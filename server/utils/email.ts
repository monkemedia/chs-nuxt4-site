// Transactional email through Resend (https://resend.com): booking confirmations to customers
// and the summary to the business. NUXT_RESEND_API_KEY is a secret (server only). The "from"
// address must be on a domain verified in Resend (NUXT_EMAIL_FROM). Without a key, nothing is
// sent: the caller falls back (the business summary goes through the form service instead).

export interface Email {
  to: string
  subject: string
  text: string
  html: string
  replyTo?: string
  attachments?: { filename: string; content: string; contentType: string }[]
}

export const emailConfigured = () => {
  const runtimeConfig = useRuntimeConfig()
  return !!runtimeConfig.resendApiKey
}

export async function sendEmail(email: Email) {
  const runtimeConfig = useRuntimeConfig()
  if (!runtimeConfig.resendApiKey) {
    console.info(
      `[email] Not sent (no NUXT_RESEND_API_KEY): "${email.subject}" to ${email.to}`,
    )
    return false
  }
  try {
    await $fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${runtimeConfig.resendApiKey}` },
      body: {
        from: runtimeConfig.emailFrom,
        to: [email.to],
        subject: email.subject,
        text: email.text,
        html: email.html,
        ...(email.replyTo ? { reply_to: email.replyTo } : {}),
        ...(email.attachments
          ? {
              attachments: email.attachments.map((a) => ({
                filename: a.filename,
                content: Buffer.from(a.content).toString("base64"),
                content_type: a.contentType,
              })),
            }
          : {}),
      },
    })
    return true
  } catch (error) {
    console.error(`[email] Sending "${email.subject}" failed:`, error)
    return false
  }
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

// A plain, readable HTML email: a heading, paragraphs and a details table. No images or
// tracking, so it shows the same everywhere.
export function simpleHtml(parts: {
  heading: string
  paragraphs: string[]
  details: [string, string][]
  after: string[]
}) {
  const p = (t: string) =>
    `<p style="margin:0 0 14px;font-size:15px;line-height:1.5;color:#0d1012">${escapeHtml(t)}</p>`
  const rows = parts.details
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#52525b;font-size:14px;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 0;font-size:14px;font-weight:600;color:#0d1012">${escapeHtml(v)}</td></tr>`,
    )
    .join("")
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f4f4f5;font-family:Helvetica,Arial,sans-serif"><div style="max-width:560px;margin:0 auto;background:#ffffff;border-top:4px solid #e5101f;border-radius:6px;padding:28px">
<h1 style="margin:0 0 18px;font-size:22px;color:#0d1012">${escapeHtml(parts.heading)}</h1>
${parts.paragraphs.map(p).join("")}
<table style="border-collapse:collapse;margin:6px 0 18px">${rows}</table>
${parts.after.map(p).join("")}
</div></body></html>`
}
