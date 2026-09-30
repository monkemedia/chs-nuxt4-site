import { defineField, defineType } from "sanity"

// Opening hours and holiday closures (one document, id "openingHours"). Used by the contact
// page, the live open/closed line and Google's structured data. Checked again at build time
// by app/data/hours-schema.ts, so keep the two in step. Until this is published the site
// uses app.config `openingHours`.

// 05:00 to 22:00 in 15-minute steps, so staff pick a time rather than type one.
const times = Array.from({ length: 69 }, (_, i) => {
  const minutes = 5 * 60 + i * 15
  const h = String(Math.floor(minutes / 60)).padStart(2, "0")
  const m = String(minutes % 60).padStart(2, "0")
  return `${h}:${m}`
})

type Day = { closed?: boolean; open?: string; close?: string }

const day = (
  name: string,
  title: string,
  initial: Day = { closed: false, open: "08:00", close: "17:30" },
) =>
  defineField({
    name,
    title,
    type: "object",
    options: { columns: 3 },
    initialValue: initial,
    fields: [
      defineField({ name: "closed", title: "Closed all day", type: "boolean" }),
      defineField({
        name: "open",
        title: "Opens",
        type: "string",
        options: { list: times },
        hidden: ({ parent }) => Boolean((parent as Day | undefined)?.closed),
      }),
      defineField({
        name: "close",
        title: "Closes",
        type: "string",
        options: { list: times },
        hidden: ({ parent }) => Boolean((parent as Day | undefined)?.closed),
      }),
    ],
    validation: (rule) =>
      rule.custom((value: Day | undefined) => {
        if (!value || value.closed) return true
        if (!value.open || !value.close)
          return 'Pick both times, or tick "Closed all day".'
        return value.open < value.close
          ? true
          : "Closing time must be after opening time."
      }),
  })

export const openingHours = defineType({
  name: "openingHours",
  title: "Opening hours",
  type: "document",
  fieldsets: [
    {
      name: "week",
      title: "Normal week",
      description:
        "Must match the hours on our Google Business Profile. Change both at the same time.",
    },
  ],
  fields: [
    ...[
      day("monday", "Monday"),
      day("tuesday", "Tuesday"),
      day("wednesday", "Wednesday"),
      day("thursday", "Thursday"),
      day("friday", "Friday"),
      day("saturday", "Saturday", {
        closed: false,
        open: "08:00",
        close: "12:00",
      }),
      day("sunday", "Sunday", { closed: true }),
    ].map((field) => ({ ...field, fieldset: "week" })),
    defineField({
      name: "closures",
      title: "Holiday closures",
      type: "array",
      description:
        "Days we're closed, e.g. Christmas or a bank holiday. Shown on the contact page and in the open/closed line. Past closures drop off by themselves.",
      of: [
        {
          type: "object",
          name: "closure",
          fields: [
            defineField({
              name: "from",
              title: "First day closed",
              type: "date",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "to",
              title: "Last day closed",
              type: "date",
              description: "Leave empty for a single day.",
              validation: (rule) =>
                rule.custom((to, context) => {
                  const from = (context.parent as { from?: string }).from
                  return !to || !from || to >= from
                    ? true
                    : "Must be on or after the first day."
                }),
            }),
            defineField({
              name: "reason",
              title: "Reason",
              type: "object",
              description:
                'Finishes the sentence "Closed for …", e.g. "Christmas" or "the bank holiday".',
              fields: [
                defineField({
                  name: "en",
                  title: "English",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "cy",
                  title: "Welsh (optional)",
                  type: "string",
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "reason.en", from: "from", to: "to" },
            prepare: ({ title, from, to }) => ({
              title: title || "Closure",
              subtitle: to && to !== from ? `${from} to ${to}` : from,
            }),
          },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Opening hours" }) },
})
