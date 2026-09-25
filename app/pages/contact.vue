<script setup lang="ts">
import * as z from "zod"
import type { FormSubmitEvent } from "@nuxt/ui"
import { services } from "~/data/services"

const { business } = useAppConfig()
const runtimeConfig = useRuntimeConfig()
const endpoint = runtimeConfig.public.contactFormEndpoint as string
const { $track } = useNuxtApp()

usePageSeo({
  title: "Contact CHS Hydraulics | Cross Hands, Llanelli",
  description:
    "Contact Crosshands Hydraulic Services for hose replacement, ram repairs, fault finding and on-site call-outs across Llanelli and Carmarthenshire.",
  path: "/contact",
})

const serviceOptions = [
  ...services.map((s) => ({ value: s.slug, label: s.h1 })),
  { value: "other", label: "Something else" },
]
const urgencies = [
  "Emergency – machine is down",
  "Within the next few days",
  "Just after a quote",
]

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name"),
  company: z.string().trim().optional(),
  phone: z
    .string()
    .trim()
    .min(6, "Please enter a phone number we can reach you on"),
  email: z.email("Please enter a valid email address"),
  service: z
    .string({ error: "Please choose a service" })
    .min(1, "Please choose a service"),
  location: z.string().trim().optional(),
  urgency: z
    .string({ error: "Please tell us how urgent it is" })
    .min(1, "Please tell us how urgent it is"),
  message: z.string().trim().min(10, "Please give us a few more details"),
})
type Schema = z.output<typeof schema>

const initialState = (): Partial<Schema> => ({
  name: "",
  company: "",
  phone: "",
  email: "",
  service: undefined,
  location: "",
  urgency: urgencies[1],
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
    serviceOptions.some((s) => s.value === requested)
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
      urgency: event.data.urgency,
    })
    Object.assign(state, initialState())
  }
  await nextTick()
  result.value?.focus()
}

const details = [
  {
    icon: "i-lucide-phone",
    title: "Phone",
    label: business.phoneDisplay,
    href: business.phoneHref,
  },
  {
    icon: "i-lucide-mail",
    title: "Email",
    label: business.email,
    href: `mailto:${business.email}`,
  },
  { icon: "i-lucide-map-pin", title: "Based in", label: business.location },
]
</script>

