<script setup lang="ts">
const { business } = useAppConfig()
const runtimeConfig = useRuntimeConfig()
const portalUrl = runtimeConfig.public.fergusPortalUrl as string
const content = useContent()
const localePath = useLocalePath()
const page = computed(() => content.value.accountsPage)

usePageSeo({ ...page.value.seo, path: "/accounts" })
useBreadcrumbs([
  { name: content.value.common.home, path: "/" },
  { name: page.value.crumb, path: "/accounts" },
])

// The payment terms are a [placeholder] until CHS confirms them.
if (import.meta.server && JSON.stringify(page.value.benefits).includes("["))
  console.warn(
    "[accounts] Trade account benefits have [placeholders] (payment terms): edit accountsPage in app/content/<locale>/index.ts.",
  )

const crumbs = computed(() => [
  { label: content.value.common.home, to: localePath("/") },
  { label: page.value.crumb, class: "text-white" },
])
const emailHref = computed(
  () =>
    `mailto:${business.email}?subject=${encodeURIComponent(page.value.emailSubject)}`,
)
</script>

<template>
  <div>
    <PageHero labelledby="accounts-title">
      <UBreadcrumb
        :items="crumbs"
        separator-icon="i-lucide-slash"
        :ui="heroBreadcrumbUi"
      />
      <h1
        id="accounts-title"
        class="heading-display text-[clamp(46px,6vw,76px)] leading-none tracking-tight"
      >
        {{ page.title[0] }}
        <em class="text-primary not-italic">{{ page.title[1] }}</em>
      </h1>
      <p class="mt-5 max-w-xl text-base text-zinc-200 sm:text-lg">
        {{ page.intro }}
      </p>
      <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-5">
        <UButton
          :to="business.phoneHref"
          icon="i-lucide-phone"
          size="xl"
          class="h-14 justify-center px-6"
        >
          {{ content.common.call(business.phoneDisplay) }}
        </UButton>
        <UButton
          :to="emailHref"
          icon="i-lucide-mail"
          color="neutral"
          variant="outline"
          size="xl"
          class="h-14 justify-center bg-transparent px-6 text-white ring-2 ring-white hover:bg-white hover:text-ink-950"
        >
          {{ page.emailButton }}
        </UButton>
      </div>
    </PageHero>

    <section class="py-16 sm:py-20" aria-labelledby="who-title">
      <UContainer>
        <p class="kicker mb-3 text-chs-700">{{ page.whoKicker }}</p>
        <h2
          id="who-title"
          class="heading-display mb-10 text-[clamp(28px,3.6vw,40px)]"
        >
          {{ page.whoTitle }}
        </h2>
        <ul class="grid gap-5 md:grid-cols-3">
          <li
            v-for="item in page.who"
            :key="item.title"
            class="rounded-box border-t-3 border-primary bg-zinc-100 p-6 sm:p-7"
          >
            <UIcon :name="item.icon" class="size-9 text-primary" />
            <h3 class="heading-display mt-4 mb-2 text-lg">{{ item.title }}</h3>
            <p class="text-sm text-zinc-600">{{ item.text }}</p>
          </li>
        </ul>
      </UContainer>
    </section>

    <section
      class="bg-zinc-100 py-16 sm:py-20"
      aria-labelledby="benefits-title"
    >
      <UContainer
        class="grid items-start gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14"
      >
        <div>
          <p class="kicker mb-3 text-chs-700">{{ page.benefitsKicker }}</p>
          <h2
            id="benefits-title"
            class="heading-display mb-8 text-[clamp(28px,3.6vw,40px)]"
          >
            {{ page.benefitsTitle }}
          </h2>
          <ul class="grid gap-5 sm:grid-cols-2">
            <li
              v-for="item in page.benefits"
              :key="item.title"
              class="flex flex-col rounded-box bg-white p-6 shadow-[0_10px_30px_rgba(15,22,26,0.08)]"
            >
              <span
                class="grid size-12 place-items-center rounded-box bg-primary text-white"
              >
                <UIcon :name="item.icon" class="size-6" />
              </span>
              <h3 class="heading-display mt-4 mb-2 text-lg">
                {{ item.title }}
              </h3>
              <p class="text-sm text-zinc-600">{{ item.text }}</p>
            </li>
          </ul>
        </div>

        <aside
          class="grid gap-5 lg:sticky lg:top-[calc(var(--header-offset)+1.5rem)] lg:transition-[top] lg:duration-300"
        >
          <div class="rounded-box bg-white px-5 py-6 sm:px-7.5">
            <h2 class="heading-display mb-4 text-[13px] tracking-wide">
              {{ page.stepsTitle }}
            </h2>
            <ol class="grid gap-4">
              <li
                v-for="(step, i) in page.steps"
                :key="step.title"
                class="flex gap-3.5"
              >
                <span
                  class="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-white"
                  aria-hidden="true"
                  >{{ i + 1 }}</span
                >
                <div>
                  <h3 class="text-sm font-extrabold">{{ step.title }}</h3>
                  <p class="text-sm text-zinc-600">{{ step.text }}</p>
                </div>
              </li>
            </ol>
          </div>

          <div class="rounded-box bg-primary p-6 text-white sm:p-7.5">
            <h2 class="heading-display mb-2 text-2xl leading-[1.1]">
              {{ page.ctaTitle }}
            </h2>
            <p class="mb-5 text-sm">{{ page.ctaText }}</p>
            <UButton
              :to="business.phoneHref"
              icon="i-lucide-phone"
              color="neutral"
              variant="solid"
              size="xl"
              block
              class="bg-white text-[17px] text-ink-950 hover:bg-ink-950 hover:text-white"
            >
              {{ business.phoneDisplay }}
            </UButton>
            <a
              :href="emailHref"
              class="mt-4 inline-flex items-center gap-2 text-[13px] font-extrabold tracking-wider text-white uppercase hover:underline"
            >
              <UIcon name="i-lucide-mail" class="size-4" />
              {{ page.emailButton }}
            </a>
          </div>

          <p v-if="portalUrl" class="text-sm font-semibold text-zinc-600">
            {{ page.loginPrompt }}
            <ULink
              raw
              :to="localePath('/login')"
              class="text-chs-700 underline"
              >{{ page.loginLink }}</ULink
            >
          </p>
        </aside>
      </UContainer>
    </section>

    <CtaBand />
  </div>
</template>
