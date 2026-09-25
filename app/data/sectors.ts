// Sectors shown on the homepage band and the /sectors page.
// Check with the business before launch: only list machines and work CHS actually takes on.

export interface Sector {
  slug: string
  icon: string
  // Two-line label for the homepage band.
  label: [string] | [string, string]
  title: string
  summary: string
  machines: string[]
  // Slugs from app/data/services.ts.
  services: string[]
}

export const sectors: Sector[] = [
  {
    slug: "plant-construction",
    icon: "i-chs-excavator",
    label: ["Plant &", "construction"],
    title: "Plant & construction",
    summary:
      "Downtime on site costs money by the hour. We replace burst hoses where the machine stands and repair rams and hydraulic systems on plant of all sizes.",
    machines: [
      "Excavators and mini diggers",
      "Dumpers and site loaders",
      "Telehandlers",
      "Rollers and compaction plant",
      "Breakers and attachments",
    ],
    services: ["hydraulic-hoses", "ram-repairs", "on-site-hydraulic-service"],
  },
  {
    slug: "agriculture",
    icon: "i-lucide-tractor",
    label: ["Agriculture", "& farms"],
    title: "Agriculture & farms",
    summary:
      "When a tractor or loader goes down mid-season it can't wait. We work around farming calendars and come out to the yard or field.",
    machines: [
      "Tractors and front loaders",
      "Tipping trailers",
      "Balers and wrappers",
      "Hedge cutters and flails",
      "Loading shovels and handlers",
    ],
    services: ["hydraulic-hoses", "ram-repairs", "on-site-hydraulic-service"],
  },
  {
    slug: "industrial",
    icon: "i-lucide-factory",
    label: ["Industrial", "& manufacturing"],
    title: "Industrial & manufacturing",
    summary:
      "Hydraulic presses, power packs and production equipment need reliable repairs with minimal disruption to your line. We diagnose faults and plan repairs around you.",
    machines: [
      "Hydraulic presses",
      "Power packs",
      "Lifting and handling equipment",
      "Production machinery",
      "Test and workshop equipment",
    ],
    services: ["hydraulic-system-repairs", "ram-repairs", "hydraulic-hoses"],
  },
  {
    slug: "commercial-vehicles",
    icon: "i-lucide-truck",
    label: ["Commercial", "vehicles"],
    title: "Commercial vehicles",
    summary:
      "Tippers, tail lifts and loader cranes all rely on hydraulics. We get vehicles back on the road with hose replacements, ram repairs and system fault finding.",
    machines: [
      "Tipper bodies",
      "Tail lifts",
      "Hook and skip loaders",
      "Lorry-mounted cranes",
      "Refuse and municipal vehicles",
    ],
    services: ["hydraulic-hoses", "ram-repairs", "hydraulic-system-repairs"],
  },
  {
    slug: "more",
    icon: "i-lucide-cog",
    label: ["And more"],
    title: "And more",
    summary:
      "If it runs on hydraulics, give us a call. We also support a range of other operators across South Wales.",
    machines: [
      "Quarrying",
      "Forestry",
      "Waste and recycling",
      "Groundworks and utilities",
      "Local authority fleets",
    ],
    services: ["hydraulic-system-repairs", "on-site-hydraulic-service"],
  },
]
