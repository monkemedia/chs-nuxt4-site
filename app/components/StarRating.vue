<script setup lang="ts">
const props = defineProps<{ rating: number }>()

const stars = computed(() =>
  Array.from({ length: 5 }, (_, i) => i < Math.round(props.rating)),
)
</script>

<template>
  <span
    class="inline-flex gap-0.5"
    role="img"
    :aria-label="`Rated ${rating} out of 5`"
  >
    <UIcon
      v-for="(filled, i) in stars"
      :key="i"
      name="i-chs-star"
      class="size-[1em]"
      :class="filled ? 'text-amber-400' : 'text-zinc-300'"
    />
  </span>
</template>
