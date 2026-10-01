<script setup lang="ts">
const { content } = useSiteHead()
</script>

<template>
  <div id="top">
    <a
      href="#main"
      class="sr-only z-100 bg-white px-3.5 py-2.5 text-black focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >{{ content.common.skipToContent }}</a
    >
    <AppHeader />
    <main id="main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
