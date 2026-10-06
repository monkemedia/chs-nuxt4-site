// "Track my repair": turns a Fergus job's status into the plain stages customers see. Shared by
// the API (server/api/repair.post.ts) and the /track page.

export const repairStages = ["booked", "assessing", "working", "done"] as const
export type RepairStage = (typeof repairStages)[number]

export interface RepairStatus {
  jobNo: string
  stage: RepairStage
  // Paused in Fergus: usually waiting for parts or the customer's go-ahead.
  onHold: boolean
  // A quote or estimate has been sent and is waiting for the customer.
  quoteSent: boolean
  updated: string
  // What the workshop has shared (pinned notes, photos named "customer…"), newest first.
  // `by`: the staff member's first name, when Fergus knows it.
  notes: { text: string; at: string; by?: string }[]
  photos: { url: string; at: string; by?: string }[]
  // Whoever shared the latest update: shown as the customer's mechanic.
  mechanic?: string
}

// The least advanced phase decides (a job isn't done until all of it is). Fergus phase
// statuses: To Schedule, To Start, In Progress, Labour Complete, To Be Approved, To Invoice,
// Invoiced.
const phaseStage: Record<string, RepairStage> = {
  "To Schedule": "booked",
  "To Start": "booked",
  "In Progress": "working",
  "Labour Complete": "done",
  "To Be Approved": "done",
  "To Invoice": "done",
  Invoiced: "done",
}

export function repairStage(jobStatus: string, phases: string[]): RepairStage {
  if (jobStatus === "Completed") return "done"
  if (/^(To Price|Quote|Estimate)/.test(jobStatus)) return "assessing"
  const stages = phases.map((p) => phaseStage[p] ?? "booked")
  if (!stages.length) return "booked"
  return repairStages[Math.min(...stages.map((s) => repairStages.indexOf(s)))]!
}

// Compares phone numbers however they're typed: spaces, +44 or 0.
export function samePhone(a: string, b: string) {
  const norm = (n: string) => n.replace(/\D/g, "").replace(/^44/, "0")
  const x = norm(a)
  return x.length >= 6 && x === norm(b)
}
