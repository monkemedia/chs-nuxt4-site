import type { Content } from "../en"
import { areas } from "./areas"
import { benefits } from "./benefits"
import { sectors } from "./sectors"
import { services } from "./services"

// Welsh copy. Typed as `Content`, so every English string must have a Welsh counterpart.
// Drafted translation: have it checked by a fluent Welsh speaker before launch
// (e.g. the Welsh Government's free Helo Blod service). Trade terms such as "ram" are
// kept where Welsh-speaking customers commonly use the English word.

export const cy: Content = {
  locale: "cy",
  dateLocale: "cy",

  common: {
    skipToContent: "Neidio i'r prif gynnwys",
    primaryNav: "Prif ddewislen",
    mobileNav: "Dewislen symudol",
    callChs: "Ffoniwch CHS Hydraulics",
    callNow: "Ffoniwch nawr",
    call: (phone: string) => `Ffoniwch ${phone}`,
    sendEnquiry: "Anfon ymholiad",
    bookOnline: "Archebu ar-lein",
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
    jobs: "Gwaith diweddar",
    careers: "Gyrfaoedd",
    hiring: "Recriwtio",
  },

  footer: {
    blurb:
      "Atgyweirio hydrolig, cyflenwi pibellau a gwasanaeth ar y safle o Cross Hands, ar draws Llanelli, Sir Gâr a De Cymru.",
    services: "Gwasanaethau",
    explore: "Archwilio",
    allServices: "Pob gwasanaeth",
    aboutUs: "Amdanom ni",
    getInTouch: "Cysylltu â ni",
    privacy: "Hysbysiad preifatrwydd",
    areas: "Ardaloedd",
    accounts: "Cyfrifon masnach",
    login: "Mewngofnodi cwsmeriaid",
    company:
      "Mae CHS Hydraulics yn enw masnachu i {legalName}, cwmni wedi'i gofrestru yng Nghymru a Lloegr, rhif cwmni {companyNumber}. Swyddfa gofrestredig: {registeredOffice}.",
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
    am: "yb",
    pm: "yh",
    hoursDraftNote: "heb ei gyhoeddi eto",
    closedDates: (dates: string) => `Ar gau ${dates}`,
    closedDay: "Ar gau",
    hoursNotes: [{ days: "Galwadau brys", time: "Ffoniwch i holi" }],
  },

  cta: {
    kicker: "Angen cymorth hydrolig?",
    title: "Gadewch i ni gadw'ch\noffer i symud.",
    text: "Mae pob awr y mae peiriant yn segur yn costio arian i chi. Ffoniwch nawr ac fe ddywedwn ni wrthoch chi'n syth pryd gallwn ni fod gyda chi.",
  },

  certification: {
    certified: (standard: string) => `Ardystiedig ${standard}`,
    by: (body: string, accreditation: string) =>
      `Wedi'i ardystio gan ${body}, corff ardystio sydd wedi'i achredu gan ${accreditation}`,
    number: (number: string) => `Rhif tystysgrif ${number}`,
    markAlt: (standard: string, body: string, accreditation: string) =>
      `Ardystiedig ${standard} gan ${body}, achrededig ${accreditation}`,
  },

  openStatus: {
    open: "Ar agor nawr: ffoniwch i siarad â'n tîm",
    closed: (opens: string) =>
      `Ar gau nawr, yn agor ${opens}. Peiriant wedi torri? Ffoniwch beth bynnag.`,
    today: (time: string) => `heddiw am ${time}`,
    tomorrow: (time: string) => `yfory am ${time}`,
    // dayjs gives "Dydd Llun"; lower-case "dydd" mid-sentence.
    on: (day: string, time: string) =>
      `${day.charAt(0).toLowerCase()}${day.slice(1)} am ${time}`,
    closedFor: (reason: string, opens: string) =>
      `Ar gau: ${reason}. Yn agor ${opens}. Peiriant wedi torri? Ffoniwch beth bynnag.`,
    closureNotice: (dates: string, reason: string) =>
      `Ar gau ${dates}: ${reason}.`,
    closesSoon: (time: string) =>
      `Yn cau cyn bo hir: yn cau am ${time}. Ffoniwch nawr`,
  },

  uptimePromise: {
    kicker: "Yr Addewid Amser Gweithio",
    title: "Ar y safle o fewn {hours} awr, neu mae'r alwad allan am ddim.",
    text: "Os nad ydyn ni gyda chi o fewn {hours} awr i'ch galwad, fyddwch chi ddim yn talu'r tâl galw allan. Mor syml â hynny.",
    terms:
      "Yn berthnasol i alwadau allan pan fydd peiriant wedi torri yn ein hardal graidd (Sir Gâr a Llanelli) yn ystod oriau agor. Mae'r amser yn dechrau pan fyddwn ni'n cadarnhau eich galwad allan.",
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
    heroCopy:
      "Arbenigwyr atgyweirio hydrolig, cyflenwi pibellau a gwasanaeth ar y safle i gwsmeriaid peiriannau, amaeth, masnachol a diwydiannol ar draws Llanelli, Sir Gâr a De Cymru.",
    heroImageAlt: "Silindr hydrolig coch gyda ram gloyw a phibellau",
    keyBenefits: "Manteision allweddol",
    trust: [
      ["{years} mlynedd", "o brofiad"],
      ["Ar y safle o fewn", "{hours} awr"],
      ["Pris wedi'i gytuno", "ymlaen llaw"],
    ],
    servicesTitle: "Datrysiadau hydrolig cyflawn",
    servicesIntro:
      "O newid pibell ar frys i atgyweirio system gyfan, rydyn ni'n cadw'ch offer i weithio gyda chyn lleied o amser segur â phosib.",
    whyKicker: "Pam dewis CHS",
    whyTitle: [
      "{years} mlynedd o ymddiriedaeth.",
      "Trwsio cyflym. Prisiau gonest.",
    ],
    whyText:
      "Mae ffermwyr a gweithredwyr peiriannau ledled De Cymru wedi ymddiried ynom ers {years} mlynedd. Dim costau cudd, dim gwerthu diangen: dim ond gwaith cyflym a gonest.",
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
    vanAlt: "Fan wasanaeth symudol CHS Hydraulics ar y safle",
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

  errorPage: {
    notFound: {
      kicker: "Gwall 404",
      title: ["Dim", "pwysau."] as [string, string],
      text: "Mae'r dudalen hon wedi gollwng. Efallai ei bod wedi symud, neu nad oedd hi erioed yn bodoli. Gadewch i ni fynd â chi'n ôl i rywle sy'n gweithio.",
    },
    server: {
      kicker: "Aeth rhywbeth o'i le",
      title: ["Sêl wedi", "chwythu."] as [string, string],
      text: "Methodd rhywbeth ar ein hochr ni. Rhowch gynnig arall arni mewn munud, neu ffoniwch ni a byddwn ni'n helpu ar unwaith.",
    },
    home: "Yn ôl i'r hafan",
    tryThese: "Rhowch gynnig ar un o'r rhain",
    gaugeUnit: "bar",
    gaugeLabel: (code: number) =>
      `Medrydd pwysau yn darllen sero, yn dangos gwall ${code}`,
  },

  recentJobs: {
    kicker: "Gwaith diweddar",
    title: "Gwaith rydyn ni wedi'i wneud yn ddiweddar",
    moreKicker: "Rhagor o waith diweddar",
    moreTitle: "Gwaith arall rydyn ni wedi'i wneud",
    serviceKicker: "Gwaith diweddar",
    serviceTitle: "Swyddi tebyg",
    viewAll: "Gweld pob swydd",
    listLabel: "Gwaith diweddar",
  },

  jobsPage: {
    seo: {
      title: "Atgyweiriadau Hydrolig Diweddar Llanelli a Sir Gâr | CHS",
      description:
        "Swyddi atgyweirio hydrolig go iawn o'n gweithdy yn Cross Hands: y peiriant, y nam a sut y gwnaethon ni ei drwsio, i gwsmeriaid ar draws Llanelli a Sir Gâr.",
    },
    crumb: "Gwaith diweddar",
    title: ["Gwaith", "diweddar"] as [string, string],
    intro:
      "Gwaith go iawn o'n gweithdy yn Cross Hands: y peiriant, beth aeth o'i le a sut y cawson ni ef yn ôl i weithio.",
    cta: {
      kicker: "Oes gennych chi swydd i ni?",
      title: "Dywedwch wrthon ni beth sy'n digwydd.",
      text: "Disgrifiwch y broblem a byddwn ni'n dweud sut gallwn ni helpu.",
    },
  },

  jobPage: {
    notFound: "Heb ddod o hyd i'r swydd",
    details: "Manylion y swydd",
    machine: "Peiriant",
    location: "Lleoliad",
    completed: "Cwblhawyd",
    service: "Gwasanaeth",
    problem: "Y broblem",
    whatWeDid: "Beth wnaethon ni",
    result: "Y canlyniad",
    similarProblem: "Problem debyg?",
    draft: "Drafft",
    draftNote:
      "Ddim yn fyw eto: pwyswch Publish yn yr ardal weinyddu pan fydd yn barod.",
    englishOnly: "Dim ond yn Saesneg mae hwn ar gael",
    ctaKicker: "Wedi'n lleoli yn Cross Hands, Sir Gâr",
    ctaText:
      "Yn gwasanaethu Llanelli, Caerfyrddin, Rhydaman, Abertawe a ledled De Cymru.",
  },

  careersPage: {
    seo: {
      title: "Swyddi Hydrolig yn Cross Hands, Llanelli | Gyrfaoedd CHS",
      description:
        "Swyddi gwag yn CHS Hydraulics: swyddi peirianneg hydrolig a phrentisiaethau yn ein gweithdy yn Cross Hands, ger Llanelli yn Sir Gâr.",
    },
    crumb: "Gyrfaoedd",
    title: ["Gweithio gyda", "CHS"],
    intro:
      "Ymunwch â'r tîm sy'n cadw peiriannau safle, fferm a diwydiannol De Cymru i weithio, o'n gweithdy yn Cross Hands.",
    listKicker: "Swyddi gwag",
    listTitle: "Swyddi rydyn ni'n recriwtio ar eu cyfer",
    whyKicker: "Pam ymuno â ni",
    whyTitle: "Crefft fedrus, yn agos at adref",
    why: [
      {
        icon: "i-lucide-wrench",
        title: "Gwaith amrywiol",
        text: "Silindrau, pympiau, falfiau a phibellau o gloddwyr, tractorau a llinellau ffatri: does dim dau ddiwrnod yr un fath.",
      },
      {
        icon: "i-lucide-graduation-cap",
        title: "Dysgu o brofiad",
        text: "Gweithio ochr yn ochr â pheirianwyr sydd â {years} mlynedd o wybodaeth hydrolig rhyngddyn nhw.",
      },
      {
        icon: "i-lucide-map-pin",
        title: "Lleol",
        text: "Wedi'n lleoli yn Cross Hands, taith hawdd o Lanelli, Rhydaman a Chaerfyrddin.",
      },
    ],
    cta: {
      kicker: "Dim byd addas?",
      title: "Anfonwch eich CV beth bynnag.",
      text: "Rydyn ni bob amser yn falch o glywed gan beirianwyr a ffitwyr hydrolig da.",
      button: "E-bostiwch eich CV",
      emailSubject: "CV",
    },
  },

  vacancyPage: {
    notFound: "Heb ddod o hyd i'r swydd wag",
    details: "Manylion y swydd",
    type: "Math",
    types: {
      "full-time": "Llawn amser",
      "part-time": "Rhan amser",
      apprenticeship: "Prentisiaeth",
      temporary: "Dros dro",
    },
    pay: "Cyflog",
    payRange: (min: string, max: string | undefined, period: "year" | "hour") =>
      `${max ? `${min} i ${max}` : min} ${period === "year" ? "y flwyddyn" : "yr awr"}`,
    hours: "Oriau",
    location: "Lleoliad",
    locationValue: "Gweithdy Cross Hands",
    posted: "Hysbysebwyd",
    closes: "Dyddiad cau",
    about: "Am y swydd",
    responsibilities: "Beth fyddwch chi'n ei wneud",
    requirements: "Beth rydyn ni'n chwilio amdano",
    niceToHave: "Byddai'n braf cael",
    offer: "Beth rydyn ni'n ei gynnig",
    applyKicker: "Oes diddordeb?",
    applyTitle: "Gwneud cais am y swydd hon",
    applyText:
      "E-bostiwch eich CV a rhai llinellau amdanoch chi'ch hun, neu ffoniwch ni am sgwrs yn gyntaf.",
    applyByEmail: "E-bostiwch eich CV",
    emailSubject: (title: string) => `Cais: ${title}`,
    draft: "Drafft",
    draftNote:
      "Ddim yn fyw eto: pwyswch Publish yn yr ardal weinyddu pan fydd yn barod. Heb swyddi gwag yn yr ardal weinyddu, mae enghreifftiau'n cael eu dangos yma.",
  },

  privacyPage: {
    seo: {
      title: "Hysbysiad Preifatrwydd | CHS Hydraulics, Cross Hands",
      description:
        "Sut mae CHS Hydraulics yn Cross Hands, Llanelli yn defnyddio'r manylion rydych yn eu rhoi i ni wrth ffonio, e-bostio, anfon ymholiad neu wneud cais am swydd.",
    },
    crumb: "Preifatrwydd",
    title: ["Hysbysiad", "preifatrwydd"],
    intro:
      "Beth rydyn ni'n ei wneud â'ch manylion pan fyddwch yn ein ffonio, yn anfon e-bost, yn anfon ymholiad neu'n gwneud cais am swydd. Yn fyr: dim ond i'ch helpu chi rydyn ni'n eu defnyddio, dydyn ni byth yn eu gwerthu, a dydy'r wefan hon ddim yn defnyddio cwcis.",
    updated: "2026-10-05",
    updatedLabel: (date: string) => `Diweddarwyd ddiwethaf ${date}`,
    sections: [
      {
        title: "Pwy ydyn ni",
        text: [
          "Mae'r wefan hon yn cael ei rhedeg gan {legalName}, yn masnachu fel CHS Hydraulics, {address}. Ni sy'n gyfrifol am eich gwybodaeth bersonol (y \"rheolydd\" o dan gyfraith diogelu data'r DU).",
          "Cwestiynau am eich gwybodaeth? E-bostiwch {email} neu ffoniwch {phone}. Rydyn ni wedi cofrestru gyda Swyddfa'r Comisiynydd Gwybodaeth (ICO), rhif cofrestru [Rhif cofrestru ICO].",
        ],
        list: [],
      },
      {
        title: "Beth rydyn ni'n ei gasglu a pham",
        text: [],
        list: [
          "Ymholiadau: pan fyddwch yn defnyddio ein ffurflen gyswllt, rydyn ni'n cael eich enw, rhif ffôn, cyfeiriad e-bost ac unrhyw beth arall rydych yn dewis ei ddweud wrthym (eich cwmni, lleoliad, y gwasanaeth sydd ei angen, pa mor frys yw e a'ch neges). Rydyn ni'n ei ddefnyddio i ateb, rhoi pris a gwneud y gwaith.",
          "Galwadau ac e-byst: eich manylion cyswllt a'r hyn rydych yn ei ddweud wrthym, am yr un rhesymau.",
          "Cwsmeriaid: y manylion sydd eu hangen arnom i wneud y gwaith, anfon anfoneb a chadw cofnodion priodol.",
          "Ceisiadau am swyddi: eich CV ac unrhyw beth rydych yn ei anfon gydag ef, dim ond i'ch ystyried ar gyfer y swydd.",
        ],
      },
      {
        title: "Ein sail gyfreithiol",
        text: [
          "Rydyn ni'n defnyddio manylion ymholiadau a chwsmeriaid i gymryd y camau rydych wedi gofyn amdanynt cyn contract ac i'w gyflawni, ac er ein buddiant dilys mewn rhedeg y busnes ac ateb pobl sy'n cysylltu â ni. Rydyn ni'n cadw cofnodion cyfrifon oherwydd bod y gyfraith yn gofyn am hynny. Defnyddir ceisiadau am swyddi i'ch ystyried ar gyfer gwaith rydych wedi gwneud cais amdano.",
        ],
        list: [],
      },
      {
        title: "Gyda phwy rydyn ni'n ei rannu",
        text: [
          "Dydyn ni byth yn gwerthu eich gwybodaeth na'i defnyddio ar gyfer marchnata nad ydych wedi gofyn amdano. Dim ond gyda gwasanaethau sy'n ein helpu i redeg y busnes rydyn ni'n ei rhannu, o dan gontract, a dim ond yr hyn sydd ei angen arnynt:",
        ],
        list: [
          "[Gwasanaeth ffurflenni], sy'n anfon negeseuon o'n ffurflen gyswllt i'n mewnflwch.",
          "Ein darparwyr e-bost a chyfrifon.",
          "Fergus, ein system rheoli swyddi: mae archebion ar-lein yn mynd yn syth iddo, gyda'r manylion rydych chi'n eu rhoi i ni.",
          "Resend, sy'n anfon ein negeseuon e-bost i gadarnhau archebion.",
          "Vercel, sy'n cynnal y wefan hon. Mae'n cadw cofnodion gweinydd tymor byr, gan gynnwys cyfeiriadau IP, er diogelwch.",
          "Plausible Analytics (gweler isod).",
        ],
      },
      {
        title: "Dadansoddi'r wefan a chwcis",
        text: [
          "Dydy'r wefan hon ddim yn gosod unrhyw gwcis. Rydyn ni'n defnyddio Plausible Analytics i gyfrif ymweliadau, gweld pa dudalennau sy'n ddefnyddiol ac a yw pobl yn ffonio neu'n anfon ymholiad. Dydy Plausible ddim yn defnyddio cwcis, ddim yn casglu gwybodaeth bersonol a ddim yn eich dilyn ar draws gwefannau eraill.",
          "Dim ond os byddwch yn clicio arno y mae'r map ar ein tudalen gyswllt yn llwytho Google Maps. Efallai y bydd Google wedyn yn gosod ei gwcis ei hun, o dan bolisi preifatrwydd Google.",
        ],
        list: [],
      },
      {
        title: "Am ba hyd rydyn ni'n ei gadw",
        text: [],
        list: [
          "Ymholiadau nad ydynt yn arwain at waith: [12 mis].",
          "Cofnodion cwsmeriaid ac anfonebau: 6 blynedd ar ôl diwedd y flwyddyn ariannol, fel y mae CThEF yn ei ofyn.",
          "Ceisiadau am swyddi: [6 mis] ar ôl llenwi'r swydd, oni bai eich bod yn cytuno i ni gadw eich un chi yn hirach.",
        ],
      },
      {
        title: "Eich hawliau",
        text: [
          "Gallwch ofyn am gopi o'ch gwybodaeth, gofyn i ni ei chywiro neu ei dileu, cyfyngu ar sut rydyn ni'n ei defnyddio neu wrthwynebu hynny, neu ei chael wedi'i hanfon atoch chi neu at rywun arall. E-bostiwch {email} a byddwn yn ateb o fewn mis. Does dim tâl.",
        ],
        list: [],
      },
      {
        title: "Cwynion",
        text: [
          "Os nad ydych yn hapus â sut rydyn ni wedi trin eich gwybodaeth, dywedwch wrthym yn gyntaf er mwyn i ni allu ei chywiro. Gallwch hefyd gwyno i Swyddfa'r Comisiynydd Gwybodaeth yn ico.org.uk neu ar 0303 123 1113.",
        ],
        list: [],
      },
    ],
  },

  holding: {
    comingSoon: {
      seo: {
        title: "CHS Hydraulics | Gwefan Newydd yn Dod yn Fuan",
        description:
          "Mae ein gwefan newydd bron yn barod. Atgyweirio pibellau, rams a systemau hydrolig yn Cross Hands, Llanelli: ffoniwch {phone}.",
      },
      kicker: "Gwefan newydd ar y ffordd",
      title: ["Codi", "pwysau."],
      text: "Mae ein gwefan newydd bron yn barod. Yn y cyfamser rydyn ni ar agor fel arfer: ffoniwch ni, anfonwch e-bost neu galwch heibio i'r gweithdy yn Cross Hands.",
      reading: "CYN HIR",
      gaugeLabel: "Medrydd pwysau yn codi i'r pwysau gweithio",
    },
    maintenance: {
      seo: {
        title: "CHS Hydraulics | Yn Ôl Cyn Hir",
        description:
          "Mae ein gwefan i lawr am wasanaeth sydyn. Rydyn ni dal ar agor ar gyfer atgyweirio hydrolig yn Cross Hands, Llanelli: ffoniwch {phone}.",
      },
      kicker: "I lawr am waith cynnal a chadw",
      title: ["Gwasanaeth", "arferol."],
      text: "Rydyn ni'n rhoi gwasanaeth sydyn i'r wefan a bydd yn ôl cyn hir. Mae'r gweithdy ar agor fel arfer, felly os oes peiriant wedi torri, ffoniwch ni nawr.",
      reading: "503",
      gaugeLabel:
        "Medrydd pwysau yn gorffwys ar sero tra bod y wefan yn cael gwasanaeth",
    },
    whatWeDo: "Beth rydyn ni'n ei wneud",
    email: "E-bostiwch ni",
    findUs: "Dewch o hyd i ni",
  },

  areaPage: {
    notFound: "Heb ddod o hyd i'r ardal",
    gettingHere: (fromTown: string) => `Cyrraedd atom ${fromTown}`,
    distance: "Pellter",
    time: "Gyrru",
    route: "Llwybr",
    directions: "Cael cyfarwyddiadau",
    servicesTitle: "Beth allwn ni ei wneud i chi",
    photoCard: {
      kicker: "Ddim yn siŵr beth sydd ei angen?",
      title: "Anfonwch lun atom",
      text: "E-bostiwch lun o'r bibell, y ram neu'r ffitiad, gydag unrhyw farciau y gallwch eu gweld, a byddwn yn dweud beth sydd ei angen cyn i chi wneud y daith.",
      button: "E-bostio llun",
      emailSubject: "Llun ar gyfer pris",
    },
    nearbyTitle: "Hefyd yn agos at",
    faqTitle: "Cwestiynau cyffredin",
    jobsKicker: "Gwaith lleol",
    jobsTitle: (inTown: string) => `Gwaith diweddar ${inTown}`,
    ctaKicker: (town: string) => `Atgyweirio hydrolig ar gyfer ${town}`,
  },

  bookPage: {
    seo: {
      title: "Archebu Gollwng Atgyweiriad Hydrolig | Cross Hands",
      description:
        "Archebwch amser i ollwng ram, pibell neu wiriad hydrolig cyn y tymor yn ein gweithdy yn Cross Hands. Yn gwasanaethu Llanelli, Sir Gâr a De Cymru.",
    },
    crumb: "Archebu",
    fields: {
      machine: "Peiriant",
      machinePlaceholder: "e.e. JCB 3CX, John Deere 6155R",
      details: "Unrhyw beth y dylen ni ei wybod",
      detailsPlaceholder:
        "Beth sydd o'i le, neu beth hoffech chi ei wirio, ac unrhyw rifau rhannau.",
    },
    // Live booking (the slot picker), shown when live booking is on.
    live: {
      kicker: ["Atgyweirio", "Gwasanaethu", "Cyflenwi"],
      title: ["Archebu atgyweiriad", "hydrolig"],
      intro:
        "Dewiswch amser sy'n gyfleus a byddwch yn mynd yn syth i'n dyddiadur. Peiriant wedi torri nawr? Ffoniwch ni yn lle hynny.",
      benefits: [
        {
          icon: "i-lucide-clock",
          title: "Dewis amser",
          text: "Dewiswch amser sy'n gyfleus",
        },
        {
          icon: "i-lucide-calendar-check",
          title: "Yn syth i'n dyddiadur",
          text: "Dim aros i ni ffonio'n ôl",
        },
        {
          icon: "i-lucide-badge-pound-sterling",
          title: "Pris wedi'i gytuno ymlaen llaw",
          text: "Rydyn ni'n dweud y gost cyn dechrau",
        },
        {
          icon: "i-lucide-shield-check",
          title: "Cymorth arbenigol",
          text: "{years} mlynedd o wybodaeth hydrolig",
        },
      ],
      steps: [
        { title: "Gwasanaeth", text: "Dewis y gwaith" },
        { title: "Dyddiad ac amser", text: "Dewis amser" },
        { title: "Eich manylion", text: "Dweud wrthym amdano" },
      ],
      serviceTitle: "1. Beth sydd ei angen arnoch chi?",
      serviceText: "Dewiswch y gwaith rydych chi'n ei archebu.",
      services: {
        hose: {
          title: "Gwneud pibell",
          text: "Tua 30 munud, tra byddwch yn aros",
        },
        check: {
          title: "Gwiriad cyn y tymor",
          text: "Tua awr, cyn y silwair neu'r cynhaeaf",
        },
        onsite: {
          title: "Ymweliad ar y safle",
          text: "Rydyn ni'n dod atoch chi: tua 2 awr a'r daith",
        },
        dropoff: {
          title: "Gollwng ram neu gydran",
          text: "Dewch ag ef yn ystod y bore",
        },
      },
      otherPrompt: "Rhywbeth arall, neu dim amser sy'n gyfleus?",
      otherLink: "Anfonwch ymholiad atom yn lle hynny",
      dateTitle: "2. Dewis dyddiad ac amser",
      dateText:
        "Dewiswch ddiwrnod, yna amser i ddod ag ef i'n gweithdy yn Cross Hands.",
      dateTextOnsite: "Dewiswch ddiwrnod, yna amser i ni ddod atoch chi.",
      locationLabel: "Ble mae'r peiriant?",
      locationPlaceholder: "Cyfeiriad y safle neu god post",
      locationError: "Dywedwch wrthym ble mae'r peiriant",
      comingTo: "Byddwn yn dod i:",
      previousMonth: "Mis blaenorol",
      nextMonth: "Mis nesaf",
      timesTitle: "Amseroedd ar gael",
      chooseDay: "Dewiswch ddiwrnod i weld yr amseroedd.",
      dropoffWindow: (from: string, to: string) => `Gollwng ${from} – ${to}`,
      loading: "Yn gwirio'r dyddiadur…",
      none: "Dim amseroedd rhydd ar-lein yn y pedair wythnos nesaf. Ffoniwch ni a byddwn yn dod o hyd i amser.",
      failed:
        "Allwn ni ddim llwytho'r dyddiadur ar hyn o bryd. Ffoniwch ni, neu anfonwch ymholiad atom yn lle hynny.",
      urgentTitle: "Angen amser ar frys?",
      urgentText:
        "Os yw eich peiriant wedi torri a bod angen amser cynharach arnoch, ffoniwch ni'n uniongyrchol ar",
      nextStep: "Cam nesaf",
      detailsTitle: "3. Eich manylion",
      detailsText: "Er mwyn i ni wybod pwy sy'n dod a beth i'w ddisgwyl.",
      confirm: "Cadarnhau'r archeb",
      booking: "Yn archebu…",
      taken:
        "Mae'n ddrwg gennym, mae'r amser hwnnw newydd gael ei gymryd. Dewiswch un arall.",
      summary: {
        title: "Eich archeb",
        service: "Gwasanaeth",
        when: "Dyddiad ac amser",
        details: "Eich manylion",
        notChosen: "Heb ddewis eto",
        notCompleted: "Heb ei gwblhau",
        change: "Newid",
      },
      help: {
        title: "Angen help i ddewis?",
        text: "Ddim yn siŵr beth sydd ei angen? Gall ein tîm helpu.",
      },
      doneTitle: "Rydych chi wedi archebu",
      doneText: (when: string) =>
        `Rydyn ni wedi eich rhoi yn ein dyddiadur ar gyfer ${when}. Os bydd unrhyw beth yn newid, ffoniwch ni ar`,
      bringTo: "Dewch ag ef i'n gweithdy:",
      bookAnother: "Gwneud archeb arall",
      addToCalendar: "Ychwanegu at y calendr",
      googleCalendar: "Google Calendar",
      emailed: (email: string) =>
        `Rydyn ni wedi e-bostio cadarnhad at ${email}.`,
      calendarTitle: (service: string) => `CHS Hydraulics: ${service}`,
      calendarDescription: (phone: string) =>
        `Wedi'i archebu ar-lein gyda CHS Hydraulics. I newid neu ganslo, ffoniwch ${phone}.`,
    },
    email: {
      subject: (service: string, when: string) =>
        `Archeb wedi'i chadarnhau: ${service}, ${when}`,
      greeting: (name: string) => `Helo ${name},`,
      intro: "Rydych chi wedi archebu gyda CHS Hydraulics. Dyma'r manylion:",
      service: "Gwasanaeth",
      when: "Pryd",
      where: "Ble",
      bringTitle: "Beth i ddod gyda chi",
      bring: {
        hose: "Yr hen bibell, gyda'i ffitiadau os gallwch chi, er mwyn i ni gyfateb yr hyd, y sgôr pwysedd a'r pennau.",
        check:
          "Y peiriant, gydag unrhyw namau rydych chi wedi sylwi arnyn nhw wedi'u nodi. Ffoniwch ni os yw'n rhy fawr i ddod ag ef i mewn.",
        dropoff:
          "Y ram neu'r gydran, a gwneuthuriad a model y peiriant y daeth ohono.",
        onsite:
          "Dim byd: byddwn ni'n dod atoch chi. Gwnewch yn siŵr y gallwn ni gyrraedd y peiriant yn ddiogel.",
      },
      change: "Angen newid neu ganslo? Ffoniwch ni ar",
      orReply: "neu atebwch yr e-bost hwn.",
      calendarNote: "Mae gwahoddiad calendr wedi'i atodi.",
      signoff: "Diolch,",
      team: "Tîm CHS Hydraulics",
    },
  },

  accountsPage: {
    seo: {
      title: "Cyfrifon Masnach i Logi Peiriannau a Ffermydd | CHS",
      description:
        "Agorwch gyfrif masnach gyda CHS Hydraulics yn Cross Hands: atgyweirio hydrolig i gwmnïau llogi peiriannau, contractwyr a ffermydd ar draws Llanelli a De Cymru.",
    },
    crumb: "Cyfrifon masnach",
    title: ["Cyfrifon", "masnach"],
    intro:
      "I gwmnïau llogi peiriannau, contractwyr a ffermydd sy'n dibynnu ar eu peiriannau: un lle ar gyfer pob pibell, ram ac atgyweiriad.",
    whoKicker: "I bwy mae e",
    whoTitle: "I fusnesau sy'n rhedeg peiriannau",
    who: [
      {
        icon: "i-lucide-construction",
        title: "Cwmnïau llogi peiriannau",
        text: "Cloddwyr, dympwyr a telehandlers yn ôl allan ar log, gyda'r gwaith papur wedi'i drefnu.",
      },
      {
        icon: "i-lucide-hard-hat",
        title: "Contractwyr",
        text: "Mae criwiau'n aros yn costio arian. Byddwn yn dweud yn blaen beth sydd ei angen a phryd bydd yn barod.",
      },
      {
        icon: "i-lucide-tractor",
        title: "Ffermydd",
        text: "Tractorau, llwythwyr ac offer yn dal i weithio, yn enwedig drwy'r silwair a'r cynhaeaf.",
      },
    ],
    benefitsKicker: "Beth rydych chi'n ei gael",
    benefitsTitle: "Pam agor cyfrif",
    benefits: [
      {
        icon: "i-lucide-receipt-text",
        title: "Talu ar gyfrif",
        text: "Talu ar anfoneb yn lle ar y diwrnod: [telerau talu, e.e. 30 diwrnod o'r anfoneb].",
      },
      {
        icon: "i-lucide-clipboard-list",
        title: "Eich peiriannau ar gofnod",
        text: "Rydyn ni'n cadw cofnod o'r pibellau a'r atgyweiriadau rydyn ni'n eu gwneud i'ch peiriannau, felly mae \"yr un fath â'r tro diwethaf\" yn hawdd.",
      },
      {
        icon: "i-lucide-message-circle",
        title: "Cael gwybod",
        text: "Byddwn yn dweud wrthych ble mae pob swydd arni a phryd bydd yn barod.",
      },
      {
        icon: "i-lucide-badge-pound-sterling",
        title: "Pris wedi'i gytuno ymlaen llaw",
        text: "Rydyn ni'n dweud wrthych beth sydd o'i le a faint fydd y gost cyn i ni ddechrau.",
      },
    ],
    stepsTitle: "Agor cyfrif",
    steps: [
      {
        title: "Cysylltu â ni",
        text: "Ffoniwch neu e-bostiwch gydag enw eich busnes a'r peiriannau rydych chi'n eu rhedeg.",
      },
      {
        title: "Rydyn ni'n eich gosod chi i fyny",
        text: "Byddwn yn cymryd eich manylion ac yn cytuno ar eich telerau.",
      },
      {
        title: "Anfonwch waith atom",
        text: "Dewch ag ef i mewn neu ffoniwch, a rhowch enw eich cyfrif.",
      },
    ],
    ctaTitle: "Agor cyfrif",
    ctaText: "Ffoniwch neu e-bostiwch ni a byddwn yn eich gosod chi i fyny.",
    emailButton: "E-bostiwch ni",
    emailSubject: "Ymholiad cyfrif masnach",
    loginPrompt: "Oes gennych chi gyfrif yn barod?",
    loginLink: "Mewngofnodi",
  },

  loginPage: {
    seo: {
      title: "Mewngofnodi Cwsmeriaid | CHS Hydraulics",
      description:
        "Mewngofnodwch i weld eich swyddi a'ch anfonebau gyda CHS Hydraulics.",
    },
    crumb: "Mewngofnodi cwsmeriaid",
    title: ["Mewngofnodi", "cwsmeriaid"],
    intro:
      "Gweld ble mae eich swyddi arni a gweld eich anfonebau yn ein porth cwsmeriaid.",
    button: "Mewngofnodi i'ch cyfrif",
    note: "Byddwch yn cael eich tywys i'n porth cwsmeriaid diogel, a ddarperir gan Fergus.",
    noAccount: "Dim cyfrif eto?",
    accountsLink: "Dysgu am gyfrifon masnach",
    help: "Methu mewngofnodi? Ffoniwch ni ar",
  },

  about: {
    seo: {
      title: "Amdanom ni | Peirianwyr Hydrolig Cross Hands, Llanelli | CHS",
      description:
        "Busnes atgyweirio a chyflenwi hydrolig yn Cross Hands, Sir Gâr yw CHS Hydraulics, gyda gweithdy ac uned symudol yn gwasanaethu Llanelli a De Cymru.",
    },
    crumb: "Amdanom ni",
    title: ["Amdanom", "ni"],
    intro:
      "Busnes atgyweirio a chyflenwi hydrolig yn Cross Hands, Sir Gâr, yn cadw peiriannau adeiladu, fferm a diwydiannol i weithio ledled De Cymru.",
    whoKicker: "Pwy ydyn ni",
    whoTitle: "Arbenigwyr hydrolig, yn agos at adref",
    who: [
      "Mae CHS Hydraulics yn atgyweirio, yn gwasanaethu ac yn cyflenwi offer hydrolig i gwsmeriaid ar draws Llanelli, Sir Gâr a De Cymru.",
      "O bibell wedi byrstio ar gloddiwr i ram yn gollwng ar lwythwr tractor neu nam ar wasg ddiwydiannol, rydyn ni'n dod o hyd i'r broblem, yn ei thrwsio'n iawn ac yn eich cael yn ôl i weithio.",
      "Mae gennym weithdy yn Cross Hands ac uned wasanaeth symudol gyda'r holl offer angenrheidiol, felly gallwn weithio lle bynnag sydd orau i chi a'ch peiriant.",
    ],
    vanAlt: "Fan wasanaeth symudol CHS Hydraulics",
    storyKicker: "Ein stori",
    storyTitle: "Wedi'i sefydlu gan {founder1} a {founder2}",
    story: [
      "[Sut dechreuodd CHS: pryd a ble sefydlodd {founder1} a {founder2} y busnes, a pham. Er enghraifft, beth roedden nhw'n ei wneud cyn hynny a'r angen a welson nhw am waith atgyweirio hydrolig iawn yn Sir Gâr.]",
      "[Beth maen nhw wedi'i adeiladu dros y blynyddoedd: y cwsmeriaid, y peiriannau a'r enw da y tu ôl i'r {years} mlynedd, a beth sy'n gwneud CHS yn wahanol.]",
      "[Ble mae'r busnes nawr: pwy sy'n ei redeg heddiw a sut mae safonau'r sylfaenwyr yn parhau.]",
    ],
    foundersCaption: "{founder1} a {founder2}",
    foundersRole: "Sylfaenwyr, CHS Hydraulics",
    foundersPhotoAlt: "{founder1} a {founder2}, sylfaenwyr CHS Hydraulics",
    foundersPhotoPlaceholder: "[Llun o'r sylfaenwyr]",
    foundersQuote:
      "[Dyfyniad byr gan y sylfaenwyr am sut maen nhw wedi gweithio erioed, e.e. ei drwsio'n iawn, y tro cyntaf.]",
    timelineKicker: "Ein hanes",
    timelineTitle: "Sut gyrhaeddon ni yma",
    timelineText:
      "O waith cyntaf y sylfaenwyr i enw newydd, y cerrig milltir y tu ôl i {years} mlynedd o gadw De Cymru i weithio.",
    timeline: [
      {
        date: "[Blwyddyn]",
        title: "[Ble dechreuodd y sylfaenwyr]",
        description:
          "[Cefndir y sylfaenwyr cyn CHS: y profiad y mae'r {years} mlynedd yn seiliedig arno.]",
        icon: "i-lucide-hard-hat",
      },
      {
        date: "{founded}",
        title: "Sefydlu Crosshands Hydraulic Services",
        description:
          "[Sefydlodd {founder1} a {founder2} y busnes yn Cross Hands: beth oedd ganddyn nhw ar y dechrau a phwy oedd eu cwsmeriaid cyntaf.]",
        icon: "i-lucide-flag",
      },
      {
        date: "[Blwyddyn]",
        title: "[Carreg filltir, e.e. gweithdy neu offer newydd]",
        description:
          "[Beth newidiodd a beth oedd hynny'n ei olygu i gwsmeriaid.]",
        icon: "i-lucide-warehouse",
      },
      {
        date: "[Blwyddyn]",
        title: "[Carreg filltir, e.e. contract mawr neu aelod newydd o'r tîm]",
        description: "[Brawddeg amdani.]",
        icon: "i-lucide-handshake",
      },
      {
        date: "2026",
        title: "Ailfrandio fel CHS Hydraulics",
        description: "Yr un busnes a'r un safonau, gydag enw a golwg newydd.",
        icon: "i-lucide-sparkles",
      },
      {
        date: "[Blwyddyn]",
        title: "Lansio'r gwasanaeth ar y safle",
        description:
          "Mae ein huned symudol, gyda'r holl offer angenrheidiol, yn dod â'r gweithdy i'ch safle, eich fferm neu'ch iard.",
        icon: "i-lucide-truck",
        upcoming: true,
        onsite: true,
      },
    ],
    factsLabel: "CHS yn gryno",
    facts: [
      { value: "{founded}", label: "Sefydlwyd" },
      { value: "Cross Hands", label: "Gweithdy" },
      { value: "Symudol", label: "Uned wasanaeth ar y safle" },
      { value: "De Cymru", label: "Ein hardal" },
      { value: "{standard}", label: "Ansawdd ardystiedig" },
    ],
    valuesKicker: "Pam rydyn ni'n ei wneud",
    valuesTitle: "Mae rhywun yn aros am bob peiriant sydd wedi torri",
    valuesIntro:
      "Nid peiriant yn unig yw peiriant sydd wedi torri. Mae'n griw yn aros, cynhaeaf ar stop neu linell gynhyrchu'n colli arian. Rydyn ni'n ei drwsio'n iawn, yn rhoi gwybod i chi beth sy'n digwydd ac yn eich cael yn ôl i weithio.",
    values: [
      {
        icon: "i-lucide-badge-pound-sterling",
        title: "Pris wedi'i gytuno ymlaen llaw",
        text: "Rydyn ni'n dweud wrthych beth sydd o'i le a faint fydd y gost cyn i ni ddechrau. Dim costau cudd, dim gwerthu diangen.",
      },
      {
        icon: "i-lucide-circle-check-big",
        title: "Wedi'i drwsio'n iawn, y tro cyntaf",
        text: "Mae {years} mlynedd o waith hydrolig ymarferol yn golygu ein bod yn dod o hyd i'r gwir nam, nid y symptom yn unig.",
      },
      {
        icon: "i-lucide-message-circle",
        title: "Rydyn ni'n rhoi gwybod i chi",
        text: "Mae peiriant sydd wedi stopio yn costio arian i chi, felly rydyn ni'n trin pob swydd fel un frys ac yn dweud wrthych ble mae hi arni a phryd bydd hi'n barod.",
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
        "{years} mlynedd o brofiad, ar y safle o fewn {hours} awr, prisiau wedi'u cytuno ymlaen llaw: pam mae ffermydd a gweithredwyr peiriannau Llanelli a Sir Gâr yn dewis CHS.",
    },
    crumb: "Pam CHS",
    title: ["Llai o amser segur.", "Mwy o gefnogaeth."],
    intro:
      "Pam mae busnesau ar draws Llanelli, Sir Gâr a De Cymru yn ymddiried yn CHS gyda'u systemau hydrolig.",
    reasonsKicker: "Pam dewis CHS",
    reasonsTitle: "Pedwar rheswm mae cwsmeriaid yn dod yn ôl",
    reviewsKicker: "Adolygiadau cwsmeriaid",
    reviewsTitle: "Peidiwch â chymryd\nein gair ni yn unig",
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
      "Prosesau ansawdd ardystiedig {standard}, wedi'u harchwilio bob blwyddyn",
    ],
    stepsKicker: "Sut mae'n gweithio",
    stepsTitle: "O dorri i lawr\ni fod yn ôl yn gweithio",
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
    bookBox: {
      kicker: "Gwaith wedi'i gynllunio?",
      title: "Archebwch amser sy'n gyfleus",
      text: "Gellir archebu pibellau, gwiriadau cyn y tymor ac amseroedd gollwng ar-lein, yn syth i'n dyddiadur.",
    },
    seo: {
      title: "Cysylltu â CHS Hydraulics | Cross Hands, Llanelli",
      description:
        "Cysylltwch â CHS Hydraulics am newid pibellau, atgyweirio rams, canfod namau a galwadau allan ar y safle ar draws Llanelli a Sir Gâr.",
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
    privacyLink: "Darllenwch ein hysbysiad preifatrwydd",
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
    address: "Cyfeiriad",
    openingHours: "Oriau agor",
    areasWeCover: "Ardaloedd rydyn ni'n eu gwasanaethu",
    map: {
      kicker: "Dewch i'r gweithdy",
      title: "Dod o hyd i ni",
      previewAlt: "Map o Cross Hands yn dangos lle mae CHS Hydraulics",
      show: "Dangos map rhyngweithiol",
      note: "Mae'n llwytho Google Maps, a allai osod cwcis.",
      iframeTitle: "Map Google yn dangos CHS Hydraulics, 3 Acer Court",
      directions: "Cyfarwyddiadau",
      findingUs: "Sut i'n cyrraedd",
      findingUsText:
        "[Sut i ddod o hyd i'r uned: e.e. pa gyffordd neu gylchfan i droi arni, lle mae Acer Court ar yr ystâd, a lle i barcio.]",
      attribution: "© Cyfranwyr OpenStreetMap",
    },
  },

  services,
  sectors,
  benefits,
  areas,
}
