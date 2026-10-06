<script setup lang="ts">
import * as z from "zod"
import { useEventListener, usePreferredReducedMotion } from "@vueuse/core"

// "Track my repair": the customer's job number plus the email or phone they booked with, checked
// against Fergus (server/api/repair.post.ts). Needs the Fergus API, so like /book it only exists
// in a server build with live booking on: otherwise it isn't prerendered, linked or in the sitemap.
const { business, features } = useAppConfig()
const runtimeConfig = useRuntimeConfig()
const content = useContent()
const localePath = useLocalePath()
const router = useRouter()
const motion = usePreferredReducedMotion()
const page = computed(() => content.value.trackPage)

if (!runtimeConfig.public.liveBooking || !features.trackRepair)
  throw createError({
    statusCode: 404,
    statusMessage: page.value.crumb,
    fatal: true,
  })

usePageSeo({ ...page.value.seo, path: "/track", noindex: true })
useBreadcrumbs([
  { name: content.value.common.home, path: "/" },
  { name: page.value.crumb, path: "/track" },
])

const crumbs = computed(() => [
  { label: content.value.common.home, to: localePath("/") },
  { label: page.value.crumb, class: "text-white" },
])

const schema = computed(() => {
  const { errors } = page.value
  return z.object({
    // A phone number in the job number box is the likeliest slip, so it gets its own message.
    jobNo: z
      .string()
      .trim()
      .superRefine((value, ctx) => {
        if (/^#?\d{1,10}$/.test(value)) return
        const phone = /^\+|^0\d{5,}|^\d{11,}$/.test(value.replace(/\s/g, ""))
        ctx.addIssue({
          code: "custom",
          message: phone ? errors.jobNoPhone : errors.jobNo,
        })
      }),
    contact: z.string().trim().min(3, errors.contact),
  })
})
type Schema = z.output<typeof schema.value>
const state = reactive<Schema>({ jobNo: "", contact: "" })

const status = ref<"idle" | "loading" | "error">("idle")
const error = ref("")
const result = ref<RepairStatus>()
const resultEl = ref<HTMLElement>()

// The booking email links here with ?job=<number>. The page is prerendered without a query, so
// read it once mounted.
onMounted(() => {
  const job = router.currentRoute.value.query.job
  if (typeof job === "string" && /^\d{1,10}$/.test(job)) state.jobNo = job
})

async function onSubmit() {
  status.value = "loading"
  error.value = ""
  try {
    result.value = await $fetch<RepairStatus>("/api/repair", {
      method: "POST",
      body: { ...state },
    })
    status.value = "idle"
    await nextTick()
    resultEl.value?.scrollIntoView({
      behavior: motion.value === "reduce" ? "auto" : "smooth",
      block: "start",
    })
  } catch (e) {
    const code = (e as { statusCode?: number }).statusCode
    error.value =
      code === 404
        ? page.value.notFound
        : code === 429
          ? page.value.tooMany
          : page.value.failed
    status.value = "error"
  }
}

function reset() {
  result.value = undefined
  photoIndex.value = undefined
  state.jobNo = ""
}

const stageIndex = computed(() =>
  result.value ? repairStages.indexOf(result.value.stage) : -1,
)
const when = (date: string) =>
  dayjs(date)
    .tz(businessTimeZone)
    .locale(content.value.dateLocale)
    .format("D MMMM YYYY, HH:mm")
// Photo viewer: the index of the open photo, undefined when closed. Arrow keys step through.
const photoIndex = ref<number>()
const photoOpen = computed({
  get: () => photoIndex.value !== undefined,
  set: (open) => {
    if (!open) photoIndex.value = undefined
  },
})
const photo = computed(() =>
  photoIndex.value === undefined
    ? undefined
    : result.value?.photos[photoIndex.value],
)
function step(by: number) {
  const count = result.value?.photos.length ?? 0
  if (photoIndex.value === undefined || !count) return
  photoIndex.value = (photoIndex.value + by + count) % count
}
useEventListener("keydown", (e: KeyboardEvent) => {
  if (!photoOpen.value) return
  if (e.key === "ArrowLeft") step(-1)
  if (e.key === "ArrowRight") step(1)
})
const photoCaption = (p: { at: string; by?: string }) =>
  p.by ? `${when(p.at)} · ${p.by}` : when(p.at)
const photoAlt = (p: { at: string }) =>
  page.value.photoAlt.replace("{date}", when(p.at))

const updated = computed(() => (result.value ? when(result.value.updated) : ""))
</script>

<template>
  <div>
    <PageHero labelledby="track-title">
      <UBreadcrumb
        :items="crumbs"
        separator-icon="i-lucide-slash"
        :ui="heroBreadcrumbUi"
      />
      <h1
        id="track-title"
        class="heading-display text-[clamp(40px,6vw,76px)] leading-[0.95] tracking-tight"
      >
        {{ page.title[0] }}
        <em class="text-primary not-italic">{{ page.title[1] }}</em>
      </h1>
      <p class="mt-5 max-w-xl text-base text-zinc-200 sm:text-lg">
        {{ page.intro }}
      </p>
    </PageHero>

    <section class="bg-zinc-100 py-12 sm:py-16">
      <UContainer class="max-w-2xl">
        <div
          v-if="result"
          ref="resultEl"
          class="scroll-mt-(--ui-header-height) rounded-box border-t-4 border-primary bg-white p-6 shadow-sm sm:p-10"
          aria-live="polite"
        >
          <p class="kicker text-chs-700">
            {{ page.jobLabel.replace("{jobNo}", result.jobNo) }}
          </p>
          <h2 class="heading-display mt-2 text-[clamp(28px,4vw,40px)]">
            {{ page.stages[result.stage].title }}
          </h2>
          <p class="mt-2 text-zinc-700">{{ page.stages[result.stage].text }}</p>
          <p
            v-if="result.mechanic"
            class="mt-4 inline-flex items-center gap-2 rounded-full bg-zinc-100 py-1.5 ps-1.5 pe-4 text-sm"
          >
            <span
              class="grid size-7 place-items-center rounded-full bg-ink-950 text-xs font-bold text-white"
              aria-hidden="true"
              >{{ result.mechanic.charAt(0) }}</span
            >
            {{ page.mechanic.replace("{name}", result.mechanic) }}
          </p>

          <UAlert
            v-if="result.onHold"
            class="mt-5"
            color="warning"
            variant="subtle"
            icon="i-lucide-pause-circle"
            :description="page.onHold"
          />
          <UAlert
            v-else-if="result.quoteSent"
            class="mt-5"
            color="info"
            variant="subtle"
            icon="i-lucide-file-text"
            :description="page.quoteSent"
          />

          <ol class="mt-8 space-y-0">
            <li
              v-for="(stage, i) in repairStages"
              :key="stage"
              class="relative flex gap-4 pb-6 last:pb-0"
              :aria-current="i === stageIndex ? 'step' : undefined"
            >
              <span
                v-if="i < repairStages.length - 1"
                aria-hidden="true"
                class="absolute top-8 bottom-0 left-4 w-0.5 -translate-x-1/2"
                :class="i < stageIndex ? 'bg-primary' : 'bg-zinc-200'"
              />
              <span
                class="relative grid size-8 shrink-0 place-items-center rounded-full"
                :class="
                  i <= stageIndex
                    ? 'bg-primary text-white'
                    : 'bg-zinc-200 text-zinc-500'
                "
              >
                <UIcon
                  v-if="
                    i < stageIndex || (i === stageIndex && stage === 'done')
                  "
                  name="i-lucide-check"
                  class="size-4"
                />
                <span v-else class="text-sm font-bold">{{ i + 1 }}</span>
              </span>
              <div class="pt-1">
                <p
                  class="font-semibold"
                  :class="i <= stageIndex ? 'text-ink-950' : 'text-zinc-500'"
                >
                  {{ page.stages[stage].title }}
                  <span
                    v-if="i === stageIndex"
                    class="ms-2 rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-green-600/20"
                    >{{ page.current }}</span
                  >
                </p>
              </div>
            </li>
          </ol>

          <div
            v-if="result.notes.length"
            class="mt-10 border-t border-zinc-200 pt-8"
          >
            <h3 class="heading-display text-2xl">{{ page.updatesTitle }}</h3>
            <ul class="mt-5 space-y-4">
              <li
                v-for="note in result.notes"
                :key="note.at + note.text"
                class="rounded-box border-l-3 border-primary bg-zinc-50 py-3 ps-4 pe-3"
              >
                <p
                  class="text-xs font-semibold tracking-wide text-zinc-500 uppercase"
                >
                  {{ when(note.at)
                  }}<template v-if="note.by"> · {{ note.by }}</template>
                </p>
                <p class="mt-1 whitespace-pre-line text-zinc-800">
                  {{ note.text }}
                </p>
              </li>
            </ul>
          </div>

          <div
            v-if="result.photos.length"
            class="mt-10 border-t border-zinc-200 pt-8"
          >
            <h3 class="heading-display text-2xl">{{ page.photosTitle }}</h3>
            <ul class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <li v-for="(photo, i) in result.photos" :key="photo.url">
                <button
                  type="button"
                  class="block w-full cursor-zoom-in overflow-hidden rounded-box bg-zinc-100 ring-primary focus-visible:ring-2 focus-visible:outline-none"
                  :aria-label="page.openPhoto.replace('{date}', when(photo.at))"
                  @click="photoIndex = i"
                >
                  <img
                    :src="photo.url"
                    :alt="photoAlt(photo)"
                    loading="lazy"
                    class="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105 motion-reduce:transition-none"
                  />
                </button>
                <p class="mt-1.5 text-xs text-zinc-500">
                  {{ when(photo.at)
                  }}<template v-if="photo.by"> · {{ photo.by }}</template>
                </p>
              </li>
            </ul>
          </div>

          <UModal
            v-model:open="photoOpen"
            :title="page.photosTitle"
            :description="photo ? photoCaption(photo) : undefined"
            :ui="{ content: 'sm:max-w-4xl', body: 'p-0 sm:p-0 bg-ink-950' }"
          >
            <template #body>
              <div v-if="photo" class="relative">
                <img
                  :src="photo.url"
                  :alt="photoAlt(photo)"
                  class="aspect-4/3 max-h-[75vh] w-full object-contain"
                />
                <template v-if="result.photos.length > 1">
                  <UButton
                    icon="i-lucide-chevron-left"
                    color="neutral"
                    variant="solid"
                    size="lg"
                    :aria-label="page.previousPhoto"
                    class="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/90 text-ink-950 hover:bg-white"
                    @click="step(-1)"
                  />
                  <UButton
                    icon="i-lucide-chevron-right"
                    color="neutral"
                    variant="solid"
                    size="lg"
                    :aria-label="page.nextPhoto"
                    class="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/90 text-ink-950 hover:bg-white"
                    @click="step(1)"
                  />
                  <p
                    class="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white"
                  >
                    {{ (photoIndex ?? 0) + 1 }} / {{ result.photos.length }}
                  </p>
                </template>
              </div>
            </template>
          </UModal>

          <p class="mt-8 text-sm text-zinc-600">
            {{ page.updated.replace("{date}", updated) }}
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <UButton :to="business.phoneHref" icon="i-lucide-phone" size="lg">
              {{ content.common.call(business.phoneDisplay) }}
            </UButton>
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              icon="i-lucide-search"
              @click="reset"
            >
              {{ page.another }}
            </UButton>
          </div>
        </div>

        <UForm
          v-else
          :schema="schema"
          :state="state"
          class="space-y-5 rounded-box border-t-4 border-primary bg-white p-6 shadow-sm sm:p-10"
          @submit="onSubmit"
        >
          <h2 class="heading-display text-[clamp(24px,3vw,32px)]">
            {{ page.formTitle }}
          </h2>
          <UFormField
            eager-validation
            :label="page.fields.jobNo"
            name="jobNo"
            :help="page.jobNoHelp"
            required
          >
            <UInput
              v-model="state.jobNo"
              inputmode="numeric"
              autocomplete="off"
              size="xl"
              class="w-full"
            />
          </UFormField>
          <UFormField
            eager-validation
            :label="page.fields.contact"
            name="contact"
            :help="page.contactHelp"
            required
          >
            <UInput
              v-model="state.contact"
              autocomplete="email"
              size="xl"
              class="w-full"
            />
          </UFormField>
          <UAlert
            v-if="status === 'error'"
            color="error"
            variant="subtle"
            icon="i-lucide-circle-alert"
            :description="error"
            role="alert"
          />
          <UButton
            type="submit"
            size="xl"
            block
            icon="i-lucide-search"
            :loading="status === 'loading'"
          >
            {{ page.submit }}
          </UButton>
        </UForm>

        <p class="mt-8 text-center text-sm text-zinc-600">
          {{ page.help }}
          <a
            :href="business.phoneHref"
            class="font-semibold text-chs-700 underline"
            >{{ business.phoneDisplay }}</a
          >.
        </p>
      </UContainer>
    </section>
  </div>
</template>
