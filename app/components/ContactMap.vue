<script setup lang="ts">
// Location map for the contact page. Shows a static OpenStreetMap preview first; the live
// Google map (which sets Google cookies and loads a lot of script) only loads when the visitor
// asks for it, so the site stays cookie-free and fast. "Get directions" opens Google Maps.
const { business } = useAppConfig()
const content = useContent()
const map = computed(() => content.value.contact.map)

const interactive = ref(false)
</script>

<template>
  <div
    class="relative aspect-4/3 overflow-hidden rounded-box sm:aspect-video bg-zinc-200 shadow-[0_10px_30px_rgba(15,22,26,0.08)]"
  >
    <iframe
      v-if="interactive"
      :src="mapEmbedUrl(business.address)"
      :title="map.iframeTitle"
      class="absolute inset-0 size-full border-0"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
    />
    <template v-else>
      <NuxtPicture
        src="/images/map-cross-hands.jpg"
        :alt="map.previewAlt"
        sizes="800px"
        width="1200"
        height="676"
        densities="x1"
        format="avif,webp"
        loading="lazy"
        :img-attrs="{ class: 'absolute inset-0 size-full object-cover' }"
      />
      <div
        class="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 bg-linear-to-t from-ink-950/70 to-transparent p-4 sm:p-5"
      >
        <div>
          <UButton
            icon="i-lucide-map"
            color="neutral"
            size="lg"
            class="bg-white text-ink-950 hover:bg-zinc-100"
            @click="interactive = true"
          >
            {{ map.show }}
          </UButton>
          <p class="mt-2 text-xs text-white">{{ map.note }}</p>
        </div>
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener"
          class="text-[11px] text-white/85 hover:text-white"
          >{{ map.attribution }}</a
        >
      </div>
    </template>
  </div>
</template>
