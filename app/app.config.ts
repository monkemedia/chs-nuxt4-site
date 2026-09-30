// Business details that are the same in every language (name, phone, email, structured data).
// Translatable details (location, service area, opening hours) live in app/content/<locale>/.
// Placeholder values: replace before launch (see README). These must match the
// Google Business Profile and directory listings exactly (name, address, phone).
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
  // Features not live yet. Off = hidden everywhere, with replacement copy where needed.
  features: {
    // On-site / mobile work: the homepage "We come to you" band, the On-site Service page,
    // on-site claims and the Uptime Promise. Off uses app/content/<locale>/workshop.ts.
    onsite: false,
  },
  // The offer. Copy in app/content/ uses {hours}, filled in by useContent(), and {years} of
  // experience, worked out from `business.foundingYear` (35 in 2026, going up each year).
  // Only publish numbers CHS can stand behind (misleading claims breach CMA rules).
  offer: {
    // Target time on-site after a breakdown call, across the core area.
    responseHours: 4,
    // The Uptime Promise ("on-site within {hours} hours or the call-out's free"). Phase 2: only
    // switch on once a second mechanic and the mobile service can reliably deliver it.
    // Needs `features.onsite` on too.
    uptimePromise: false,
  },
  business: {
    name: "CHS Hydraulics",
    // Brand line: the homepage H1, the footer and structured data (`slogan`). Kept in English
    // on the Welsh pages too, like the name. The last word is highlighted in the hero.
    tagline: "Driven By Pressure",
    // Registered name at Companies House (OC308080); confirm it's still the legal entity.
    legalName: "Crosshands Hydraulic Services LLP",
    // Founding directors, named in the About page story and the homepage "why" band (copy uses
    // {founder1} and {founder2}). PLACEHOLDERS: names in [brackets] show on the site but are
    // kept out of structured data, and `npm run generate` warns until they're replaced.
    // Get their permission before publishing names or photos.
    founders: [{ name: "[Founder 1]" }, { name: "[Founder 2]" }],
    // Photo of the founders together for the About story (a /images/ path, ideally 4:3), or ""
    // for a placeholder panel.
    foundersPhoto: "",
    // Quality certification: footer badge, About facts, Why CHS promise and structured data.
    // PLACEHOLDERS: set the real certificate number, and `mark` to the official URS/UKAS
    // certification mark from URS's logo pack (e.g. "/images/urs-iso-9001.png"); until then a
    // text badge shows. Never use the UKAS or ISO logos on their own, or a mark copied from the
    // web. Only claim it while the certificate is current and for the activities in its scope.
    certification: {
      standard: "ISO 9001:2015",
      body: "URS",
      accreditation: "UKAS",
      certificateNumber: "[Certificate no.]",
      mark: "",
    },
    // Year the business started: "Established", structured data and {years} of experience.
    // The LLP was only incorporated in 2004. Confirm with the business.
    foundingYear: "1991",
    // Former trading name: kept in structured data so Google links old listings to the new brand.
    formerName: "Crosshands Hydraulic Services",
    phoneDisplay: "01269 831491",
    phoneHref: "tel:+441269831491",
    phoneIntl: "+44 1269 831491",
    email: "info@chshydraulics.co.uk",
    // Must match the Google Business Profile exactly.
    address: {
      street: "3 Acer Court",
      locality: "Cross Hands",
      town: "Llanelli",
      region: "Carmarthenshire",
      postcode: "SA14 6RB",
    },
    // Map pin and structured data `geo`. APPROXIMATE: the SA14 6RB postcode point (Acer Court
    // isn't in OpenStreetMap); Google places the unit on Heol Parc Mawr, a little away. Replace
    // with the exact point (right-click the unit in Google Maps, click the coordinates to copy
    // them), then regenerate the preview image (public/images/map-cross-hands.jpg) around it.
    geo: { latitude: 51.793761, longitude: -4.076576 },
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
    // Opening hours in schema.org format: the one source for the contact page list, the live
    // open/closed line and structured data (app/utils/hours.ts). Must match Google.
    openingHours: ["Mo-Fr 08:00-17:30", "Sa 08:00-12:00"],
    // Profile URLs (Google Business Profile, Facebook, Yell…) for structured data.
    sameAs: [] as string[],
    // Google Business Profile Place ID (find it at developers.google.com/maps/documentation/places/web-service/place-id).
    // Powers the "Read all reviews" and "Leave a review" links. Empty = links hidden.
    googlePlaceId: "",
  },
})
