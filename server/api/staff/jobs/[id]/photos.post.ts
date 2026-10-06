// Adds a photo to a job (multipart: `photo`, `shared`). The app resizes photos before upload;
// anything over 10 MB or not an image is refused.
export default defineEventHandler(async (event) => {
  const user = await requireStaff(event)
  const job = await staffJob(event)
  const parts = (await readMultipartFormData(event)) ?? []
  const photo = parts.find((p) => p.name === "photo")
  const shared =
    parts.find((p) => p.name === "shared")?.data.toString() === "true"
  if (!photo?.type?.startsWith("image/") || photo.data.length > 10 * 1024 ** 2)
    throw createError({ statusCode: 400, statusMessage: "Not a photo" })
  await fergusAddPhoto(
    job.id,
    { data: photo.data, type: photo.type },
    shared,
    user.firstName,
  )
  forgetRepairJob(job.jobNo)
  return { ok: true }
})
