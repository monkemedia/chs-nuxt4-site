import { createHmac, timingSafeEqual } from "node:crypto"

// Signed links for "Track my repair" photos: /api/repair/photo/<id>?exp=…&sig=…. They're only
// handed out after the visitor's job number and contact have been checked, and expire after an
// hour, so photos can't be fetched by guessing ids. Signed with the Fergus token (server-only).
const lifetime = 60 * 60

function signature(id: string, exp: number) {
  const runtimeConfig = useRuntimeConfig()
  const key = (runtimeConfig.fergusApiToken as string) || "mock"
  return createHmac("sha256", key).update(`${id}.${exp}`).digest("base64url")
}

export function signedPhotoUrl(id: string) {
  const exp = Math.floor(Date.now() / 1000) + lifetime
  return `/api/repair/photo/${encodeURIComponent(id)}?exp=${exp}&sig=${signature(id, exp)}`
}

export function validPhotoSignature(id: string, exp: number, sig: string) {
  if (!Number.isFinite(exp) || exp < Date.now() / 1000) return false
  const expected = Buffer.from(signature(id, exp))
  const given = Buffer.from(sig)
  return expected.length === given.length && timingSafeEqual(expected, given)
}
