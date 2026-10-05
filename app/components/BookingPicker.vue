<script setup lang="ts">
import * as z from "zod"
import type { FormSubmitEvent } from "@nuxt/ui"
import type { BookingService, DaySlots, Slot } from "#shared/utils/booking"
import type { CalendarEvent } from "#shared/utils/ics"

// Live booking against the Fergus diary (server/api/booking), laid out as steps: 1. service,
// 2. date and time (month calendar + times), 3. details, with a "Your booking" summary beside
// them. Slots load in the browser only (the page is prerendered). Anything that isn't
// bookable goes to the contact form.

const { business, features } = useAppConfig()
const content = useContent()
const localePath = useLocalePath()
const { $track } = useNuxtApp()
const { locale } = useI18n()
const page = computed(() => content.value.bookPage)
const live = computed(() => content.value.bookPage.live)
const contact = computed(() => content.value.contact)

const icons: Record<BookingService, string> = {
  hose: "i-lucide-cable",
  check: "i-lucide-clipboard-check",
  dropoff: "i-lucide-package",
  onsite: "i-lucide-truck",
}
// On-site visits only while on-site work is live (app.config `features.onsite`).
const services = availableBookingServices(features.onsite)

const service = ref<BookingService>()
const days = ref<DaySlots[]>([])
const day = ref<string>()
const slot = ref<Slot>()
const month = ref<string>()
const loading = ref(false)
const failed = ref(false)
const notice = ref("")
const showDetails = ref(false)
// The step that's open; finished steps collapse to a one-line summary with "Change".
const active = ref<1 | 2 | 3>(1)
const booked = ref<Slot>()
// Where we're going, for a booked on-site visit.
const bookedOnsite = ref("")
// The calendar entry for the confirmation buttons, and who we emailed (if anyone).
const bookedEvent = ref<CalendarEvent>()
const emailedTo = ref("")
const sending = ref(false)
const gotcha = ref("")

const dateSection = ref<HTMLElement | null>(null)
const detailsSection = ref<HTMLElement | null>(null)
const top = ref<HTMLElement | null>(null)
const scrollTo = (el: HTMLElement | null) =>
  nextTick(() => el?.scrollIntoView({ behavior: "smooth", block: "start" }))

async function loadSlots() {
  if (!service.value) return
  loading.value = true
  failed.value = false
  try {
    const result = await $fetch<{ days: DaySlots[] }>("/api/booking/slots", {
      query: { service: service.value },
      // Always ask the server (which caches for a minute); never reuse a browser copy.
      cache: "no-store",
    })
    days.value = result.days
    if (!days.value.some((d) => d.date === day.value)) day.value = undefined
    month.value ??= days.value[0]?.date.slice(0, 7)
  } catch {
    failed.value = true
  } finally {
    loading.value = false
  }
}

// Links like /book?service=hose pre-select the job. The page is prerendered without the
// query, so read it once mounted (as the contact form does).
const router = useRouter()
onMounted(() => {
  const requested = router.currentRoute.value.query.service
  if (services.includes(requested as BookingService))
    chooseService(requested as BookingService, false)
})

function chooseService(key: BookingService, scroll = true) {
  if (service.value === key) {
    // Reopened step 1 and kept the same job: carry on where they were.
    active.value = slot.value ? (showDetails.value ? 3 : 2) : 2
    if (scroll) scrollTo(dateSection.value)
    return
  }
  service.value = key
  active.value = 2
  slot.value = undefined
  day.value = undefined
  month.value = undefined
  // Don't leave the previous service's times on screen while the new ones load.
  days.value = []
  showDetails.value = false
  notice.value = ""
  loadSlots()
  if (scroll) scrollTo(dateSection.value)
}

// Times and dates in UK time, in the page's language.
const local = (iso: string) =>
  dayjs(iso).tz(businessTimeZone).locale(content.value.dateLocale)
const range = (s: Slot) =>
  `${local(s.start).format("HH:mm")} – ${local(s.end).format("HH:mm")}`
const slotLabel = (s: Slot) =>
  service.value === "dropoff"
    ? live.value.dropoffWindow(
        local(s.start).format("HH:mm"),
        local(s.end).format("HH:mm"),
      )
    : range(s)
