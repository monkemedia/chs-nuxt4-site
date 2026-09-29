// Postal address helpers, in Royal Mail order: street, locality, post town, postcode
// ("3 Acer Court, Cross Hands, Llanelli SA14 6RB"). Auto-imported.
interface Address {
  street: string
  locality: string
  town: string
  postcode: string
}

// One line per part, with the postcode on the town's line.
export function addressLines(address: Address) {
  return [
    address.street,
    address.locality,
    [address.town, address.postcode].filter(Boolean).join(" "),
  ].filter(Boolean)
}

const query = (address: Address) =>
  encodeURIComponent(addressLines(address).join(", "))

// Google Maps search for the address (opens the Maps app on phones).
export function mapsUrl(address: Address) {
  return `https://www.google.com/maps/search/?api=1&query=${query(address)}`
}

// Directions to the address from wherever the visitor is.
export function directionsUrl(address: Address) {
  return `https://www.google.com/maps/dir/?api=1&destination=${query(address)}`
}

// Embeddable Google map (no API key needed). Only load it after the visitor asks: it sets
// Google cookies and loads a lot of script.
export function mapEmbedUrl(address: Address) {
  return `https://www.google.com/maps?q=${query(address)}&z=16&output=embed`
}
