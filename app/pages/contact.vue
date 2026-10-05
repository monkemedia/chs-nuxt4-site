<script setup lang="ts">
import * as z from "zod"
import type { FormSubmitEvent } from "@nuxt/ui"
import { useMounted } from "@vueuse/core"
import { contentByLocale } from "~/content"
const { business } = useAppConfig()
const content = useContent()
const mounted = useMounted()
const localePath = useLocalePath()
const booking = useBookingLink()
const page = computed(() => content.value.contact)
const { status, result, gotcha, send } = useEnquirySubmit({
  subject: "New website enquiry – CHS Hydraulics",
  event: "Enquiry Sent",
})
const { week, closures, draft: hoursDraft } = useOpeningHours()

usePageSeo({ ...page.value.seo, path: "/contact" })

const serviceOptions = computed(() => [
  ...content.value.services.map((s) => ({ value: s.slug, label: s.h1 })),
  { value: "other", label: page.value.fields.somethingElse },
])

// Urgency is stored as a key; the business always receives the English label.
type UrgencyKey = keyof typeof contentByLocale.en.contact.urgencies
const urgencyKeys: UrgencyKey[] = ["emergency", "soon", "quote"]
const urgencyItems = computed(() =>
  urgencyKeys.map((key) => ({ value: key, label: page.value.urgencies[key] })),
)

const schema = computed(() => {
  const errors = page.value.errors
  return z.object({
    name: z.string().trim().min(1, errors.name),
    company: z.string().trim().optional(),
    phone: z.string().trim().min(6, errors.phone),
    email: z.email(errors.email),
    service: z.string({ error: errors.service }).min(1, errors.service),
    location: z.string().trim().optional(),
    urgency: z.enum(["emergency", "soon", "quote"], { error: errors.urgency }),
    message: z.string().trim().min(10, errors.message),
  })
})
type Schema = z.output<typeof schema.value>

const initialState = (): Partial<Schema> => ({
  name: "",
  company: "",
  phone: "",
  email: "",
  service: undefined,
  location: "",
  urgency: "soon",
  message: "",
})
const state = reactive(initialState())

