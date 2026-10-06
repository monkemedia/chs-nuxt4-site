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

export function repairStage(
  jobStatus: string,
  phases: string[],
  // The workshop has shared an update: work has started even if the phase still says so.
  started = false,
): RepairStage {
  if (jobStatus === "Completed") return "done"
  if (/^(To Price|Quote|Estimate)/.test(jobStatus)) return "assessing"
  const stages = phases.map((p) => phaseStage[p] ?? "booked")
  const stage = stages.length
    ? repairStages[Math.min(...stages.map((s) => repairStages.indexOf(s)))]!
    : "booked"
  return stage === "booked" && started ? "working" : stage
}

// Compares phone numbers however they're typed: spaces, +44 or 0.
export function samePhone(a: string, b: string) {
  const norm = (n: string) => n.replace(/\D/g, "").replace(/^44/, "0")
  const x = norm(a)
  return x.length >= 6 && x === norm(b)
}

// Notes and photos added through the staff app reach Fergus as the API token's user, so they
// carry the mechanic's first name themselves: notes end with "— Rhys", photo files are named
// "customer-rhys-<time>.jpg" (shared) or "photo-rhys-<time>.jpg".
export const signNote = (text: string, by: string) => `${text}\n— ${by}`

export function parseSignedNote(text: string) {
  const match = text.match(/^([\s\S]*?)\n— ([^\n]{1,40})$/)
  return match ? { text: match[1]!.trim(), by: match[2]!.trim() } : { text }
}

const slug = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z]/g, "")
    .slice(0, 20) || "staff"

export const photoFileName = (shared: boolean, by: string) =>
  `${shared ? "customer" : "photo"}-${slug(by)}-${Date.now()}.jpg`

export function photoAuthor(fileName: string) {
  const match = fileName.match(/^(?:customer|photo)-([a-z]{1,20})-\d+\./i)
  const name = match?.[1]
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : undefined
}