const whenText = (s: Slot) =>
  `${local(s.start).format("dddd D MMMM")}, ${slotLabel(s)}`

// Month calendar: Monday first, bookable days enabled.
const bookable = computed(() => new Set(days.value.map((d) => d.date)))
const months = computed(() => [
  ...new Set(days.value.map((d) => d.date.slice(0, 7))),
])
const weekdays = computed(() =>
  Array.from({ length: 7 }, (_, i) =>
    dayjs("2026-01-05") // a Monday
      .add(i, "day")
      .locale(content.value.dateLocale)
      .format("dd"),
  ),
)
const cells = computed(() => {
  if (!month.value) return []
  const first = dayjs(`${month.value}-01`)
  const lead = (first.day() + 6) % 7
  const weeks = Math.ceil((lead + first.daysInMonth()) / 7)
  return Array.from({ length: weeks * 7 }, (_, i) => {
    const date = first.subtract(lead, "day").add(i, "day")
    const key = date.format("YYYY-MM-DD")
    return {
      key,
      label: date.date(),
      inMonth: date.month() === first.month(),
      bookable: bookable.value.has(key),
    }
  })
})
const monthLabel = computed(() =>
  month.value
    ? dayjs(`${month.value}-01`)
        .locale(content.value.dateLocale)
        .format("MMMM YYYY")
    : "",
)
const monthIndex = computed(() => months.value.indexOf(month.value ?? ""))
const daySlots = computed(
  () => days.value.find((d) => d.date === day.value)?.slots ?? [],
)

function chooseDay(key: string) {
  day.value = key
  slot.value = undefined
}

const schema = computed(() => {
  const errors = contact.value.errors
  return z.object({
    name: z.string().trim().min(1, errors.name),
    company: z.string().trim().optional(),
    phone: z.string().trim().min(6, errors.phone),
    email: z.email(errors.email),
    machine: z.string().trim().optional(),
    location:
      service.value === "onsite"
        ? z.string().trim().min(3, live.value.locationError)
        : z.string().trim().optional(),
    message: z.string().trim().optional(),
  })
})
type Schema = z.output<typeof schema.value>
const state = reactive<Partial<Schema>>({
  name: "",
  company: "",
  phone: "",
  email: "",
  machine: "",
  location: "",
  message: "",
})

const step = computed(() => (booked.value ? 4 : active.value))

function nextStep() {
  showDetails.value = true
  active.value = 3
  scrollTo(detailsSection.value)
}

// Reopens a finished step ("Change").
function edit(n: 1 | 2 | 3) {
  active.value = n
  scrollTo(
    n === 1 ? top.value : n === 2 ? dateSection.value : detailsSection.value,
  )
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (sending.value || !slot.value || !service.value) return
  sending.value = true
  notice.value = ""
  try {
    const result = await $fetch<{ emailed?: boolean }>("/api/booking", {
      method: "POST",
      body: {
        ...event.data,
        service: service.value,
        start: slot.value.start,
        language: locale.value,
        _gotcha: gotcha.value,
      },
    })
    booked.value = slot.value
    bookedOnsite.value =
      service.value === "onsite" ? (event.data.location ?? "") : ""
    emailedTo.value = result.emailed ? event.data.email : ""
    const title = live.value.services[service.value].title
    bookedEvent.value = {
      uid: `${slot.value.start}-${service.value}-${event.data.email}@chshydraulics.co.uk`,
      title: live.value.calendarTitle(title),
      start: slot.value.start,
      end: slot.value.end,
      location: bookedOnsite.value || addressLines(business.address).join(", "),
      description: live.value.calendarDescription(business.phoneDisplay),
    }
    $track("Booking Made", { service: service.value, language: locale.value })
    scrollTo(top.value)
  } catch (error) {
    const status = (error as { statusCode?: number }).statusCode
    notice.value = status === 409 ? live.value.taken : live.value.failed
    if (status === 409) {
      slot.value = undefined
      showDetails.value = false
      active.value = 2
      await loadSlots()
      scrollTo(dateSection.value)
    }
  } finally {
    sending.value = false
  }
}

