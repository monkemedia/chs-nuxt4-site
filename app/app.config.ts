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
  business: {
    name: "Crosshands Hydraulic Services",
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
