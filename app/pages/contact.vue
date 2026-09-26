<script setup lang="ts">
import * as z from "zod"
import type { FormSubmitEvent } from "@nuxt/ui"
import { contentByLocale } from "~/content"
const { business } = useAppConfig()
const runtimeConfig = useRuntimeConfig()
const endpoint = runtimeConfig.public.contactFormEndpoint as string
const { $track } = useNuxtApp()
const content = useContent()
const page = computed(() => content.value.contact)
const { locale } = useI18n()

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
// Honeypot: hidden from people, filled in by spam bots. Kept out of the schema.
const gotcha = ref("")
const status = ref<"idle" | "sending" | "sent" | "error">("idle")
const result = ref<HTMLElement | null>(null)

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
  if (status.value === "sending") return
  if (!endpoint) {
    console.error(
      "Contact form endpoint missing: set NUXT_PUBLIC_CONTACT_FORM_ENDPOINT.",
    )
    status.value = "error"
  } else {
    status.value = "sending"
    const body = new FormData()
    for (const [key, value] of Object.entries(event.data))
      if (value) body.append(key, value)
    body.set(
      "urgency",
      contentByLocale.en.contact.urgencies[event.data.urgency],
    )
    // Tells the business which language to reply in.
    body.append("language", locale.value === "cy" ? "Welsh" : "English")
    body.append("_subject", "New website enquiry – CHS Hydraulic Services")
    body.append("_gotcha", gotcha.value)
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body,
        headers: { Accept: "application/json" },
      })
      status.value = response.ok ? "sent" : "error"
    } catch {
      status.value = "error"
    }
  }
  if (status.value === "sent") {
    $track("Enquiry Sent", {
      service: event.data.service,
      urgency: contentByLocale.en.contact.urgencies[event.data.urgency],
      language: locale.value,
    })
    Object.assign(state, initialState())
  }
  await nextTick()
  result.value?.focus()
}

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
    title: page.value.basedIn,
    label: content.value.business.location,
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
          class="-mx-4 border-t-4 border-primary bg-white px-5 py-7 shadow-[0_10px_30px_rgba(15,22,26,0.08)] sm:mx-0 sm:p-10"
        >
          <div
            v-if="status === 'sent'"
            ref="result"
            tabindex="-1"
            class="focus:outline-none"
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
              <UFormField :label="page.fields.name" name="name" required>
                <UInput
                  v-model="state.name"
                  autocomplete="name"
                  size="xl"
                  class="w-full"
                />
              </UFormField>
              <UFormField
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
              <UFormField :label="page.fields.phone" name="phone" required>
                <UInput
                  v-model="state.phone"
                  type="tel"
                  autocomplete="tel"
                  inputmode="tel"
                  size="xl"
                  class="w-full"
                />
              </UFormField>
              <UFormField :label="page.fields.email" name="email" required>
                <UInput
                  v-model="state.email"
                  type="email"
                  autocomplete="email"
                  size="xl"
                  class="w-full"
                />
              </UFormField>
              <UFormField :label="page.fields.service" name="service" required>
                <USelect
                  v-model="state.service"
                  :items="serviceOptions"
                  :placeholder="page.fields.servicePlaceholder"
                  size="xl"
                  class="w-full"
                />
              </UFormField>
              <UFormField
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

            <UFormField :label="page.fields.urgency" name="urgency" required>
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

            <UFormField :label="page.fields.details" name="message" required>
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
              class="focus:outline-none"
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
              </p>
            </div>
          </UForm>
        </div>

        <aside
          class="grid gap-5 md:grid-cols-2 lg:grid-cols-1"
          :aria-label="page.detailsLabel"
        >
          <div
            class="bg-primary p-6 text-white sm:p-7.5 md:col-span-2 lg:col-span-1"
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

          <ul
            class="divide-y divide-zinc-200 bg-white px-5 py-1 shadow-[0_10px_30px_rgba(15,22,26,0.08)] sm:px-7.5 sm:py-2"
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
                  class="font-bold wrap-anywhere hover:text-chs-700"
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
                <dl
                  class="mt-1.5 grid grid-cols-[auto_auto] gap-x-4 gap-y-1 text-sm"
                >
                  <template
                    v-for="row in content.business.hours"
                    :key="row.days"
                  >
                    <dt class="text-zinc-600">{{ row.days }}</dt>
                    <dd class="font-bold">{{ row.time }}</dd>
                  </template>
                </dl>
              </div>
            </li>
          </ul>

          <div class="bg-ink-900 px-5 py-6 text-white sm:px-7.5">
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
  </div>
</template>
