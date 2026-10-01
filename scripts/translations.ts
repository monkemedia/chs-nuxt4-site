// Welsh translation round trip for translators (e.g. Helo Blod), who shouldn't have to edit
// TypeScript:
//
//   npm run translations:export            -> translations/chs-welsh-<date>.xlsx
//   npm run translations:import <file>     -> writes the Welsh back into app/content/cy/
//
// The content files are read as source (TypeScript AST), not imported, so the import can
// replace each Welsh string in place and leave the rest of the file untouched.
// translations/checked.json records the English each row had when a translator last
// checked it, so the next export marks new and changed rows.
import { execFileSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join, relative } from "node:path"
import ExcelJS from "exceljs"
import ts from "typescript"

// Run from the repo root (npm scripts do).
const root = process.cwd()
const content = join(root, "app/content")
const checkedFile = join(root, "translations/checked.json")

// English and Welsh sources, paired. Keys start with the prefix ("workshop." for the
// workshop-only copy, which is what the live site shows while on-site work is off).
const sources = [
  { prefix: "", en: ["en/index.ts", "en"], cy: ["cy/index.ts", "cy"] },
  {
    prefix: "services.",
    en: ["en/services.ts", "services"],
    cy: ["cy/services.ts", "services"],
  },
  {
    prefix: "sectors.",
    en: ["en/sectors.ts", "sectors"],
    cy: ["cy/sectors.ts", "sectors"],
  },
  {
    prefix: "benefits.",
    en: ["en/benefits.ts", "benefits"],
    cy: ["cy/benefits.ts", "benefits"],
  },
  {
    prefix: "areas.",
    en: ["en/areas.ts", "areas"],
    cy: ["cy/areas.ts", "areas"],
  },
  {
    prefix: "workshop.",
    en: ["en/workshop.ts", "workshop"],
    cy: ["cy/workshop.ts", "workshop"],
  },
] as const

// Not copy: identifiers, icons, image paths and locale codes.
const skipKeys = new Set(["slug", "icon", "image", "locale", "dateLocale"])
// Lists of service slugs (sectors) rather than copy.
const slugLists = new Set(["services"])

interface Leaf {
  key: string
  // Text, with template placeholders written as {name}.
  text: string
  // Functions with logic around the text (e.g. the pay range): shown, not imported.
  fn: boolean
  // Functions that just fill in a sentence (e.g. (phone) => `Call ${phone}`): editable, and
  // written back as a template literal. Holds the placeholder names.
  params?: Set<string>
  node: ts.Node
  file: string
}

