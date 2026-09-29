import { defineField, defineType } from "sanity"

// The overall rating from the Google Business Profile (one document, id "googleRating").
export const googleRating = defineType({
  name: "googleRating",
  title: "Google rating",
  type: "document",
  fields: [
    defineField({
      name: "rating",
      title: "Overall rating",
      type: "number",
      description:
        "As shown on the Google Business Profile, e.g. 4.8. Update it when it changes. Leave both empty to hide the rating.",
      validation: (rule) => rule.min(1).max(5).precision(1),
    }),
    defineField({
      name: "count",
      title: "Number of reviews",
      type: "number",
      validation: (rule) => rule.min(1).integer(),
    }),
  ],
  preview: { prepare: () => ({ title: "Google rating" }) },
})
