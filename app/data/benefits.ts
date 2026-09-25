// "Why choose CHS" points shown on the homepage band and the /why-chs page.
// Check with the business before launch: only publish what CHS can stand behind.

export interface Benefit {
  icon: string
  // Two-line title for the homepage band.
  title: [string, string]
  summary: string
  detail: string
}

export const benefits: Benefit[] = [
  {
    icon: "i-lucide-timer",
    title: ["Fast", "response"],
    summary: "Get back up and running quickly.",
    detail:
      "We know a stopped machine is lost money. Most hydraulic hoses are made up while you wait at our Cross Hands workshop, and our mobile unit can come out to breakdowns so you're not waiting on transport.",
  },
  {
    icon: "i-lucide-users",
    title: ["Experienced", "team"],
    summary: "Real-world expertise across multiple sectors.",
    detail:
      "Our team works on plant, farm, commercial and industrial hydraulics every day. That breadth means we recognise faults quickly and know what a machine needs to get back to work.",
  },
  {
    icon: "i-lucide-shield-check",
    title: ["Quality", "components"],
    summary: "We use trusted, durable parts and materials.",
    detail:
      "Hoses, fittings and seals are matched to the job and the working pressure, not just what's cheapest. The right parts first time means fewer repeat failures.",
  },
  {
    icon: "i-lucide-map-pin",
    title: ["On-site across", "South Wales"],
    summary: "Mobile service to your site, workshop or farm.",
    detail:
      "Our fully equipped mobile service unit brings the workshop to you, whether that's a building site, a quarry, a field or your yard.",
  },
]
