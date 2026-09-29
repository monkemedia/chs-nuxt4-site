import type { Job, JobText } from "./jobs"

// DEV PREVIEW ONLY. Placeholder jobs so the design can be seen under `npm run dev` before
// real jobs exist. useJobs() only uses these when `import.meta.dev` is true, so they are never
// included in a production build. Never copy these into jobs.ts.

const sample = (n: number, lang: "en" | "cy"): JobText =>
  lang === "en"
    ? {
        title: `Sample job ${n}: a real job title goes here`,
        summary:
          "Sample summary. A real job would say what the machine was, what had gone wrong and how quickly it was back at work.",
        machine: "Sample machine",
        location: "Sample town",
        problem:
          "Sample text. The symptoms the customer saw and what CHS found when it came in.",
        work: [
          "Sample step: stripped and inspected",
          "Sample step: parts repaired or replaced",
          "Sample step: rebuilt and tested",
        ],
        result:
          "Sample text. How long it took and how the machine is running now.",
        imageAlt: "Sample photo",
      }
    : {
        title: `Swydd enghreifftiol ${n}: teitl swydd go iawn yma`,
        summary:
          "Crynodeb enghreifftiol. Byddai swydd go iawn yn dweud beth oedd y peiriant, beth aeth o'i le a pha mor gyflym roedd yn ôl yn gweithio.",
        machine: "Peiriant enghreifftiol",
        location: "Tref enghreifftiol",
        problem:
          "Testun enghreifftiol. Y symptomau a welodd y cwsmer a beth ddaeth CHS o hyd iddo.",
        work: [
          "Cam enghreifftiol: datgymalu ac archwilio",
          "Cam enghreifftiol: atgyweirio neu newid rhannau",
          "Cam enghreifftiol: ailadeiladu a phrofi",
        ],
        result:
          "Testun enghreifftiol. Faint o amser a gymerodd a sut mae'r peiriant yn rhedeg nawr.",
        imageAlt: "Llun enghreifftiol",
      }

const job = (n: number, service: string, image: string, date: string): Job => ({
  slug: `sample-job-${n}`,
  date,
  service,
  image,
  published: true,
  en: sample(n, "en"),
  cy: sample(n, "cy"),
})

export const sampleJobs: Job[] = [
  job(1, "ram-repairs", "/images/rams.jpg", "2026-09-10"),
  job(2, "hydraulic-hoses", "/images/hoses.jpg", "2026-08-22"),
  job(3, "hydraulic-system-repairs", "/images/systems.jpg", "2026-08-05"),
  job(4, "ram-repairs", "/images/rams.jpg", "2026-07-18"),
]