// Downloads the booking as an .ics file (iPhone, Outlook and most calendar apps).
function downloadIcs() {
  if (!bookedEvent.value) return
  const url = URL.createObjectURL(
    new Blob([buildIcs(bookedEvent.value)], { type: "text/calendar" }),
  )
  const link = document.createElement("a")
  link.href = url
  link.download = "chs-hydraulics-booking.ics"
  link.click()
  URL.revokeObjectURL(url)
}

function again() {
  booked.value = undefined
  slot.value = undefined
  day.value = undefined
  showDetails.value = false
  active.value = service.value ? 2 : 1
  loadSlots()
}

const summary = computed(() => [
  {
    label: live.value.summary.service,
    value: service.value ? live.value.services[service.value].title : "",
    empty: live.value.summary.notChosen,
    target: 1 as const,
    icon: service.value ? icons[service.value] : undefined,
  },
  {
    label: live.value.summary.when,
    value: slot.value ? whenText(slot.value) : "",
    empty: live.value.summary.notChosen,
    target: 2 as const,
    icon: undefined as string | undefined,
  },
  {
    label: live.value.summary.details,
    value: state.name
      ? `${state.name}${state.company ? `, ${state.company}` : ""}`
      : "",
    empty: live.value.summary.notCompleted,
    target: 3 as const,
    icon: undefined as string | undefined,
  },
])

const card =
  "rounded-box bg-white p-5 shadow-[0_10px_30px_rgba(15,22,26,0.08)] sm:p-8"
</script>

