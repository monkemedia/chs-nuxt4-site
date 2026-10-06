<script setup lang="ts">
// NUXT_PUBLIC_SITE_MODE=coming-soon or maintenance shows the holding page on every URL, except
// the staff app (mechanics keep working while the public site is down).
const runtimeConfig = useRuntimeConfig()
const route = useRoute()
const siteMode = runtimeConfig.public.siteMode as
  "live" | "coming-soon" | "maintenance"
const holding = computed(
  () => siteMode !== "live" && !route.path.startsWith("/staff"),
)
</script>

<template>
  <UApp>
    <HoldingPage v-if="holding && siteMode !== 'live'" :mode="siteMode" />
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
