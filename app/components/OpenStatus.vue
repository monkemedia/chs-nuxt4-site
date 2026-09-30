<script setup lang="ts">
// "Open now" / "Closed, opens Monday at 08:00" line for dark backgrounds, from the opening
// hours and holiday closures (useOpeningHours) in UK time. Rendered in the browser only,
// since the pages are prerendered.
const content = useContent()
const { week: schedule, closures } = useOpeningHours()

const closureOn = (date: string) =>
  closures.value.find((c) => date >= c.from && date <= c.to)

// "Closing soon" for the last hour before closing time.
const closingSoonMinutes = 60
// A closure starting within this many days is mentioned in advance.
const noticeDays = 7

const status = ref<{
  open: boolean
  closingSoon?: boolean
  text: string
  notice?: string
} | null>(null)

function update() {
  const { dateLocale, openStatus } = content.value
  const now = dayjs().tz(businessTimeZone).locale(dateLocale)
  // dayjs weeks start on Sunday (0); the schedule starts on Monday.
  const weekday = (date: typeof now) => (date.day() + 6) % 7
  const minute = now.hour() * 60 + now.minute()
  const today = now.format("YYYY-MM-DD")
  const closure = closureOn(today)
  const hours = schedule[weekday(now)]
  // Heads-up for a closure coming up soon: "Closed 24 Dec – 1 Jan for Christmas".
  const soon = closures.value.find(
    (c) =>
      c.from > today &&
      c.from <= now.add(noticeDays, "day").format("YYYY-MM-DD"),
  )
  const notice = soon
    ? openStatus.closureNotice(soon.dates, soon.reason)
    : undefined

  if (!closure && hours && minute >= hours.open && minute < hours.close) {
    // In the last hour: "Closing soon: closes at 17:00", in amber.
    const closingSoon = hours.close - minute <= closingSoonMinutes
    status.value = {
      open: true,
      closingSoon,
      text: closingSoon
        ? openStatus.closesSoon(
            now.startOf("day").add(hours.close, "minute").format("HH:mm"),
          )
        : openStatus.open,
      notice,
    }
    return
  }

  // The next opening, skipping holiday closures (up to a couple of months ahead).
  for (let ahead = 0; ahead < 62; ahead++) {
    const date = now.add(ahead, "day")
    const next = schedule[weekday(date)]
    if (!next || closureOn(date.format("YYYY-MM-DD"))) continue
    if (ahead === 0 && minute >= next.open) continue
    const opens = date.startOf("day").add(next.open, "minute")
    const time = opens.format("HH:mm")
    const when =
      ahead === 0
        ? openStatus.today(time)
        : ahead === 1
          ? openStatus.tomorrow(time)
          : // Beyond this week, give the date too ("Monday 5 January").
            openStatus.on(
              opens.format(ahead < 7 ? "dddd" : "dddd D MMMM"),
              time,
            )
    status.value = {
      open: false,
      text: closure
        ? openStatus.closedFor(closure.reason, when)
        : openStatus.closed(when),
      // During a closure the next opening already says when we're back.
      notice: closure ? undefined : notice,
    }
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
    class="flex items-baseline gap-2.5 text-sm font-semibold text-zinc-200"
    role="status"
  >
    <span class="relative flex size-2.5 shrink-0" aria-hidden="true">
      <span
        v-if="status.open"
        class="absolute inline-flex size-full animate-ping rounded-full opacity-75 motion-reduce:hidden"
        :class="status.closingSoon ? 'bg-amber-400' : 'bg-emerald-400'"
      />
      <span
        class="relative inline-flex size-2.5 rounded-full"
        :class="
          status.open && !status.closingSoon ? 'bg-emerald-400' : 'bg-amber-400'
        "
      />
    </span>
    <span>
      {{ status.text }}
      <span v-if="status.notice" class="mt-0.5 block text-amber-300">
        {{ status.notice }}
      </span>
    </span>
  </p>
</template>
