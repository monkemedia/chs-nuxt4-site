export default defineEventHandler(async (event) => {
  const session = await staffSession(event)
  await session.clear()
  return { ok: true }
})