<template>
  <div ref="top" class="scroll-mt-[calc(var(--ui-header-height)+1.5rem)]">
    <!-- Steps -->

    <div
      class="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8"
    >
      <div class="grid min-w-0 gap-6" aria-live="polite">
        <!-- Each step but the last grows to fill the space up to the next, ending in a connecting
             line: dark once that step is done, grey before. -->
        <ol class="flex items-center gap-3 sm:gap-4">
          <li
            v-for="(s, i) in live.steps"
            :key="s.title"
            class="flex min-w-0 items-center gap-3"
            :class="i < live.steps.length - 1 && 'flex-1'"
            :aria-current="step === i + 1 ? 'step' : undefined"
          >
            <span
              class="grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold"
              :class="
                step > i + 1
                  ? 'bg-ink-950 text-white'
                  : step === i + 1
                    ? 'bg-primary text-white'
                    : 'bg-zinc-300 text-zinc-700'
              "
            >
              <UIcon v-if="step > i + 1" name="i-lucide-check" class="size-4" />
              <template v-else>{{ i + 1 }}</template>
            </span>
            <!-- On phones only the current step is named; the rest are numbers on the line. -->
            <span
              class="min-w-0 shrink-0"
              :class="step === i + 1 ? 'block' : 'hidden sm:block'"
            >
              <span
                class="block text-sm font-bold whitespace-nowrap"
                :class="step === i + 1 ? 'text-chs-700' : 'text-ink-950'"
                >{{ s.title }}</span
              >
              <span class="hidden text-xs text-zinc-600 sm:block">{{
                s.text
              }}</span>
            </span>
            <span
              v-if="i < live.steps.length - 1"
              class="h-0.5 min-w-4 flex-1 rounded-full transition-colors"
              :class="step > i + 1 ? 'bg-ink-950' : 'bg-zinc-300'"
              aria-hidden="true"
            />
          </li>
        </ol>
        <!-- Booked -->
        <div v-if="booked" :class="card">
          <UAlert
            color="success"
            variant="subtle"
            icon="i-lucide-calendar-check"
            :title="live.doneTitle"
            :ui="{
              title: 'heading-display text-xl text-green-800 sm:text-2xl',
              description: 'mt-2 text-base text-ink-950',
              icon: 'text-green-700',
            }"
          >
            <template #description>
              {{ live.doneText(whenText(booked)) }}
              <a
                :href="business.phoneHref"
                class="font-extrabold whitespace-nowrap text-chs-700 underline"
                >{{ business.phoneDisplay }}</a
              >.
              <span class="mt-3 block text-sm">
                <template v-if="bookedOnsite">
                  {{ live.comingTo }} {{ bookedOnsite }}
                </template>
                <template v-else>
                  {{ live.bringTo }}
                  {{ addressLines(business.address).join(", ") }}
                </template>
              </span>
            </template>
          </UAlert>
          <p v-if="emailedTo" class="mt-4 flex items-center gap-2 text-sm">
            <UIcon name="i-lucide-mail-check" class="size-5 text-green-700" />
            {{ live.emailed(emailedTo) }}
          </p>
          <div v-if="bookedEvent" class="mt-5 flex flex-wrap gap-3">
            <UButton
              icon="i-lucide-calendar-plus"
              size="lg"
              @click="downloadIcs"
            >
              {{ live.addToCalendar }}
            </UButton>
            <UButton
              :to="googleCalendarUrl(bookedEvent)"
              target="_blank"
              icon="i-lucide-external-link"
              color="neutral"
              variant="outline"
              size="lg"
            >
              {{ live.googleCalendar }}
            </UButton>
          </div>
          <UButton
            class="mt-6"
            variant="link"
            color="neutral"
            trailing-icon="i-lucide-chevron-right"
            @click="again"
          >
            {{ live.bookAnother }}
          </UButton>
        </div>

        <template v-else>
          <!-- 1. Service -->
          <section :class="card" aria-labelledby="bk-service-title">
            <template v-if="active === 1 || !service">
              <h2
                id="bk-service-title"
                class="heading-display text-[clamp(22px,2.6vw,28px)]"
              >
                {{ live.serviceTitle }}
              </h2>
              <p class="mt-1 mb-5 text-sm text-zinc-600">
                {{ live.serviceText }}
              </p>
              <div
                class="grid gap-3"
                :class="
                  services.length % 2 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
                "
                role="radiogroup"
                :aria-label="live.serviceTitle"
              >
                <button
                  v-for="key in services"
                  :key="key"
                  type="button"
                  role="radio"
                  :aria-checked="service === key"
                  class="relative flex items-start gap-3 rounded-box border-2 p-4 pr-8 text-left transition"
                  :class="
                    service === key
                      ? 'border-primary bg-chs-50'
                      : 'border-zinc-200 hover:border-chs-300'
                  "
                  @click="chooseService(key)"
                >
                  <UIcon
                    :name="icons[key]"
                    class="mt-0.5 size-7 shrink-0 text-ink-950"
                  />
                  <span>
                    <span class="block text-sm font-extrabold uppercase">{{
                      live.services[key].title
                    }}</span>
                    <span class="mt-0.5 block text-xs text-zinc-600">{{
                      live.services[key].text
                    }}</span>
                  </span>
                  <UIcon
                    v-if="service === key"
                    name="i-lucide-circle-check"
                    class="absolute top-2 right-2 size-5 text-primary"
                  />
                </button>
              </div>
              <p class="mt-5 text-sm text-zinc-600">
                {{ live.otherPrompt }}
                <ULink
                  raw
                  :to="localePath('/contact')"
                  class="font-semibold text-chs-700 underline"
                >
                  {{ live.otherLink }}
                </ULink>
              </p>
            </template>
            <div v-else class="flex flex-wrap items-center gap-x-4 gap-y-1">
              <h2 id="bk-service-title" class="heading-display text-lg">
                {{ live.serviceTitle }}
              </h2>
              <span
                class="flex min-w-0 items-center gap-2 text-sm font-semibold"
              >
                <UIcon
                  name="i-lucide-circle-check"
                  class="size-5 shrink-0 text-green-700"
                />
                <UIcon
                  v-if="service"
                  :name="icons[service]"
                  class="size-5 shrink-0 text-ink-950"
                />
                {{ service && live.services[service].title }}
              </span>
              <UButton
                variant="link"
                color="neutral"
                class="ms-auto px-0 font-semibold text-chs-700 normal-case tracking-normal"
                @click="edit(1)"
              >
                {{ live.summary.change }}
              </UButton>
            </div>
          </section>

          <!-- 2. Date and time -->
          <section
            ref="dateSection"
            :class="[card, 'scroll-mt-[calc(var(--ui-header-height)+1.5rem)]']"
            aria-labelledby="bk-date-title"
          >
            <template v-if="active === 2">
              <h2
                id="bk-date-title"
                class="heading-display text-[clamp(22px,2.6vw,28px)]"
              >
                {{ live.dateTitle }}
              </h2>
              <p class="mt-1 text-sm text-zinc-600">
                {{ service === "onsite" ? live.dateTextOnsite : live.dateText }}
              </p>

              <p
                v-if="notice"
                class="mt-5 flex items-start gap-2 rounded-box bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
                role="alert"
              >
                <UIcon name="i-lucide-circle-alert" class="size-5 shrink-0" />
                {{ notice }}
              </p>

              <template v-if="service">
                <p
                  v-if="!loading && (failed || !days.length)"
                  class="mt-6 rounded-box bg-zinc-100 px-4 py-3 text-sm font-semibold"
                >
                  {{ failed ? live.failed : live.none }}
                  <a
                    :href="business.phoneHref"
                    class="whitespace-nowrap text-chs-700 underline"
                    >{{ business.phoneDisplay }}</a
                  >
                </p>
                <div
                  v-else
                  class="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
                  :aria-busy="loading"
                >
                  <!-- Month calendar (a spinner in its place while the diary loads) -->
                  <div
                    v-if="loading"
                    class="flex min-h-72 flex-col items-center md:min-h-80 justify-center gap-3 rounded-box bg-zinc-50 text-sm font-semibold text-zinc-600"
                    role="status"
                  >
                    <UIcon
                      name="i-lucide-loader-circle"
                      class="size-8 animate-spin text-primary"
                    />
                    {{ live.loading }}
                  </div>
                  <div v-else>
                    <div class="mb-3 flex items-center justify-between">
                      <p class="font-extrabold">{{ monthLabel }}</p>
                      <div class="flex gap-1">
                        <UButton
                          icon="i-lucide-chevron-left"
                          color="neutral"
                          variant="ghost"
                          :aria-label="live.previousMonth"
                          :disabled="monthIndex <= 0"
                          @click="month = months[monthIndex - 1]"
                        />
                        <UButton
                          icon="i-lucide-chevron-right"
                          color="neutral"
                          variant="ghost"
                          :aria-label="live.nextMonth"
                          :disabled="monthIndex >= months.length - 1"
                          @click="month = months[monthIndex + 1]"
                        />
                      </div>
                    </div>
                    <div
                      class="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-zinc-500"
                      aria-hidden="true"
                    >
                      <span v-for="w in weekdays" :key="w" class="py-1">{{
                        w
                      }}</span>
                    </div>
                    <div class="grid grid-cols-7 gap-1">
                      <button
                        v-for="c in cells"
                        :key="c.key"
                        type="button"
                        class="aspect-square rounded-box text-sm font-semibold transition"
                        :class="[
                          !c.inMonth && 'invisible',
                          c.key === day
                            ? 'bg-primary text-white'
                            : c.bookable
                              ? 'bg-zinc-100 text-ink-950 hover:bg-chs-100'
                              : 'cursor-not-allowed text-zinc-300',
                        ]"
                        :disabled="!c.bookable"
                        :aria-pressed="c.key === day"
                        :aria-label="
                          local(`${c.key}T12:00:00Z`).format('dddd D MMMM')
                        "
                        @click="chooseDay(c.key)"
                      >
                        {{ c.label }}
                      </button>
                    </div>
                  </div>

                  <!-- Times -->
                  <div>
                    <p class="mb-1 font-extrabold">{{ live.timesTitle }}</p>
                    <template v-if="day && !loading">
                      <p class="mb-4 text-sm text-zinc-600">
                        {{
                          local(`${day}T12:00:00Z`).format("dddd D MMMM YYYY")
                        }}
                        · {{ live.services[service].title }}
                      </p>
                      <div
                        class="grid gap-2"
                        :class="
                          service === 'dropoff'
                            ? 'grid-cols-1'
                            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-3'
                        "
                      >
                        <button
                          v-for="s in daySlots"
                          :key="s.start"
                          type="button"
                          class="rounded-box border px-2 py-2.5 text-sm font-semibold transition"
                          :class="
                            slot?.start === s.start
                              ? 'border-primary bg-primary text-white'
                              : 'border-zinc-300 bg-white hover:border-primary'
                          "
                          :aria-pressed="slot?.start === s.start"
                          @click="slot = s"
                        >
                          {{ slotLabel(s) }}
                        </button>
                      </div>
                    </template>
                    <p v-else class="mt-2 text-sm text-zinc-500">
                      {{ live.chooseDay }}
                    </p>
                  </div>
                </div>
              </template>

              <div
                class="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div
                  class="flex items-start gap-3 rounded-box bg-zinc-100 px-4 py-3 text-sm sm:max-w-md"
                >
                  <UIcon
                    name="i-lucide-info"
                    class="mt-0.5 size-5 shrink-0 text-ink-950"
                  />
                  <p>
                    <span class="font-bold">{{ live.urgentTitle }}</span>
                    {{ live.urgentText }}
                    <a
                      :href="business.phoneHref"
                      class="font-bold whitespace-nowrap text-chs-700 underline"
                      >{{ business.phoneDisplay }}</a
                    >.
                  </p>
                </div>
                <UButton
                  size="xl"
                  trailing-icon="i-lucide-arrow-right"
                  class="justify-center px-6"
                  :disabled="!slot"
                  @click="nextStep"
                >
                  {{ live.nextStep }}
                </UButton>
              </div>
            </template>
            <div
              v-else-if="slot"
              class="flex flex-wrap items-center gap-x-4 gap-y-1"
            >
              <h2 id="bk-date-title" class="heading-display text-lg">
                {{ live.dateTitle }}
              </h2>
              <span
                class="flex min-w-0 items-center gap-2 text-sm font-semibold"
              >
                <UIcon
                  name="i-lucide-circle-check"
                  class="size-5 shrink-0 text-green-700"
                />
                {{ slot && whenText(slot) }}
              </span>
              <UButton
                variant="link"
                color="neutral"
                class="ms-auto px-0 font-semibold text-chs-700 normal-case tracking-normal"
                @click="edit(2)"
              >
                {{ live.summary.change }}
              </UButton>
            </div>
            <h2
              v-else
              id="bk-date-title"
              class="heading-display text-[clamp(22px,2.6vw,28px)] text-zinc-400"
            >
              {{ live.dateTitle }}
            </h2>
          </section>

          <!-- 3. Details -->
          <section
            v-if="showDetails && slot && service"
            ref="detailsSection"
            :class="[card, 'scroll-mt-[calc(var(--ui-header-height)+1.5rem)]']"
            aria-labelledby="bk-details-title"
          >
            <template v-if="active === 3">
              <h2
                id="bk-details-title"
                class="heading-display text-[clamp(22px,2.6vw,28px)]"
              >
                {{ live.detailsTitle }}
              </h2>
              <p class="mt-1 mb-5 text-sm text-zinc-600">
                {{ live.detailsText }}
              </p>
              <UForm
                :schema="schema"
                :state="state"
                class="space-y-5"
                @submit="onSubmit"
              >
                <div class="sr-only" aria-hidden="true">
                  <label for="lb-company-website">{{ contact.honeypot }}</label>
                  <input
                    id="lb-company-website"
                    v-model="gotcha"
                    type="text"
                    tabindex="-1"
                    autocomplete="off"
                  />
                </div>
                <div class="grid gap-5 sm:grid-cols-2">
                  <UFormField
                    eager-validation
                    :label="contact.fields.name"
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
                    :label="contact.fields.company"
                    name="company"
                    :hint="contact.optional"
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
                    :label="contact.fields.phone"
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
                    :label="contact.fields.email"
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
                </div>
                <UFormField
                  eager-validation
                  :label="page.fields.machine"
                  name="machine"
                  :hint="contact.optional"
                >
                  <UInput
                    v-model="state.machine"
                    :placeholder="page.fields.machinePlaceholder"
                    size="xl"
                    class="w-full"
                  />
                </UFormField>
                <UFormField
                  v-if="service === 'onsite'"
                  eager-validation
                  :label="live.locationLabel"
                  name="location"
                  required
                >
                  <UInput
                    v-model="state.location"
                    autocomplete="street-address"
                    :placeholder="live.locationPlaceholder"
                    size="xl"
                    class="w-full"
                  />
                </UFormField>
                <UFormField
                  eager-validation
                  :label="page.fields.details"
                  name="message"
                  :hint="contact.optional"
                >
                  <UTextarea
                    v-model="state.message"
                    :rows="3"
                    autoresize
                    :placeholder="page.fields.detailsPlaceholder"
                    size="xl"
                    class="w-full"
                  />
                </UFormField>
                <div class="flex flex-wrap items-center gap-x-6 gap-y-4 pt-2">
                  <UButton
                    type="submit"
                    size="xl"
                    icon="i-lucide-calendar-check"
                    :loading="sending"
                    class="h-13.5 w-full justify-center px-8 sm:w-auto"
                  >
                    {{ sending ? live.booking : live.confirm }}
                  </UButton>
                  <p class="text-[13px] text-zinc-600">{{ contact.privacy }}</p>
                </div>
              </UForm>
            </template>
            <div v-else class="flex flex-wrap items-center gap-x-4 gap-y-1">
              <h2 id="bk-details-title" class="heading-display text-lg">
                {{ live.detailsTitle }}
              </h2>
              <span
                class="flex min-w-0 items-center gap-2 text-sm font-semibold"
              >
                <UIcon
                  name="i-lucide-circle-check"
                  class="size-5 shrink-0 text-green-700"
                />
                {{
                  state.name
                    ? `${state.name}${state.company ? `, ${state.company}` : ""}`
                    : live.summary.notCompleted
                }}
              </span>
              <UButton
                variant="link"
                color="neutral"
                class="ms-auto px-0 font-semibold text-chs-700 normal-case tracking-normal"
                @click="edit(3)"
              >
                {{ live.summary.change }}
              </UButton>
            </div>
          </section>
        </template>
      </div>

      <!-- Summary and help -->
      <aside
        class="grid gap-5 lg:sticky lg:top-[calc(var(--header-offset)+1.5rem)] lg:transition-[top] lg:duration-300"
        :aria-label="live.summary.title"
      >
        <div
          class="overflow-hidden rounded-box bg-white shadow-[0_10px_30px_rgba(15,22,26,0.08)]"
        >
          <h2 class="heading-display bg-zinc-100 px-6 py-4 text-lg">
            {{ live.summary.title }}
          </h2>
          <dl class="divide-y divide-zinc-200 px-6 py-1">
            <div
              v-for="row in summary"
              :key="row.label"
              class="flex items-start justify-between gap-3 py-3.5"
            >
              <div class="min-w-0">
                <dt class="text-sm text-zinc-500">{{ row.label }}</dt>
                <dd
                  class="mt-1 flex items-center gap-2.5 text-sm font-semibold"
                  :class="!row.value && 'text-zinc-400'"
                >
                  <UIcon
                    v-if="row.icon"
                    :name="row.icon"
                    class="size-5 shrink-0 text-ink-950"
                    aria-hidden="true"
                  />
                  {{ row.value || row.empty }}
                </dd>
              </div>
              <button
                v-if="row.value && !booked"
                type="button"
                class="shrink-0 text-sm font-semibold text-chs-700 hover:underline"
                @click="edit(row.target)"
              >
                {{ live.summary.change }}
              </button>
            </div>
          </dl>
        </div>

        <div class="rounded-box bg-ink-950 p-6 text-white">
          <h2 class="heading-display text-2xl leading-[1.05]">
            {{ live.help.title }}
          </h2>
          <p class="mt-2 mb-5 text-sm text-zinc-300">{{ live.help.text }}</p>
          <UButton
            :to="business.phoneHref"
            icon="i-lucide-phone"
            size="xl"
            block
          >
            {{ content.common.call(business.phoneDisplay) }}
          </UButton>
        </div>
      </aside>
    </div>
  </div>
</template>
