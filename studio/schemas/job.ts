import { defineField, defineType, type Rule } from "sanity"
import { services } from "../../app/content/en/services"

// A Recent work job. Publishing puts it on the live site (after the rebuild, about two
// minutes); drafts only show on the preview site. Checked again at build time by
// app/data/jobs-schema.ts, so keep the two in step.

const text = (required: boolean) => {
  const need = (rule: Rule) => (required ? rule.required() : rule)
  return [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        'What was done, to what, e.g. "Boom ram rebuilt for a JCB 3CX". Aim for under 45 characters.',
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
    defineField({ name: "machine", title: "Machine", type: "string" }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description:
        "Town or area only. Name the customer only with their permission.",
    }),
    defineField({
      name: "problem",
      title: "The problem",
      type: "text",
      rows: 4,
      validation: need,
    }),
    defineField({
      name: "work",
      title: "What we did",
      type: "array",
      of: [{ type: "string" }],
      description: "One step per item.",
      validation: (rule) => (required ? rule.required().min(1) : rule),
    }),
    defineField({
      name: "result",
      title: "The result",
      type: "text",
      rows: 3,
      validation: need,
    }),
    defineField({
      name: "imageAlt",
      title: "Photo description",
      type: "string",
      description: "What the photo shows, for people who can't see it.",
    }),
  ]
}

export const job = defineType({
  name: "job",
  title: "Recent work",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      options: { source: "en.title", maxLength: 80 },
      description:
        'Click "Generate" to make it from the title. Never change it after publishing: old links would break.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date finished",
      type: "date",
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "service",
      title: "Service",
      type: "string",
      options: {
        list: services.map((s) => ({ title: s.title, value: s.slug })),
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      description:
        "Your own photo of this job, landscape, at least 800 × 500. No stock photos. Optional; without one, cards show the service's photo.",
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
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "en.title", date: "date", media: "image" },
    prepare: ({ title, date, media }) => ({
      title: title || "Untitled job",
      subtitle: date,
      media,
    }),
  },
})
