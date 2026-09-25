import type { Service } from "../types"

// Content for the services index, each /services/<slug> page, the homepage cards
// and the contact form's service dropdown.
// Check every claim with the business before launch: only publish what CHS actually does.

export const services: Service[] = [
  {
    slug: "hydraulic-hoses",
    title: "Hydraulic Hoses",
    icon: "i-lucide-cable",
    image: "/images/hoses.jpg",
    alt: "Hydraulic hoses and crimped couplings",
    summary: "Bespoke hose manufacture and replacement, while you wait.",
    metaTitle: "Hydraulic Hose Repair Llanelli & Carmarthenshire | CHS",
    metaDescription:
      "Hydraulic hoses made up while you wait at our Cross Hands workshop, or replaced on-site by our mobile unit. Serving Llanelli, Carmarthenshire and South Wales.",
    h1: "Hydraulic hose repair & replacement",
    lead: "Burst or leaking hose? We make up replacement hydraulic hoses while you wait at our Cross Hands workshop, or come out and fit them on-site.",
    intro: [
      "A failed hydraulic hose stops a machine dead, so we keep turnaround as short as we can. Bring the old hose into our workshop at Cross Hands and we'll match the length, pressure rating and end fittings, then make up a new assembly while you wait.",
      "If the machine can't come to us, our mobile service unit can replace the hose where it stands: on a building site, in a field or at your yard anywhere across Llanelli, Carmarthenshire and South Wales.",
    ],
    includes: [
      "High-pressure hydraulic hoses made up to length",
      "Matching end fittings and adaptors",
      "Like-for-like replacement of burst, chafed or perished hoses",
      "Hose protection such as spiral guard and sleeving",
      "Hoses for plant, tractors, trailers, tippers and industrial machinery",
      "On-site hose replacement with our mobile unit",
    ],
    process: [
      {
        title: "Bring it in or call us out",
        text: "Drop the old hose into our Cross Hands workshop, or call and we'll come to the machine.",
      },
      {
        title: "We match and make it up",
        text: "We match the hose type, length and fittings and build the new assembly.",
      },
      {
        title: "Fitted and checked",
        text: "The new hose is fitted, the system is run up and checked for leaks.",
      },
    ],
    faqs: [
      {
        q: "Can you make a hydraulic hose while I wait?",
        a: "Yes. Most standard hose assemblies can be made up while you wait at our Cross Hands workshop. For large or unusual hoses, call ahead so we can check we have what's needed.",
      },
      {
        q: "Do I need to bring the old hose?",
        a: "It helps, because we can match the length and fittings exactly. If you can't remove it, tell us the machine make and model, or call us out to measure and replace it on-site.",
      },
      {
        q: "Can you replace a hose on-site?",
        a: "Yes. Our mobile service unit can replace hoses on plant, farm and commercial machinery at your site, field or yard.",
      },
      {
        q: "What areas do you cover?",
        a: "We're based in Cross Hands and cover Llanelli, Carmarthen, Ammanford, Swansea and the wider Carmarthenshire and South Wales area.",
      },
    ],
  },
  {
    slug: "ram-repairs",
    title: "Ram Repairs",
    icon: "i-lucide-cylinder",
    image: "/images/rams.jpg",
    alt: "Hydraulic ram with polished cylinder rod",
    summary:
      "Strip, inspect, repair and reseal all types of hydraulic rams and cylinders.",
    metaTitle: "Hydraulic Ram & Cylinder Repairs Carmarthenshire | CHS",
    metaDescription:
      "Hydraulic ram and cylinder repairs and resealing at our Cross Hands workshop. Leaking or drifting rams stripped, inspected and repaired. Llanelli & South Wales.",
    h1: "Hydraulic ram & cylinder repairs",
    lead: "Leaking, drifting or damaged rams stripped, inspected, repaired and resealed at our Cross Hands workshop.",
    intro: [
      "A leaking or drifting ram gets worse the longer it's left, and it can damage the rod and seals further. We strip hydraulic rams and cylinders down, inspect every part and tell you plainly what needs doing before we go ahead.",
      "We work on rams from excavators, loaders, telehandlers, tractors, tipping trailers and industrial machinery, from small single-acting cylinders to large double-acting rams.",
    ],
    includes: [
      "Full strip-down and inspection",
      "Resealing with new seal kits",
      "Rod and tube checked for scoring, pitting and bends",
      "Repair or replacement of worn and damaged parts",
      "Rebuilt and checked before it goes back to you",
      "Single- and double-acting rams of all types",
    ],
    process: [
      {
        title: "Bring the ram in",
        text: "Drop the ram at our workshop, or ask about removal when we're on-site.",
      },
      {
        title: "Strip and inspect",
        text: "We strip it down, find the cause and explain what it needs and why.",
      },
      {
        title: "Repair and reseal",
        text: "Parts are repaired or replaced, the ram is resealed, rebuilt and returned.",
      },
    ],
    faqs: [
      {
        q: "How do I know if a hydraulic ram needs resealing?",
        a: "Common signs are oil weeping past the rod seal, the ram drifting or creeping under load, sluggish or uneven movement, and oil on the rod after it retracts.",
      },
      {
        q: "Can a scored ram rod be repaired?",
        a: "Light marks can sometimes be polished out. Deeper scoring or pitting usually means the rod needs re-chroming or replacing. We'll tell you which after inspection.",
      },
      {
        q: "How long does a ram repair take?",
        a: "It depends on the ram and whether parts need sourcing. Call with the machine make and model and we'll give you a realistic turnaround.",
      },
      {
        q: "What machines do you repair rams for?",
        a: "Plant and construction equipment, agricultural machinery, tipping trailers, commercial vehicles and industrial equipment.",
      },
    ],
  },
  {
    slug: "hydraulic-system-repairs",
    title: "System Repairs",
    icon: "i-lucide-cog",
    image: "/images/systems.jpg",
    alt: "Hydraulic system components and pipework",
    summary:
      "Diagnostics, fault finding and complete hydraulic system repairs.",
    metaTitle: "Hydraulic System Repairs & Fault Finding | CHS Llanelli",
    metaDescription:
      "Hydraulic fault finding and system repairs for plant, farm and industrial machinery. Slow, weak or overheating hydraulics fixed across Carmarthenshire.",
    h1: "Hydraulic system repairs & fault finding",
    lead: "Slow, weak, noisy or overheating hydraulics? We track down the cause and repair it, in the workshop or on-site.",
    intro: [
      "Hydraulic faults aren't always where they first appear. A slow arm might be a worn pump, a sticking valve, a blocked filter or an internal leak. We diagnose the system properly so you only pay to fix what's actually wrong.",
      "We carry out fault finding and repairs on plant, agricultural, commercial and industrial hydraulic systems, at our Cross Hands workshop or on-site with our mobile unit.",
    ],
    includes: [
      "Fault finding on slow, weak or erratic hydraulics",
      "Pump, valve and motor diagnosis",
      "Pressure and flow checks",
      "Leak tracing and repair",
      "Component repair and replacement",
      "Oil and filter changes",
    ],
    process: [
      {
        title: "Tell us the symptoms",
        text: "Call with the machine and what it's doing. It helps us bring the right kit.",
      },
      {
        title: "Diagnose",
        text: "We test the system to find the root cause, not just the symptom.",
      },
      {
        title: "Repair and test",
        text: "We repair or replace the faulty parts and test the system under load.",
      },
    ],
    faqs: [
      {
        q: "Why are my hydraulics slow?",
        a: "Common causes include low or contaminated oil, blocked filters, a worn pump, internal leakage in rams or valves, and incorrect relief valve settings. Diagnosis pins down which.",
      },
      {
        q: "Why is my hydraulic oil overheating?",
        a: "Overheating is often caused by a worn pump or internal leakage, a restricted cooler, low oil level or a relief valve opening too often. It should be looked at quickly, as heat damages seals and oil.",
      },
      {
        q: "Can you diagnose faults on-site?",
        a: "Yes. Our mobile unit can carry out fault finding at your site, which avoids transporting the machine.",
      },
      {
        q: "What machines do you work on?",
        a: "Excavators, loaders, telehandlers, tractors and farm machinery, tippers and commercial vehicles, and industrial hydraulic equipment.",
      },
    ],
  },
  {
    slug: "on-site-hydraulic-service",
    title: "On-site Service",
    icon: "i-lucide-wrench",
    image: "/images/onsite.jpg",
    alt: "CHS mobile hydraulic service van",
    summary:
      "Mobile hydraulic service and emergency call-outs to keep you moving.",
    metaTitle: "Mobile Hydraulic Repairs Llanelli & Carmarthenshire | CHS",
    metaDescription:
      "Mobile hydraulic repairs, on-site hose replacement and breakdown call-outs across Llanelli, Carmarthenshire and South Wales. Our equipped unit comes to you.",
    h1: "On-site & mobile hydraulic service",
    lead: "Machine broken down on site or in the field? Our fully equipped mobile unit comes to you across Carmarthenshire and South Wales.",
    intro: [
      "Moving a broken-down machine costs time and money. Our fully equipped mobile service unit carries out hose replacements, repairs and fault diagnosis where the machine stands, so you're back to work sooner.",
      "We're based in Cross Hands, so we're well placed for Llanelli, Carmarthen, Ammanford, Swansea and the surrounding area, working on building sites, quarries, farms and yards.",
    ],
    includes: [
      "Breakdown and emergency call-outs",
      "On-site hydraulic hose replacement",
      "On-site fault finding and diagnostics",
      "Plant, agricultural and commercial machinery",
      "Scheduled on-site servicing visits",
      "Flexible, reliable scheduling",
    ],
    process: [
      {
        title: "Call us",
        text: "Tell us the machine, where it is and what's happened. A photo of the failed part helps.",
      },
      {
        title: "We come to you",
        text: "Our mobile unit comes to your site, field or yard with the kit to fix it.",
      },
      {
        title: "Back to work",
        text: "Most hose jobs are fixed there and then. Bigger repairs are planned with you.",
      },
    ],
    faqs: [
      {
        q: "Do you cover my area?",
        a: "We're based in Cross Hands and regularly cover Llanelli, Carmarthen, Ammanford, Swansea, Neath Port Talbot and the wider South Wales area. Call to check availability for your location.",
      },
      {
        q: "Do you offer emergency call-outs?",
        a: "Yes. Call us and we'll tell you how quickly we can get to you. Availability depends on the time and location.",
      },
      {
        q: "What should I have ready when I call?",
        a: "The machine make and model, where it is, what has failed and, if possible, a photo of the damaged hose or part.",
      },
      {
        q: "What can you fix on-site?",
        a: "Hose replacements and many repairs can be done on-site. Where a component needs workshop repair, such as a ram reseal, we'll arrange it with you.",
      },
    ],
  },
]
