import type { Content } from "../en"
import { benefits } from "./benefits"
import { sectors } from "./sectors"
import { services } from "./services"

// Welsh copy. Typed as `Content`, so every English string must have a Welsh counterpart.
// Drafted translation: have it checked by a fluent Welsh speaker before launch
// (e.g. the Welsh Government's free Helo Blod service). Trade terms such as "ram" are
// kept where Welsh-speaking customers commonly use the English word.

export const cy: Content = {
  locale: "cy",
  dateLocale: "cy-GB",

  common: {
    skipToContent: "Neidio i'r prif gynnwys",
    primaryNav: "Prif ddewislen",
    mobileNav: "Dewislen symudol",
    callChs: "Ffoniwch CHS Hydraulic Services",
    callNow: "Ffoniwch nawr",
    call: (phone: string) => `Ffoniwch ${phone}`,
    sendEnquiry: "Anfon ymholiad",
    orSendEnquiry: "Neu anfonwch ymholiad",
    ourServices: "Ein gwasanaethau",
    viewAllServices: "Gweld pob gwasanaeth",
    home: "Hafan",
    languageSwitch: "English",
    languageSwitchLabel: "Read this page in English",
  },

  nav: {
    home: "Hafan",
    services: "Gwasanaethau",
    about: "Amdanom ni",
    sectors: "Sectorau",
    whyChs: "Pam CHS",
    contact: "Cysylltu",
  },

  footer: {
    blurb:
      "Atgyweirio hydrolig, cyflenwi pibellau a gwasanaeth ar y safle o Cross Hands, ar draws Llanelli, Sir Gâr a De Cymru.",
    services: "Gwasanaethau",
    explore: "Archwilio",
    allServices: "Pob gwasanaeth",
    aboutUs: "Amdanom ni",
    getInTouch: "Cysylltu â ni",
  },

  business: {
    location: "Cross Hands, Sir Gâr",
    serviceArea: [
      "Sir Gâr",
      "Llanelli",
      "Abertawe",
      "Castell-nedd Port Talbot",
      "Sir Benfro",
      "De Cymru",
    ],
    hours: [
      { days: "Dydd Llun – Dydd Gwener", time: "8yb – 5.30yh" },
      { days: "Dydd Sadwrn", time: "8yb – 12yh" },
      { days: "Galwadau brys", time: "Ffoniwch i holi" },
    ],
  },

  cta: {
    kicker: "Angen cymorth hydrolig?",
    title: "Gadewch i ni gadw'ch\noffer i symud.",
    text: "Ffoniwch CHS i drafod gwaith atgyweirio, gwasanaeth neu ymweliad ar y safle.",
  },

  reviews: {
    kicker: "Beth mae cwsmeriaid yn ei ddweud",
    title: "Busnesau ledled De Cymru yn ymddiried ynom",
    fromGoogleReviews: (count: number) => `o ${count} adolygiad Google`,
    onGoogle: "ar Google",
    reviewCount: (count: number) => `${count} adolygiad`,
    googleReview: "Adolygiad Google",
    customer: "Cwsmer",
    readAll: "Darllen pob adolygiad ar Google",
    leaveReview: "Gadewch adolygiad",
    rated: (rating: number) => `Sgôr ${rating} allan o 5`,
  },

  home: {
    seo: {
      title: "Atgyweirio Hydrolig Llanelli a Sir Gâr | CHS",
      description:
        "Newid pibellau hydrolig, atgyweirio rams, canfod namau a galwadau allan symudol o Cross Hands, ar draws Llanelli, Sir Gâr a De Cymru.",
    },
    heroKicker: "Atgyweirio hydrolig yn Llanelli a Sir Gâr",
    heroTitle: ["Cadw", "diwydiant", "i symud"],
    heroCopy:
      "Arbenigwyr atgyweirio hydrolig, cyflenwi pibellau a gwasanaeth ar y safle i gwsmeriaid peiriannau, amaeth, masnachol a diwydiannol ar draws Llanelli, Sir Gâr a De Cymru.",
    heroImageAlt: "Silindr hydrolig coch gyda ram gloyw a phibellau",
    keyBenefits: "Manteision allweddol",
    trust: [
      ["Gwaith", "cyflym"],
      ["Cymorth", "ar y safle"],
      ["Ansawdd", "dibynadwy"],
    ],
    servicesTitle: "Datrysiadau hydrolig cyflawn",
    servicesIntro:
      "O newid pibell ar frys i atgyweirio system gyfan, rydyn ni'n cadw'ch offer i weithio gyda chyn lleied o amser segur â phosib.",
    whyKicker: "Pam dewis CHS",
    whyTitle: ["Llai o amser segur.", "Mwy o gefnogaeth."],
    whyLink: "Pam dewis CHS",
    onsiteKicker: "Gwasanaeth hydrolig ar y safle",
    onsiteTitle: "Rydyn ni'n dod atoch chi",
    onsiteText:
      "Gall ein huned wasanaeth symudol, sydd â'r holl offer angenrheidiol, wneud gwaith atgyweirio, newid pibellau a chanfod namau ar y safle, gan eich helpu i osgoi amser segur costus.",
    onsiteList: [
      "Galwadau brys",
      "Newid pibellau ar y safle",
      "Canfod namau systemau hydrolig",
      "Peiriannau, amaeth a masnachol",
      "Trefnu hyblyg a dibynadwy",
    ],
    bookService: "Trefnu gwasanaeth",
    vanAlt:
      "Fan wasanaeth symudol CHS Crosshands Hydraulic Services ar y safle",
    sectorsKicker: "Ein sectorau",
    sectorsTitle: ["Yn falch o gefnogi", "ystod eang o ddiwydiannau."],
    viewSectors: "Gweld y sectorau",
  },

  servicesPage: {
    seo: {
      title: "Gwasanaethau Hydrolig Llanelli a Sir Gâr | CHS",
      description:
        "Newid pibellau, atgyweirio rams a silindrau, canfod namau a gwasanaeth symudol o'n gweithdy yn Cross Hands, ar draws Llanelli a Sir Gâr.",
    },
    crumb: "Gwasanaethau",
    title: ["Gwasanaethau", "hydrolig"],
    intro:
      "Newid pibellau, atgyweirio rams, canfod namau a galwadau allan symudol o'n gweithdy yn Cross Hands, yn gwasanaethu Llanelli, Sir Gâr a De Cymru.",
    listLabel: "Ein gwasanaethau",
    cta: {
      kicker: "Ddim yn siŵr beth sydd ei angen?",
      title: "Dywedwch wrthym beth sy'n digwydd.",
      text: "Disgrifiwch y broblem a byddwn yn eich cyfeirio i'r cyfeiriad cywir.",
    },
  },

  servicePage: {
    notFound: "Heb ddod o hyd i'r gwasanaeth",
    whatWeDo: "Beth rydyn ni'n ei wneud",
    howItWorks: "Sut mae'n gweithio",
    commonQuestions: "Cwestiynau cyffredin",
    getHelp: "Cael help",
    needSorted: "Angen ei ddatrys?",
    talkToTeam: "Siaradwch â'n tîm",
    otherServices: "Gwasanaethau eraill",
    areasWeCover: "Ardaloedd rydyn ni'n eu gwasanaethu",
    ctaKicker: "Wedi'n lleoli yn Cross Hands, Sir Gâr",
    ctaText:
      "Yn gwasanaethu Llanelli, Caerfyrddin, Rhydaman, Abertawe a ledled De Cymru.",
  },

  about: {
    seo: {
      title: "Amdanom ni | Peirianwyr Hydrolig Cross Hands, Llanelli | CHS",
      description:
        "Busnes atgyweirio a chyflenwi hydrolig yn Cross Hands, Sir Gâr yw Crosshands Hydraulic Services, gyda gweithdy ac uned symudol yn gwasanaethu Llanelli a De Cymru.",
    },
    crumb: "Amdanom ni",
    title: ["Amdanom", "ni"],
    intro:
      "Busnes atgyweirio a chyflenwi hydrolig yn Cross Hands, Sir Gâr, yn cadw peiriannau adeiladu, fferm a diwydiannol i weithio ledled De Cymru.",
    whoKicker: "Pwy ydyn ni",
    whoTitle: "Arbenigwyr hydrolig, yn agos at adref",
    who: [
      "Mae Crosshands Hydraulic Services yn atgyweirio, yn gwasanaethu ac yn cyflenwi offer hydrolig i gwsmeriaid ar draws Llanelli, Sir Gâr a De Cymru.",
      "O bibell wedi byrstio ar gloddiwr i ram yn gollwng ar lwythwr tractor neu nam ar wasg ddiwydiannol, rydyn ni'n dod o hyd i'r broblem, yn ei thrwsio'n iawn ac yn eich cael yn ôl i weithio.",
      "Mae gennym weithdy yn Cross Hands ac uned wasanaeth symudol gyda'r holl offer angenrheidiol, felly gallwn weithio lle bynnag sydd orau i chi a'ch peiriant.",
    ],
    vanAlt: "Fan wasanaeth symudol CHS Crosshands Hydraulic Services",
    factsLabel: "CHS yn gryno",
    facts: [
      { value: "2004", label: "Sefydlwyd" },
      { value: "Cross Hands", label: "Gweithdy" },
      { value: "Symudol", label: "Uned wasanaeth ar y safle" },
      { value: "De Cymru", label: "Ein hardal" },
    ],
    valuesKicker: "Sut rydyn ni'n gweithio",
    valuesTitle: "Beth allwch chi ei ddisgwyl gennym",
    values: [
      {
        icon: "i-lucide-message-square-text",
        title: "Atebion syml",
        text: "Rydyn ni'n dweud wrthych beth sydd o'i le, beth sydd ei angen a faint fydd y gost cyn dechrau, heb unrhyw syrpreis.",
      },
      {
        icon: "i-lucide-hard-hat",
        title: "Profiad ymarferol",
        text: "Gwaith hydrolig ymarferol bob dydd ar beiriannau adeiladu, fferm, masnachol a diwydiannol.",
      },
      {
        icon: "i-lucide-map-pinned",
        title: "Lleol a hawdd cael gafael arnom",
        text: "Wedi'n lleoli yn Cross Hands, felly rydyn ni'n agos at Lanelli, Caerfyrddin, Rhydaman ac Abertawe pan fyddwch ein hangen.",
      },
    ],
    waysKicker: "Yn y gweithdy neu ar y safle",
    waysTitle: "Dwy ffordd y gallwn helpu",
    ways: [
      {
        icon: "i-lucide-warehouse",
        title: "Yn ein gweithdy",
        text: "Dewch â phibellau, rams a chydrannau i'n gweithdy yn Cross Hands. Mae'r rhan fwyaf o bibellau'n cael eu gwneud tra byddwch yn aros, ac mae rams yn cael eu datgymalu, eu harchwilio a'u hailadeiladu yn y gweithdy.",
        link: {
          label: "Atgyweirio a newid pibellau",
          to: "/services/hydraulic-hoses",
        },
      },
      {
        icon: "i-lucide-truck",
        title: "Ar eich safle",
        text: "Pan na all y peiriant ddod atom ni, mae ein huned symudol yn mynd ato: safleoedd adeiladu, chwareli, ffermydd ac iardiau ledled De Cymru.",
        link: {
          label: "Gwasanaeth symudol ar y safle",
          to: "/services/on-site-hydraulic-service",
        },
      },
    ],
    areasKicker: "Ble rydyn ni'n gweithio",
    areasTitle: "Ardaloedd rydyn ni'n eu gwasanaethu",
    areasText:
      "Wedi'n lleoli yn Cross Hands, rydyn ni mewn lle da i gwsmeriaid ar draws y rhanbarth. Ddim yn siŵr a ydyn ni'n dod i'ch ardal chi? Holwch.",
  },

  sectorsPage: {
    seo: {
      title: "Y Sectorau a Gefnogwn | Atgyweirio Hydrolig De Cymru | CHS",
      description:
        "Atgyweirio hydrolig ar gyfer peiriannau adeiladu, amaeth, diwydiant a gweithgynhyrchu, a cherbydau masnachol ar draws Llanelli, Sir Gâr a De Cymru.",
    },
    crumb: "Sectorau",
    title: ["Y sectorau", "a gefnogwn"],
    intro:
      "O safleoedd adeiladu a ffermydd i ffatrïoedd a fflydoedd, rydyn ni'n cadw peiriannau hydrolig i weithio ar draws Llanelli, Sir Gâr a De Cymru.",
    navLabel: "Sectorau",
    servicesForSector: "Gwasanaethau i'r sector hwn",
    typicalMachines: "Peiriannau nodweddiadol",
    otherWork: "Gwaith arall rydyn ni'n ei wneud",
    cta: {
      kicker: "Ddim yn gweld eich sector chi?",
      title: "Os yw'n rhedeg ar hydrolig, ffoniwch ni.",
      text: "Rydyn ni'n gweithio ar ystod eang o beiriannau. Dywedwch wrthym beth sydd gennych a byddwn yn rhoi gwybod sut gallwn helpu.",
    },
  },

  why: {
    seo: {
      title: "Pam Dewis CHS | Atgyweirio Hydrolig Llanelli a Sir Gâr",
      description:
        "Ymateb cyflym, tîm profiadol, cydrannau o ansawdd ac uned wasanaeth symudol: pam mae busnesau ar draws Llanelli a Sir Gâr yn dewis CHS ar gyfer atgyweirio hydrolig.",
    },
    crumb: "Pam CHS",
    title: ["Llai o amser segur.", "Mwy o gefnogaeth."],
    intro:
      "Pam mae busnesau ar draws Llanelli, Sir Gâr a De Cymru yn ymddiried yn CHS gyda'u systemau hydrolig.",
    reasonsKicker: "Pam dewis CHS",
    reasonsTitle: "Pedwar rheswm mae cwsmeriaid yn dod yn ôl",
    reviewsKicker: "Adolygiadau cwsmeriaid",
    reviewsTitle: "Peidiwch â chymryd ein gair ni yn unig",
    promiseKicker: "Ein haddewid",
    promiseTitle: "Beth gewch chi bob tro",
    promiseText:
      "Waeth pa mor fawr neu fach yw'r gwaith, dyma sut rydyn ni'n gweithio.",
    promises: [
      "Rydyn ni'n esbonio'r nam a'r ateb cyn dechrau unrhyw waith",
      "Amseroedd realistig, ac rydyn ni'n eich diweddaru",
      "Rhannau sy'n addas i'r gwaith a'r pwysedd gweithio",
      "Pibellau wedi'u gwneud tra byddwch yn aros ar gyfer y rhan fwyaf o feintiau safonol",
      "Yn y gweithdy neu ar y safle, pa un bynnag sy'n eich cael yn ôl i weithio gyntaf",
      "Prisiau clir heb unrhyw syrpreis ar yr anfoneb",
    ],
    stepsKicker: "Sut mae'n gweithio",
    stepsTitle: "O dorri i lawr i fod yn ôl yn gweithio",
    steps: [
      {
        icon: "i-lucide-phone-call",
        title: "Ffoniwch neu anfonwch ymholiad",
        text: "Dywedwch wrthym am y peiriant, beth sydd wedi digwydd a ble mae e.",
      },
      {
        icon: "i-lucide-search",
        title: "Rydyn ni'n canfod y broblem",
        text: "Yn y gweithdy neu ar y safle, rydyn ni'n dod o hyd i'r gwir achos, nid y symptom yn unig.",
      },
      {
        icon: "i-lucide-wrench",
        title: "Rydyn ni'n ei drwsio'n iawn",
        text: "Rhannau o ansawdd, wedi'u gosod a'u profi, fel ei fod yn aros wedi'i drwsio.",
      },
      {
        icon: "i-lucide-circle-check-big",
        title: "Yn ôl i weithio",
        text: "Mae'ch peiriant yn rhedeg eto gyda chyn lleied o amser segur â phosib.",
      },
    ],
    ctaKicker: "Yn barod pan fyddwch chi",
  },

  contact: {
    seo: {
      title: "Cysylltu â CHS Hydraulics | Cross Hands, Llanelli",
      description:
        "Cysylltwch â Crosshands Hydraulic Services am newid pibellau, atgyweirio rams, canfod namau a galwadau allan ar y safle ar draws Llanelli a Sir Gâr.",
    },
    kicker: ["Cysylltu", "Dyfynbrisiau", "Galwadau allan"],
    title: ["Cysylltwch", "â ni"],
    intro:
      "Peiriant wedi torri, angen gwneud pibell neu eisiau pris am ailadeiladu ram? Ffoniwch ni, neu anfonwch y manylion isod a byddwn yn cysylltu â chi.",
    sectionLabel: "Ffyrdd o gysylltu",
    formKicker: "Anfon ymholiad",
    formTitle: "Dywedwch wrthym beth sydd ei angen",
    requiredNote: [
      "Mae'r meysydd sydd wedi'u marcio",
      "â seren",
      "yn orfodol.",
    ],
    honeypot: "Gadewch y maes hwn yn wag",
    optional: "Dewisol",
    fields: {
      name: "Enw",
      company: "Cwmni",
      phone: "Ffôn",
      email: "E-bost",
      service: "Gwasanaeth",
      servicePlaceholder: "Dewiswch wasanaeth",
      somethingElse: "Rhywbeth arall",
      location: "Lleoliad neu god post",
      locationPlaceholder: "e.e. SA14",
      urgency: "Pa mor frys yw e?",
      details: "Manylion",
      detailsPlaceholder:
        "Gwneuthuriad/model y peiriant, beth sydd wedi mynd o'i le, rhifau rhannau os oes gennych nhw…",
    },
    urgencies: {
      emergency: "Argyfwng – mae'r peiriant wedi stopio",
      soon: "O fewn y dyddiau nesaf",
      quote: "Dim ond eisiau pris",
    },
    errors: {
      name: "Rhowch eich enw",
      phone: "Rhowch rif ffôn y gallwn eich cyrraedd arno",
      email: "Rhowch gyfeiriad e-bost dilys",
      service: "Dewiswch wasanaeth",
      urgency: "Dywedwch wrthym pa mor frys yw e",
      message: "Rhowch ychydig mwy o fanylion",
    },
    send: "Anfon ymholiad",
    sending: "Wrthi'n anfon…",
    privacy:
      "Dim ond i ymateb i'ch ymholiad y byddwn yn defnyddio'ch manylion.",
    sentTitle: "Diolch, mae'ch ymholiad wedi'i anfon",
    sentText:
      "Byddwn yn cysylltu â chi cyn gynted â phosib. Os yw'ch peiriant wedi stopio, ffoniwch ni ar",
    sendAnother: "Anfon ymholiad arall",
    errorTitle: "Mae'n ddrwg gennym, doedd dim modd anfon eich ymholiad",
    errorText: "Rhowch gynnig arall arni, neu ffoniwch ni ar",
    detailsLabel: "Manylion cyswllt",
    emergencyKicker: "Peiriant wedi stopio?",
    emergencyTitle: "Ffoniwch am alwadau brys",
    phone: "Ffôn",
    email: "E-bost",
    basedIn: "Wedi'n lleoli yn",
    openingHours: "Oriau agor",
    areasWeCover: "Ardaloedd rydyn ni'n eu gwasanaethu",
  },

  services,
  sectors,
  benefits,
}
