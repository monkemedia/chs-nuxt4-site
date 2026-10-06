import * as z from "zod"

// The signed-in mechanic's diary for a day: GET /api/staff/diary?day=YYYY-MM-DD
const query = z.object({ day: z.iso.date() })

export default defineEventHandler(async (event) => {
  const user = await requireStaff(event)
  const { day } = await getValidatedQuery(event, query.parse)
  return await fergusDiary(user.fergusUserId, day)
})
