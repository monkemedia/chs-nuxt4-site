<script setup lang="ts">
// NUXT_PUBLIC_SITE_MODE=coming-soon or maintenance shows the holding page on every URL.
const runtimeConfig = useRuntimeConfig()
const siteMode = runtimeConfig.public.siteMode as
  "live" | "coming-soon" | "maintenance"
</script>

<template>
  <UApp>
    <HoldingPage v-if="siteMode !== 'live'" :mode="siteMode" />
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
