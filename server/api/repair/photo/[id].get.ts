import * as z from "zod"

// A shared "Track my repair" photo, from a signed link (see repairPhotos.ts). Redirects to the
// file: Fergus's own short-lived download URL, or a site image in mock mode.
const query = z.object({ exp: z.coerce.number(), sig: z.string().max(100) })

export default defineEventHandler(async (event) => {
  const { features } = useAppConfig()
  if (!features.trackRepair || !features.repairUpdates)
    throw createError({ statusCode: 404, statusMessage: "Not found" })
  const id = getRouterParam(event, "id") ?? ""
  const { exp, sig } = await getValidatedQuery(event, query.parse)
  if (!/^[\w-]{1,40}$/.test(id) || !validPhotoSignature(id, exp, sig))
    throw createError({ statusCode: 403, statusMessage: "Link expired" })
  const url = await fergusPhotoUrl(id)
  if (!url) throw createError({ statusCode: 404, statusMessage: "Not found" })
  setResponseHeader(event, "Cache-Control", "private, max-age=600")
  return sendRedirect(event, url, 302)
})
