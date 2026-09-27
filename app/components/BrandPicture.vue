<script setup lang="ts">
import type { BrandVariant } from "~/app.config"

// A <NuxtPicture> that shows the right image for the brand A/B variant. Renders one picture
// per variant that has its own image (from app.config `brand.images`) and lets CSS show only
// the active one, so the swap happens before first paint. All other attributes are passed
// through to <NuxtPicture>.
defineOptions({ inheritAttrs: false })
const props = defineProps<{ src: string }>()

const { brand } = useAppConfig()

const sources = computed(() => {
  const overrides = brand.images[props.src]
  if (!overrides) return [{ variant: null, src: props.src }]
  return brand.variants.map((variant: BrandVariant) => ({
    variant,
    src: overrides[variant] ?? props.src,
  }))
})
</script>

<template>
  <NuxtPicture
    v-for="source in sources"
    :key="source.src + source.variant"
    v-bind="$attrs"
    :src="source.src"
    :class="source.variant && `brand-only-${source.variant}`"
  />
</template>
