<script setup lang="ts">
// Copy defaults to the current language's `cta` content; `enquiryTo` is an English path.
const props = defineProps<{
  kicker?: string
  title?: string
  text?: string
  enquiryTo?: string
}>()

const { business } = useAppConfig()
const content = useContent()
const localePath = useLocalePath()

const kicker = computed(() => props.kicker ?? content.value.cta.kicker)
const title = computed(() => props.title ?? content.value.cta.title)
const text = computed(() => props.text ?? content.value.cta.text)
const enquiryTo = computed(() => localePath(props.enquiryTo ?? "/contact"))
</script>

<template>
  <section
    class="relative isolate overflow-hidden bg-ink-950 py-18 text-white sm:py-24"
    aria-labelledby="cta-title"
  >
    <NuxtPicture
      src="/images/digger-cta.jpg"
      alt=""
      sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw"
      width="2170"
      height="900"
      format="avif,webp"
      loading="lazy"
      :img-attrs="{
        class:
          'absolute inset-0 -z-20 size-full object-cover object-[70%_center]',
      }"
    />
    <!-- Darkest behind the text (left on desktop, everywhere on mobile) so white text stays readable. -->
    <div
      class="absolute inset-0 -z-10 bg-ink-950/80 md:bg-transparent md:bg-linear-to-r md:from-ink-950/95 md:via-ink-950/80 md:to-ink-950/35"
      aria-hidden="true"
    />
    <UContainer class="flex flex-col items-start gap-8">
      <div>
        <p class="kicker mb-3 text-chs-400">{{ kicker }}</p>
        <h2
          id="cta-title"
          class="heading-display mb-3 text-3xl whitespace-pre-line sm:text-[44px]"
        >
          {{ title }}
        </h2>
        <p class="max-w-xl text-zinc-200">{{ text }}</p>
      </div>
      <div class="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
        <UButton
          :to="business.phoneHref"
          icon="i-lucide-phone"
          size="xl"
          class="justify-center"
          >{{ business.phoneDisplay }}</UButton
        >
        <UButton
          :to="enquiryTo"
          color="neutral"
          variant="outline"
          size="xl"
          trailing-icon="i-lucide-chevron-right"
          class="justify-center bg-transparent text-white ring-2 ring-white hover:bg-white hover:text-ink-950"
        >
          {{ content.common.sendEnquiry }}
        </UButton>
      </div>
    </UContainer>
  </section>
</template>
