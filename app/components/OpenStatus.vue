<script setup lang="ts">
// "Open now" / "Closed, opens Monday at 08:00" line for dark backgrounds, from app.config
// `openingHours` in UK time. Rendered in the browser only, since the pages are prerendered.
const { business } = useAppConfig()
const content = useContent()

const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

// "Mo-Fr 08:00-17:30" -> one { open, close } (minutes) per weekday, Monday first.
const schedule = computed(() => {
  const week: ({ open: number; close: number } | null)[] = days.map(() => null)
  const minutes = (time: string) => {
    const [h, m] = time.split(":").map(Number)
    return h! * 60 + m!
  }
  for (const spec of business.openingHours) {
    const [dayPart, timePart] = spec.split(" ")
    const [from, to = from] = dayPart!.split("-")
    const [open, close] = timePart!.split("-")
    for (let d = days.indexOf(from!); d <= days.indexOf(to!); d++)
      week[d] = { open: minutes(open!), close: minutes(close!) }
  }
  return week
})

const status = ref<{ open: boolean; text: string } | null>(null)

function update() {
  const { dateLocale, openStatus } = content.value
  const now = dayjs().tz(businessTimeZone).locale(dateLocale)
  // dayjs weeks start on Sunday (0); the schedule starts on Monday.
  const today = (now.day() + 6) % 7
  const minute = now.hour() * 60 + now.minute()
  const hours = schedule.value[today]

  if (hours && minute >= hours.open && minute < hours.close) {
    status.value = { open: true, text: openStatus.open }
    return
  }

  for (let ahead = 0; ahead < 7; ahead++) {
    const next = schedule.value[(today + ahead) % 7]
    if (!next || (ahead === 0 && minute >= next.open)) continue
    const opens = now.add(ahead, "day").startOf("day").add(next.open, "minute")
    const time = opens.format("HH:mm")
    const when =
      ahead === 0
        ? openStatus.today(time)
        : ahead === 1
          ? openStatus.tomorrow(time)
          : openStatus.on(opens.format("dddd"), time)
    status.value = { open: false, text: openStatus.closed(when) }
    return
  }
}

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  update()
  timer = setInterval(update, 60_000)
})
onBeforeUnmount(() => clearInterval(timer))
watch(content, update)
</script>

<template>
  <p
    v-if="status"
    class="flex items-center gap-2.5 text-sm font-semibold text-zinc-200"
    role="status"
  >
    <span class="relative flex size-2.5 shrink-0" aria-hidden="true">
      <span
        v-if="status.open"
        class="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:hidden"
      />
      <span
        class="relative inline-flex size-2.5 rounded-full"
        :class="status.open ? 'bg-emerald-400' : 'bg-amber-400'"
      />
    </span>
    {{ status.text }}
  </p>
</template>
