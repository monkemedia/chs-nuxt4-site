import { usePreferredReducedMotion } from "@vueuse/core"

// Sends a website form (contact, booking) to the form service set in
// NUXT_PUBLIC_CONTACT_FORM_ENDPOINT (Formspree-style: FormData POST, 2xx = success), adds the
// language so the business knows to reply in Welsh, records the Plausible event, then brings
// the thank-you or error message (bind it with ref="result") into view and focuses it.
export function useEnquirySubmit(options: { subject: string; event: string }) {
  const runtimeConfig = useRuntimeConfig()
  const endpoint = runtimeConfig.public.contactFormEndpoint as string
  const { $track } = useNuxtApp()
  const { locale } = useI18n()
  const reducedMotion = usePreferredReducedMotion()

  const status = ref<"idle" | "sending" | "sent" | "error">("idle")
  const result = ref<HTMLElement | null>(null)
  // Honeypot: hidden from people, filled in by spam bots. Bind it to the hidden field.
  const gotcha = ref("")

  // `fields` are sent as they are (empty ones left out); `trackProps` go to Plausible.
  async function send(
    fields: Record<string, string | undefined>,
    trackProps: Record<string, string> = {},
  ) {
    if (status.value === "sending") return false
    if (!endpoint) {
      console.error(
        "Contact form endpoint missing: set NUXT_PUBLIC_CONTACT_FORM_ENDPOINT.",
      )
      status.value = "error"
    } else {
      status.value = "sending"
      const body = new FormData()
      for (const [key, value] of Object.entries(fields))
        if (value) body.append(key, value)
      body.append("language", locale.value === "cy" ? "Welsh" : "English")
      body.append("_subject", options.subject)
      body.append("_gotcha", gotcha.value)
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body,
          headers: { Accept: "application/json" },
        })
        status.value = response.ok ? "sent" : "error"
      } catch {
        status.value = "error"
      }
    }
    if (status.value === "sent")
      $track(options.event, { ...trackProps, language: locale.value })

    await nextTick()
    // The thank-you replaces the form, above where the visitor clicked; the error sits by the
    // button. Scroll below the sticky header, then focus for screen readers.
    result.value?.scrollIntoView({
      behavior: reducedMotion.value === "reduce" ? "auto" : "smooth",
      block: status.value === "sent" ? "start" : "nearest",
    })
    result.value?.focus({ preventScroll: true })
    return status.value === "sent"
  }

  return { status, result, gotcha, send }
}
