import { benefits } from "./benefits"
import { sectors } from "./sectors"
import { services } from "./services"

// All English copy for the site. app/content/cy/index.ts must match this shape exactly
// (it's typed as `Content`), so `nuxt typecheck` fails if a Welsh string is missing.

export const en = {
  locale: "en",
  // BCP 47 tag for dates and numbers.
  dateLocale: "en-GB",

  common: {
    skipToContent: "Skip to main content",
    primaryNav: "Primary navigation",
    mobileNav: "Mobile navigation",
    callChs: "Call CHS Hydraulic Services",
    callNow: "Call now",
    call: (phone: string) => `Call ${phone}`,
    sendEnquiry: "Send an enquiry",
    orSendEnquiry: "Or send an enquiry",
    ourServices: "Our services",
    viewAllServices: "View all services",
    home: "Home",
    languageSwitch: "Cymraeg",
    languageSwitchLabel: "Darllenwch y dudalen hon yn Gymraeg",
  },

  nav: {
    home: "Home",
    services: "Services",
    about: "About",
    sectors: "Sectors",
    whyChs: "Why CHS",
    contact: "Contact",
  },

  footer: {
    blurb:
      "Hydraulic repair, hose supply and on-site service from Cross Hands, covering Llanelli, Carmarthenshire and South Wales.",
    services: "Services",
    explore: "Explore",
    allServices: "All services",
    aboutUs: "About us",
    getInTouch: "Get in touch",
  },

  business: {
    location: "Cross Hands, Carmarthenshire",
    serviceArea: [
      "Carmarthenshire",
      "Llanelli",
      "Swansea",
      "Neath Port Talbot",
      "Pembrokeshire",
      "Wider South Wales",
    ],
    hours: [
      { days: "Monday – Friday", time: "8am – 5.30pm" },
      { days: "Saturday", time: "8am – 12pm" },
      { days: "Emergency call-outs", time: "Call for availability" },
    ],
  },

  cta: {
    kicker: "Need hydraulic support?",
    // "\n" = line break in the heading.
    title: "Let's keep\nyour equipment moving.",
    text: "Call CHS to discuss a repair, service or on-site visit.",
  },

  reviews: {
    kicker: "What customers say",
    title: "Trusted by businesses across South Wales",
    fromGoogleReviews: (count: number) => `from ${count} Google reviews`,
    onGoogle: "on Google",
    reviewCount: (count: number) => `${count} reviews`,
    googleReview: "Google review",
    customer: "Customer",
    readAll: "Read all reviews on Google",
    leaveReview: "Leave us a review",
    rated: (rating: number) => `Rated ${rating} out of 5`,
  },

  home: {
    seo: {
      title: "Hydraulic Repairs Llanelli & Carmarthenshire | CHS",
      description:
        "Hydraulic hose replacement, ram repairs, fault finding and mobile call-outs from Cross Hands, covering Llanelli, Carmarthenshire and South Wales.",
    },
    heroKicker: "Hydraulic repairs in Llanelli & Carmarthenshire",
    heroTitle: ["Keeping", "industry", "moving"] as [string, string, string],
    heroCopy:
      "Expert hydraulic repair, hose supply and on-site service for plant, agriculture, commercial and industrial customers across Llanelli, Carmarthenshire and South Wales.",
    heroImageAlt: "Red hydraulic cylinder with polished ram and hoses",
    keyBenefits: "Key benefits",
    trust: [
      ["Fast", "turnaround"],
      ["On-site", "support"],
      ["Quality", "you can trust"],
    ] as [string, string][],
    servicesTitle: "Complete hydraulic solutions",
    servicesIntro:
      "From emergency hose replacements to full system repairs, we keep your equipment running with minimal downtime.",
    whyKicker: "Why choose CHS",
    whyTitle: ["Minimum downtime.", "Maximum support."] as [string, string],
    whyLink: "Why choose CHS",
    onsiteKicker: "On-site hydraulic service",
    onsiteTitle: "We come to you",
    onsiteText:
      "Our fully equipped mobile service unit can carry out repairs, hose replacements and system diagnostics on-site, helping you avoid costly downtime.",
    onsiteList: [
      "Emergency call-outs",
      "On-site hose replacement",
      "Hydraulic system diagnostics",
      "Plant, agricultural & commercial",
      "Flexible, reliable scheduling",
    ],
    bookService: "Book a service",
    vanAlt: "CHS Crosshands Hydraulic Services mobile service van on site",
    sectorsKicker: "Our sectors",
    sectorsTitle: ["Proud to support", "a wide range of industries."] as [
      string,
      string,
    ],
    viewSectors: "View sectors",
  },

  servicesPage: {
    seo: {
      title: "Hydraulic Services Llanelli & Carmarthenshire | CHS",
      description:
        "Hose replacement, ram and cylinder repairs, fault finding and mobile on-site service from our Cross Hands workshop, covering Llanelli and Carmarthenshire.",
    },
    crumb: "Services",
    title: ["Hydraulic", "services"] as [string, string],
    intro:
      "Hose replacement, ram repairs, fault finding and mobile call-outs from our workshop in Cross Hands, serving Llanelli, Carmarthenshire and South Wales.",
    listLabel: "Our services",
    cta: {
      kicker: "Not sure what you need?",
      title: "Tell us what's happening.",
      text: "Describe the problem and we'll point you in the right direction.",
    },
  },

  servicePage: {
    notFound: "Service not found",
    whatWeDo: "What we do",
    howItWorks: "How it works",
    commonQuestions: "Common questions",
    getHelp: "Get help",
    needSorted: "Need it sorted?",
    talkToTeam: "Talk to our team",
    otherServices: "Other services",
    areasWeCover: "Areas we cover",
    ctaKicker: "Based in Cross Hands, Carmarthenshire",
    ctaText:
      "Serving Llanelli, Carmarthen, Ammanford, Swansea and across South Wales.",
  },

  about: {
    seo: {
      title: "About CHS | Hydraulic Engineers in Cross Hands, Llanelli",
      description:
        "Crosshands Hydraulic Services is a hydraulic repair and supply business in Cross Hands, Carmarthenshire, with a workshop and mobile unit serving Llanelli and South Wales.",
    },
    crumb: "About",
    title: ["About", "CHS"] as [string, string],
    intro:
      "A hydraulic repair and supply business in Cross Hands, Carmarthenshire, keeping plant, farm and industrial machinery working across South Wales.",
    whoKicker: "Who we are",
    whoTitle: "Hydraulic specialists, close to home",
    who: [
      "Crosshands Hydraulic Services repairs, services and supplies hydraulic equipment for customers across Llanelli, Carmarthenshire and South Wales.",
      "From a burst hose on an excavator to a leaking ram on a tractor loader or a fault on an industrial press, we find the problem, fix it properly and get you back to work.",
      "We run a workshop at Cross Hands and a fully equipped mobile service unit, so we can work wherever makes most sense for you and your machine.",
    ],
    vanAlt: "CHS Crosshands Hydraulic Services mobile service van",
    factsLabel: "CHS at a glance",
    // "2004" is the Companies House incorporation date for Crosshands Hydraulic Services LLP; confirm with the business.
    facts: [
      { value: "2004", label: "Established" },
      { value: "Cross Hands", label: "Workshop base" },
      { value: "Mobile", label: "On-site service unit" },
      { value: "South Wales", label: "Area we cover" },
    ],
    valuesKicker: "How we work",
    valuesTitle: "What you can expect from us",
    values: [
      {
        icon: "i-lucide-message-square-text",
        title: "Straight answers",
        text: "We tell you what's wrong, what it needs and what it'll cost before we start, with no surprises.",
      },
      {
        icon: "i-lucide-hard-hat",
        title: "Practical experience",
        text: "Hands-on hydraulic work every day across plant, farm, commercial and industrial machinery.",
      },
      {
        icon: "i-lucide-map-pinned",
        title: "Local and reachable",
        text: "Based in Cross Hands, so we're close to Llanelli, Carmarthen, Ammanford and Swansea when you need us.",
      },
    ],
    waysKicker: "Workshop or on-site",
    waysTitle: "Two ways we can help",
    ways: [
      {
        icon: "i-lucide-warehouse",
        title: "At our workshop",
        text: "Bring hoses, rams and components to our Cross Hands workshop. Most hoses are made up while you wait, and rams are stripped, inspected and rebuilt in-house.",
        link: {
          label: "Hose repair & replacement",
          to: "/services/hydraulic-hoses",
        },
      },
      {
        icon: "i-lucide-truck",
        title: "On your site",
        text: "When the machine can't come to us, our fully equipped mobile unit goes to it: building sites, quarries, farms and yards across South Wales.",
        link: {
          label: "On-site & mobile service",
          to: "/services/on-site-hydraulic-service",
        },
      },
    ],
    areasKicker: "Where we work",
    areasTitle: "Areas we cover",
    areasText:
      "Based at Cross Hands, we're well placed for customers right across the region. Not sure if we cover you? Just ask.",
  },

  sectorsPage: {
    seo: {
      title: "Sectors We Support | Hydraulic Repairs South Wales | CHS",
      description:
        "Hydraulic repairs for plant and construction, agriculture, industrial and manufacturing, and commercial vehicles across Llanelli, Carmarthenshire and South Wales.",
    },
    crumb: "Sectors",
    title: ["Sectors we", "support"] as [string, string],
    intro:
      "From building sites and farms to factories and fleets, we keep hydraulic machinery working across Llanelli, Carmarthenshire and South Wales.",
    navLabel: "Sectors",
    servicesForSector: "Services for this sector",
    typicalMachines: "Typical machines",
    otherWork: "Other work we take on",
    cta: {
      kicker: "Don't see your sector?",
      title: "If it runs on hydraulics, call us.",
      text: "We work on a wide range of machinery. Tell us what you've got and we'll let you know how we can help.",
    },
  },

  why: {
    seo: {
      title: "Why Choose CHS | Hydraulic Repairs Llanelli & Carmarthenshire",
      description:
        "Fast response, an experienced team, quality components and a mobile service unit: why businesses across Llanelli and Carmarthenshire choose CHS for hydraulic repairs.",
    },
    crumb: "Why CHS",
    title: ["Minimum downtime.", "Maximum support."] as [string, string],
    intro:
      "Why businesses across Llanelli, Carmarthenshire and South Wales trust CHS with their hydraulics.",
    reasonsKicker: "Why choose CHS",
    reasonsTitle: "Four reasons customers come back",
    reviewsKicker: "Customer reviews",
    reviewsTitle: "Don't just take our word for it",
    promiseKicker: "Our promise",
    promiseTitle: "What you get every time",
    promiseText: "However big or small the job, this is how we work.",
    promises: [
      "We explain the fault and the fix before any work starts",
      "Realistic turnaround times, and we keep you updated",
      "Parts matched to the job and working pressure",
      "Hoses made up while you wait for most standard sizes",
      "Workshop or on-site, whichever gets you working sooner",
      "Clear pricing with no surprises on the invoice",
    ],
    stepsKicker: "How it works",
    stepsTitle: "From breakdown to back at work",
    steps: [
      {
        icon: "i-lucide-phone-call",
        title: "Call or send an enquiry",
        text: "Tell us the machine, what's happened and where it is.",
      },
      {
        icon: "i-lucide-search",
        title: "We diagnose the problem",
        text: "In the workshop or on-site, we find the real cause, not just the symptom.",
      },
      {
        icon: "i-lucide-wrench",
        title: "We fix it properly",
        text: "Quality parts, fitted and tested, so it stays fixed.",
      },
      {
        icon: "i-lucide-circle-check-big",
        title: "Back to work",
        text: "Your machine is running again with minimal downtime.",
      },
    ],
    ctaKicker: "Ready when you are",
  },

  contact: {
    seo: {
      title: "Contact CHS Hydraulics | Cross Hands, Llanelli",
      description:
        "Contact Crosshands Hydraulic Services for hose replacement, ram repairs, fault finding and on-site call-outs across Llanelli and Carmarthenshire.",
    },
    kicker: ["Contact", "Quotes", "Call-outs"],
    title: ["Get in", "touch"] as [string, string],
    intro:
      "Machine down, need a hose made up or want a quote for a ram rebuild? Call us, or send the details below and we'll get back to you.",
    sectionLabel: "Contact options",
    formKicker: "Send an enquiry",
    formTitle: "Tell us what you need",
    requiredNote: ["Fields marked", "with an asterisk", "are required."],
    honeypot: "Leave this field empty",
    optional: "Optional",
    fields: {
      name: "Name",
      company: "Company",
      phone: "Phone",
      email: "Email",
      service: "Service",
      servicePlaceholder: "Choose a service",
      somethingElse: "Something else",
      location: "Location or postcode",
      locationPlaceholder: "e.g. SA14",
      urgency: "How urgent is it?",
      details: "Details",
      detailsPlaceholder:
        "Machine make/model, what's gone wrong, part numbers if you have them…",
    },
    urgencies: {
      emergency: "Emergency – machine is down",
      soon: "Within the next few days",
      quote: "Just after a quote",
    },
    errors: {
      name: "Please enter your name",
      phone: "Please enter a phone number we can reach you on",
      email: "Please enter a valid email address",
      service: "Please choose a service",
      urgency: "Please tell us how urgent it is",
      message: "Please give us a few more details",
    },
    send: "Send enquiry",
    sending: "Sending…",
    privacy: "We only use your details to respond to your enquiry.",
    sentTitle: "Thanks, your enquiry has been sent",
    sentText:
      "We'll be in touch as soon as possible. If your machine is down, call us on",
    sendAnother: "Send another enquiry",
    errorTitle: "Sorry, your enquiry couldn't be sent",
    errorText: "Please try again, or call us on",
    detailsLabel: "Contact details",
    emergencyKicker: "Machine down?",
    emergencyTitle: "Call for emergency call‑outs",
    phone: "Phone",
    email: "Email",
    basedIn: "Based in",
    openingHours: "Opening hours",
    areasWeCover: "Areas we cover",
  },

  services,
  sectors,
  benefits,
}

export type Content = typeof en
