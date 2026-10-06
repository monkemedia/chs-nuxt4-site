import * as z from "zod"

// "Track my repair": POST /api/repair with the job number and the email or phone it was booked
// under. Only answers when the contact matches the job, and a wrong guess looks the same as a
// missing job, so job numbers can't be browsed. POST keeps the contact details out of URLs and
// logs.
const body = z.object({
  jobNo: z
    .string()
    .trim()
    .transform((s) => s.replace(/^#/, ""))
    .pipe(z.string().regex(/^\d{1,10}$/)),
  contact: z.string().trim().min(3).max(200),
})

// Failed lookups per visitor: 10 in 10 minutes, then 429. Successful checks don't count, so a
// customer can keep checking their own job.
const failures = new Map<string, { count: number; reset: number }>()
const limit = 10
const window = 10 * 60_000

export default defineEventHandler(async (event) => {
  const { features } = useAppConfig()
  if (!features.trackRepair)
    throw createError({ statusCode: 404, statusMessage: "Not found" })
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? "unknown"
  const now = Date.now()
  if (failures.size > 5000)
    for (const [key, value] of failures)
      if (value.reset <= now) failures.delete(key)
  const seen = failures.get(ip)
  if (seen && seen.reset > now && seen.count >= limit)
    throw createError({ statusCode: 429, statusMessage: "Too many attempts" })

  const { jobNo, contact } = await readValidatedBody(event, body.parse)
  const job = await cachedRepairJob(jobNo, features.repairUpdates)
  const matches =
    job &&
    (contact.includes("@")
      ? job.contact.emails.some(
          (e) => e.toLowerCase() === contact.toLowerCase(),
        )
      : job.contact.phones.some((p) => samePhone(p, contact)))
  if (!job || !matches) {
    if (!seen || seen.reset <= now)
      failures.set(ip, { count: 1, reset: now + window })
    else seen.count++
    throw createError({ statusCode: 404, statusMessage: "No match" })
  }

  return {
    jobNo,
    // Fergus has no API call to start a phase, so a shared update also means work has started.
    stage: repairStage(
      job.status,
      job.phases.map((p) => p.status),
      job.notes.length + job.photos.length > 0,
    ),
    onHold: job.onHold,
    quoteSent: /Sent$/.test(job.status),
    updated: job.updated,
    notes: job.notes.map(({ text, at, by }) => ({ text, at, by })),
    photos: job.photos.map((p) => ({
      url: signedPhotoUrl(p.id),
      at: p.at,
      by: p.by,
    })),
    mechanic: [...job.notes, ...job.photos]
      .filter((x) => x.by)
      .toSorted((x, y) => y.at.localeCompare(x.at))[0]?.by,
  } satisfies RepairStatus
})