// Service links elsewhere on the site point here with ?service=<slug>. This page is
// prerendered at /contact, so on a direct load the router briefly reports no query while
// hydrating; watch the live route so the value is picked up once it's restored.
const router = useRouter()
function preselect(requested: unknown) {
  if (
    typeof requested === "string" &&
    serviceOptions.value.some((s) => s.value === requested)
  )
    state.service = requested
}
onMounted(() => {
  preselect(router.currentRoute.value.query.service)
  watch(() => router.currentRoute.value.query.service, preselect)
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // The business always receives the English urgency label.
  const urgency = contentByLocale.en.contact.urgencies[event.data.urgency]
  const sent = await send(
    { ...event.data, urgency },
    { service: event.data.service, urgency },
  )
  if (sent) Object.assign(state, initialState())
}

// "Finding us" directions are a [placeholder] until the business supplies them.
if (import.meta.server && page.value.map.findingUsText.startsWith("["))
  console.warn(
    '[contact] "Finding us" directions are a placeholder: edit contact.map.findingUsText in app/content/<locale>/index.ts.',
  )

// Opening hours (admin area, else app.config) in the page's language, with days in a row that
// share the same hours grouped ("Monday – Friday: 8am – 5.30pm", "Sunday: Closed"), then
// notes such as emergency call-outs, then upcoming holiday closures.
// Holiday closures are listed from 30 days before they start. That depends on today's date,
// so it's worked out in the browser: the page is prerendered and only rebuilt on publish,
// so a closure added months ahead still appears on time. (Structured data lists them all.)
const closureNoticeDays = 30
const upcomingClosures = computed(() => {
  if (!mounted.value) return []
  const today = dayjs().tz(businessTimeZone)
  const from = today.format("YYYY-MM-DD")
  const until = today.add(closureNoticeDays, "day").format("YYYY-MM-DD")
  // Also drops closures that ended since the last rebuild.
  return closures.value.filter((c) => c.from <= until && c.to >= from)
})

const hours = computed((): { days: string; time: string; lang?: string }[] => {
  const { dateLocale, business: text } = content.value
  const day = (i: number) =>
    dayjs()
      .locale(dateLocale)
      .day((i + 1) % 7)
      .format("dddd")
  const time = (i: number) => {
    const d = week[i]
    return d
      ? `${formatHour(d.open, text)} – ${formatHour(d.close, text)}`
      : text.closedDay
  }
  const rows: { days: string; time: string }[] = []
  let start = 0
  for (let i = 0; i < 7; i++) {
    if (i < 6 && time(i + 1) === time(i)) continue
    rows.push({
      days: start === i ? day(i) : `${day(start)} – ${day(i)}`,
      time: time(i),
    })
    start = i + 1
  }
  return [
    ...rows,
    ...text.hoursNotes,
    ...upcomingClosures.value.map((c) => ({
      // Reasons finish "Closed for …" ("staff training"), so capitalise them as a label.
      days: c.reason.charAt(0).toUpperCase() + c.reason.slice(1),
      time: text.closedDates(c.dates),
      lang: c.lang,
    })),
  ]
})

const details = computed(() => [
  {
    icon: "i-lucide-phone",
    title: page.value.phone,
    label: business.phoneDisplay,
    href: business.phoneHref,
  },
  {
    icon: "i-lucide-mail",
    title: page.value.email,
    label: business.email,
    href: `mailto:${business.email}`,
  },
  {
    icon: "i-lucide-map-pin",
    title: page.value.address,
    label: addressLines(business.address).join("\n"),
    href: mapsUrl(business.address),
    external: true,
  },
])
</script>

<template>
  <div>
    <PageHero labelledby="contact-title">
      <p class="kicker mb-4 sm:tracking-[3px]">
        <template v-for="(word, i) in page.kicker" :key="word"
          ><span v-if="i" class="px-2 opacity-80" aria-hidden="true">|</span
          >{{ word }}</template
        >
      </p>
      <h1
        id="contact-title"
        class="heading-display text-[clamp(40px,6vw,76px)] leading-[0.95] tracking-tight"
      >
        {{ page.title[0] }}
        <em class="text-primary not-italic">{{ page.title[1] }}</em>
      </h1>
      <p class="mt-5 max-w-xl text-base text-zinc-200 sm:text-lg">
        {{ page.intro }}
      </p>
    </PageHero>

    <section class="bg-zinc-100 py-16 sm:py-20" :aria-label="page.sectionLabel">
      <UContainer
        class="grid items-start gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]"
      >
        <div
          class="-mx-4 border-t-4 sm:rounded-box border-primary bg-white px-5 py-7 shadow-[0_10px_30px_rgba(15,22,26,0.08)] sm:mx-0 sm:p-10"
        >
          <div
            v-if="status === 'sent'"
            ref="result"
            tabindex="-1"
            class="scroll-mt-[calc(var(--ui-header-height)+1.5rem)] focus:outline-none"
          >
            <UAlert
              color="success"
              variant="subtle"
              icon="i-lucide-circle-check"
              :title="page.sentTitle"
              :ui="{
                title: 'heading-display text-xl text-green-800 sm:text-2xl',
                description: 'mt-2 text-base text-ink-950',
                icon: 'text-green-700',
              }"
            >
              <template #description>
                {{ page.sentText }}
                <a
                  :href="business.phoneHref"
                  class="font-extrabold whitespace-nowrap text-chs-700 underline"
                  >{{ business.phoneDisplay }}</a
                >.
              </template>
            </UAlert>
            <UButton
              class="mt-6"
              variant="link"
              color="neutral"
              trailing-icon="i-lucide-chevron-right"
              @click="status = 'idle'"
            >
              {{ page.sendAnother }}
            </UButton>
          </div>

          <!-- eager-validation re-checks each field as it's typed in, so a corrected error
               clears straight away. Otherwise it only clears on blur, and the form shrinking
               under the cursor makes the click on Send miss. -->
          <UForm
            v-else
            :schema="schema"
            :state="state"
            class="space-y-5"
            @submit="onSubmit"
          >
            <div>
              <p class="kicker mb-3 text-chs-700">{{ page.formKicker }}</p>
              <h2 class="heading-display text-[clamp(24px,3vw,32px)]">
                {{ page.formTitle }}
              </h2>
              <p class="mt-2.5 text-[13px] text-zinc-600">
                {{ page.requiredNote[0] }}
                <span class="text-error" aria-hidden="true">*</span
                ><span class="sr-only">{{ page.requiredNote[1] }}</span>
                {{ page.requiredNote[2] }}
              </p>
            </div>

            <div class="sr-only" aria-hidden="true">
              <label for="f-company-website">{{ page.honeypot }}</label>
              <input
                id="f-company-website"
                v-model="gotcha"
                type="text"
                name="_gotcha"
                tabindex="-1"
                autocomplete="off"
              />
            </div>

            <div class="grid gap-5 sm:grid-cols-2">
              <UFormField
                eager-validation
                :label="page.fields.name"
                name="name"
                required
              >
                <UInput
                  v-model="state.name"
                  autocomplete="name"
                  size="xl"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                eager-validation
                :label="page.fields.company"
                name="company"
                :hint="page.optional"
              >
                <UInput
                  v-model="state.company"
                  autocomplete="organization"
                  size="xl"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                eager-validation
                :label="page.fields.phone"
                name="phone"
                required
              >
                <UInput
                  v-model="state.phone"
                  type="tel"
                  autocomplete="tel"
                  inputmode="tel"
                  size="xl"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                eager-validation
                :label="page.fields.email"
                name="email"
                required
              >
                <UInput
                  v-model="state.email"
                  type="email"
                  autocomplete="email"
                  size="xl"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                eager-validation
                :label="page.fields.service"
                name="service"
                required
              >
                <USelect
                  v-model="state.service"
                  :items="serviceOptions"
                  :placeholder="page.fields.servicePlaceholder"
                  size="xl"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                eager-validation
                :label="page.fields.location"
                name="location"
                :hint="page.optional"
              >
                <UInput
                  v-model="state.location"
                  autocomplete="postal-code"
                  :placeholder="page.fields.locationPlaceholder"
                  size="xl"
                  class="w-full"
                />
              </UFormField>
            </div>

            <UFormField
              eager-validation
              :label="page.fields.urgency"
              name="urgency"
              required
            >
              <URadioGroup
                v-model="state.urgency"
                :items="urgencyItems"
                variant="card"
                orientation="horizontal"
                :ui="{
                  fieldset: 'flex-col sm:flex-row sm:flex-wrap gap-2.5',
                  item: 'has-data-[state=checked]:bg-chs-50',
                  label: 'font-semibold',
                }"
              />
            </UFormField>

            <UFormField
              eager-validation
              :label="page.fields.details"
              name="message"
              required
            >
              <UTextarea
                v-model="state.message"
                :rows="6"
                autoresize
                :placeholder="page.fields.detailsPlaceholder"
                size="xl"
                class="w-full"
              />
            </UFormField>

            <div
              v-if="status === 'error'"
              ref="result"
              tabindex="-1"
              class="scroll-mt-[calc(var(--ui-header-height)+1.5rem)] focus:outline-none"
            >
              <UAlert
                color="error"
                variant="subtle"
                icon="i-lucide-circle-alert"
                :title="page.errorTitle"
                :ui="{
                  title: 'text-red-800',
                  description: 'text-ink-950',
                  icon: 'text-red-700',
                }"
              >
                <template #description>
                  {{ page.errorText }}
                  <a
                    :href="business.phoneHref"
                    class="font-extrabold whitespace-nowrap underline"
                    >{{ business.phoneDisplay }}</a
                  >.
                </template>
              </UAlert>
            </div>

            <div class="flex flex-wrap items-center gap-x-6 gap-y-4 pt-3">
              <UButton
                type="submit"
                size="xl"
                trailing-icon="i-lucide-chevron-right"
                :loading="status === 'sending'"
                class="h-13.5 w-full justify-center px-8 sm:w-auto"
              >
                {{ status === "sending" ? page.sending : page.send }}
              </UButton>
              <p class="text-[13px] text-zinc-600">
                {{ page.privacy }}
                <ULink
                  raw
                  :to="localePath('/privacy')"
                  class="font-semibold text-chs-700 underline"
                  >{{ page.privacyLink }}</ULink
                >
              </p>
            </div>
          </UForm>
        </div>

        <aside
          class="grid gap-5 md:grid-cols-2 lg:grid-cols-1"
          :aria-label="page.detailsLabel"
        >
          <div
            class="rounded-box bg-primary p-6 text-white sm:p-7.5 md:col-span-2 lg:col-span-1"
          >
            <p class="kicker mb-3">{{ page.emergencyKicker }}</p>
            <h2 class="heading-display mb-5 text-2xl leading-[1.1]">
              {{ page.emergencyTitle }}
            </h2>
            <UButton
              :to="business.phoneHref"
              icon="i-lucide-phone"
              color="neutral"
              variant="solid"
              size="xl"
              block
              class="bg-white text-[17px] text-ink-950 hover:bg-ink-950 hover:text-white"
            >
              {{ business.phoneDisplay }}
            </UButton>
          </div>

          <div
            v-if="booking.available"
            class="rounded-box border-t-3 border-primary bg-white p-6 shadow-[0_10px_30px_rgba(15,22,26,0.08)] sm:p-7.5 md:col-span-2 lg:col-span-1"
          >
            <p class="kicker mb-3 text-chs-700">{{ page.bookBox.kicker }}</p>
            <h2 class="heading-display mb-2 text-2xl leading-[1.1]">
              {{ page.bookBox.title }}
            </h2>
            <p class="mb-5 text-sm text-zinc-600">{{ page.bookBox.text }}</p>
            <UButton
              :to="booking.to()"
              icon="i-lucide-calendar-check"
              size="xl"
              block
            >
              {{ booking.label.value }}
            </UButton>
          </div>

          <ul
            class="divide-y divide-zinc-200 rounded-box bg-white px-5 py-1 shadow-[0_10px_30px_rgba(15,22,26,0.08)] sm:px-7.5 sm:py-2"
          >
            <li
              v-for="item in details"
              :key="item.title"
              class="flex gap-4 py-5"
            >
              <UIcon
                :name="item.icon"
                class="mt-0.5 size-6 shrink-0 text-primary"
              />
              <div class="min-w-0">
                <h3 class="heading-display mb-1 text-[13px] tracking-wide">
                  {{ item.title }}
                </h3>
                <a
                  v-if="item.href"
                  :href="item.href"
                  :target="item.external ? '_blank' : undefined"
                  :rel="item.external ? 'noopener' : undefined"
                  class="font-bold wrap-anywhere whitespace-pre-line hover:text-chs-700"
                  >{{ item.label }}</a
                >
                <p v-else>{{ item.label }}</p>
              </div>
            </li>
            <li class="flex gap-4 py-5">
              <UIcon
                name="i-lucide-clock"
                class="mt-0.5 size-6 shrink-0 text-primary"
              />
              <div>
                <h3 class="heading-display mb-1 text-[13px] tracking-wide">
                  {{ page.openingHours }}
                </h3>
                <UBadge
                  v-if="hoursDraft"
                  color="warning"
                  variant="solid"
                  icon="i-lucide-pencil-line"
                  :label="`${content.jobPage.draft}: ${content.business.hoursDraftNote}`"
                  class="my-1.5 whitespace-normal"
                />
                <dl
                  class="mt-1.5 grid grid-cols-[auto_auto] gap-x-4 gap-y-1 text-sm"
                >
                  <template v-for="row in hours" :key="row.days">
                    <dt class="text-zinc-600" :lang="row.lang">
                      {{ row.days }}
                    </dt>
                    <dd class="font-bold">{{ row.time }}</dd>
                  </template>
                </dl>
              </div>
            </li>
          </ul>

          <div class="rounded-box bg-ink-900 px-5 py-6 text-white sm:px-7.5">
            <h3 class="heading-display mb-3.5 text-[13px] tracking-wide">
              {{ page.areasWeCover }}
            </h3>
            <ul class="flex flex-wrap gap-2">
              <li v-for="area in content.business.serviceArea" :key="area">
                <UBadge
                  :label="area"
                  color="neutral"
                  variant="outline"
                  size="lg"
                  class="bg-transparent text-white ring-white/25"
                />
              </li>
            </ul>
          </div>
        </aside>
      </UContainer>
    </section>

    <section class="py-16 sm:py-20" aria-labelledby="map-title">
      <UContainer
        class="grid items-start gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14"
      >
        <ContactMap />
        <div>
          <p class="kicker mb-3 text-chs-700">{{ page.map.kicker }}</p>
          <h2
            id="map-title"
            class="heading-display mb-5 text-[clamp(28px,3.6vw,40px)]"
          >
            {{ page.map.title }}
          </h2>
          <address class="mb-6 text-lg font-bold not-italic">
            <template
              v-for="(line, i) in addressLines(business.address)"
              :key="line"
              ><br v-if="i" />{{ line }}</template
            >
          </address>
          <UButton
            :to="directionsUrl(business.address)"
            target="_blank"
            icon="i-lucide-navigation"
            size="xl"
          >
            {{ page.map.directions }}
          </UButton>
          <h3 class="heading-display mt-8 mb-2 text-[13px] tracking-wide">
            {{ page.map.findingUs }}
          </h3>
          <p class="text-zinc-600">{{ page.map.findingUsText }}</p>
        </div>
      </UContainer>
    </section>
  </div>
</template>
