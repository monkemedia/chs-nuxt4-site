<script setup lang="ts">
// Pressure gauge, 0–400 bar over a 270° dial. The error page drops the needle to zero with
// the error code on the readout; the holding pages build it up to working pressure ("SOON")
// or rest it at zero ("503").
const props = withDefaults(
  defineProps<{
    reading: string | number
    unit: string
    label: string
    // Where the needle settles, in bar.
    bar?: number
    // "drop": falls from high pressure. "build": climbs from zero.
    motion?: "drop" | "build"
  }>(),
  { bar: 0, motion: "drop" },
)

const cx = 120
const cy = 120
const max = 400
// Angle clockwise from 12 o'clock for a pressure in bar.
const angle = (bar: number) => -135 + (bar / max) * 270
const point = (bar: number, r: number) => {
  const rad = (angle(bar) * Math.PI) / 180
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) }
}

const ticks = Array.from({ length: max / 20 + 1 }, (_, i) => {
  const bar = i * 20
  const major = bar % 100 === 0
  const from = point(bar, major ? 78 : 83)
  const to = point(bar, 92)
  return { bar, major, from, to, text: point(bar, 64) }
})

// The readout box grows with longer readings ("CYN HIR"), centred under the needle.
const readoutWidth = computed(() =>
  Math.max(64, String(props.reading).length * 14 + 16),
)

// Red zone from 320 bar to the top of the scale.
const redFrom = point(320, 92)
const redTo = point(max, 92)
const redZone = `M ${redFrom.x} ${redFrom.y} A 92 92 0 0 1 ${redTo.x} ${redTo.y}`
</script>

<template>
  <svg viewBox="0 0 240 240" role="img" :aria-label="label">
    <circle
      :cx="cx"
      :cy="cy"
      r="112"
      class="fill-ink-900 stroke-ink-700"
      stroke-width="3"
    />
    <circle :cx="cx" :cy="cy" r="100" class="fill-ink-950" />
    <path :d="redZone" class="fill-none stroke-primary" stroke-width="7" />
    <line
      v-for="tick in ticks"
      :key="tick.bar"
      :x1="tick.from.x"
      :y1="tick.from.y"
      :x2="tick.to.x"
      :y2="tick.to.y"
      :class="tick.major ? 'stroke-white' : 'stroke-zinc-500'"
      :stroke-width="tick.major ? 3 : 1.5"
    />

    <rect
      :x="cx - readoutWidth / 2"
      y="176"
      :width="readoutWidth"
      height="30"
      rx="3"
      class="fill-ink-900 stroke-ink-700"
    />
    <text
      :x="cx"
      y="191"
      text-anchor="middle"
      dominant-baseline="central"
      class="fill-chs-400 font-display text-[20px] font-black tracking-[2px]"
    >
      {{ reading }}
    </text>
    <text
      :x="cx"
      y="220"
      text-anchor="middle"
      class="fill-zinc-500 text-[10px] font-bold tracking-[3px] uppercase"
    >
      {{ unit }}
    </text>

    <!-- Rotated to its resting pressure; the inner group animates relative to that. -->
    <g :transform="`rotate(${angle(props.bar)} ${cx} ${cy})`">
      <g
        class="origin-[120px_120px] motion-reduce:animate-none"
        :class="
          props.motion === 'build'
            ? 'animate-needle-build'
            : 'animate-needle-drop'
        "
      >
        <polygon
          :points="`${cx - 4},${cy} ${cx},${cy - 88} ${cx + 4},${cy}`"
          class="fill-primary"
        />
        <line
          :x1="cx"
          :y1="cy"
          :x2="cx"
          :y2="cy + 18"
          class="stroke-primary"
          stroke-width="6"
          stroke-linecap="round"
        />
      </g>
    </g>
    <!-- Numbers drawn over the needle so the 0 it rests on stays readable. -->
    <text
      v-for="tick in ticks.filter((t) => t.major)"
      :key="`label-${tick.bar}`"
      :x="tick.text.x"
      :y="tick.text.y"
      text-anchor="middle"
      dominant-baseline="central"
      class="fill-zinc-400 stroke-ink-950 font-display text-[11px] font-black [paint-order:stroke]"
      stroke-width="3"
    >
      {{ tick.bar }}
    </text>
    <circle
      :cx="cx"
      :cy="cy"
      r="10"
      class="fill-ink-700 stroke-primary"
      stroke-width="3"
    />
  </svg>
</template>
