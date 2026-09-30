// EXAMPLE vacancies, to preview the careers pages before CHS advertises a real role. Used
// only in dev and the preview build, and only while the admin area has no vacancies
// (modules/vacancies.ts). They're marked as drafts, so they never reach the live site.
// Dates are relative to the build so the examples never expire.

export const exampleVacancies = (posted: string, closes: string) => [
  {
    draft: true,
    slug: "example-hydraulic-fitter",
    posted,
    closes,
    type: "full-time",
    salaryMin: 28000,
    salaryMax: 34000,
    salaryPeriod: "year",
    en: {
      title: "Hydraulic fitter",
      summary:
        "Strip, repair and test hydraulic cylinders, pumps and valves in our Cross Hands workshop.",
      hours: "Monday to Friday, 8am to 5pm",
      about:
        "EXAMPLE VACANCY. You'll work on plant, farm and industrial machinery for customers across South Wales, from diagnosing the fault to testing the finished repair.",
      responsibilities: [
        "Strip down, inspect and rebuild hydraulic cylinders",
        "Repair and test pumps, motors and valves",
        "Make up hoses and fittings to order",
        "Keep clear records of each job",
      ],
      requirements: [
        "Experience repairing hydraulic components",
        "Able to read hydraulic schematics",
        "Full UK driving licence",
      ],
      niceToHave: ["Machining or welding experience"],
      offer: [
        "Training on a wide range of machinery",
        "Workwear and tools provided",
        "Company pension",
      ],
    },
    cy: {
      title: "Ffitiwr hydrolig",
      summary:
        "Datgymalu, atgyweirio a phrofi silindrau, pympiau a falfiau hydrolig yn ein gweithdy yn Cross Hands.",
      hours: "Dydd Llun i ddydd Gwener, 8yb i 5yh",
      about:
        "SWYDD ENGHREIFFTIOL. Byddwch chi'n gweithio ar beiriannau safle, fferm a diwydiannol i gwsmeriaid ar draws De Cymru, o ddod o hyd i'r nam i brofi'r atgyweiriad gorffenedig.",
      responsibilities: [
        "Datgymalu, archwilio ac ailadeiladu silindrau hydrolig",
        "Atgyweirio a phrofi pympiau, moduron a falfiau",
        "Gwneud pibellau a ffitiadau i archeb",
        "Cadw cofnodion clir o bob swydd",
      ],
      requirements: [
        "Profiad o atgyweirio cydrannau hydrolig",
        "Gallu darllen diagramau hydrolig",
        "Trwydded yrru lawn yn y DU",
      ],
      niceToHave: ["Profiad peiriannu neu weldio"],
      offer: [
        "Hyfforddiant ar amrywiaeth eang o beiriannau",
        "Dillad gwaith ac offer wedi'u darparu",
        "Pensiwn cwmni",
      ],
    },
  },
  {
    draft: true,
    slug: "example-apprentice-hydraulic-engineer",
    posted,
    type: "apprenticeship",
    salaryMin: 8,
    salaryPeriod: "hour",
    // No Welsh version, to preview the "only available in English" note.
    en: {
      title: "Apprentice hydraulic engineer",
      summary:
        "Learn hydraulic repair from the ground up, working alongside our experienced engineers.",
      about:
        "EXAMPLE VACANCY. A chance to learn a skilled trade on real machines, with college study alongside your time in the workshop.",
      responsibilities: [
        "Help strip down and rebuild hydraulic components",
        "Learn to test repairs on our test rig",
        "Keep the workshop safe and tidy",
      ],
      requirements: [
        "Interest in engineering and machinery",
        "Reliable, and happy to learn",
      ],
      offer: ["A recognised qualification", "Paid college days"],
    },
  },
]
