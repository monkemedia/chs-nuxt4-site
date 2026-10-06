// Mock mode only: photos taken in the staff app, kept in memory (stand-in for Fergus storage).
export default defineEventHandler((event) => {
  const file = fergusIsMock()
    ? mockPhotoFiles.get(getRouterParam(event, "id") ?? "")
    : undefined
  if (!file) throw createError({ statusCode: 404, statusMessage: "Not found" })
  setResponseHeader(event, "Content-Type", file.type)
  return file.data
})
