<script setup lang="ts">
defineProps<{ labelledby: string }>()
</script>

<template>
  <section class="relative isolate overflow-hidden bg-ink-950 py-14 text-white sm:py-20" :aria-labelledby="labelledby">
    <!-- A real <img> (not a CSS background) so the browser finds and preloads the LCP image early. -->
    <NuxtPicture
      src="/images/hero.jpg"
      alt=""
      sizes="524px"
      width="524"
      height="328"
      densities="x1"
      format="avif,webp"
      :preload="{ fetchPriority: 'high' }"
      :img-attrs="{ fetchpriority: 'high', class: 'absolute inset-y-0 right-0 -z-20 h-full w-full object-cover lg:w-3/5' }"
    />
    <div class="absolute inset-y-0 right-0 -z-10 w-full bg-linear-to-r from-ink-950/95 to-ink-950/75 lg:w-3/5 lg:from-ink-950 lg:via-ink-950/70 lg:to-ink-950/35" aria-hidden="true" />
    <UContainer>
      <slot />
    </UContainer>
  </section>
</template>
