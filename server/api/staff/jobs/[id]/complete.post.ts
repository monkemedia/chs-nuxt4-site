import * as z from "zod"

// Marks a phase's work complete (Fergus: ready for invoice).
const body = z.object({ phaseId: z.number().int() })

export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const job = await staffJob(event)
  const { phaseId } = await readValidatedBody(event, body.parse)
  if (!job.phases.some((p) => p.id === phaseId))
    throw createError({ statusCode: 404, statusMessage: "No such phase" })
  await fergusCompletePhase(job.id, phaseId)
  forgetRepairJob(job.jobNo)
  return { ok: true }
})
