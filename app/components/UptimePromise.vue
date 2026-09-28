<script setup lang="ts">
// The Uptime Promise guarantee band. Renders nothing until app.config `offer.uptimePromise`
// and `features.onsite` are both on, so it can't go live before CHS can deliver it.
const { features, offer } = useAppConfig()
const content = useContent()
</script>

<template>
  <section
    v-if="features.onsite && offer.uptimePromise"
    class="bg-chs-700 py-12 text-white sm:py-14"
    aria-labelledby="uptime-title"
  >
    <UContainer
      class="grid items-center gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:gap-10"
    >
      <UIcon name="i-lucide-shield-check" class="size-16 sm:size-20" />
      <div>
        <p class="kicker mb-2 text-white">
          {{ content.uptimePromise.kicker }}
        </p>
        <h2
          id="uptime-title"
          class="heading-display text-[clamp(26px,3.4vw,40px)] leading-[1.05]"
        >
          {{ content.uptimePromise.title }}
        </h2>
        <p class="mt-3 max-w-2xl text-base font-semibold">
          {{ content.uptimePromise.text }}
        </p>
        <p class="mt-3 max-w-2xl text-xs text-white/85">
          {{ content.uptimePromise.terms }}
        </p>
      </div>
    </UContainer>
  </section>
</template>
