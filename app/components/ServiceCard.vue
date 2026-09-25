<script setup lang="ts">
import type { Service } from '~/data/services'

defineProps<{ service: Service, headingLevel?: 'h2' | 'h3' }>()
</script>

<template>
  <article class="service-card">
    <div class="service-media">
      <NuxtPicture :src="service.image" :alt="service.alt" sizes="220px" width="220" height="130" densities="x1" format="avif,webp" loading="lazy" />
      <span class="service-badge"><AppIcon :name="service.icon" /></span>
    </div>
    <div class="service-body">
      <component :is="headingLevel ?? 'h3'" class="service-title"><NuxtLink :to="`/services/${service.slug}`">{{ service.title }}</NuxtLink></component>
      <p>{{ service.summary }}</p>
      <AppIcon name="chevron" class="service-arrow" />
    </div>
  </article>
</template>
