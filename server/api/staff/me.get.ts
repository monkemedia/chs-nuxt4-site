// The signed-in mechanic, or null (404 while the staff app is off).
export default defineEventHandler(async (event) => {
  if (!staffAppEnabled())
    throw createError({ statusCode: 404, statusMessage: "Not found" })
  const session = await staffSession(event)
  return session.data.user ?? null
})
