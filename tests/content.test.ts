import { describe, expect, it } from "vitest"
import { cy } from "~/content/cy"
import { en } from "~/content/en"

// Tokens are filled in by useContent() before they reach the page, so measure the real text:
// two-digit years of experience, a one-digit response time, a four-digit year.
const filled = (text: string) =>
  text
    .replaceAll("{years}", "35")
    .replaceAll("{hours}", "4")
    .replaceAll("{founded}", "1991")

// Every { title, description } SEO pair in the content, with where it is.
function seoEntries(value: unknown, path = ""): [string, string, string][] {
  if (!value || typeof value !== "object") return []
  const record = value as Record<string, unknown>
  const own: [string, string, string][] = []
  if (
    typeof record.title === "string" &&
    typeof record.description === "string" &&
    path.endsWith("seo")
  )
    own.push([path, record.title, record.description])
  if (
    typeof record.metaTitle === "string" &&
    typeof record.metaDescription === "string"
  )
    own.push([path, record.metaTitle, record.metaDescription])
  return [
    ...own,
    ...Object.entries(record).flatMap(([key, child]) =>
      seoEntries(child, path ? `${path}.${key}` : key),
    ),
  ]
}

describe.each([
  ["en", en],
  ["cy", cy],
])("%s content", (_, content) => {
  const entries = seoEntries(content)

  it("has SEO titles and descriptions", () => {
    expect(entries.length).toBeGreaterThan(10)
  })

  it.each(entries.map(([path, title]) => [path, title]))(
    "%s: title within 60 characters",
    (_path, title) => {
      expect(filled(title).length).toBeLessThanOrEqual(60)
    },
  )

  it.each(entries.map(([path, , description]) => [path, description]))(
    "%s: description within 160 characters",
    (_path, description) => {
      expect(filled(description).length).toBeLessThanOrEqual(160)
    },
  )
})

describe("English and Welsh match", () => {
  const slugs = (list: { slug: string }[]) => list.map((item) => item.slug)

  it("lists the same services, sectors, benefits and areas in the same order", () => {
    expect(slugs(cy.services)).toEqual(slugs(en.services))
    expect(slugs(cy.sectors)).toEqual(slugs(en.sectors))
    expect(slugs(cy.benefits)).toEqual(slugs(en.benefits))
    expect(slugs(cy.areas)).toEqual(slugs(en.areas))
  })

  it("keeps the same {placeholders} in every string", () => {
    const placeholders = (text: string) =>
      [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()
    const walk = (a: unknown, b: unknown, path: string): string[] => {
      if (typeof a === "string" && typeof b === "string")
        return JSON.stringify(placeholders(a)) ===
          JSON.stringify(placeholders(b))
          ? []
          : [path]
      if (a && b && typeof a === "object" && typeof b === "object")
        return Object.keys(a).flatMap((key) =>
          walk(
            (a as Record<string, unknown>)[key],
            (b as Record<string, unknown>)[key],
            `${path}.${key}`,
          ),
        )
      return []
    }
    expect(walk(en, cy, "content")).toEqual([])
  })
})
