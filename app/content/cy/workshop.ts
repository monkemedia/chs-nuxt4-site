import type { Content } from "../en"
import type { Overrides } from "../overrides"

// Welsh workshop-only copy. Same keys as ../en/workshop.ts.
// Drafted translation: have it checked by a fluent Welsh speaker before launch.

export const workshop: Overrides<Content> = {
  footer: {
    blurb:
      "Atgyweirio hydrolig a chyflenwi pibellau o'n gweithdy yn Cross Hands, ar draws Llanelli, Sir Gâr a De Cymru.",
  },
  business: {
    hours: { 2: null },
  },
  cta: {
    text: "Mae pob awr y mae peiriant yn segur yn costio arian i chi. Ffoniwch nawr ac fe ddywedwn ni wrthoch chi'n syth pa mor gyflym y gallwn ni ei drwsio.",
  },
  home: {
    seo: {
      description:
        "Pibellau hydrolig tra byddwch yn aros, atgyweirio rams a chanfod namau yn ein gweithdy yn Cross Hands, ar gyfer Llanelli, Sir Gâr a De Cymru.",
    },
    heroCopy:
      "Arbenigwyr atgyweirio hydrolig a chyflenwi pibellau i gwsmeriaid peiriannau, amaeth, masnachol a diwydiannol, o'n gweithdy yn Cross Hands ar gyfer Llanelli, Sir Gâr a De Cymru.",
    trust: { 1: ["Pibellau tra", "byddwch yn aros"] },
  },
  servicesPage: {
    seo: {
      description:
        "Newid pibellau, atgyweirio rams a silindrau a chanfod namau hydrolig yn ein gweithdy yn Cross Hands, ar gyfer Llanelli, Sir Gâr a De Cymru.",
    },
    intro:
      "Newid pibellau, atgyweirio rams a chanfod namau o'n gweithdy yn Cross Hands, ar gyfer Llanelli, Sir Gâr a De Cymru.",
  },
  about: {
    seo: {
      description:
        "Busnes atgyweirio a chyflenwi offer hydrolig gyda gweithdy yn Cross Hands, Sir Gâr, yn gwasanaethu Llanelli a De Cymru yw CHS Hydraulics.",
    },
    who: {
      2: "Mae popeth yn cael ei wneud yn ein gweithdy yn Cross Hands, lle mae'r rhan fwyaf o bibellau'n cael eu gwneud tra byddwch yn aros a rams yn cael eu datgymalu, eu harchwilio a'u hailadeiladu yn fewnol.",
    },
    vanAlt: "Fan CHS Hydraulics",
    facts: {
      2: { value: "Tra byddwch yn aros", label: "Y rhan fwyaf o bibellau" },
    },
    waysKicker: "Yn ein gweithdy",
    waysTitle: "Pibellau wedi'u gwneud, rams wedi'u hailadeiladu",
    ways: {
      0: {
        title: "Pibellau tra byddwch yn aros",
        text: "Dewch â'r hen bibell i'n gweithdy yn Cross Hands ac fe wnawn ni un newydd i gyd-fynd tra byddwch yn aros, ar gyfer y rhan fwyaf o feintiau safonol.",
      },
      1: {
        icon: "i-lucide-cylinder",
        title: "Rams wedi'u hailadeiladu'n fewnol",
        text: "Mae rams sy'n gollwng neu'n llithro yn cael eu datgymalu, eu harchwilio, eu hail-selio a'u hailadeiladu yn ein gweithdy, ac yn cael eu gwirio cyn dod yn ôl atoch chi.",
        link: {
          label: "Atgyweirio rams a silindrau",
          to: "/services/ram-repairs",
        },
      },
    },
  },
  why: {
    seo: {
      description:
        "{years} mlynedd o brofiad, pibellau tra byddwch yn aros, prisiau wedi'u cytuno ymlaen llaw: pam mae ffermydd a gweithredwyr peiriannau Llanelli a Sir Gâr yn dewis CHS.",
    },
    promises: { 4: "Cyngor gonest ynghylch atgyweirio neu newid" },
    steps: {
      1: {
        text: "Yn ein gweithdy, rydyn ni'n dod o hyd i'r gwir achos, nid y symptom yn unig.",
      },
    },
  },
  contact: {
    seo: {
      description:
        "Cysylltwch â CHS Hydraulics i newid pibellau, atgyweirio rams a chanfod namau hydrolig yn ein gweithdy yn Cross Hands, ar gyfer Llanelli a Sir Gâr.",
    },
    kicker: { 2: "Atgyweirio" },
    emergencyTitle: "Ffoniwch ni am waith atgyweirio brys",
  },
  services: [
    {
      slug: "hydraulic-hoses",
      metaDescription:
        "Pibellau hydrolig wedi'u gwneud tra byddwch yn aros yn ein gweithdy yn Cross Hands, gyda ffitiadau cyfatebol a diogelwch pibellau. Llanelli, Sir Gâr a De Cymru.",
      lead: "Pibell wedi byrstio neu'n gollwng? Rydyn ni'n gwneud pibellau hydrolig newydd tra byddwch yn aros yn ein gweithdy yn Cross Hands.",
      intro: { 1: null },
      includes: { 5: null },
      process: {
        0: {
          title: "Dewch â hi i mewn",
          text: "Dewch â'r hen bibell i'n gweithdy yn Cross Hands, neu ffoniwch yn gyntaf er mwyn i ni wirio bod gennym bopeth sydd ei angen.",
        },
      },
      faqs: {
        1: {
          a: "Mae'n help, gan ein bod yn gallu cyfateb yr hyd a'r ffitiadau'n union. Os na allwch ei thynnu, dywedwch wrthym wneuthuriad a model y peiriant ac fe wnawn ni eich cynghori.",
        },
        2: null,
      },
    },
    {
      slug: "ram-repairs",
      process: { 0: { text: "Dewch â'r ram i'n gweithdy yn Cross Hands." } },
    },
    {
      slug: "hydraulic-system-repairs",
      lead: "System hydrolig araf, gwan, swnllyd neu sy'n gorboethi? Rydyn ni'n dod o hyd i'r achos ac yn ei atgyweirio yn ein gweithdy.",
      intro: {
        1: "Rydyn ni'n canfod namau ac yn atgyweirio systemau a chydrannau hydrolig peiriannau adeiladu, amaethyddol, masnachol a diwydiannol yn ein gweithdy yn Cross Hands.",
      },
      process: {
        0: {
          text: "Ffoniwch gyda manylion y peiriant a beth mae'n ei wneud, er mwyn i ni eich cynghori ar y cam nesaf.",
        },
      },
      faqs: { 2: null },
    },
  ],
  benefits: {
    0: {
      icon: "i-lucide-map-pin",
      title: ["Gweithdy yn", "Cross Hands"],
      summary:
        "Hawdd ei gyrraedd o Lanelli, Caerfyrddin, Rhydaman ac Abertawe.",
      detail:
        "Mae ein gweithdy yn Cross Hands, yn agos at Lanelli, Caerfyrddin, Rhydaman ac Abertawe, felly dydy help byth yn bell. Ffoniwch ymlaen llaw a bydd popeth yn barod.",
    },
  },
}
