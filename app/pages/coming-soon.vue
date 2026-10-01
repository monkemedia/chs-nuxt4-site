<script setup lang="ts">
// Preview of the coming-soon holding page (see HoldingPage.vue). Not linked, kept out of search
// results and the sitemap; the real switch is NUXT_PUBLIC_SITE_MODE.
definePageMeta({ layout: false })
</script>

<template>
  <HoldingPage mode="coming-soon" preview />
</template>
