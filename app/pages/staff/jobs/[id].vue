<script setup lang="ts">
import { useEventListener } from "@vueuse/core"

// Staff app job: the customer, site and work, then what the mechanic does on it: notes and
// photos (each can be shared with the customer on "Track my repair"), hold/resume and marking
// the work complete. Everything is saved straight to Fergus.
defineI18nRoute(false)
definePageMeta({ layout: "staff", middleware: "staff" })

interface Job {
  id: number
  jobNo: string
  title: string
  description: string
  status: string
  onHold: boolean
  customer: string
  contact: { name: string; emails: string[]; phones: string[] }
  site: { name: string; lines: string[] }
  phases: { id: number; title: string; status: string }[]
  notes: {
    id: string
    text: string
    at: string
    by?: string
    shared: boolean
  }[]
  photos: {
    id: string
    url: string
    at: string
    by?: string
    shared: boolean
  }[]
}

const { api, copy } = useStaff()
const t = copy.job
const route = useRoute()
const toast = useToast()

const job = ref<Job>()
const status = ref<"loading" | "ready" | "error">("loading")
async function load() {
  try {
    job.value = await api<Job>(`/api/staff/jobs/${route.params.id}`)
    status.value = "ready"
  } catch {
    status.value = job.value ? "ready" : "error"
  }
}
await load()

const when = (iso: string) =>
  dayjs(iso).tz(businessTimeZone).locale("en-gb").format("D MMM, HH:mm")
const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`
const directions = computed(() =>
  job.value?.site.lines.length
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(job.value.site.lines.join(", "))}`
    : undefined,
)
const done = (phaseStatus: string) =>
  ["Labour Complete", "To Be Approved", "To Invoice", "Invoiced"].includes(
    phaseStatus,
  )

// Saves, reloads the job and says so (or that it failed).
const busy = ref("")
async function save(what: string, request: () => Promise<unknown>) {
  busy.value = what
  try {
    await request()
    await load()
    toast.add({ title: t.saved, color: "success", icon: "i-lucide-check" })
    return true
  } catch {
    toast.add({
      title: t.failed,
      color: "error",
      icon: "i-lucide-circle-alert",
    })
    return false
  } finally {
    busy.value = ""
  }
}

// Notes
const note = ref("")
const shareNote = ref(false)
async function addNote() {
  const text = note.value.trim()
  if (!text) return
  const ok = await save("note", () =>
    api(`/api/staff/jobs/${job.value!.id}/notes`, {
      method: "POST",
      body: { text, shared: shareNote.value },
    }),
  )
  if (ok) {
    note.value = ""
    shareNote.value = false
  }
}

// Photos: resized in the browser (longest side 2000px, JPEG) so uploads are quick on site.
const sharePhotos = ref(false)
const fileInput = ref<HTMLInputElement>()
const progress = ref<{ done: number; total: number }>()
async function resize(file: File) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("resize"))),
      "image/jpeg",
      0.82,
    ),
  )
}
async function upload(event: Event) {
  const files = [...((event.target as HTMLInputElement).files ?? [])]
  if (!files.length) return
  progress.value = { done: 0, total: files.length }
  await save("photos", async () => {
    for (const file of files) {
      const form = new FormData()
      form.append("photo", await resize(file), "photo.jpg")
      form.append("shared", String(sharePhotos.value))
      await api(`/api/staff/jobs/${job.value!.id}/photos`, {
        method: "POST",
        body: form,
      })
      progress.value!.done++
    }
  })
  progress.value = undefined
  if (fileInput.value) fileInput.value.value = ""
}

// Photo viewer
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
    : job.value?.photos[photoIndex.value],
)
function step(by: number) {
  const count = job.value?.photos.length ?? 0
  if (photoIndex.value === undefined || !count) return
  photoIndex.value = (photoIndex.value + by + count) % count
}
useEventListener("keydown", (e: KeyboardEvent) => {
  if (!photoOpen.value) return
  if (e.key === "ArrowLeft") step(-1)
  if (e.key === "ArrowRight") step(1)
})

