<script setup lang="ts">
// Staff app home: the signed-in mechanic's Fergus diary for a day (today first), and a job
// number search for anything not in it.
defineI18nRoute(false)
definePageMeta({ layout: "staff", middleware: "staff" })

interface DiaryEntry {
  start: string
  end: string
  allDay: boolean
  title: string
  jobId?: number
  jobNo?: string
  customer?: string
  site?: string
  onHold?: boolean
}

const { user, api, copy } = useStaff()
const NuxtLink = resolveComponent("NuxtLink")
const t = copy.diary
const router = useRouter()

const today = dayjs().tz(businessTimeZone).format("YYYY-MM-DD")
const day = useState("staff-day", () => today)
const entries = ref<DiaryEntry[]>([])
const status = ref<"loading" | "ready" | "error">("loading")

async function load() {
  status.value = "loading"
  try {
    entries.value = await api<DiaryEntry[]>("/api/staff/diary", {
      query: { day: day.value },
    })
    status.value = "ready"
  } catch {
    status.value = "error"
  }
}
watch(day, load, { immediate: true })

function shift(by: number) {
  day.value = dayjs(day.value).add(by, "day").format("YYYY-MM-DD")
}
const dayLabel = computed(() => {
  const diff = dayjs(day.value).diff(today, "day")
  const date = dayjs(day.value).locale("en-gb").format("dddd D MMMM")
  const name =
    diff === 0
      ? t.today
      : diff === 1
        ? t.tomorrow
        : diff === -1
          ? t.yesterday
          : ""
  return { name, date }
})
const time = (iso: string) => dayjs(iso).tz(businessTimeZone).format("HH:mm")

// Job number search.
const jobNo = ref("")
const finding = ref(false)
const findError = ref("")
async function find() {
  const no = jobNo.value.trim().replace(/^#/, "")
  if (!/^\d{1,10}$/.test(no)) return
  finding.value = true
  findError.value = ""
  try {
    const { id } = await api<{ id: number }>("/api/staff/find", {
      query: { jobNo: no },
    })
    await router.push(`/staff/jobs/${id}`)
  } catch {
    findError.value = t.notFound
  } finally {
    finding.value = false
  }
}
</script>

<template>
  <div>
    <h1 v-if="user" class="heading-display text-3xl sm:text-4xl">
      {{ t.hello(user.firstName) }}
    </h1>

    <form class="mt-4 flex gap-2" @submit.prevent="find">
      <UInput
        v-model="jobNo"
        :placeholder="t.find"
        :aria-label="t.find"
        inputmode="numeric"
        icon="i-lucide-search"
        size="xl"
        class="flex-1"
      />
      <UButton type="submit" size="xl" color="neutral" :loading="finding">
        {{ t.findButton }}
      </UButton>
    </form>
    <p v-if="findError" class="mt-2 text-sm text-error" role="alert">
      {{ findError }}
    </p>

    <div
      class="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-20 -mx-4 mt-5 flex items-center gap-2 bg-zinc-100/95 px-4 py-2 backdrop-blur"
    >
      <UButton
        icon="i-lucide-chevron-left"
        color="neutral"
        variant="outline"
        size="xl"
        class="bg-white"
        :aria-label="t.previous"
        @click="shift(-1)"
      />
      <button
        type="button"
        class="flex-1 text-center"
        :disabled="day === today"
        @click="day = today"
      >
        <span v-if="dayLabel.name" class="block text-lg font-bold">{{
          dayLabel.name
        }}</span>
        <span
          class="block"
          :class="dayLabel.name ? 'text-sm text-zinc-600' : 'text-lg font-bold'"
          >{{ dayLabel.date }}</span
        >
      </button>
      <UButton
        icon="i-lucide-chevron-right"
        color="neutral"
        variant="outline"
        size="xl"
        class="bg-white"
        :aria-label="t.next"
        @click="shift(1)"
      />
    </div>

    <div v-if="status === 'loading'" class="mt-4 space-y-3">
      <USkeleton v-for="i in 3" :key="i" class="h-24 rounded-box" />
    </div>
    <div
      v-else-if="status === 'error'"
      class="mt-6 rounded-box bg-white p-6 text-center"
    >
      <p>{{ t.failed }}</p>
      <UButton class="mt-4" icon="i-lucide-refresh-cw" @click="load">
        {{ t.retry }}
      </UButton>
    </div>
    <p
      v-else-if="!entries.length"
      class="mt-6 rounded-box bg-white p-8 text-center text-zinc-600"
    >
      {{ t.empty }}
    </p>
    <ul v-else class="mt-4 grid gap-3 md:grid-cols-2">
      <li v-for="entry in entries" :key="entry.start + entry.title">
        <component
          :is="entry.jobId ? NuxtLink : 'div'"
          :to="entry.jobId ? `/staff/jobs/${entry.jobId}` : undefined"
          class="flex h-full gap-4 rounded-box border-l-4 bg-white p-4 shadow-sm transition-colors"
          :class="[
            entry.onHold ? 'border-amber-500' : 'border-primary',
            entry.jobId && 'active:bg-zinc-50 hover:bg-zinc-50',
          ]"
        >
          <div class="w-14 shrink-0 text-sm font-semibold tabular-nums">
            <template v-if="entry.allDay">{{ t.allDay }}</template>
            <template v-else>
              {{ time(entry.start) }}
              <span class="block font-normal text-zinc-500">{{
                time(entry.end)
              }}</span>
            </template>
          </div>
          <div class="min-w-0 flex-1">
            <p class="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
              <span v-if="entry.jobNo" class="font-semibold text-chs-700"
                >#{{ entry.jobNo }}</span
              >
              <UBadge
                v-if="entry.onHold"
                color="warning"
                variant="subtle"
                size="sm"
                >{{ t.onHold }}</UBadge
              >
            </p>
            <p class="mt-0.5 font-semibold">{{ entry.title }}</p>
            <p v-if="entry.customer" class="text-sm text-zinc-700">
              {{ entry.customer }}
            </p>
            <p
              v-if="entry.site"
              class="mt-1 flex items-center gap-1 text-sm text-zinc-500"
            >
              <UIcon name="i-lucide-map-pin" class="size-3.5 shrink-0" />
              <span class="truncate">{{ entry.site }}</span>
            </p>
          </div>
          <UIcon
            v-if="entry.jobId"
            name="i-lucide-chevron-right"
            class="size-5 self-center text-zinc-400"
          />
        </component>
      </li>
    </ul>
  </div>
</template>
