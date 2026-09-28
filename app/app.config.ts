// Business details that are the same in every language (name, phone, email, structured data).
// Translatable details (location, service area, opening hours) live in app/content/<locale>/.
// Placeholder values: replace before launch (see README). These must match the
// Google Business Profile and directory listings exactly (name, address, phone).
export type BrandVariant = "orange" | "red"

export default defineAppConfig({
  ui: {
    colors: {
      primary: "chs",
      neutral: "zinc",
    },
    button: {
      slots: { base: "uppercase font-extrabold tracking-wider" },
    },
    formField: {
      slots: {
        label:
          "uppercase text-xs font-extrabold tracking-wide text-highlighted",
      },
    },
  },
  // Brand colour A/B test (see AGENTS.md "Brand A/B test"). With `abTest` on, each visitor
  // is randomly assigned a variant on first visit and keeps it (localStorage). `?brand=red`
  // or `?brand=orange` forces one. Turn `abTest` off to show everyone `default`.
  brand: {
    abTest: true,
    default: "orange" as BrandVariant,
    variants: ["orange", "red"] as BrandVariant[],
    // Images that differ per brand: default src -> variant src. <BrandPicture> swaps them.
    images: {
      "/images/chs-logo-white.png": { red: "/images/chs-logo-white-red.png" },
      "/images/hero.jpg": { red: "/images/hero-red.jpg" },
      "/images/service-van.png": { red: "/images/service-van-red.png" },
    } as Record<string, Partial<Record<BrandVariant, string>>>,
  },
  // Features not live yet. Off = hidden everywhere, with replacement copy where needed.
  features: {
    // On-site / mobile work: the homepage "We come to you" band, the On-site Service page,
    // on-site claims and the Uptime Promise. Off uses app/content/<locale>/workshop.ts.
    onsite: false,
  },
  // The offer. Copy in app/content/ uses {years} and {hours}, filled in by useContent().
  // Only publish numbers CHS can stand behind (misleading claims breach CMA rules).
  offer: {
    // Experience claimed in copy; the LLP was incorporated in 2004, so confirm what the 35 covers.
    yearsExperience: 35,
    // Target time on-site after a breakdown call, across the core area.
    responseHours: 4,
    // The Uptime Promise ("on-site within {hours} hours or the call-out's free"). Phase 2: only
    // switch on once a second mechanic and the mobile service can reliably deliver it.
    // Needs `features.onsite` on too.
    uptimePromise: false,
  },
  business: {
    name: "CHS Hydraulics",
    // Registered name at Companies House (OC308080); confirm it's still the legal entity.
    legalName: "Crosshands Hydraulic Services LLP",
    // Former trading name: kept in structured data so Google links old listings to the new brand.
    formerName: "Crosshands Hydraulic Services",
    phoneDisplay: "01269 123 456",
    phoneHref: "tel:+441269123456",
    phoneIntl: "+44 1269 123456",
    email: "info@chshydraulics.co.uk",
    // Leave street/postcode empty until confirmed; the address is only added to structured data once both are set.
    address: {
      street: "",
      locality: "Cross Hands",
      town: "Llanelli",
      region: "Carmarthenshire",
      postcode: "",
    },
    // Towns named in structured data (areaServed).
    towns: [
      "Cross Hands",
      "Llanelli",
      "Carmarthen",
      "Ammanford",
      "Burry Port",
      "Kidwelly",
      "Swansea",
      "Neath",
      "Port Talbot",
    ],
    // Opening hours in schema.org format; keep in step with `business.hours` in app/content/<locale>/index.ts.
    openingHours: ["Mo-Fr 08:00-17:30", "Sa 08:00-12:00"],
    // Profile URLs (Google Business Profile, Facebook, Yell…) for structured data.
    sameAs: [] as string[],
    // Google Business Profile Place ID (find it at developers.google.com/maps/documentation/places/web-service/place-id).
    // Powers the "Read all reviews" and "Leave a review" links. Empty = links hidden.
    googlePlaceId: "",
  },
})
