import { defineField, defineType } from "sanity"

// Only REAL reviews, copied exactly. Fake or edited reviews breach UK consumer law (CMA) and
// Google's policies. Checked again at build time by app/data/reviews-schema.ts.
export const review = defineType({
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    defineField({
      name: "source",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Google review", value: "google" },
          { title: "Testimonial (sent to us directly)", value: "testimonial" },
        ],
        layout: "radio",
      },
      initialValue: "google",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Name",
      type: "string",
      description:
        "Exactly as shown on Google. For testimonials, only with the customer's permission.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "company",
      title: "Company or role",
      type: "string",
      description: 'Testimonials only, e.g. "Site manager, Jones Groundworks".',
      hidden: ({ parent }) => parent?.source === "google",
    }),
    defineField({
      name: "rating",
      title: "Stars (1–5)",
      type: "number",
      options: { list: [5, 4, 3, 2, 1] },
      description:
        "The reviewer's star rating on Google. Leave empty for testimonials without one.",
      validation: (rule) => rule.min(1).max(5).integer(),
    }),
    defineField({
      name: "text",
      title: "Review",
      type: "text",
      rows: 6,
      description:
        "Copy it word for word. Never edit, shorten or tidy up a review.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      description:
        "The date on the review. Shown on the site as month and year.",
      validation: (rule) => rule.required(),
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
    select: { author: "author", source: "source", rating: "rating" },
    prepare: ({ author, source, rating }) => ({
      title: author,
      subtitle: [
        source === "google" ? "Google" : "Testimonial",
        rating ? "★".repeat(rating) : "",
      ]
        .filter(Boolean)
        .join(" · "),
    }),
  },
})
