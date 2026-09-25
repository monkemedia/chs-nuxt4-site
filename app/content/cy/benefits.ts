import type { Benefit } from "../types"

// Welsh "why choose CHS" points. Same icons and order as ../en/benefits.ts.
// Drafted translation: have it checked by a fluent Welsh speaker before launch.

export const benefits: Benefit[] = [
  {
    icon: "i-lucide-timer",
    title: ["Ymateb", "cyflym"],
    summary: "Yn ôl ar waith yn gyflym.",
    detail:
      "Rydyn ni'n gwybod bod peiriant sydd wedi stopio yn golled ariannol. Mae'r rhan fwyaf o bibellau hydrolig yn cael eu gwneud tra byddwch yn aros yn ein gweithdy yn Cross Hands, a gall ein huned symudol ddod allan pan fydd peiriant wedi torri i lawr fel nad oes rhaid i chi aros am gludiant.",
  },
  {
    icon: "i-lucide-users",
    title: ["Tîm", "profiadol"],
    summary: "Arbenigedd ymarferol ar draws sawl sector.",
    detail:
      "Mae ein tîm yn gweithio ar systemau hydrolig peiriannau adeiladu, fferm, masnachol a diwydiannol bob dydd. Mae'r ehangder hwnnw'n golygu ein bod yn adnabod namau'n gyflym ac yn gwybod beth sydd ei angen ar beiriant i'w gael yn ôl i weithio.",
  },
  {
    icon: "i-lucide-shield-check",
    title: ["Cydrannau", "o ansawdd"],
    summary: "Rydyn ni'n defnyddio rhannau a deunyddiau dibynadwy sy'n para.",
    detail:
      "Mae pibellau, ffitiadau a seliau'n cael eu dewis i gyd-fynd â'r gwaith a'r pwysedd gweithio, nid dim ond yr hyn sydd rataf. Y rhannau cywir y tro cyntaf yn golygu llai o fethiannau dro ar ôl tro.",
  },
  {
    icon: "i-lucide-map-pin",
    title: ["Ar y safle ledled", "De Cymru"],
    summary: "Gwasanaeth symudol i'ch safle, eich gweithdy neu'ch fferm.",
    detail:
      "Mae ein huned wasanaeth symudol, gyda'r holl offer angenrheidiol, yn dod â'r gweithdy atoch chi, boed hynny'n safle adeiladu, chwarel, cae neu'ch iard.",
  },
]
