import * as z from "zod"

// Staff sign-in: email and password (see staffAuth.ts), then the matching Fergus user. Five
// failed tries per visitor in 15 minutes, then 429.
const body = z.object({
  email: z.email().max(200),
  password: z.string().min(1).max(200),
})

const failures = new Map<string, { count: number; reset: number }>()

export default defineEventHandler(async (event) => {
  if (!staffAppEnabled())
    throw createError({ statusCode: 404, statusMessage: "Not found" })
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? "unknown"
  const now = Date.now()
  const seen = failures.get(ip)
  if (seen && seen.reset > now && seen.count >= 5)
    throw createError({ statusCode: 429, statusMessage: "Too many attempts" })

  const { email, password } = await readValidatedBody(event, body.parse)
  const user = checkPassword(email, password)
    ? await fergusUserByEmail(email)
    : undefined
  if (!user) {
    if (!seen || seen.reset <= now)
      failures.set(ip, { count: 1, reset: now + 15 * 60_000 })
    else seen.count++
    throw createError({ statusCode: 401, statusMessage: "Wrong details" })
  }
  failures.delete(ip)
  const session = await staffSession(event)
  const staffUser: StaffUser = {
    email: email.toLowerCase(),
    firstName: user.firstName,
    fergusUserId: user.id,
  }
  await session.update({ user: staffUser })
  return staffUser
})
