import * as z from "zod"

// Adds a note to a job, signed by the mechanic. `shared` pins it for "Track my repair".
const body = z.object({
  text: z.string().trim().min(1).max(4000),
  shared: z.boolean(),
})

export default defineEventHandler(async (event) => {
  const user = await requireStaff(event)
  const job = await staffJob(event)
  const { text, shared } = await readValidatedBody(event, body.parse)
  await fergusAddNote(job.id, text, shared, user.firstName)
  forgetRepairJob(job.jobNo)
  return { ok: true }
})
