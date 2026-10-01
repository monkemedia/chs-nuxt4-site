import type { Area } from "../types"

// Town pages (/areas/<slug>). Same slugs and order in every locale. Workshop-based copy only:
// on-site work isn't live (see workshop.ts), so these never promise call-outs.
// CHECK WITH CHS: the travel times and distances, and "most hoses while you wait".

export const areas: Area[] = [
  {
    slug: "ammanford",
    town: "Ammanford",
    fromTown: "from Ammanford",
    inTown: "in Ammanford",
    metaTitle: "Hydraulic Repairs Ammanford | Hoses & Rams | CHS Hydraulics",
    metaDescription:
      "Hydraulic hose, ram and system repairs for Ammanford and the Amman Valley, about 15 minutes away at our Cross Hands workshop. Most hoses while you wait.",
    h1: "Hydraulic repairs for Ammanford",
    lead: "Burst hose, leaking ram or a fault you can't trace? Our Cross Hands workshop is only about 15 minutes from Ammanford.",
    intro: [
      // CHECK WITH CHS: the kind of local work described here.
      "From farms around Llandybie and up the Amman Valley to the plant and tipper trucks working out of Ammanford, hydraulics do the heavy lifting. When something fails you want it fixed properly and quickly, close to home, by people who'll tell you straight what it needs.",
      "CHS Hydraulics has been repairing hydraulic hoses, rams and systems for {years} years, just down the road in Cross Hands. Bring the hose, ram or component in: most hoses are made up while you wait, and rams are stripped, inspected and rebuilt in-house.",
      "Not sure what it needs? Call {phone} or email us a photo of the part, and we'll tell you what we think before you set off.",
    ],
    // CHECK WITH CHS: distance, time and route.
    travel: {
      distance: "About 6 miles",
      time: "Around 15 minutes",
      route: "Through Saron and Penygroes",
    },
    nearby: [
      "Tycroes",
      "Saron",
      "Capel Hendre",
      "Penygroes",
      "Llandybie",
      "Betws",
      "Glanaman",
      "Garnant",
      "Brynamman",
    ],
    faqs: [
      {
        q: "How far is your workshop from Ammanford?",
        a: "About 6 miles, or around 15 minutes by car through Saron and Penygroes. We're at {address}.",
      },
      {
        q: "Can I wait while my hose is made?",
        a: "For most hoses, yes. Bring the old hose so we can match the length, pressure rating and fittings. For anything unusual or very large, call {phone} first so we can have the parts ready.",
      },
      {
        q: "What machines do you work on?",
        a: "Tractors, loaders, excavators, telehandlers, tippers, forklifts and industrial equipment. If it runs on hydraulics, we can usually help.",
      },
      {
        q: "Can you quote before I bring it in?",
        a: "Often, yes. Email us a photo of the hose, ram or fitting with any markings you can see, or call {phone}, and we'll give you an idea of what's involved.",
      },
    ],
  },
  {
    slug: "carmarthen",
    town: "Carmarthen",
    fromTown: "from Carmarthen",
    inTown: "in Carmarthen",
    metaTitle: "Hydraulic Repairs Carmarthen | Hoses & Rams | CHS Hydraulics",
    metaDescription:
      "Hydraulic hose, ram and system repairs for Carmarthen, about 20 minutes along the A48 at our Cross Hands workshop. Most hoses made while you wait.",
    h1: "Hydraulic repairs for Carmarthen",
    lead: "Burst hose, leaking ram or a fault you can't trace? Our Cross Hands workshop is around 20 minutes from Carmarthen, straight along the A48.",
    intro: [
      // CHECK WITH CHS: the kind of local work described here.
      "From the farms of the Tywi Valley to the contractors and plant hire yards around Carmarthen, hydraulics keep the county's machines working. When something fails you want it fixed properly and quickly, by people who'll tell you straight what it needs.",
      "CHS Hydraulics has been repairing hydraulic hoses, rams and systems for {years} years. Bring the hose, ram or component to our workshop in Cross Hands: most hoses are made up while you wait, and rams are stripped, inspected and rebuilt in-house.",
      "Not sure it's worth the trip? Call {phone} or email us a photo of the part, and we'll tell you what we think before you set off.",
    ],
    // CHECK WITH CHS: distance, time and route.
    travel: {
      distance: "About 13 miles",
      time: "Around 20 minutes",
      route: "A48 east to Cross Hands",
    },
    nearby: [
      "Johnstown",
      "Llangunnor",
      "Abergwili",
      "Bronwydd",
      "Nantgaredig",
      "Cwmffrwd",
      "Llanddarog",
      "Porthyrhyd",
    ],
    faqs: [
      {
        q: "How far is your workshop from Carmarthen?",
        a: "About 13 miles, or around 20 minutes by car: head east on the A48 to Cross Hands. We're at {address}.",
      },
      {
        q: "Can I wait while my hose is made?",
        a: "For most hoses, yes. Bring the old hose so we can match the length, pressure rating and fittings. For anything unusual or very large, call {phone} first so we can have the parts ready.",
      },
      {
        q: "Do you repair tractor and loader rams?",
        a: "Yes. Tractor loader, tipping and implement rams are stripped, inspected, resealed and rebuilt in our workshop, then pressure tested before they go back.",
      },
      {
        q: "Can you quote before I bring it in?",
        a: "Often, yes. Email us a photo of the hose, ram or fitting with any markings you can see, or call {phone}, and we'll give you an idea of what's involved.",
      },
    ],
  },
  {
    slug: "swansea",
    town: "Swansea",
    fromTown: "from Swansea",
    inTown: "in Swansea",
    metaTitle: "Hydraulic Repairs Swansea | Hoses & Rams | CHS Hydraulics",
    metaDescription:
      "Hydraulic hose, ram and system repairs for Swansea, about 25 minutes up the M4 at our Cross Hands workshop. Most hoses made while you wait.",
    h1: "Hydraulic repairs for Swansea",
    lead: "Burst hose, leaking ram or a fault you can't trace? Our Cross Hands workshop is around 25 minutes from Swansea, just off the M4.",
    intro: [
      "From the docks and Swansea Enterprise Park to the plant yards of Llansamlet and the farms out towards Gower, hydraulics keep Swansea's machines working. When something fails you want it fixed properly and quickly, by people who'll tell you straight what it needs.",
      "CHS Hydraulics has been repairing hydraulic hoses, rams and systems for {years} years. Bring the hose, ram or component to our workshop in Cross Hands: most hoses are made up while you wait, and rams are stripped, inspected and rebuilt in-house.",
      "Not sure it's worth the trip? Call {phone} or email us a photo of the part, and we'll tell you what we think before you set off.",
    ],
    travel: {
      distance: "About 16 miles",
      time: "Around 25 minutes",
      route: "M4 west to junction 49, then the A48",
    },
    nearby: [
      "Gorseinon",
      "Gowerton",
      "Pontarddulais",
      "Penllergaer",
      "Llangyfelach",
      "Morriston",
      "Fforestfach",
      "Llansamlet",
      "Swansea Enterprise Park",
    ],
    faqs: [
      {
        q: "How far is your workshop from Swansea?",
        a: "About 16 miles, or around 25 minutes by car. Take the M4 west to junction 49 (Pont Abraham), then the A48 to Cross Hands. We're at {address}.",
      },
      {
        q: "Can I wait while my hose is made?",
        a: "For most hoses, yes. Bring the old hose so we can match the length, pressure rating and fittings. For anything unusual or very large, call {phone} first so we can have the parts ready.",
      },
      {
        q: "What machines do you work on?",
        a: "Excavators, loaders, telehandlers, tractors, tippers, forklifts and industrial equipment. If it runs on hydraulics, we can usually help.",
      },
      {
        q: "Can you quote before I bring it in?",
        a: "Often, yes. Email us a photo of the hose, ram or fitting with any markings you can see, or call {phone}, and we'll give you an idea of what's involved.",
      },
    ],
  },
]
