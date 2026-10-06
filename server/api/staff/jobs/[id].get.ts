// A job for the staff app: everything on it, internal notes included. Photos come as links to
// /api/staff/photo/<id>, which only answer to a signed-in mechanic.
export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const id = Number(getRouterParam(event, "id"))
  const job = Number.isInteger(id) ? await fergusJobById(id) : undefined
  if (!job) throw createError({ statusCode: 404, statusMessage: "No such job" })
  return {
    ...job,
    photos: job.photos.map((p) => ({
      ...p,
      url: `/api/staff/photo/${encodeURIComponent(p.id)}`,
    })),
  }
})
