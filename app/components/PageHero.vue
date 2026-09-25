<script setup lang="ts">
defineProps<{ labelledby: string }>()
</script>

<template>
  <section class="page-hero" :aria-labelledby="labelledby">
    <!-- A real <img> (not a CSS background) so the browser finds and preloads the LCP image early. -->
    <NuxtPicture class="page-hero-media" src="/images/hero.jpg" alt="" sizes="524px" width="524" height="328" densities="x1" format="avif,webp" :preload="{ fetchPriority: 'high' }" :img-attrs="{ fetchpriority: 'high' }" />
    <div class="container">
      <slot />
    </div>
  </section>
</template>
