import type { Sector } from "../types"

// Welsh sectors. Same slugs, icons, service slugs and order as ../en/sectors.ts.
// Drafted translation: have it checked by a fluent Welsh speaker before launch.

export const sectors: Sector[] = [
  {
    slug: "plant-construction",
    icon: "i-chs-excavator",
    label: ["Peiriannau", "ac adeiladu"],
    title: "Peiriannau ac adeiladu",
    summary:
      "Mae amser segur ar safle yn costio arian bob awr. Rydyn ni'n newid pibellau sydd wedi byrstio lle mae'r peiriant ac yn atgyweirio rams a systemau hydrolig ar beiriannau o bob maint.",
    machines: [
      "Cloddwyr a chloddwyr bach",
      "Dympars a llwythwyr safle",
      "Teleliftiau",
      "Rholeri a pheiriannau cywasgu",
      "Torwyr ac atodiadau",
    ],
    services: ["hydraulic-hoses", "ram-repairs", "on-site-hydraulic-service"],
  },
  {
    slug: "agriculture",
    icon: "i-lucide-tractor",
    label: ["Amaeth", "a ffermydd"],
    title: "Amaeth a ffermydd",
    summary:
      "Pan fydd tractor neu lwythwr yn torri i lawr ganol y tymor, all e ddim aros. Rydyn ni'n gweithio o gwmpas y calendr ffermio ac yn dod allan i'r iard neu'r cae.",
    machines: [
      "Tractorau a llwythwyr blaen",
      "Trelars tipio",
      "Byrnwyr a lapwyr",
      "Torwyr gwrychoedd a fflails",
      "Rhawiau llwytho a llwythwyr",
    ],
    services: ["hydraulic-hoses", "ram-repairs", "on-site-hydraulic-service"],
  },
  {
    slug: "industrial",
    icon: "i-lucide-factory",
    label: ["Diwydiant a", "gweithgynhyrchu"],
    title: "Diwydiant a gweithgynhyrchu",
    summary:
      "Mae angen atgyweirio gweisg hydrolig, pecynnau pŵer ac offer cynhyrchu yn ddibynadwy gyda chyn lleied o darfu â phosib ar eich llinell. Rydyn ni'n canfod namau ac yn cynllunio gwaith atgyweirio o'ch cwmpas chi.",
    machines: [
      "Gweisg hydrolig",
      "Pecynnau pŵer",
      "Offer codi a thrin",
      "Peiriannau cynhyrchu",
      "Offer profi a gweithdy",
    ],
    services: ["hydraulic-system-repairs", "ram-repairs", "hydraulic-hoses"],
  },
  {
    slug: "commercial-vehicles",
    icon: "i-lucide-truck",
    label: ["Cerbydau", "masnachol"],
    title: "Cerbydau masnachol",
    summary:
      "Mae tipwyr, lifftiau cynffon a chraeniau llwytho i gyd yn dibynnu ar hydrolig. Rydyn ni'n cael cerbydau yn ôl ar y ffordd drwy newid pibellau, atgyweirio rams a chanfod namau ar systemau.",
    machines: [
      "Cyrff tipio",
      "Lifftiau cynffon",
      "Llwythwyr bachyn a sgip",
      "Craeniau ar lorïau",
      "Cerbydau sbwriel a chyngor",
    ],
    services: ["hydraulic-hoses", "ram-repairs", "hydraulic-system-repairs"],
  },
  {
    slug: "more",
    icon: "i-lucide-cog",
    label: ["A mwy"],
    title: "A mwy",
    summary:
      "Os yw'n rhedeg ar hydrolig, rhowch ganiad i ni. Rydyn ni hefyd yn cefnogi ystod o weithredwyr eraill ledled De Cymru.",
    machines: [
      "Chwareli",
      "Coedwigaeth",
      "Gwastraff ac ailgylchu",
      "Gwaith tir a chyfleustodau",
      "Fflydoedd awdurdodau lleol",
    ],
    services: ["hydraulic-system-repairs", "on-site-hydraulic-service"],
  },
]
