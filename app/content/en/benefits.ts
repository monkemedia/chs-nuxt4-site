import type { Benefit } from "../types"

// "Why choose CHS" points shown on the homepage band and the /why-chs page.
// Specific, checkable claims rather than generic ones. {years} and {hours} come from app.config `offer`.
// Check with the business before launch: only publish what CHS can stand behind.

export const benefits: Benefit[] = [
  {
    icon: "i-lucide-timer",
    title: ["On-site within", "{hours} hours"],
    summary: "We aim to be with you within {hours} hours of your call.",
    detail:
      "A stopped machine costs you money every hour. Across Carmarthenshire and Llanelli our mobile unit aims to be with you within {hours} hours of your call, so you're not waiting days or paying for transport to a workshop.",
  },
  {
    icon: "i-lucide-award",
    title: ["{years} years'", "experience"],
    summary: "Trusted by farmers and plant operators across South Wales.",
    detail:
      "For {years} years we've kept tractors, diggers, dumpers and factory machinery working across South Wales. We've seen most faults before, so we find them quickly and fix them first time.",
  },
  {
    icon: "i-lucide-badge-pound-sterling",
    title: ["Price agreed", "up front"],
    summary: "No hidden costs. No upselling.",
    detail:
      "We tell you what's wrong, what it needs and what it'll cost before we start. You pay for the fix you agreed to, and nothing you didn't ask for.",
  },
  {
    icon: "i-lucide-wrench",
    title: ["Hoses made", "while you wait"],
    summary: "Most standard hoses made up on the spot at Cross Hands.",
    detail:
      "Bring the old hose to our Cross Hands workshop and we'll make up a matching replacement while you wait, for most standard sizes. No waiting days for parts.",
  },
]
