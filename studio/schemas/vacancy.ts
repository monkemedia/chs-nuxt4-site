import { defineField, defineType, type Rule } from "sanity"

// A vacancy on the careers page. Publishing puts it on the live site (after the rebuild,
// about two minutes); drafts only show on the preview site. Checked again at build time by
// app/data/vacancies-schema.ts, so keep the two in step.

const list = (name: string, title: string, required: boolean) =>
  defineField({
    name,
    title,
    type: "array",
    of: [{ type: "string" }],
    description: "One point per item.",
    validation: (rule) => (required ? rule.required().min(1) : rule),
  })

const text = (required: boolean) => {
  const need = (rule: Rule) => (required ? rule.required() : rule)
  return [
    defineField({
      name: "title",
      title: "Job title",
      type: "string",
      description: 'e.g. "Hydraulic fitter". Aim for under 45 characters.',
      validation: (rule) => need(rule).max(80),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description:
        "One or two sentences for the card and Google (under 160 characters).",
      validation: (rule) =>
        need(rule).max(160).warning("Google shows about 160 characters."),
    }),
    defineField({
      name: "hours",
      title: "Working hours",
      type: "string",
      description: 'Optional, e.g. "Monday to Friday, 8am to 5pm".',
    }),
    defineField({
      name: "about",
      title: "About the role",
      type: "text",
      rows: 4,
      validation: need,
    }),
    list("responsibilities", "What you'll do", required),
    list("requirements", "What we're looking for", required),
    list("niceToHave", "Nice to have (optional)", false),
    list("offer", "What we offer (optional)", false),
  ]
}

export const vacancy = defineType({
  name: "vacancy",
  title: "Vacancy",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      options: { source: "en.title", maxLength: 80 },
      description:
        'Click "Generate" to make it from the job title. Never change it after publishing: old links would break.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Full-time", value: "full-time" },
          { title: "Part-time", value: "part-time" },
          { title: "Apprenticeship", value: "apprenticeship" },
          { title: "Temporary", value: "temporary" },
        ],
        layout: "radio",
      },
      initialValue: "full-time",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "posted",
      title: "Date posted",
      type: "date",
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "closes",
      title: "Closing date",
      type: "date",
      description:
        "Optional. The vacancy comes off the site after this date (at the next update). Without one, unpublish it when the role is filled.",
    }),
    defineField({
      name: "salaryMin",
      title: "Pay from (£)",
      type: "number",
      description: "Optional. For a single figure, fill in this one only.",
      validation: (rule) => rule.positive(),
    }),
    defineField({
      name: "salaryMax",
      title: "Pay up to (£)",
      type: "number",
      validation: (rule) =>
        rule.positive().custom((max, context) => {
          const min = (context.document as { salaryMin?: number }).salaryMin
          return max === undefined || min === undefined || max >= min
            ? true
            : '"Pay up to" must be at least "Pay from".'
        }),
    }),
    defineField({
      name: "salaryPeriod",
      title: "Pay is per",
      type: "string",
      options: {
        list: [
          { title: "Year", value: "year" },
          { title: "Hour", value: "hour" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "year",
    }),
    defineField({
      name: "en",
      title: "English",
      type: "object",
      options: { collapsible: false },
      fields: text(true),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cy",
      title: "Welsh (Cymraeg)",
      type: "object",
      description:
        "Optional. Without a complete Welsh version, the Welsh site shows the English with a note.",
      options: { collapsible: true, collapsed: true },
      fields: text(false),
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "postedDesc",
      by: [{ field: "posted", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "en.title", closes: "closes" },
    prepare: ({ title, closes }) => ({
      title: title || "Untitled vacancy",
      subtitle: closes ? `Closes ${closes}` : "No closing date",
    }),
  },
})
