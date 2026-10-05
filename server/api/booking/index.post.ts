import dayjs from "dayjs/esm"
import cy from "dayjs/esm/locale/cy"
import enGb from "dayjs/esm/locale/en-gb"
import * as z from "zod"
import { contentByLocale } from "../../../app/content"

dayjs.locale(cy, undefined, true)
dayjs.locale(enGb, undefined, true)

// Makes a booking: POST /api/booking. Re-checks the slot against a fresh Fergus calendar, then
// creates (or finds) the customer, a draft job and the calendar event in Fergus, and emails the
// business a summary through the form service (as the contact form does).
const body = z.object({
  service: z.enum(bookingServices),
  start: z.iso.datetime({ offset: true }),
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().max(120).optional(),
  phone: z.string().trim().min(6).max(40),
  email: z.email().max(200),
  machine: z.string().trim().max(200).optional(),
  // Where the machine is (on-site visits only).
  location: z.string().trim().max(300).optional(),
  message: z.string().trim().max(2000).optional(),
  language: z.enum(["en", "cy"]).default("en"),
  // Honeypot: filled in only by spam bots.
  _gotcha: z.string().optional(),
})

const labels = {
  hose: "Hose made up",
  check: "Pre-season hydraulic check",
  dropoff: "Ram or component drop-off",
  onsite: "On-site visit",
}

export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, body.parse)
  refuseUnavailable(data.service)
  if (data.service === "onsite" && !data.location)
    throw createError({ statusCode: 400, statusMessage: "Location needed" })
  // Pretend it worked, so bots learn nothing.
  if (data._gotcha) return { ok: true }

  const now = dayjs().tz("Europe/London")
  const events = await fergusBusyEvents(now.format("YYYY-MM-DD"))
  const slot = computeSlots(data.service, events, bookingHours(), now)
    .flatMap((day) => day.slots)
    .find((s) => dayjs(s.start).isSame(dayjs(data.start)))
  if (!slot)
    throw createError({
      statusCode: 409,
      statusMessage: "That time has just been taken",
    })

  const when = dayjs(slot.start).tz("Europe/London")
  const whenText =
    data.service === "dropoff"
      ? `${when.format("dddd D MMMM YYYY")}, drop off ${when.format("HH:mm")}–${dayjs(slot.end).tz("Europe/London").format("HH:mm")}`
      : `${when.format("dddd D MMMM YYYY, HH:mm")}`
  const description = [
    `${labels[data.service]}: ${whenText}`,
    `Name: ${data.name}${data.company ? ` (${data.company})` : ""}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    data.machine && `Machine: ${data.machine}`,
    data.location && `Location: ${data.location}`,
    data.message && `Notes: ${data.message}`,
    `Reply in: ${data.language === "cy" ? "Welsh" : "English"}`,
    "Booked on the website.",
  ]
    .filter(Boolean)
    .join("\n")

  const result = await fergusCreateBooking({
    service: data.service,
    start: slot.start,
    end: slot.end,
    title: webBookingTitle(data.service, data.company || data.name),
    name: data.name,
    company: data.company,
    phone: data.phone,
    email: data.email,
    description,
    location: data.service === "onsite" ? data.location : undefined,
  })
  // Fresh slots for everyone else straight away: every service, since they share the bays.
  // (Per server instance; other instances catch up within the minute, and booking re-checks.)
  await Promise.all(
    bookingServices.map((service) =>
      useStorage()
        .removeItem(slotsCacheKey(service))
        .catch(() => {}),
    ),
  )

  const { business } = useAppConfig()
  const address = addressLines(business.address).join(", ")
  const where = data.service === "onsite" ? data.location! : address
  const subjectWhen = `${when.format("ddd D MMM, HH:mm")}`

  // Confirmation to the customer, in their language, with the calendar invite attached.
  const locale = contentByLocale[data.language]
  const text = locale.bookPage
  const customerWhen = dayjs(slot.start)
    .tz("Europe/London")
    .locale(locale.dateLocale)
  const customerWhenText =
    data.service === "dropoff"
      ? text.live.dropoffWindow(
          customerWhen.format("HH:mm"),
          dayjs(slot.end).tz("Europe/London").format("HH:mm"),
        )
      : `${customerWhen.format("HH:mm")} – ${dayjs(slot.end).tz("Europe/London").format("HH:mm")}`
  const customerDate = `${customerWhen.format("dddd D MMMM YYYY")}, ${customerWhenText}`
  const serviceName = text.live.services[data.service].title
  const ics = buildIcs({
    uid: `${slot.start}-${data.service}-${data.email}@chshydraulics.co.uk`,
    title: text.live.calendarTitle(serviceName),
    start: slot.start,
    end: slot.end,
    location: where,
    description: text.live.calendarDescription(business.phoneDisplay),
  })
  const mail = text.email
  const details: [string, string][] = [
    [mail.service, serviceName],
    [mail.when, customerDate],
    [mail.where, where],
  ]
  const after = [
    `${mail.bringTitle}: ${mail.bring[data.service]}`,
    `${mail.change} ${business.phoneDisplay} ${mail.orReply}`,
    mail.calendarNote,
    `${mail.signoff} ${mail.team}`,
  ]
  const emailed = await sendEmail({
    to: data.email,
    replyTo: business.email,
    subject: mail.subject(serviceName, customerDate),
    text: [
      mail.greeting(data.name),
      "",
      mail.intro,
      ...details.map(([k, v]) => `${k}: ${v}`),
      "",
      ...after,
    ].join("\n"),
    html: simpleHtml({
      heading: mail.subject(serviceName, customerDate),
      paragraphs: [mail.greeting(data.name), mail.intro],
      details,
      after,
    }),
    attachments: [
      { filename: "booking.ics", content: ics, contentType: "text/calendar" },
    ],
  })

  // The business summary: by email when Resend is set up, else through the form service.
  const subject = `New online booking – ${labels[data.service]}, ${subjectWhen}${result.jobNo ? ` (Fergus job ${result.jobNo})` : ""}`
  const sentToBusiness =
    emailConfigured() &&
    (await sendEmail({
      to: business.email,
      replyTo: data.email,
      subject,
      text: description,
      html: simpleHtml({
        heading: subject,
        paragraphs: description.split("\n"),
        details: [],
        after: [],
      }),
    }))
  const runtimeConfig = useRuntimeConfig()
  const endpoint = runtimeConfig.public.contactFormEndpoint as string
  if (!sentToBusiness && endpoint) {
    const form = new FormData()
    form.append("enquiry", "Online booking")
    form.append("booking", description)
    form.append("email", data.email)
    form.append("_subject", subject)
    await $fetch(endpoint, {
      method: "POST",
      body: form,
      headers: { Accept: "application/json" },
    }).catch((error) =>
      console.error("[booking] Booked, but the business email failed:", error),
    )
  }

  return {
    ok: true,
    start: slot.start,
    end: slot.end,
    emailed,
    mock: result.mock,
  }
})
