<script setup lang="ts">
import type { BookingService } from "#shared/utils/booking"

// Copy defaults to the current language's `cta` content; `enquiryTo` is an English path.
// `action` replaces the booking (or enquiry) button and the enquiry link (e.g. "Email your CV" on the careers pages).
const props = defineProps<{
  kicker?: string
  title?: string
  text?: string
  enquiryTo?: string
  action?: { label: string; to: string; icon?: string }
  // Pre-selects this job on /book (e.g. "hose" on the hose page).
  bookService?: BookingService
}>()

const { business } = useAppConfig()
const content = useContent()
const localePath = useLocalePath()
const booking = useBookingLink()

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
        <!-- Booking when it's on (enquiry as a link below), else the enquiry button. -->
        <UButton
          :to="
            action?.to ??
            (booking.available ? booking.to(bookService) : enquiryTo)
          "
          color="neutral"
          variant="outline"
          size="xl"
          :icon="
            action?.icon ??
            (booking.available ? 'i-lucide-calendar-check' : undefined)
          "
          :trailing-icon="
            action || booking.available ? undefined : 'i-lucide-chevron-right'
          "
          class="justify-center bg-transparent text-white ring-2 ring-white hover:bg-white hover:text-ink-950"
        >
          {{
            action?.label ??
            (booking.available
              ? booking.label.value
              : content.common.sendEnquiry)
          }}
        </UButton>
      </div>
      <ULink
        v-if="!action && booking.available"
        raw
        :to="enquiryTo"
        class="-mt-4 inline-flex items-center gap-2 text-[13px] font-extrabold tracking-wider text-white uppercase hover:underline"
      >
        {{ content.common.orSendEnquiry }}
        <UIcon name="i-lucide-chevron-right" class="size-4" />
      </ULink>
      <OpenStatus />
    </UContainer>
  </section>
</template>
