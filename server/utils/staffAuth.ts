import { scryptSync, timingSafeEqual } from "node:crypto"
import type { H3Event } from "h3"

// Staff app sign-in. Accounts are in NUXT_STAFF_ACCOUNTS (secret, Vercel settings only):
// "email=hash" pairs separated by commas, the hash from `npm run staff:password`. Each email
// must also be a Fergus user, whose diary the app shows. Sessions are an encrypted cookie
// (h3 sessions, NUXT_SESSION_SECRET, 32+ characters) lasting 30 days, so mechanics stay signed
// in on their phone. In mock mode with no accounts set, any email signs in with "demo".

export interface StaffUser {
  email: string
  firstName: string
  fergusUserId: number
}

const devSecret = "chs-mock-session-secret-not-for-production-use"

function sessionConfig() {
  const runtimeConfig = useRuntimeConfig()
  const secret = runtimeConfig.sessionSecret as string
  if (secret.length < 32 && !fergusIsMock())
    throw createError({
      statusCode: 503,
      statusMessage: "Staff app not set up (NUXT_SESSION_SECRET)",
    })
  return {
    password: secret.length >= 32 ? secret : devSecret,
    name: "chs-staff",
    maxAge: 30 * 24 * 60 * 60,
    cookie: { sameSite: "lax" as const, httpOnly: true, path: "/" },
  }
}

// The staff app only exists with its flag on and Fergus connected (or the mock).
export function staffAppEnabled() {
  const { features } = useAppConfig()
  const runtimeConfig = useRuntimeConfig()
  return features.staffApp && (!!runtimeConfig.fergusApiToken || fergusIsMock())
}

export async function staffSession(event: H3Event) {
  return await useSession<{ user?: StaffUser }>(event, sessionConfig())
}

// The signed-in mechanic, or a 401 (404 while the app is off).
export async function requireStaff(event: H3Event) {
  if (!staffAppEnabled())
    throw createError({ statusCode: 404, statusMessage: "Not found" })
  const session = await staffSession(event)
  if (!session.data.user)
    throw createError({ statusCode: 401, statusMessage: "Sign in" })
  return session.data.user
}

function accounts() {
  const runtimeConfig = useRuntimeConfig()
  const map = new Map<string, string>()
  for (const pair of String(runtimeConfig.staffAccounts).split(",")) {
    const at = pair.indexOf("=")
    if (at > 0)
      map.set(pair.slice(0, at).trim().toLowerCase(), pair.slice(at + 1).trim())
  }
  return map
}

// Whether the password is right for this email (always takes about the same time).
export function checkPassword(email: string, password: string) {
  const list = accounts()
  if (!list.size && fergusIsMock()) return password === "demo"
  const stored = list.get(email.toLowerCase()) ?? `scrypt$x$${"A".repeat(43)}`
  const [, salt, hash] = stored.split("$")
  if (!salt || !hash) return false
  const expected = Buffer.from(hash, "base64url")
  const given = scryptSync(password, salt, expected.length)
  return timingSafeEqual(expected, given) && list.has(email.toLowerCase())
}

// The job named in the route (/api/staff/jobs/<id>/…), or a 404.
export async function staffJob(event: H3Event) {
  const id = Number(getRouterParam(event, "id"))
  const job = Number.isInteger(id) ? await fergusJobById(id) : undefined
  if (!job) throw createError({ statusCode: 404, statusMessage: "No such job" })
  return job
}
