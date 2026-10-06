import { areas } from "./areas"
import { benefits } from "./benefits"
import { sectors } from "./sectors"
import { services } from "./services"

// All English copy for the site. app/content/cy/index.ts must match this shape exactly
// (it's typed as `Content`), so `nuxt typecheck` fails if a Welsh string is missing.

export const en = {
  locale: "en",
  // dayjs locale for dates and times.
  dateLocale: "en-gb",

  common: {
    skipToContent: "Skip to main content",
    primaryNav: "Primary navigation",
    mobileNav: "Mobile navigation",
    callChs: "Call CHS Hydraulics",
    callNow: "Call now",
    call: (phone: string) => `Call ${phone}`,
    sendEnquiry: "Send an enquiry",
    // Booking buttons (only while online booking is on).
    bookOnline: "Book online",
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
    jobs: "Recent work",
    careers: "Careers",
    hiring: "Hiring",
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
    privacy: "Privacy notice",
    areas: "Areas",
    accounts: "Trade accounts",
    login: "Customer login",
    track: "Track my repair",
    // Company details a company's website must show (Companies Act 2006).
    company:
      "CHS Hydraulics is a trading name of {legalName}, registered in England and Wales, company number {companyNumber}. Registered office: {registeredOffice}.",
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
    // Opening days and times come from app.config `openingHours`; these are the words
    // around them ("8am – 5.30pm") and extra rows shown after them on the contact page.
    am: "am",
    pm: "pm",
    // Preview build only: the hours shown aren't published yet.
    hoursDraftNote: "not published yet",
    // Holiday closure dates on the contact page, e.g. "Closed 24 Dec – 2 Jan".
    closedDates: (dates: string) => `Closed ${dates}`,
    // Days we don't open, on the contact page.
    closedDay: "Closed",
    hoursNotes: [
      { days: "Emergency call-outs", time: "Call for availability" },
    ],
  },

  cta: {
    kicker: "Need hydraulic support?",
    // "\n" = line break in the heading.
    title: "Let's keep\nyour equipment moving.",
    text: "Every hour a machine stands idle costs you money. Call now and we'll tell you straight away when we can be with you.",
  },

  // Certification badge (footer). Details come from app.config `business.certification`.
  certification: {
    certified: (standard: string) => `${standard} certified`,
    by: (body: string, accreditation: string) =>
      `Certified by ${body}, a ${accreditation}-accredited certification body`,
    number: (number: string) => `Certificate no. ${number}`,
    markAlt: (standard: string, body: string, accreditation: string) =>
      `${body} ${standard} certified, ${accreditation} accredited`,
  },

  // Live open/closed line next to call buttons (Europe/London time, from app.config openingHours).
  openStatus: {
    open: "Open now: call and speak to our team",
    closed: (opens: string) =>
      `Closed now, open ${opens}. Machine down? Call anyway.`,
    today: (time: string) => `today at ${time}`,
    tomorrow: (time: string) => `tomorrow at ${time}`,
    on: (day: string, time: string) => `${day} at ${time}`,
    // During a holiday closure; `reason` is set in the admin area, e.g. "Christmas".
    closedFor: (reason: string, opens: string) =>
      `Closed for ${reason}, open ${opens}. Machine down? Call anyway.`,
    // A closure coming up in the next week, under the open/closed line.
    closureNotice: (dates: string, reason: string) =>
      `Closed ${dates} for ${reason}.`,
    // Open, but closing within the hour.
    closesSoon: (time: string) => `Closing soon: closes at ${time}. Call now`,
  },

  // The Uptime Promise (shown only when app.config `offer.uptimePromise` is on).
  uptimePromise: {
    kicker: "The Uptime Promise",
    title: "On-site within {hours} hours, or the call-out's free.",
    text: "If we're not with you within {hours} hours of your call, you don't pay the call-out charge. Simple as that.",
    terms:
      "Applies to breakdown call-outs in our core area (Carmarthenshire and Llanelli) during opening hours. Time runs from when we confirm your call-out.",
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
    heroCopy:
      "Expert hydraulic repair, hose supply and on-site service for plant, agriculture, commercial and industrial customers across Llanelli, Carmarthenshire and South Wales.",
    heroImageAlt: "Red hydraulic cylinder with polished ram and hoses",
    keyBenefits: "Key benefits",
    trust: [
      ["{years} years'", "experience"],
      ["On-site within", "{hours} hours"],
      ["Price agreed", "up front"],
    ] as [string, string][],
    servicesTitle: "Complete hydraulic solutions",
    servicesIntro:
      "From emergency hose replacements to full system repairs, we keep your equipment running with minimal downtime.",
    whyKicker: "Why choose CHS",
    whyTitle: ["{years} years trusted.", "Fixed fast. Priced honestly."] as [
      string,
      string,
    ],
    whyText:
      "Farmers and plant operators across South Wales have trusted us for {years} years. No hidden costs, no upselling: just fixed, fast and honest.",
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
    vanAlt: "CHS Hydraulics mobile service van on site",
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

  errorPage: {
    notFound: {
      kicker: "Error 404",
      title: ["Pressure", "lost."] as [string, string],
      text: "This page has sprung a leak. It may have moved, or it never existed. Let's get you back to something that works.",
    },
    server: {
      kicker: "Something went wrong",
      title: ["Blown", "a seal."] as [string, string],
      text: "Something failed on our side. Try again in a minute, or give us a call and we'll help straight away.",
    },
    home: "Back to the homepage",
    tryThese: "Try one of these",
    gaugeUnit: "bar",
    gaugeLabel: (code: number) =>
      `Pressure gauge reading zero, showing error ${code}`,
  },

  recentJobs: {
    kicker: "Recent work",
    title: "Jobs we've done lately",
    moreKicker: "More recent work",
    moreTitle: "Other work we've done",
    serviceKicker: "Recent work",
    serviceTitle: "Jobs like this",
    viewAll: "View all our work",
    listLabel: "Recent work",
  },

  jobsPage: {
    seo: {
      title: "Recent Hydraulic Repairs Llanelli & Carmarthenshire | CHS",
      description:
        "Real hydraulic repair jobs from our Cross Hands workshop: the machine, the fault and how we fixed it, for customers across Llanelli and Carmarthenshire.",
    },
    crumb: "Recent work",
    title: ["Recent", "work"] as [string, string],
    intro:
      "Real work from our Cross Hands workshop: the machine, what had gone wrong and how we got it back to work.",
    cta: {
      kicker: "Got a job for us?",
      title: "Tell us what's happening.",
      text: "Describe the problem and we'll tell you how we can help.",
    },
  },

  jobPage: {
    notFound: "Job not found",
    details: "Job details",
    machine: "Machine",
    location: "Location",
    completed: "Completed",
    service: "Service",
    problem: "The problem",
    whatWeDid: "What we did",
    result: "The result",
    similarProblem: "Similar problem?",
    // Preview build only (NUXT_PUBLIC_SHOW_DRAFTS): shown on jobs that aren't live yet.
    draft: "Draft",
    draftNote: "Not live yet: press Publish in the admin area when it's ready.",
    // Only shown on the Welsh site, for jobs without a Welsh version.
    englishOnly: "Only available in English",
    ctaKicker: "Based in Cross Hands, Carmarthenshire",
    ctaText:
      "Serving Llanelli, Carmarthen, Ammanford, Swansea and across South Wales.",
  },

  careersPage: {
    seo: {
      title: "Hydraulic Jobs in Cross Hands, Llanelli | Careers at CHS",
      description:
        "Current vacancies at CHS Hydraulics: hydraulic engineering jobs and apprenticeships at our Cross Hands workshop, near Llanelli in Carmarthenshire.",
    },
    crumb: "Careers",
    title: ["Work at", "CHS"] as [string, string],
    intro:
      "Join the team keeping South Wales's plant, farm and industrial machinery working, from our workshop in Cross Hands.",
    listKicker: "Current vacancies",
    listTitle: "Roles we're hiring for",
    whyKicker: "Why join us",
    whyTitle: "A skilled trade, close to home",
    // Drafted: check each point with CHS before the page goes live.
    why: [
      {
        icon: "i-lucide-wrench",
        title: "Varied work",
        text: "Cylinders, pumps, valves and hoses from diggers, tractors and factory lines: no two days the same.",
      },
      {
        icon: "i-lucide-graduation-cap",
        title: "Learn from experience",
        text: "Work alongside engineers with {years} years of hydraulic know-how between them.",
      },
      {
        icon: "i-lucide-map-pin",
        title: "Local",
        text: "Based in Cross Hands, an easy commute from Llanelli, Ammanford and Carmarthen.",
      },
    ],
    cta: {
      kicker: "Nothing that fits?",
      title: "Send us your CV anyway.",
      text: "We're always glad to hear from good hydraulic engineers and fitters.",
      button: "Email your CV",
      emailSubject: "CV",
    },
  },

  vacancyPage: {
    notFound: "Vacancy not found",
    details: "Role details",
    type: "Type",
    types: {
      "full-time": "Full-time",
      "part-time": "Part-time",
      apprenticeship: "Apprenticeship",
      temporary: "Temporary",
    },
    pay: "Pay",
    payRange: (min: string, max: string | undefined, period: "year" | "hour") =>
      `${max ? `${min} to ${max}` : min} ${period === "year" ? "a year" : "an hour"}`,
    hours: "Hours",
    location: "Location",
    locationValue: "Cross Hands workshop",
    posted: "Posted",
    closes: "Closing date",
    about: "About the role",
    responsibilities: "What you'll do",
    requirements: "What we're looking for",
    niceToHave: "Nice to have",
    offer: "What we offer",
    applyKicker: "Interested?",
    applyTitle: "Apply for this role",
    applyText:
      "Email your CV and a few lines about yourself, or give us a call for a chat first.",
    applyByEmail: "Email your CV",
    emailSubject: (title: string) => `Application: ${title}`,
    draft: "Draft",
    draftNote:
      "Not live yet: press Publish in the admin area when it's ready. With no vacancies in the admin area, examples show here.",
  },

  // Privacy notice (UK GDPR). Drafted from what the site and the business do with personal
  // data: check it with CHS, fill in the [brackets] (the build warns until then), and update
  // `updated` whenever it changes.
  privacyPage: {
    seo: {
      title: "Privacy Notice | CHS Hydraulics, Cross Hands, Llanelli",
      description:
        "How CHS Hydraulics in Cross Hands, Llanelli uses the details you give us when you call, email, send an enquiry or apply for a job.",
    },
    crumb: "Privacy",
    title: ["Privacy", "notice"] as [string, string],
    intro:
      "What we do with your details when you call us, email us, send an enquiry or apply for a job. In short: we only use them to help you, we never sell them, and this website doesn't use cookies.",
    updated: "2026-10-05",
    updatedLabel: (date: string) => `Last updated ${date}`,
    sections: [
      {
        title: "Who we are",
        text: [
          'This website is run by {legalName}, trading as CHS Hydraulics, of {address}. We\'re responsible for your personal information (the "controller" under UK data protection law).',
          "Questions about your information? Email {email} or call {phone}. We're registered with the Information Commissioner's Office (ICO), registration number [ICO registration number].",
        ],
        list: [] as string[],
      },
      {
        title: "What we collect and why",
        text: [] as string[],
        list: [
          "Enquiries: when you use our contact form we receive your name, phone number, email address and anything else you choose to tell us (your company, location, the service you need, how urgent it is and your message). We use it to reply, quote and do the work.",
          "Calls and emails: your contact details and what you tell us, for the same reasons.",
          "Customers: the details we need to do the job, invoice you and keep proper records.",
          "Job applications: your CV and anything you send with it, used only to consider you for the role.",
        ],
      },
      {
        title: "Our legal basis",
        text: [
          "We use enquiry and customer details to take the steps you've asked for before a contract and to carry it out, and in our legitimate interest in running the business and answering people who contact us. We keep accounting records because the law requires it. Job applications are used to consider you for work you've applied for.",
        ],
        list: [] as string[],
      },
      {
        title: "Who we share it with",
        text: [
          "We never sell your information or use it for marketing you haven't asked for. We only share it with services that help us run the business, under contract, and only what they need:",
        ],
        list: [
          "[Form service], which delivers messages from our contact form to our inbox.",
          "Our email and accounting providers.",
          "Fergus, our job management system: online bookings go straight into it, with the details you give us.",
          "Resend, which sends our booking confirmation emails.",
          "Vercel, which hosts this website. It keeps short-term server logs, including IP addresses, for security.",
          "Plausible Analytics (see below).",
        ],
      },
      {
        title: "Website analytics and cookies",
        text: [
          "This website doesn't set any cookies. We use Plausible Analytics to count visits, see which pages are useful and whether people call or send an enquiry. Plausible doesn't use cookies, doesn't collect personal information and doesn't follow you across other websites.",
          "The map on our contact page only loads Google Maps if you click it. Google may then set its own cookies, covered by Google's privacy policy.",
        ],
        list: [] as string[],
      },
      {
        title: "How long we keep it",
        text: [] as string[],
        list: [
          "Enquiries that don't lead to work: [12 months].",
          "Customer and invoice records: 6 years after the end of the financial year, as HMRC requires.",
          "Job applications: [6 months] after the role is filled, unless you agree to us keeping yours longer.",
        ],
      },
      {
        title: "Your rights",
        text: [
          "You can ask for a copy of your information, ask us to correct or delete it, restrict or object to how we use it, or have it sent to you or someone else. Email {email} and we'll reply within one month. There's no charge.",
        ],
        list: [] as string[],
      },
      {
        title: "Complaints",
        text: [
          "If you're unhappy with how we've handled your information, please tell us first so we can put it right. You can also complain to the Information Commissioner's Office at ico.org.uk or on 0303 123 1113.",
        ],
        list: [] as string[],
      },
    ],
  },

  // Holding pages, shown on every URL while runtimeConfig `siteMode` is "coming-soon" or
  // "maintenance" (NUXT_PUBLIC_SITE_MODE). Preview them at /coming-soon and /maintenance.
  holding: {
    comingSoon: {
      seo: {
        title: "CHS Hydraulics | New Website Coming Soon",
        description:
          "Our new website is nearly ready. Hydraulic hose, ram and system repairs in Cross Hands, Llanelli: call {phone}.",
      },
      kicker: "New website on the way",
      title: ["Building", "pressure."] as [string, string],
      text: "Our new website is nearly ready. In the meantime we're open as usual: give us a call, send an email or drop in to the workshop in Cross Hands.",
      reading: "SOON",
      gaugeLabel: "Pressure gauge climbing to working pressure",
    },
    maintenance: {
      seo: {
        title: "CHS Hydraulics | Back Shortly",
        description:
          "Our website is down for a quick service. We're still open for hydraulic repairs in Cross Hands, Llanelli: call {phone}.",
      },
      kicker: "Down for maintenance",
      title: ["Routine", "service."] as [string, string],
      text: "We're giving the website a quick service and it'll be back shortly. The workshop is open as normal, so if a machine's down, call us now.",
      reading: "503",
      gaugeLabel:
        "Pressure gauge resting at zero while the website is serviced",
    },
    whatWeDo: "What we do",
    email: "Email us",
    findUs: "Find us",
  },

  // Town pages (/areas/<slug>; the towns themselves are in ./areas.ts).
  areaPage: {
    notFound: "Area not found",
    gettingHere: (fromTown: string) => `Getting to us ${fromTown}`,
    distance: "Distance",
    time: "Drive",
    route: "Route",
    directions: "Get directions",
    servicesTitle: "What we can do for you",
    // Fills the services grid when there's an odd number of services.
    photoCard: {
      kicker: "Not sure what you need?",
      title: "Send us a photo",
      text: "Email a photo of the hose, ram or fitting, with any markings you can see, and we'll tell you what it needs before you make the trip.",
      button: "Email a photo",
      emailSubject: "Photo for a quote",
    },
    nearbyTitle: "Also close to",
    faqTitle: "Common questions",
    jobsKicker: "Local work",
    jobsTitle: (inTown: string) => `Recent jobs ${inTown}`,
    ctaKicker: (town: string) => `Hydraulic repairs for ${town}`,
  },

  // Booking request (/book): planned work only. Fields shared with the contact form (name,
  // phone, email…) use contact.fields.
  bookPage: {
    seo: {
      title: "Book a Hydraulic Repair Drop-off | Cross Hands, Llanelli",
      description:
        "Book a drop-off at our Cross Hands workshop for a ram rebuild, a hose or a pre-season hydraulic check. Serving Llanelli, Carmarthenshire and South Wales.",
    },
    crumb: "Book",
    fields: {
      machine: "Machine",
      machinePlaceholder: "e.g. JCB 3CX, John Deere 6155R",
      details: "Anything we should know",
      detailsPlaceholder:
        "What's wrong, or what you'd like checked, and any part numbers.",
    },
    // Live booking (the slot picker), shown when live booking is on.
    live: {
      kicker: ["Repair", "Service", "Supply"],
      title: ["Book a hydraulic", "repair"] as [string, string],
      intro:
        "Pick a time that suits you and you're booked straight into our diary. Machine down right now? Call us instead.",
      benefits: [
        {
          icon: "i-lucide-clock",
          title: "Choose a time",
          text: "Pick a slot that suits you",
        },
        {
          icon: "i-lucide-calendar-check",
          title: "Straight into our diary",
          text: "No waiting for a call back",
        },
        {
          icon: "i-lucide-badge-pound-sterling",
          title: "Price agreed up front",
          text: "We tell you the cost before we start",
        },
        {
          icon: "i-lucide-shield-check",
          title: "Expert support",
          text: "{years} years of hydraulic know-how",
        },
      ],
      steps: [
        { title: "Service", text: "Choose the job" },
        { title: "Date & time", text: "Pick a slot" },
        { title: "Your details", text: "Tell us about it" },
      ],
      serviceTitle: "1. What do you need?",
      serviceText: "Choose the job you're booking in.",
      services: {
        hose: {
          title: "Hose made up",
          text: "About 30 minutes, while you wait",
        },
        check: {
          title: "Pre-season check",
          text: "About an hour, before silage or harvest",
        },
        onsite: {
          title: "On-site visit",
          text: "We come to you: about 2 hours plus travel",
        },
        dropoff: {
          title: "Ram or component drop-off",
          text: "Drop it off in the morning window",
        },
      },
      otherPrompt: "Something else, or no time that suits?",
      otherLink: "Send us an enquiry instead",
      dateTitle: "2. Choose a date & time",
      dateText:
        "Pick a day, then a time to bring it to our Cross Hands workshop.",
      dateTextOnsite: "Pick a day, then a time for us to come to you.",
      locationLabel: "Where's the machine?",
      locationPlaceholder: "Site address or postcode",
      locationError: "Please tell us where the machine is",
      comingTo: "We'll come to:",
      previousMonth: "Previous month",
      nextMonth: "Next month",
      timesTitle: "Available times",
      chooseDay: "Choose a day to see the times.",
      dropoffWindow: (from: string, to: string) => `Drop off ${from} – ${to}`,
      loading: "Checking the diary…",
      none: "No free times online in the next four weeks. Give us a call and we'll fit you in.",
      failed:
        "We can't load the diary right now. Call us, or send us an enquiry instead.",
      urgentTitle: "Need an urgent slot?",
      urgentText:
        "If your machine is down and you need it sooner, call us directly on",
      nextStep: "Next step",
      detailsTitle: "3. Your details",
      detailsText: "So we know who's coming and what to expect.",
      confirm: "Confirm booking",
      booking: "Booking…",
      taken: "Sorry, that time has just been taken. Please choose another.",
      summary: {
        title: "Your booking",
        service: "Service",
        when: "Date & time",
        details: "Your details",
        notChosen: "Not chosen yet",
        notCompleted: "Not completed",
        change: "Change",
      },
      help: {
        title: "Need help choosing?",
        text: "Not sure which you need? Our team can help.",
      },
      doneTitle: "You're booked in",
      doneText: (when: string) =>
        `We've put you in our diary for ${when}. If anything changes, call us on`,
      bringTo: "Bring it to our workshop:",
      bookAnother: "Make another booking",
      addToCalendar: "Add to calendar",
      googleCalendar: "Google Calendar",
      emailed: (email: string) => `We've emailed a confirmation to ${email}.`,
      calendarTitle: (service: string) => `CHS Hydraulics: ${service}`,
      calendarDescription: (phone: string) =>
        `Booked online with CHS Hydraulics. To change or cancel, call ${phone}.`,
    },
    // Confirmation email to the customer (server/api/booking), in their language.
    email: {
      subject: (service: string, when: string) =>
        `Booking confirmed: ${service}, ${when}`,
      greeting: (name: string) => `Hi ${name},`,
      intro: "You're booked in with CHS Hydraulics. Here are the details:",
      service: "Service",
      when: "When",
      where: "Where",
      bringTitle: "What to bring",
      bring: {
        hose: "The old hose, with its fittings if you can, so we can match the length, pressure rating and ends.",
        check:
          "The machine, with any faults you've noticed written down. Give us a ring if it's too big to bring in.",
        dropoff:
          "The ram or component, and the make and model of the machine it came off.",
        onsite:
          "Nothing: we'll come to you. Please make sure we can get to the machine safely.",
      },
      change: "Need to change or cancel? Call us on",
      orReply: "or reply to this email.",
      calendarNote: "A calendar invite is attached.",
      track: (jobNo: string, url: string) =>
        `Your job number is ${jobNo}. Follow its progress at ${url}`,
      signoff: "Thanks,",
      team: "The CHS Hydraulics team",
    },
  },

  // Trade accounts (/accounts).
  // CHECK WITH CHS: the benefits must match how CHS works (and what Fergus does). Fill in the
  // [payment terms]; the build warns while it's in brackets.
  accountsPage: {
    seo: {
      title: "Trade Accounts for Plant Hire & Farms | CHS Hydraulics",
      description:
        "Open a trade account with CHS Hydraulics in Cross Hands: hydraulic repairs for plant hire firms, contractors and farms across Llanelli and South Wales.",
    },
    crumb: "Trade accounts",
    title: ["Trade", "accounts"] as [string, string],
    intro:
      "For plant hire firms, contractors and farms who rely on their machines: one place for every hose, ram and repair.",
    whoKicker: "Who it's for",
    whoTitle: "For businesses that run machines",
    who: [
      {
        icon: "i-lucide-construction",
        title: "Plant hire firms",
        text: "Diggers, dumpers and telehandlers back out on hire, with the paperwork sorted.",
      },
      {
        icon: "i-lucide-hard-hat",
        title: "Contractors",
        text: "Crews stood waiting cost money. We'll tell you straight what it needs and when it'll be ready.",
      },
      {
        icon: "i-lucide-tractor",
        title: "Farms",
        text: "Tractors, loaders and implements kept working, especially through silage and harvest.",
      },
    ],
    benefitsKicker: "What you get",
    benefitsTitle: "Why open an account",
    benefits: [
      {
        icon: "i-lucide-receipt-text",
        title: "Pay on account",
        text: "Pay on invoice instead of on the day: [payment terms, e.g. 30 days from invoice].",
      },
      {
        icon: "i-lucide-clipboard-list",
        title: "Your machines on record",
        text: 'We keep a record of the hoses and repairs we do for your machines, so "the same as last time" is easy.',
      },
      {
        icon: "i-lucide-message-circle",
        title: "Kept posted",
        text: "We'll tell you where each job is up to and when it'll be ready.",
      },
      {
        icon: "i-lucide-badge-pound-sterling",
        title: "Price agreed up front",
        text: "We tell you what's wrong and what it'll cost before we start.",
      },
    ],
    stepsTitle: "Opening an account",
    steps: [
      {
        title: "Get in touch",
        text: "Call or email with your business name and the machines you run.",
      },
      {
        title: "We set you up",
        text: "We'll take your details and agree your terms.",
      },
      {
        title: "Send work our way",
        text: "Drop it off or call, and give your account name.",
      },
    ],
    ctaTitle: "Open an account",
    ctaText: "Call or email us and we'll get you set up.",
    emailButton: "Email us",
    emailSubject: "Trade account enquiry",
    loginPrompt: "Already have an account?",
    loginLink: "Log in",
  },

  // Customer login (/login): a gateway to the Fergus customer portal. Only shown once
  // NUXT_PUBLIC_FERGUS_PORTAL_URL is set; never indexed or in the sitemap.
  trackPage: {
    seo: {
      title: "Track My Repair | CHS Hydraulics, Cross Hands",
      description:
        "Check how your hydraulic repair is getting on at CHS Hydraulics in Cross Hands, Llanelli: enter your job number to see its progress.",
    },
    crumb: "Track my repair",
    title: ["Track my", "repair"] as [string, string],
    intro:
      "See where your job is up to. You'll find your job number on your booking email or job card.",
    formTitle: "Find your job",
    fields: {
      jobNo: "Job number",
      contact: "Email or phone number",
    },
    jobNoHelp: "A short number, like 1234, on your booking email or job card.",
    contactHelp: "The one you gave us when you booked.",
    submit: "Check progress",
    errors: {
      jobNo: "Enter your job number: numbers only, like 1234",
      jobNoPhone:
        "That looks like a phone number: put it in the box below. Your job number is a short number, like 1234.",
      contact: "Enter your email or phone number",
    },
    notFound:
      "We couldn't find a job with those details. Check the job number and use the email or phone number you booked with.",
    tooMany: "Too many attempts. Please wait a few minutes, or give us a call.",
    failed:
      "We couldn't check right now. Please try again shortly, or call us.",
    jobLabel: "Job {jobNo}",
    updated: "Last updated {date}",
    stages: {
      booked: {
        title: "Booked in",
        text: "Your job is in our diary.",
      },
      assessing: {
        title: "Assessing",
        text: "We're looking at what's needed and pricing it up.",
      },
      working: {
        title: "In the workshop",
        text: "We're working on it now.",
      },
      done: {
        title: "Work complete",
        text: "The work is done. Call us to arrange collection.",
      },
    },
    current: "Current stage",
    onHold:
      "On hold: we're waiting on something (usually parts or your go-ahead). We'll be in touch.",
    quoteSent:
      "We've sent you a quote. Let us know if you'd like us to go ahead.",
    updatesTitle: "Updates from the workshop",
    photosTitle: "Photos",
    photoAlt: "Photo from the workshop, {date}",
    openPhoto: "Open photo from {date}",
    previousPhoto: "Previous photo",
    nextPhoto: "Next photo",
    mechanic: "Your mechanic: {name}",
    another: "Check another job",
    help: "Questions about your job? Call us on",
  },

  loginPage: {
    seo: {
      title: "Customer Login | CHS Hydraulics",
      description: "Log in to see your jobs and invoices with CHS Hydraulics.",
    },
    crumb: "Customer login",
    title: ["Customer", "login"] as [string, string],
    intro:
      "Check where your jobs are up to and see your invoices in our customer portal.",
    button: "Log in to your account",
    note: "You'll be taken to our secure customer portal, provided by Fergus.",
    noAccount: "Don't have an account yet?",
    accountsLink: "Find out about trade accounts",
    help: "Can't log in? Call us on",
  },

  about: {
    seo: {
      title: "About CHS | Hydraulic Engineers in Cross Hands, Llanelli",
      description:
        "CHS Hydraulics is a hydraulic repair and supply business in Cross Hands, Carmarthenshire, with a workshop and mobile unit serving Llanelli and South Wales.",
    },
    crumb: "About",
    title: ["About", "CHS"] as [string, string],
    intro:
      "A hydraulic repair and supply business in Cross Hands, Carmarthenshire, keeping plant, farm and industrial machinery working across South Wales.",
    whoKicker: "Who we are",
    whoTitle: "Hydraulic specialists, close to home",
    who: [
      "CHS Hydraulics repairs, services and supplies hydraulic equipment for customers across Llanelli, Carmarthenshire and South Wales.",
      "From a burst hose on an excavator to a leaking ram on a tractor loader or a fault on an industrial press, we find the problem, fix it properly and get you back to work.",
      "We run a workshop at Cross Hands and a fully equipped mobile service unit, so we can work wherever makes most sense for you and your machine.",
    ],
    vanAlt: "CHS Hydraulics mobile service van",
    // PLACEHOLDER story: replace the [bracketed] prompts with the real history (and cy/index.ts).
    storyKicker: "Our story",
    storyTitle: "Founded by {founder1} and {founder2}",
    story: [
      "[How CHS started: when and where {founder1} and {founder2} set up, and why. For example, what they did before and the need they saw for proper hydraulic repairs in Carmarthenshire.]",
      "[What they built over the years: the customers, machines and reputation behind the {years} years, and what makes CHS different.]",
      "[Where the business is now: who runs it today and how the founders' standards carry on.]",
    ],
    foundersCaption: "{founder1} & {founder2}",
    foundersRole: "Founders, CHS Hydraulics",
    foundersPhotoAlt: "{founder1} and {founder2}, founders of CHS Hydraulics",
    foundersPhotoPlaceholder: "[Photo of the founders]",
    foundersQuote:
      "[A short quote from the founders about how they've always worked, e.g. fix it properly, first time.]",
    // PLACEHOLDER milestones: replace [bracketed] entries with real ones (and cy/index.ts); add
    // or remove entries freely. `upcoming` entries show greyed out as "next"; `onsite` entries
    // only show when app.config `features.onsite` is on.
    timelineKicker: "Our history",
    timelineTitle: "How we got here",
    timelineText:
      "From the founders' first jobs to a new name, the milestones behind {years} years of keeping South Wales working.",
    timeline: [
      {
        date: "[Year]",
        title: "[Where the founders started]",
        description:
          "[The founders' background before CHS: the experience the {years} years builds on.]",
        icon: "i-lucide-hard-hat",
      },
      {
        date: "{founded}",
        title: "Crosshands Hydraulic Services founded",
        description:
          "[{founder1} and {founder2} set up in Cross Hands: what they started with and who their first customers were.]",
        icon: "i-lucide-flag",
      },
      {
        date: "[Year]",
        title: "[Milestone, e.g. a new workshop or equipment]",
        description: "[What changed and what it meant for customers.]",
        icon: "i-lucide-warehouse",
      },
      {
        date: "[Year]",
        title: "[Milestone, e.g. a major contract or new team member]",
        description: "[A sentence about it.]",
        icon: "i-lucide-handshake",
      },
      {
        date: "2026",
        title: "Rebranded as CHS Hydraulics",
        description:
          "The same business and the same standards, with a new name and a new look.",
        icon: "i-lucide-sparkles",
      },
      {
        date: "[Year]",
        title: "On-site service launches",
        description:
          "Our fully equipped mobile unit brings the workshop to your site, farm or yard.",
        icon: "i-lucide-truck",
        upcoming: true,
        onsite: true,
      },
    ],
    factsLabel: "CHS at a glance",
    // {founded} is business.foundingYear (1991): confirm with the business.
    facts: [
      { value: "{founded}", label: "Established" },
      { value: "Cross Hands", label: "Workshop base" },
      { value: "Mobile", label: "On-site service unit" },
      { value: "South Wales", label: "Area we cover" },
      { value: "{standard}", label: "Quality certified" },
    ],
    // The customer-facing version of the Purpose in Notion ("Purpose, Mission, Vision &
    // Values"). The machine stays in the sentence so the page is still clearly about repairs.
    valuesKicker: "Why we do it",
    valuesTitle: "Every broken machine has someone waiting on it",
    valuesIntro:
      "A broken machine is never just a machine. It's a crew stood waiting, a harvest on hold or a production line losing money. We fix it properly, keep you in the picture and get you back to work.",
    values: [
      {
        icon: "i-lucide-badge-pound-sterling",
        title: "Price agreed up front",
        text: "We tell you what's wrong and what it'll cost before we start. No hidden costs, no upselling.",
      },
      {
        icon: "i-lucide-circle-check-big",
        title: "Fixed properly, first time",
        text: "{years} years of hands-on hydraulic work means we find the real fault, not just the symptom.",
      },
      {
        icon: "i-lucide-message-circle",
        title: "We keep you posted",
        text: "A stopped machine costs you money, so we treat every job as urgent and tell you where it's up to and when it'll be ready.",
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
        "Hydraulic repairs for construction plant, farms, industry, manufacturing and commercial vehicles across Llanelli, Carmarthenshire and South Wales.",
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
      title: "Why CHS | Hydraulic Repairs in Llanelli & Carmarthenshire",
      description:
        "{years} years' experience, on-site within {hours} hours, prices agreed up front: why farms and plant operators across Llanelli and Carmarthenshire choose CHS.",
    },
    crumb: "Why CHS",
    title: ["Minimum downtime.", "Maximum support."] as [string, string],
    intro:
      "Why businesses across Llanelli, Carmarthenshire and South Wales trust CHS with their hydraulics.",
    reasonsKicker: "Why choose CHS",
    reasonsTitle: "Four reasons customers come back",
    reviewsKicker: "Customer reviews",
    // "\n" = line break in the heading.
    reviewsTitle: "Don't just\ntake our word for it",
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
      "{standard} certified quality processes, audited every year",
    ],
    stepsKicker: "How it works",
    stepsTitle: "From breakdown\nto back at work",
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
    bookBox: {
      kicker: "Planned work?",
      title: "Book a time that suits you",
      text: "Hoses, pre-season checks and drop-offs can be booked online, straight into our diary.",
    },
    seo: {
      title: "Contact CHS Hydraulics | Cross Hands, Llanelli",
      description:
        "Contact CHS Hydraulics for hose replacement, ram repairs, fault finding and on-site call-outs across Llanelli and Carmarthenshire.",
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
    privacyLink: "Read our privacy notice",
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
    address: "Address",
    openingHours: "Opening hours",
    areasWeCover: "Areas we cover",
    map: {
      kicker: "Visit the workshop",
      title: "Find us",
      previewAlt: "Map of Cross Hands showing where CHS Hydraulics is",
      show: "Show interactive map",
      // Shown under the button: the live map comes from Google.
      note: "Loads Google Maps, which may set cookies.",
      iframeTitle: "Google map showing CHS Hydraulics, 3 Acer Court",
      directions: "Get directions",
      findingUs: "Finding us",
      // PLACEHOLDER: real directions from the main road (and cy/index.ts).
      findingUsText:
        "[How to find the unit: e.g. which junction or roundabout to turn at, where Acer Court is on the estate, and where to park.]",
      attribution: "© OpenStreetMap contributors",
    },
  },

  services,
  sectors,
  benefits,
  areas,
}

export type Content = typeof en