// Hold / resume / complete
const holdOpen = ref(false)
const holdReason = ref("")
async function hold() {
  const ok = await save("hold", () =>
    api(`/api/staff/jobs/${job.value!.id}/hold`, {
      method: "POST",
      body: { hold: true, reason: holdReason.value },
    }),
  )
  if (ok) {
    holdOpen.value = false
    holdReason.value = ""
  }
}
const resume = () =>
  save("hold", () =>
    api(`/api/staff/jobs/${job.value!.id}/hold`, {
      method: "POST",
      body: { hold: false },
    }),
  )
const completing = ref<number>()
async function complete() {
  const phaseId = completing.value
  if (phaseId === undefined) return
  const ok = await save(`complete-${phaseId}`, () =>
    api(`/api/staff/jobs/${job.value!.id}/complete`, {
      method: "POST",
      body: { phaseId },
    }),
  )
  if (ok) completing.value = undefined
}
const completeOpen = computed({
  get: () => completing.value !== undefined,
  set: (open) => {
    if (!open) completing.value = undefined
  },
})
</script>

<template>
  <div>
    <UButton
      to="/staff"
      icon="i-lucide-chevron-left"
      color="neutral"
      variant="link"
      class="-ms-2 px-2"
    >
      {{ t.back }}
    </UButton>

    <div v-if="status === 'error'" class="mt-4 rounded-box bg-white p-6">
      <p>{{ t.failed }}</p>
    </div>

    <template v-else-if="job">
      <header class="mt-2">
        <p class="text-sm font-semibold text-chs-700">
          {{ t.jobNo(job.jobNo) }}
        </p>
        <h1 class="heading-display mt-1 text-3xl sm:text-4xl">
          {{ job.title }}
        </h1>
        <p v-if="job.customer" class="mt-1 text-lg text-zinc-700">
          {{ job.customer }}
        </p>
      </header>

      <UAlert
        v-if="job.onHold"
        class="mt-4"
        color="warning"
        variant="subtle"
        icon="i-lucide-pause-circle"
        :title="t.onHold"
      >
        <template #actions>
          <UButton
            color="warning"
            size="lg"
            icon="i-lucide-play"
            :loading="busy === 'hold'"
            @click="resume"
            >{{ t.resume }}</UButton
          >
        </template>
      </UAlert>

      <!-- Contact and site: big tap targets for gloved hands. -->
      <div class="mt-5 grid gap-3 md:grid-cols-2">
        <section class="rounded-box bg-white p-4 shadow-sm">
          <h2 class="text-xs font-bold tracking-wider text-zinc-500 uppercase">
            {{ t.contact }}
          </h2>
          <p class="mt-1 font-semibold">
            {{ job.contact.name || job.customer }}
          </p>
          <div class="mt-3 flex flex-wrap gap-2">
            <UButton
              v-for="phone in job.contact.phones"
              :key="phone"
              :to="telHref(phone)"
              icon="i-lucide-phone"
              size="lg"
            >
              {{ phone }}
            </UButton>
            <UButton
              v-for="email in job.contact.emails"
              :key="email"
              :to="`mailto:${email}`"
              icon="i-lucide-mail"
              color="neutral"
              variant="outline"
              size="lg"
              :aria-label="`${t.email} ${email}`"
            >
              {{ t.email }}
            </UButton>
          </div>
        </section>
        <section class="rounded-box bg-white p-4 shadow-sm">
          <h2 class="text-xs font-bold tracking-wider text-zinc-500 uppercase">
            {{ t.site }}
          </h2>
          <p class="mt-1 font-semibold">{{ job.site.name }}</p>
          <p class="text-sm text-zinc-600">{{ job.site.lines.join(", ") }}</p>
          <UButton
            v-if="directions"
            :to="directions"
            target="_blank"
            icon="i-lucide-navigation"
            color="neutral"
            variant="outline"
            size="lg"
            class="mt-3"
          >
            {{ t.directions }}
          </UButton>
        </section>
      </div>

      <section
        v-if="job.description"
        class="mt-3 rounded-box bg-white p-4 shadow-sm"
      >
        <h2 class="text-xs font-bold tracking-wider text-zinc-500 uppercase">
          {{ t.description }}
        </h2>
        <p class="mt-1 whitespace-pre-line">{{ job.description }}</p>
      </section>

      <!-- Work: each phase can be marked complete. -->
      <section class="mt-3 rounded-box bg-white p-4 shadow-sm">
        <h2 class="text-xs font-bold tracking-wider text-zinc-500 uppercase">
          {{ t.phases }}
        </h2>
        <ul class="mt-2 divide-y divide-zinc-100">
          <li
            v-for="phase in job.phases"
            :key="phase.id"
            class="flex flex-wrap items-center gap-3 py-3"
          >
            <div class="min-w-0 flex-1">
              <p class="font-semibold">{{ phase.title || job.title }}</p>
              <p class="text-sm text-zinc-500">{{ phase.status }}</p>
            </div>
            <UBadge
              v-if="done(phase.status)"
              color="success"
              variant="subtle"
              size="lg"
              icon="i-lucide-check"
              >{{ t.completed }}</UBadge
            >
            <UButton
              v-else
              icon="i-lucide-circle-check"
              size="lg"
              color="success"
              :loading="busy === `complete-${phase.id}`"
              @click="completing = phase.id"
            >
              {{ t.complete }}
            </UButton>
          </li>
        </ul>
        <UButton
          v-if="!job.onHold"
          icon="i-lucide-pause"
          color="warning"
          variant="outline"
          size="lg"
          class="mt-2"
          @click="holdOpen = true"
        >
          {{ t.hold }}
        </UButton>
      </section>

      <!-- Photos -->
      <section class="mt-3 rounded-box bg-white p-4 shadow-sm">
        <h2 class="text-xs font-bold tracking-wider text-zinc-500 uppercase">
          {{ t.photos }}
        </h2>
        <div class="mt-3 flex flex-wrap items-center gap-4">
          <UButton
            icon="i-lucide-camera"
            size="xl"
            :loading="busy === 'photos'"
            @click="fileInput?.click()"
          >
            {{
              progress
                ? t.uploading(progress.done, progress.total)
                : t.takePhoto
            }}
          </UButton>
          <USwitch
            v-model="sharePhotos"
            :label="t.share"
            :description="t.shareHelp"
            size="lg"
          />
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="upload"
          />
        </div>
        <p v-if="!job.photos.length" class="mt-4 text-sm text-zinc-500">
          {{ t.noPhotos }}
        </p>
        <ul v-else class="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
          <li v-for="(p, i) in job.photos" :key="p.id" class="relative">
            <button
              type="button"
              class="block w-full overflow-hidden rounded-box bg-zinc-100"
              :aria-label="`${t.photos} ${when(p.at)}`"
              @click="photoIndex = i"
            >
              <img
                :src="p.url"
                alt=""
                loading="lazy"
                class="aspect-square w-full object-cover"
              />
            </button>
            <UBadge
              :color="p.shared ? 'success' : 'neutral'"
              variant="solid"
              size="sm"
              class="absolute top-1.5 left-1.5"
              :icon="p.shared ? 'i-lucide-eye' : 'i-lucide-lock'"
              >{{ p.shared ? t.shared : t.internal }}</UBadge
            >
          </li>
        </ul>
      </section>

      <!-- Notes -->
      <section class="mt-3 rounded-box bg-white p-4 shadow-sm">
        <h2 class="text-xs font-bold tracking-wider text-zinc-500 uppercase">
          {{ t.notes }}
        </h2>
        <form class="mt-3 space-y-3" @submit.prevent="addNote">
          <UTextarea
            v-model="note"
            :placeholder="t.notePlaceholder"
            :aria-label="t.notePlaceholder"
            :rows="3"
            autoresize
            size="xl"
            class="w-full"
          />
          <div class="flex flex-wrap items-center justify-between gap-3">
            <USwitch
              v-model="shareNote"
              :label="t.share"
              :description="t.shareHelp"
              size="lg"
            />
            <UButton
              type="submit"
              icon="i-lucide-send"
              size="lg"
              :disabled="!note.trim()"
              :loading="busy === 'note'"
            >
              {{ t.addNote }}
            </UButton>
          </div>
        </form>
        <p v-if="!job.notes.length" class="mt-4 text-sm text-zinc-500">
          {{ t.noNotes }}
        </p>
        <ul v-else class="mt-4 space-y-3">
          <li
            v-for="n in job.notes"
            :key="n.id"
            class="rounded-box border-l-3 bg-zinc-50 py-2.5 ps-3 pe-3"
            :class="n.shared ? 'border-green-600' : 'border-zinc-300'"
          >
            <p
              class="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-500"
            >
              {{ when(n.at) }}<template v-if="n.by"> · {{ n.by }}</template>
              <UBadge
                :color="n.shared ? 'success' : 'neutral'"
                variant="subtle"
                size="sm"
                :icon="n.shared ? 'i-lucide-eye' : 'i-lucide-lock'"
                >{{ n.shared ? t.shared : t.internal }}</UBadge
              >
            </p>
            <p class="mt-1 whitespace-pre-line">{{ n.text }}</p>
          </li>
        </ul>
      </section>

      <UModal
        v-model:open="photoOpen"
        :title="t.photos"
        :description="
          photo
            ? `${when(photo.at)}${photo.by ? ` · ${photo.by}` : ''}`
            : undefined
        "
        :ui="{ content: 'sm:max-w-4xl', body: 'p-0 sm:p-0 bg-ink-950' }"
      >
        <template #body>
          <div v-if="photo" class="relative">
            <img
              :src="photo.url"
              alt=""
              class="aspect-4/3 max-h-[75vh] w-full object-contain"
            />
            <template v-if="job.photos.length > 1">
              <UButton
                icon="i-lucide-chevron-left"
                color="neutral"
                size="xl"
                :aria-label="t.previousPhoto"
                class="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/90 text-ink-950 hover:bg-white"
                @click="step(-1)"
              />
              <UButton
                icon="i-lucide-chevron-right"
                color="neutral"
                size="xl"
                :aria-label="t.nextPhoto"
                class="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/90 text-ink-950 hover:bg-white"
                @click="step(1)"
              />
            </template>
          </div>
        </template>
      </UModal>

      <UModal v-model:open="holdOpen" :title="t.hold">
        <template #body>
          <UTextarea
            v-model="holdReason"
            :placeholder="t.holdReason"
            :aria-label="t.holdReason"
            :rows="3"
            size="xl"
            class="w-full"
          />
        </template>
        <template #footer>
          <div class="flex w-full justify-end gap-2">
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              @click="holdOpen = false"
              >{{ t.cancel }}</UButton
            >
            <UButton
              color="warning"
              size="lg"
              icon="i-lucide-pause"
              :loading="busy === 'hold'"
              @click="hold"
              >{{ t.holdConfirm }}</UButton
            >
          </div>
        </template>
      </UModal>

      <UModal
        v-model:open="completeOpen"
        :title="t.complete"
        :description="t.completeConfirm"
      >
        <template #footer>
          <div class="flex w-full justify-end gap-2">
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              @click="completing = undefined"
              >{{ t.cancel }}</UButton
            >
            <UButton
              color="success"
              size="lg"
              icon="i-lucide-circle-check"
              :loading="busy.startsWith('complete')"
              @click="complete"
              >{{ t.complete }}</UButton
            >
          </div>
        </template>
      </UModal>
    </template>
  </div>
</template>
