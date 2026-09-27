<script setup lang="ts">
const { brand } = useAppConfig()

// Brand A/B test: pick the visitor's variant and set <html data-brand> before first paint,
// so there's no flash of the wrong colours or logo. Order of precedence: ?brand= in the URL
// (forces and remembers a variant), a previous assignment in localStorage, then a random
// pick (when the test is on) or the default.
const brandScript = `(() => {
  const config = ${JSON.stringify({ abTest: brand.abTest, fallback: brand.default, variants: brand.variants })}
  const key = "chs-brand"
  const valid = (v) => config.variants.includes(v)
  let variant = new URLSearchParams(location.search).get("brand")
  try {
    if (!valid(variant)) variant = localStorage.getItem(key)
    if (!valid(variant))
      variant = config.abTest
        ? config.variants[Math.floor(Math.random() * config.variants.length)]
        : config.fallback
    localStorage.setItem(key, variant)
  } catch {
    if (!valid(variant)) variant = config.fallback
  }
  document.documentElement.dataset.brand = variant
})()`

useHead({
  script: [
    {
      key: "brand",
      innerHTML: brandScript,
      tagPosition: "head",
      tagPriority: "critical",
    },
  ],
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
