<script setup lang="ts">
import type { Service } from "~/content/types"

defineProps<{ service: Service; headingLevel?: "h2" | "h3" }>()

const localePath = useLocalePath()
</script>

<template>
  <article
    class="group relative flex flex-col bg-white shadow-[0_10px_30px_rgba(15,22,26,0.09)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(15,22,26,0.15)]"
  >
    <div class="relative aspect-220/130 bg-ink-950">
      <NuxtPicture
        :src="service.image"
        :alt="service.alt"
        sizes="220px"
        width="220"
        height="130"
        densities="x1"
        format="avif,webp"
        loading="lazy"
        :img-attrs="{ class: 'size-full object-cover' }"
      />
      <!-- Sized/positioned as percentages so it always covers the same spot of the photo. -->
      <span
        class="absolute top-[73%] left-[6%] grid aspect-square w-[21%] place-items-center bg-primary text-white rounded-md"
      >
        <UIcon :name="service.icon" class="size-[45%]" />
      </span>
    </div>
    <div class="relative flex-1 px-5 pt-8 pb-6 pr-12">
      <component
        :is="headingLevel ?? 'h3'"
        class="heading-display mb-2.5 text-lg leading-tight"
      >
        <NuxtLink
          :to="localePath(`/services/${service.slug}`)"
          class="after:absolute after:inset-0 after:z-10"
          >{{ service.title }}</NuxtLink
        >
      </component>
      <p class="text-sm text-zinc-600">{{ service.summary }}</p>
      <UIcon
        name="i-lucide-chevron-right"
        class="absolute right-4 bottom-6 size-5 text-primary transition-transform group-hover:translate-x-1"
      />
    </div>
  </article>
</template>
