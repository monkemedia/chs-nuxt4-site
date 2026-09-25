import { init, track as plausibleTrack } from "@plausible-analytics/tracker"

// Plausible analytics: cookie-free, so no consent banner is needed.
// Only runs when NUXT_PUBLIC_PLAUSIBLE_DOMAIN is set at build time, so local dev and
// previews don't pollute the stats. Exclude your own visits by running
// `localStorage.plausible_ignore = 'true'` in the browser console on the live site.
//
// Custom events sent (add each as a goal in Plausible to see it on the dashboard):
// - "Phone Call"   click on any tel: link          props: page
// - "Email Click"  click on any mailto: link       props: page
// - "Enquiry Sent" contact form sent successfully  props: service, urgency
export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()
  const domain = runtimeConfig.public.plausibleDomain as string

  function track(event: string, props?: Record<string, string>) {
    if (domain) plausibleTrack(event, { props })
  }

  if (domain) {
    init({ domain, outboundLinks: true })

    document.addEventListener("click", (event) => {
      const link = (event.target as Element | null)?.closest?.(
        'a[href^="tel:"], a[href^="mailto:"]',
      )
      if (!link) return
      const page = window.location.pathname
      track(
        link.getAttribute("href")!.startsWith("tel:")
          ? "Phone Call"
          : "Email Click",
        { page },
      )
    })
  }

  return { provide: { track } }
})