function parse(file: string) {
  const path = join(content, file)
  return ts.createSourceFile(
    path,
    readFileSync(path, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  )
}

function findExport(source: ts.SourceFile, name: string) {
  for (const statement of source.statements)
    if (ts.isVariableStatement(statement))
      for (const decl of statement.declarationList.declarations)
        if (ts.isIdentifier(decl.name) && decl.name.text === name)
          return decl.initializer!
  throw new Error(`No "${name}" export in ${source.fileName}`)
}

const unwrap = (node: ts.Node): ts.Node =>
  ts.isAsExpression(node) ||
  ts.isSatisfiesExpression(node) ||
  ts.isParenthesizedExpression(node)
    ? unwrap(node.expression)
    : node

function templateText(node: ts.Node): string {
  node = unwrap(node)
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    return node.text
  if (ts.isTemplateExpression(node))
    return (
      node.head.text +
      node.templateSpans
        .map((span) => `{${span.expression.getText()}}` + span.literal.text)
        .join("")
    )
  return node.getText()
}

// A function that only fills its parameters into one sentence, with no other logic.
function isSentence(fn: ts.ArrowFunction) {
  const body = unwrap(fn.body)
  const params = new Set(fn.parameters.map((p) => p.name.getText()))
  if (ts.isStringLiteral(body) || ts.isNoSubstitutionTemplateLiteral(body))
    return true
  return (
    ts.isTemplateExpression(body) &&
    body.templateSpans.every(
      (span) =>
        ts.isIdentifier(span.expression) && params.has(span.expression.text),
    )
  )
}

// Welsh text back to source: a template literal for sentence functions, else a string.
function toSource(text: string, params?: Set<string>) {
  if (!params) return JSON.stringify(text)
  const body = text
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${")
    .replace(/\{(\w+)\}/g, (match, name: string) =>
      params.has(name) ? `\${${name}}` : match,
    )
  return `\`${body}\``
}

function collect(file: string, name: string, prefix: string) {
  const source = parse(file)
  const leaves = new Map<string, Leaf>()
  const walk = (raw: ts.Node, path: string) => {
    const node = unwrap(raw)
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      leaves.set(path, { key: path, text: node.text, fn: false, node, file })
    } else if (ts.isArrowFunction(node) && isSentence(node)) {
      const body = unwrap(node.body)
      leaves.set(path, {
        key: path,
        text: templateText(body),
        fn: false,
        params: new Set(node.parameters.map((p) => p.name.getText())),
        node: body,
        file,
      })
    } else if (ts.isArrowFunction(node)) {
      leaves.set(path, {
        key: path,
        text: templateText(node.body),
        fn: true,
        node,
        file,
      })
    } else if (ts.isArrayLiteralExpression(node)) {
      node.elements.forEach((el, i) => walk(el, `${path}.${i}`))
    } else if (ts.isObjectLiteralExpression(node)) {
      for (const prop of node.properties) {
        if (!ts.isPropertyAssignment(prop)) continue
        const key = ts.isIdentifier(prop.name)
          ? prop.name.text
          : ts.isStringLiteral(prop.name) || ts.isNumericLiteral(prop.name)
            ? prop.name.text
            : undefined
        if (key === undefined || skipKeys.has(key)) continue
        if (
          slugLists.has(key) &&
          ts.isArrayLiteralExpression(unwrap(prop.initializer))
        )
          continue
        walk(prop.initializer, path ? `${path}.${key}` : key)
      }
    }
  }
  walk(findExport(source, name), prefix.replace(/\.$/, ""))
  return { source, leaves }
}

function load() {
  const rows: { en: Leaf; cy: Leaf | undefined }[] = []
  const files = new Map<string, ts.SourceFile>()
  for (const { prefix, en, cy } of sources) {
    const english = collect(en[0], en[1], prefix)
    const welsh = collect(cy[0], cy[1], prefix)
    files.set(cy[0], welsh.source)
    for (const leaf of english.leaves.values()) {
      // Not copy: links, and text that's only placeholders or numbers ("{founded}", "2026").
      if (
        leaf.text.startsWith("/") ||
        !/[a-z]/i.test(leaf.text.replace(/\{[\w.]+\}/g, ""))
      )
        continue
      rows.push({ en: leaf, cy: welsh.leaves.get(leaf.key) })
    }
  }
  return { rows, files }
}

// ---- Labels and notes -------------------------------------------------------------------

const names: Record<string, string> = {
  common: "Site-wide",
  nav: "Menu",
  cta: "Call-to-action band",
  home: "Homepage",
  seo: "Google listing",
  h1: "Main heading",
  q: "Question",
  a: "Answer",
  metaTitle: "Google title",
  metaDescription: "Google description",
  alt: "Image description",
  whyChs: "Why CHS",
  jobsPage: "Recent work page",
  jobPage: "Recent work: job page",
  careersPage: "Careers page",
  vacancyPage: "Careers: vacancy page",
  errorPage: "Error page",
  faqs: "FAQs",
  workshop: "Workshop-only version",
  areas: "Town pages",
  areaPage: "Town pages: labels",
}

const humanise = (key: string) =>
  names[key] ??
  key
    .replace(/^cta/, "callToAction")
    .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
    .toLowerCase()
    .replace(/^./, (c) => c.toUpperCase())

// "services.0.faqs.2.a" -> "Services › Hydraulic Hoses › FAQs 3 › Answer", naming array
// items after their English title where they have one.
function label(key: string, english: Map<string, string>) {
  const parts = key.split(".")
  const out: string[] = []
  parts.forEach((part, i) => {
    if (!/^\d+$/.test(part)) return out.push(humanise(part))
    const base = parts.slice(0, i + 1).join(".")
    const titleKey = ["title", "q", "label.0"].find((k) =>
      english.has(`${base}.${k}`),
    )
    const rest = parts.slice(i + 1).join(".")
    // Named items read better by name ("Services › Hydraulic Hoses"), unless the row is the
    // name itself (then "FAQs 3 › Question").
    if (titleKey && rest && rest !== titleKey && !rest.startsWith("label")) {
      const title = english.get(`${base}.${titleKey}`)!
      out.push(title.length > 40 ? `${title.slice(0, 40)}…` : title)
    } else
      out[out.length - 1] = `${out.at(-1) ?? ""} ${Number(part) + 1}`.trim()
  })
  return out.join(" › ")
}

const tokens = (text: string) => (text.match(/\{[\w.]+\}/g) ?? []).sort()

function notes(key: string, text: string, fn: boolean) {
  const note: string[] = []
  const last = key.split(".").at(-1)!
  const seo = key.includes(".seo.") || last.startsWith("meta")
  if (seo && /title$/i.test(last))
    note.push("Google title: 60 characters at most.")
  if (seo && /description$/i.test(last))
    note.push("Google description: 160 characters at most.")
  if (tokens(text).length)
    note.push(
      `Keep ${tokens(text).join(", ")} exactly as written: the website fills these in.`,
    )
  if (text.includes("CHS")) note.push('Keep "CHS Hydraulics" / "CHS" as is.')
  if (fn)
    note.push(
      "Built by the website from parts: suggest changes in the comments column and the developer will make them.",
    )
  if (key.startsWith("workshop."))
    note.push(
      "Replaces the matching sentence while CHS only works from the workshop (what the website shows now).",
    )
  return note.join(" ")
}

// ---- Checked state ----------------------------------------------------------------------

const readChecked = (): Record<string, string> =>
  existsSync(checkedFile) ? JSON.parse(readFileSync(checkedFile, "utf8")) : {}

// ---- Export -----------------------------------------------------------------------------

async function exportSheet() {
  const { rows } = load()
  const checked = readChecked()
  const english = new Map(rows.map(({ en }) => [en.key, en.text]))

  const book = new ExcelJS.Workbook()
  book.creator = "CHS Hydraulics"

  const guide = book.addWorksheet("How to use")
  guide.getColumn(1).width = 110
  ;[
    [
      "CHS Hydraulics website: Welsh translation check",
      { bold: true, size: 16 },
    ],
    [""],
    [
      "Each row on the Translations sheet is one piece of text from the website. Please check the Welsh in the yellow column against the English, and correct it where needed.",
    ],
    [""],
    ["• Only edit the yellow Welsh column and the Comments column."],
    [
      '• Status shows what needs checking: "Not checked yet", "New" or "English changed". "Checked" rows were checked before; you can skip them. Use the filter on the Status column.',
    ],
    [
      "• Words in curly brackets, such as {years} or {tagline}, are filled in by the website. Keep them exactly as written.",
    ],
    [
      "• Google titles and descriptions have a character limit (see Notes). The Characters column counts the Welsh; it turns red when too long.",
    ],
    [
      '• Some trade words (e.g. "ram") are deliberately left in English where Welsh-speaking customers use them. Change them if you disagree.',
    ],
    [
      "• Grey rows are built by the website from parts. Suggest changes in Comments rather than editing the Welsh.",
    ],
    ["• Questions or suggestions for any row: use the Comments column."],
    [""],
    ["Thank you! Diolch yn fawr!", { bold: true }],
  ].forEach(([text, font], i) => {
    const cell = guide.getCell(i + 1, 1)
    cell.value = text as string
    cell.alignment = { wrapText: true, vertical: "top" }
    if (font) cell.font = font as Partial<ExcelJS.Font>
  })

  const sheet = book.addWorksheet("Translations", {
    views: [{ state: "frozen", ySplit: 1 }],
  })
  sheet.columns = [
    { header: "Where on the website", key: "where", width: 38 },
    { header: "English", key: "en", width: 55 },
    { header: "Welsh (check and edit)", key: "cy", width: 55 },
    { header: "Characters", key: "len", width: 11 },
    { header: "Status", key: "status", width: 16 },
    { header: "Notes", key: "notes", width: 40 },
    { header: "Comments", key: "comments", width: 40 },
    { header: "Key (don't edit)", key: "key", width: 30, hidden: true },
  ]

  const counts: Record<string, number> = {}
  for (const { en, cy } of rows) {
    const status = !(en.key in checked)
      ? Object.keys(checked).length
        ? "New"
        : "Not checked yet"
      : checked[en.key] === en.text
        ? "Checked"
        : "English changed"
    counts[status] = (counts[status] ?? 0) + 1
    const row = sheet.addRow({
      where: label(en.key, english),
      en: en.text,
      cy: cy?.text ?? "",
      status,
      notes: [
        !cy && "No Welsh yet.",
        cy && cy.text === en.text && "Same as the English: check it should be.",
        notes(en.key, en.text, en.fn),
      ]
        .filter(Boolean)
        .join(" "),
      key: en.key,
    })
    row.getCell("len").value = { formula: `LEN(C${row.number})` }
    row.alignment = { wrapText: true, vertical: "top" }
    const editable = !en.fn
    row.getCell("cy").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: editable ? "FFFFF6CC" : "FFEDEDED" },
    }
    row.getCell("cy").protection = { locked: !editable }
    row.getCell("comments").protection = { locked: false }
    if (en.fn) row.font = { color: { argb: "FF6B6B6B" } }
    // Character limits for Google titles and descriptions.
    const limit = /Google title: 60/.test(String(row.getCell("notes").value))
      ? 60
      : /Google description: 160/.test(String(row.getCell("notes").value))
        ? 160
        : undefined
    if (limit)
      sheet.addConditionalFormatting({
        ref: `D${row.number}`,
        rules: [
          {
            type: "cellIs",
            operator: "greaterThan",
            formulae: [String(limit)],
            priority: 1,
            style: {
              font: { color: { argb: "FFB00020" }, bold: true },
              fill: {
                type: "pattern",
                pattern: "solid",
                bgColor: { argb: "FFFDE2E2" },
              },
            },
          },
        ],
      })
  }

  const header = sheet.getRow(1)
  header.font = { bold: true, color: { argb: "FFFFFFFF" } }
  header.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0D1012" },
  }
  sheet.autoFilter = { from: "A1", to: "G1" }
  // Only the Welsh and Comments columns can be edited; filtering and resizing still work.
  await sheet.protect("", {
    autoFilter: true,
    sort: true,
    formatColumns: true,
    formatRows: true,
  })

  const dir = join(root, "translations")
  mkdirSync(dir, { recursive: true })
  const out = join(
    dir,
    `chs-welsh-${new Date().toISOString().slice(0, 10)}.xlsx`,
  )
  await book.xlsx.writeFile(out)
  console.log(`Wrote ${relative(root, out)}: ${rows.length} rows`)
  for (const [status, n] of Object.entries(counts))
    console.log(`  ${status}: ${n}`)
}

