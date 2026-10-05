<script setup lang="ts">
// Online booking against the Fergus diary (<BookingPicker>). Only exists while live booking is
// on (nuxt.config `liveBooking`): otherwise it isn't prerendered or linked, and the booking
// buttons hide (useBookingLink). Anything that isn't bookable goes to the contact form.
const runtimeConfig = useRuntimeConfig()
const content = useContent()
const localePath = useLocalePath()
const page = computed(() => content.value.bookPage)

if (!runtimeConfig.public.liveBooking)
  throw createError({
    statusCode: 404,
    statusMessage: page.value.crumb,
    fatal: true,
  })

usePageSeo({ ...page.value.seo, path: "/book" })
useBreadcrumbs([
  { name: content.value.common.home, path: "/" },
  { name: page.value.crumb, path: "/book" },
])

const crumbs = computed(() => [
  { label: content.value.common.home, to: localePath("/") },
  { label: page.value.crumb, class: "text-white" },
])
</script>

<template>
  <div>
    <PageHero labelledby="book-title">
      <UBreadcrumb
        :items="crumbs"
        separator-icon="i-lucide-slash"
        :ui="heroBreadcrumbUi"
      />
      <p class="kicker mb-4 sm:tracking-[3px]">
        <template v-for="(word, i) in page.live.kicker" :key="word"
          ><span v-if="i" class="px-2 opacity-80" aria-hidden="true">|</span
          >{{ word }}</template
        >
      </p>
      <h1
        id="book-title"
        class="heading-display text-[clamp(40px,6vw,76px)] leading-[0.95] tracking-tight"
      >
        {{ page.live.title[0] }}
        <em class="text-primary not-italic">{{ page.live.title[1] }}</em>
      </h1>
      <p class="mt-5 max-w-xl text-base text-zinc-200 sm:text-lg">
        {{ page.live.intro }}
      </p>
      <ul
        class="mt-10 grid gap-5 border-t border-white/15 pt-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        <li
          v-for="item in page.live.benefits"
          :key="item.title"
          class="flex items-center gap-3.5"
        >
          <span
            class="grid size-12 shrink-0 place-items-center rounded-full ring-2 ring-primary"
          >
            <UIcon :name="item.icon" class="size-6 text-white" />
          </span>
          <span>
            <span
              class="block text-sm font-extrabold tracking-wide uppercase"
              >{{ item.title }}</span
            >
            <span class="block text-sm text-zinc-300">{{ item.text }}</span>
          </span>
        </li>
      </ul>
    </PageHero>

    <section class="bg-zinc-100 py-12 sm:py-16">
      <UContainer>
        <BookingPicker />
      </UContainer>
    </section>
  </div>
</template>
