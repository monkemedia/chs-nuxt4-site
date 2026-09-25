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
    class="border-t border-zinc-200 bg-zinc-100 py-16 sm:py-18"
    aria-labelledby="cta-title"
  >
    <UContainer
      class="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"
    >
      <div>
        <p class="kicker mb-3 text-chs-600">{{ kicker }}</p>
        <h2 id="cta-title" class="heading-display mb-3 text-3xl sm:text-[44px]">
          {{ title }}
        </h2>
        <p class="text-zinc-600">{{ text }}</p>
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
          class="justify-center bg-transparent ring-2 ring-ink-950 text-ink-950 hover:bg-ink-950 hover:text-white"
        >
          {{ content.common.sendEnquiry }}
        </UButton>
      </div>
    </UContainer>
  </section>
</template>