<template>
  <div>
    <PageHero labelledby="contact-title">
      <p class="kicker mb-4 sm:tracking-[3px]">
        Contact <span class="px-2 opacity-80" aria-hidden="true">|</span> Quotes
        <span class="px-2 opacity-80" aria-hidden="true">|</span> Call-outs
      </p>
      <h1
        id="contact-title"
        class="heading-display text-[clamp(40px,6vw,76px)] leading-[0.95] tracking-tight"
      >
        Get in <em class="text-primary not-italic">touch</em>
      </h1>
      <p class="mt-5 max-w-xl text-base text-zinc-200 sm:text-lg">
        Machine down, need a hose made up or want a quote for a ram rebuild?
        Call us, or send the details below and we'll get back to you.
      </p>
    </PageHero>

    <section class="bg-zinc-100 py-16 sm:py-20" aria-label="Contact options">
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
              title="Thanks, your enquiry has been sent"
              :ui="{
                title: 'heading-display text-xl text-green-800 sm:text-2xl',
                description: 'mt-2 text-base text-ink-950',
                icon: 'text-green-700',
              }"
            >
              <template #description>
                We'll be in touch as soon as possible. If your machine is down,
                call us on
                <a
                  :href="business.phoneHref"
                  class="font-extrabold whitespace-nowrap text-chs-600 underline"
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
              Send another enquiry
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
              <p class="kicker mb-3 text-chs-600">Send an enquiry</p>
              <h2 class="heading-display text-[clamp(24px,3vw,32px)]">
                Tell us what you need
              </h2>
              <p class="mt-2.5 text-[13px] text-zinc-600">
                Fields marked
                <span class="text-error" aria-hidden="true">*</span
                ><span class="sr-only">with an asterisk</span> are required.
              </p>
            </div>

            <div class="sr-only" aria-hidden="true">
              <label for="f-company-website">Leave this field empty</label>
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
              <UFormField label="Name" name="name" required>
                <UInput
                  v-model="state.name"
                  autocomplete="name"
                  size="xl"
                  class="w-full"
                />
              </UFormField>
              <UFormField label="Company" name="company" hint="Optional">
                <UInput
                  v-model="state.company"
                  autocomplete="organization"
                  size="xl"
                  class="w-full"
                />
              </UFormField>
              <UFormField label="Phone" name="phone" required>
                <UInput
                  v-model="state.phone"
                  type="tel"
                  autocomplete="tel"
                  inputmode="tel"
                  size="xl"
                  class="w-full"
                />
              </UFormField>
              <UFormField label="Email" name="email" required>
                <UInput
                  v-model="state.email"
                  type="email"
                  autocomplete="email"
                  size="xl"
                  class="w-full"
                />
              </UFormField>
              <UFormField label="Service" name="service" required>
                <USelect
                  v-model="state.service"
                  :items="serviceOptions"
                  placeholder="Choose a service"
                  size="xl"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Location or postcode"
                name="location"
                hint="Optional"
              >
                <UInput
                  v-model="state.location"
                  autocomplete="postal-code"
                  placeholder="e.g. SA14"
                  size="xl"
                  class="w-full"
                />
              </UFormField>
            </div>

            <UFormField label="How urgent is it?" name="urgency" required>
              <URadioGroup
                v-model="state.urgency"
                :items="urgencies"
                variant="card"
                orientation="horizontal"
                :ui="{
                  fieldset: 'flex-col sm:flex-row sm:flex-wrap gap-2.5',
                  item: 'has-data-[state=checked]:bg-chs-50',
                  label: 'font-semibold',
                }"
              />
            </UFormField>

            <UFormField label="Details" name="message" required>
              <UTextarea
                v-model="state.message"
                :rows="6"
                autoresize
                placeholder="Machine make/model, what's gone wrong, part numbers if you have them…"
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
                title="Sorry, your enquiry couldn't be sent"
                :ui="{
                  title: 'text-chs-800',
                  description: 'text-ink-950',
                  icon: 'text-chs-700',
                }"
              >
                <template #description>
                  Please try again, or call us on
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
                {{ status === "sending" ? "Sending…" : "Send enquiry" }}
              </UButton>
              <p class="text-[13px] text-zinc-600">
                We only use your details to respond to your enquiry.
              </p>
            </div>
          </UForm>
        </div>

        <aside
          class="grid gap-5 md:grid-cols-2 lg:grid-cols-1"
          aria-label="Contact details"
        >
          <div
            class="bg-primary p-6 text-white sm:p-7.5 md:col-span-2 lg:col-span-1"
          >
            <p class="kicker mb-3">Machine down?</p>
            <h2 class="heading-display mb-5 text-2xl leading-[1.1]">
              Call for emergency call&#8209;outs
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
                  class="font-bold wrap-anywhere hover:text-chs-600"
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
                  Opening hours
                </h3>
                <dl
                  class="mt-1.5 grid grid-cols-[auto_auto] gap-x-4 gap-y-1 text-sm"
                >
                  <template v-for="row in business.hours" :key="row.days">
                    <dt class="text-zinc-600">{{ row.days }}</dt>
                    <dd class="font-bold">{{ row.time }}</dd>
                  </template>
                </dl>
              </div>
            </li>
          </ul>

          <div class="bg-ink-900 px-5 py-6 text-white sm:px-7.5">
            <h3 class="heading-display mb-3.5 text-[13px] tracking-wide">
              Areas we cover
            </h3>
            <ul class="flex flex-wrap gap-2">
              <li v-for="area in business.serviceArea" :key="area">
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
