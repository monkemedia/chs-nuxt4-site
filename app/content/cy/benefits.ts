import type { Benefit } from "../types"

// Welsh "why choose CHS" points. Same icons and order as ../en/benefits.ts.
// Drafted translation: have it checked by a fluent Welsh speaker before launch.

export const benefits: Benefit[] = [
  {
    icon: "i-lucide-timer",
    title: ["Ar y safle o fewn", "{hours} awr"],
    summary: "Rydyn ni'n anelu at fod gyda chi o fewn {hours} awr i'ch galwad.",
    detail:
      "Mae peiriant sydd wedi stopio yn costio arian i chi bob awr. Ledled Sir Gâr a Llanelli, mae ein huned symudol yn anelu at fod gyda chi o fewn {hours} awr i'ch galwad, fel nad ydych chi'n aros am ddyddiau nac yn talu i gludo'r peiriant i weithdy.",
  },
  {
    icon: "i-lucide-award",
    title: ["{years} mlynedd", "o brofiad"],
    summary:
      "Mae ffermwyr a gweithredwyr peiriannau ledled De Cymru yn ymddiried ynom ni.",
    detail:
      "Ers {years} mlynedd, rydyn ni wedi cadw tractorau, peiriannau cloddio, dympwyr a pheiriannau ffatri i weithio ledled De Cymru. Rydyn ni wedi gweld y rhan fwyaf o namau o'r blaen, felly rydyn ni'n dod o hyd iddyn nhw'n gyflym ac yn eu trwsio y tro cyntaf.",
  },
  {
    icon: "i-lucide-badge-pound-sterling",
    title: ["Pris wedi'i gytuno", "ymlaen llaw"],
    summary: "Dim costau cudd. Dim gwerthu diangen.",
    detail:
      "Rydyn ni'n dweud wrthoch chi beth sydd o'i le, beth sydd ei angen a faint fydd y gost cyn i ni ddechrau. Rydych chi'n talu am y gwaith y cytunwyd arno, a dim byd na wnaethoch chi ofyn amdano.",
  },
  {
    icon: "i-lucide-wrench",
    title: ["Pibellau tra", "byddwch yn aros"],
    summary:
      "Y rhan fwyaf o bibellau safonol wedi'u gwneud yn y fan a'r lle yn Cross Hands.",
    detail:
      "Dewch â'r hen bibell i'n gweithdy yn Cross Hands ac fe wnawn ni un newydd i gyd-fynd tra byddwch yn aros, ar gyfer y rhan fwyaf o feintiau safonol. Dim aros dyddiau am rannau.",
  },
]
