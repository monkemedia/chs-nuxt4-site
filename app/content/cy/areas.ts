import type { Area } from "../types"

// Welsh town pages. Same slugs and order as ../en/areas.ts.
// Drafted translation: have it checked by a fluent Welsh speaker before launch.

export const areas: Area[] = [
  {
    slug: "ammanford",
    town: "Rhydaman",
    fromTown: "o Rydaman",
    inTown: "yn Rhydaman",
    metaTitle: "Atgyweirio Hydrolig Rhydaman | Pibellau a Rams | CHS",
    metaDescription:
      "Atgyweirio pibellau, rams a systemau hydrolig ar gyfer Rhydaman a Dyffryn Aman, tua 15 munud i ffwrdd yn ein gweithdy yn Cross Hands.",
    h1: "Atgyweirio hydrolig ar gyfer Rhydaman",
    lead: "Pibell wedi byrstio, ram yn gollwng neu nam na allwch ddod o hyd iddo? Dim ond tua 15 munud o Rydaman yw ein gweithdy yn Cross Hands.",
    intro: [
      "O ffermydd o gwmpas Llandybïe ac i fyny Dyffryn Aman i'r peiriannau a'r lorïau tipio sy'n gweithio o Rydaman, hydroleg sy'n gwneud y gwaith codi trwm. Pan fydd rhywbeth yn methu, rydych chi eisiau iddo gael ei drwsio'n iawn ac yn gyflym, yn agos at adref, gan bobl a fydd yn dweud yn blaen beth sydd ei angen.",
      "Mae CHS Hydraulics wedi bod yn atgyweirio pibellau, rams a systemau hydrolig ers {years} mlynedd, i lawr yr heol yn Cross Hands. Dewch â'r bibell, y ram neu'r gydran i mewn: mae'r rhan fwyaf o bibellau'n cael eu gwneud tra byddwch yn aros, ac mae rams yn cael eu datgymalu, eu harchwilio a'u hailadeiladu yn y gweithdy.",
      "Ddim yn siŵr beth sydd ei angen? Ffoniwch {phone} neu e-bostiwch lun o'r rhan atom, a byddwn yn dweud beth rydyn ni'n ei feddwl cyn i chi gychwyn.",
    ],
    travel: {
      distance: "Tua 6 milltir",
      time: "Tua 15 munud",
      route: "Trwy Saron a Phen-y-groes",
    },
    nearby: [
      "Tycroes",
      "Saron",
      "Capel Hendre",
      "Pen-y-groes",
      "Llandybïe",
      "Betws",
      "Glanaman",
      "Garnant",
      "Brynaman",
    ],
    faqs: [
      {
        q: "Pa mor bell yw eich gweithdy o Rydaman?",
        a: "Tua 6 milltir, neu tua 15 munud yn y car trwy Saron a Phen-y-groes. Rydyn ni yn {address}.",
      },
      {
        q: "Alla i aros tra bod fy mhibell yn cael ei gwneud?",
        a: "Ar gyfer y rhan fwyaf o bibellau, gallwch. Dewch â'r hen bibell er mwyn i ni gyfateb yr hyd, y sgôr pwysedd a'r ffitiadau. Ar gyfer unrhyw beth anarferol neu fawr iawn, ffoniwch {phone} yn gyntaf er mwyn i ni gael y rhannau'n barod.",
      },
      {
        q: "Ar ba beiriannau rydych chi'n gweithio?",
        a: "Tractorau, llwythwyr, cloddwyr, telehandlers, tipwyr, wagenni fforch godi ac offer diwydiannol. Os yw'n rhedeg ar hydroleg, gallwn ni helpu fel arfer.",
      },
      {
        q: "Allwch chi roi pris cyn i mi ddod â'r rhan i mewn?",
        a: "Yn aml, gallwn. E-bostiwch lun o'r bibell, y ram neu'r ffitiad gydag unrhyw farciau y gallwch eu gweld, neu ffoniwch {phone}, a byddwn yn rhoi syniad i chi o'r hyn sydd ei angen.",
      },
    ],
  },
  {
    slug: "carmarthen",
    town: "Caerfyrddin",
    fromTown: "o Gaerfyrddin",
    inTown: "yng Nghaerfyrddin",
    metaTitle: "Atgyweirio Hydrolig Caerfyrddin | Pibellau a Rams | CHS",
    metaDescription:
      "Atgyweirio pibellau, rams a systemau hydrolig ar gyfer Caerfyrddin, tua 20 munud ar hyd yr A48 yn ein gweithdy yn Cross Hands.",
    h1: "Atgyweirio hydrolig ar gyfer Caerfyrddin",
    lead: "Pibell wedi byrstio, ram yn gollwng neu nam na allwch ddod o hyd iddo? Mae ein gweithdy yn Cross Hands tua 20 munud o Gaerfyrddin, yn syth ar hyd yr A48.",
    intro: [
      "O ffermydd Dyffryn Tywi i'r contractwyr a'r iardiau llogi peiriannau o gwmpas Caerfyrddin, hydroleg sy'n cadw peiriannau'r sir i weithio. Pan fydd rhywbeth yn methu, rydych chi eisiau iddo gael ei drwsio'n iawn ac yn gyflym, gan bobl a fydd yn dweud yn blaen beth sydd ei angen.",
      "Mae CHS Hydraulics wedi bod yn atgyweirio pibellau, rams a systemau hydrolig ers {years} mlynedd. Dewch â'r bibell, y ram neu'r gydran i'n gweithdy yn Cross Hands: mae'r rhan fwyaf o bibellau'n cael eu gwneud tra byddwch yn aros, ac mae rams yn cael eu datgymalu, eu harchwilio a'u hailadeiladu yn y gweithdy.",
      "Ddim yn siŵr a yw'n werth y daith? Ffoniwch {phone} neu e-bostiwch lun o'r rhan atom, a byddwn yn dweud beth rydyn ni'n ei feddwl cyn i chi gychwyn.",
    ],
    travel: {
      distance: "Tua 13 milltir",
      time: "Tua 20 munud",
      route: "Yr A48 tua'r dwyrain i Cross Hands",
    },
    nearby: [
      "Tre Ioan",
      "Llangynnwr",
      "Abergwili",
      "Bronwydd",
      "Nantgaredig",
      "Cwmffrwd",
      "Llanddarog",
      "Porth-y-rhyd",
    ],
    faqs: [
      {
        q: "Pa mor bell yw eich gweithdy o Gaerfyrddin?",
        a: "Tua 13 milltir, neu tua 20 munud yn y car: ewch tua'r dwyrain ar yr A48 i Cross Hands. Rydyn ni yn {address}.",
      },
      {
        q: "Alla i aros tra bod fy mhibell yn cael ei gwneud?",
        a: "Ar gyfer y rhan fwyaf o bibellau, gallwch. Dewch â'r hen bibell er mwyn i ni gyfateb yr hyd, y sgôr pwysedd a'r ffitiadau. Ar gyfer unrhyw beth anarferol neu fawr iawn, ffoniwch {phone} yn gyntaf er mwyn i ni gael y rhannau'n barod.",
      },
      {
        q: "Ydych chi'n atgyweirio rams tractorau a llwythwyr?",
        a: "Ydyn. Mae rams llwythwyr tractor, tipio ac offer yn cael eu datgymalu, eu harchwilio, eu hailselio a'u hailadeiladu yn ein gweithdy, ac yna'n cael prawf pwysedd cyn mynd yn ôl.",
      },
      {
        q: "Allwch chi roi pris cyn i mi ddod â'r rhan i mewn?",
        a: "Yn aml, gallwn. E-bostiwch lun o'r bibell, y ram neu'r ffitiad gydag unrhyw farciau y gallwch eu gweld, neu ffoniwch {phone}, a byddwn yn rhoi syniad i chi o'r hyn sydd ei angen.",
      },
    ],
  },
  {
    slug: "swansea",
    town: "Abertawe",
    fromTown: "o Abertawe",
    inTown: "yn Abertawe",
    metaTitle: "Atgyweirio Hydrolig Abertawe | Pibellau a Rams | CHS",
    metaDescription:
      "Atgyweirio pibellau, rams a systemau hydrolig ar gyfer Abertawe, tua 25 munud ar hyd yr M4 yn ein gweithdy yn Cross Hands.",
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
