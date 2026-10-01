import type { Area } from "../types"

// Welsh town pages. Same slugs and order as ../en/areas.ts.
// Drafted translation: have it checked by a fluent Welsh speaker before launch.

export const areas: Area[] = [
  {
    slug: "swansea",
    town: "Abertawe",
    metaTitle: "Atgyweirio Hydrolig Abertawe | Pibellau a Rams | CHS",
    metaDescription:
      "Atgyweirio pibellau, rams a systemau hydrolig ar gyfer Abertawe, tua 25 munud ar hyd yr M4 yn ein gweithdy yn Cross Hands. Y rhan fwyaf o bibellau tra byddwch yn aros.",
    h1: "Atgyweirio hydrolig ar gyfer Abertawe",
    lead: "Pibell wedi byrstio, ram yn gollwng neu nam na allwch ddod o hyd iddo? Mae ein gweithdy yn Cross Hands tua 25 munud o Abertawe, ychydig oddi ar yr M4.",
    intro: [
      "O'r dociau a Pharc Menter Abertawe i iardiau peiriannau Llansamlet a'r ffermydd tuag at Benrhyn Gŵyr, hydroleg sy'n cadw peiriannau Abertawe i weithio. Pan fydd rhywbeth yn methu, rydych chi eisiau iddo gael ei drwsio'n iawn ac yn gyflym, gan bobl a fydd yn dweud yn blaen beth sydd ei angen.",
      "Mae CHS Hydraulics wedi bod yn atgyweirio pibellau, rams a systemau hydrolig ers {years} mlynedd. Dewch â'r bibell, y ram neu'r gydran i'n gweithdy yn Cross Hands: mae'r rhan fwyaf o bibellau'n cael eu gwneud tra byddwch yn aros, ac mae rams yn cael eu datgymalu, eu harchwilio a'u hailadeiladu yn y gweithdy.",
      "Ddim yn siŵr a yw'n werth y daith? Ffoniwch {phone} neu e-bostiwch lun o'r rhan atom, a byddwn yn dweud beth rydyn ni'n ei feddwl cyn i chi gychwyn.",
    ],
    travel: {
      distance: "Tua 16 milltir",
      time: "Tua 25 munud",
      route: "Yr M4 tua'r gorllewin i gyffordd 49, yna'r A48",
    },
    nearby: [
      "Gorseinon",
      "Tre-gŵyr",
      "Pontarddulais",
      "Penlle'r-gaer",
      "Llangyfelach",
      "Treforys",
      "Fforest-fach",
      "Llansamlet",
      "Parc Menter Abertawe",
    ],
    faqs: [
      {
        q: "Pa mor bell yw eich gweithdy o Abertawe?",
        a: "Tua 16 milltir, neu tua 25 munud yn y car. Ewch ar yr M4 tua'r gorllewin i gyffordd 49 (Pont Abraham), yna'r A48 i Cross Hands. Rydyn ni yn {address}.",
      },
      {
        q: "Alla i aros tra bod fy mhibell yn cael ei gwneud?",
        a: "Ar gyfer y rhan fwyaf o bibellau, gallwch. Dewch â'r hen bibell er mwyn i ni gyfateb yr hyd, y sgôr pwysedd a'r ffitiadau. Ar gyfer unrhyw beth anarferol neu fawr iawn, ffoniwch {phone} yn gyntaf er mwyn i ni gael y rhannau'n barod.",
      },
      {
        q: "Ar ba beiriannau rydych chi'n gweithio?",
        a: "Cloddwyr, llwythwyr, telehandlers, tractorau, tipwyr, wagenni fforch godi ac offer diwydiannol. Os yw'n rhedeg ar hydroleg, gallwn ni helpu fel arfer.",
      },
      {
        q: "Allwch chi roi pris cyn i mi ddod â'r rhan i mewn?",
        a: "Yn aml, gallwn. E-bostiwch lun o'r bibell, y ram neu'r ffitiad gydag unrhyw farciau y gallwch eu gweld, neu ffoniwch {phone}, a byddwn yn rhoi syniad i chi o'r hyn sydd ei angen.",
      },
    ],
  },
]