// ---- Import -----------------------------------------------------------------------------

const cellText = (cell: ExcelJS.Cell) => {
  const value = cell.value
  if (value && typeof value === "object" && "richText" in value)
    return value.richText.map((r) => r.text).join("")
  return value === null || value === undefined ? "" : String(value)
}

async function importSheet(file: string) {
  const book = new ExcelJS.Workbook()
  await book.xlsx.readFile(file)
  const sheet = book.getWorksheet("Translations")
  if (!sheet) throw new Error(`No "Translations" sheet in ${file}`)

  const { rows, files } = load()
  const byKey = new Map(rows.map((row) => [row.en.key, row]))
  const checked = readChecked()
  const edits = new Map<
    string,
    { start: number; end: number; text: string }[]
  >()
  const problems: string[] = []
  const comments: string[] = []
  let changed = 0

  sheet.eachRow((row, n) => {
    if (n === 1) return
    const key = cellText(row.getCell(8)).trim()
    const where = cellText(row.getCell(1))
    const sheetEnglish = cellText(row.getCell(2))
    const welsh = cellText(row.getCell(3)).trim()
    const comment = cellText(row.getCell(7)).trim()
    if (comment) comments.push(`${where}: ${comment}`)
    const current = byKey.get(key)
    if (!current) return problems.push(`${where}: no longer on the website`)
    const { en, cy } = current
    if (!cy) return problems.push(`${where}: no Welsh entry in the code yet`)
    if (en.text !== sheetEnglish)
      return problems.push(
        `${where}: the English changed since this file was exported (not imported)`,
      )
    if (!welsh)
      return problems.push(`${where}: Welsh left empty (not imported)`)
    if (welsh !== cy.text) {
      if (cy.fn)
        return problems.push(
          `${where}: built from parts, change by hand: "${welsh}"`,
        )
      if (tokens(welsh).join() !== tokens(en.text).join())
        return problems.push(
          `${where}: placeholders don't match the English (${tokens(en.text).join(", ") || "none"}) (not imported)`,
        )
      const list = edits.get(cy.file) ?? []
      list.push({
        start: cy.node.getStart(),
        end: cy.node.getEnd(),
        text: toSource(welsh, cy.params),
      })
      edits.set(cy.file, list)
      changed++
    }
    checked[key] = en.text
  })

  const touched: string[] = []
  for (const [file, list] of edits) {
    let text = files.get(file)!.getFullText()
    for (const edit of list.sort((a, b) => b.start - a.start))
      text = text.slice(0, edit.start) + edit.text + text.slice(edit.end)
    const path = join(content, file)
    writeFileSync(path, text)
    touched.push(path)
  }
  mkdirSync(join(root, "translations"), { recursive: true })
  writeFileSync(
    checkedFile,
    JSON.stringify(
      Object.fromEntries(Object.entries(checked).sort()),
      null,
      2,
    ) + "\n",
  )
  if (touched.length)
    execFileSync("npx", ["prettier", "--write", ...touched], { cwd: root })

  console.log(
    `Imported ${changed} changed Welsh string(s) into ${touched.map((f) => relative(root, f)).join(", ") || "no files"}.`,
  )
  if (comments.length)
    console.log(`\nTranslator comments:\n  ${comments.join("\n  ")}`)
  if (problems.length) {
    console.log(`\nNeeds attention:\n  ${problems.join("\n  ")}`)
    process.exitCode = 1
  }
  console.log("\nNext: npx nuxt typecheck, then check the Welsh pages.")
}

const [command, file] = process.argv.slice(2)
if (command === "export") exportSheet()
else if (command === "import" && file) importSheet(file)
else {
  console.error(
    "Usage: npm run translations:export | npm run translations:import <file.xlsx>",
  )
  process.exitCode = 1
}
