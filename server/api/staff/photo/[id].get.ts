// A job photo for a signed-in mechanic: redirects to Fergus's short-lived download URL.
export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const id = getRouterParam(event, "id") ?? ""
  const url = /^[\w-]{1,40}$/.test(id) ? await fergusPhotoUrl(id) : undefined
  if (!url) throw createError({ statusCode: 404, statusMessage: "Not found" })
  setResponseHeader(event, "Cache-Control", "private, max-age=600")
  return sendRedirect(event, url, 302)
})
