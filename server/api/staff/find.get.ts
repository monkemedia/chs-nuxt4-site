import * as z from "zod"

// Finds a job by its number: GET /api/staff/find?jobNo=1234 → { id }
const query = z.object({ jobNo: z.string().regex(/^\d{1,10}$/) })

export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const { jobNo } = await getValidatedQuery(event, query.parse)
  const job = await fergusJobByNumber(jobNo, false)
  if (!job) throw createError({ statusCode: 404, statusMessage: "No such job" })
  return { id: job.id }
})
