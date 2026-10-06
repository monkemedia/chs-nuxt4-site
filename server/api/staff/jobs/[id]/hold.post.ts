import * as z from "zod"

// Puts a job on hold (with a reason for the office) or resumes it.
const body = z.object({
  hold: z.boolean(),
  reason: z.string().trim().max(500).optional(),
})

export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const job = await staffJob(event)
  const { hold, reason } = await readValidatedBody(event, body.parse)
  await fergusSetHold(job.id, hold, reason)
  forgetRepairJob(job.jobNo)
  return { ok: true }
})
