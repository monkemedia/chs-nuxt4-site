import type { Content } from "."
import type { Overrides } from "../overrides"

// Workshop-only copy, used instead of the matching parts of ./index.ts while on-site work
// isn't live (app.config `features.onsite: false`). Only sentences that mention on-site,
// mobile or call-out work are here; delete nothing when on-site goes live, just flip the flag.
// See ../overrides.ts for how arrays are patched ({ 1: "…" } replaces, { 2: null } removes).
// Keep ../cy/workshop.ts in step.

export const workshop: Overrides<Content> = {
  footer: {
    blurb:
      "Hydraulic repair and hose supply from our Cross Hands workshop, covering Llanelli, Carmarthenshire and South Wales.",
  },
  business: {
    // Drop the "Emergency call-outs" row.
    hours: { 2: null },
  },
  cta: {
    text: "Every hour a machine stands idle costs you money. Call now and we'll tell you straight away how quickly we can fix it.",
  },
  home: {
    seo: {
      description:
        "Hydraulic hoses made while you wait, ram repairs and fault finding at our Cross Hands workshop, serving Llanelli, Carmarthenshire and South Wales.",
    },
    heroCopy:
      "Expert hydraulic repair and hose supply for plant, agriculture, commercial and industrial customers, from our Cross Hands workshop serving Llanelli, Carmarthenshire and South Wales.",
    trust: { 1: ["Hoses made", "while you wait"] },
  },
  servicesPage: {
    seo: {
      description:
        "Hose replacement, ram and cylinder repairs and hydraulic fault finding at our Cross Hands workshop, serving Llanelli, Carmarthenshire and South Wales.",
    },
    intro:
      "Hose replacement, ram repairs and fault finding from our workshop in Cross Hands, serving Llanelli, Carmarthenshire and South Wales.",
  },
  about: {
    seo: {
      description:
        "CHS Hydraulics is a hydraulic repair and supply business with a workshop in Cross Hands, Carmarthenshire, serving Llanelli and South Wales.",
    },
    who: {
      2: "Everything is done at our Cross Hands workshop, where most hoses are made up while you wait and rams are stripped, inspected and rebuilt in-house.",
    },
    vanAlt: "CHS Hydraulics van",
    facts: { 2: { value: "While you wait", label: "Most hose repairs" } },
    waysKicker: "At our workshop",
    waysTitle: "Hoses made, rams rebuilt",
    ways: {
      0: {
        title: "Hoses while you wait",
        text: "Bring the old hose to our Cross Hands workshop and we'll make up a matching replacement while you wait, for most standard sizes.",
      },
      1: {
        icon: "i-lucide-cylinder",
        title: "Rams rebuilt in-house",
        text: "Leaking or creeping rams are stripped, inspected, resealed and rebuilt at our workshop, then checked before they go back to you.",
        link: { label: "Ram & cylinder repairs", to: "/services/ram-repairs" },
      },
    },
  },
  why: {
    seo: {
      description:
        "{years} years' experience, hoses made while you wait, prices agreed up front: why farms and plant operators across Llanelli and Carmarthenshire choose CHS.",
    },
    promises: { 4: "Honest advice on whether to repair or replace" },
    steps: {
      1: {
        text: "At our workshop, we find the real cause, not just the symptom.",
      },
    },
  },
  contact: {
    seo: {
      description:
        "Contact CHS Hydraulics for hose replacement, ram repairs and hydraulic fault finding at our Cross Hands workshop, serving Llanelli and Carmarthenshire.",
    },
    kicker: { 2: "Repairs" },
    emergencyTitle: "Call us for urgent repairs",
  },
  services: [
    {
      slug: "hydraulic-hoses",
      metaDescription:
        "Hydraulic hoses made up while you wait at our Cross Hands workshop, with matching fittings and hose protection. Serving Llanelli, Carmarthenshire and South Wales.",
      lead: "Burst or leaking hose? We make up replacement hydraulic hoses while you wait at our Cross Hands workshop.",
      intro: { 1: null },
      includes: { 5: null },
      process: {
        0: {
          title: "Bring it in",
          text: "Drop the old hose into our Cross Hands workshop, or call first so we can check we have what's needed.",
        },
      },
      faqs: {
        1: {
          a: "It helps, because we can match the length and fittings exactly. If you can't remove it, tell us the machine make and model and we'll advise.",
        },
        2: null,
      },
    },
    {
      slug: "ram-repairs",
      process: { 0: { text: "Drop the ram at our Cross Hands workshop." } },
    },
    {
      slug: "hydraulic-system-repairs",
      lead: "Slow, weak, noisy or overheating hydraulics? We track down the cause and repair it at our workshop.",
      intro: {
        1: "We carry out fault finding and repairs on plant, agricultural, commercial and industrial hydraulic systems and components at our Cross Hands workshop.",
      },
      process: {
        0: {
          text: "Call with the machine and what it's doing, so we can advise on the next step.",
        },
      },
      faqs: { 2: null },
    },
  ],
  // Replaces the "On-site within {hours} hours" point.
  benefits: {
    0: {
      icon: "i-lucide-map-pin",
      title: ["Workshop in", "Cross Hands"],
      summary:
        "Easy to reach from Llanelli, Carmarthen, Ammanford and Swansea.",
      detail:
        "Our workshop is in Cross Hands, close to Llanelli, Carmarthen, Ammanford and Swansea, so help is never far away. Call ahead and we'll have what you need ready.",
    },
  },
}
