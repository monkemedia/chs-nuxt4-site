<script setup lang="ts">
// Customer login: a gateway to the Fergus customer portal. Hidden (404, unlinked, so not
// prerendered) until NUXT_PUBLIC_FERGUS_PORTAL_URL is set; never indexed or in the sitemap.
const { business } = useAppConfig()
const runtimeConfig = useRuntimeConfig()
const portalUrl = runtimeConfig.public.fergusPortalUrl as string
const content = useContent()
const localePath = useLocalePath()
const page = computed(() => content.value.loginPage)

if (!portalUrl)
  throw createError({
    statusCode: 404,
    statusMessage: page.value.crumb,
    fatal: true,
  })

usePageSeo({ ...page.value.seo, path: "/login", noindex: true })

const crumbs = computed(() => [
  { label: content.value.common.home, to: localePath("/") },
  { label: page.value.crumb, class: "text-white" },
])
</script>

<template>
  <div>
    <PageHero labelledby="login-title">
      <UBreadcrumb
        :items="crumbs"
        separator-icon="i-lucide-slash"
        :ui="heroBreadcrumbUi"
      />
      <h1
        id="login-title"
        class="heading-display text-[clamp(46px,6vw,76px)] leading-none tracking-tight"
      >
        {{ page.title[0] }}
        <em class="text-primary not-italic">{{ page.title[1] }}</em>
      </h1>
      <p class="mt-5 max-w-xl text-base text-zinc-200 sm:text-lg">
        {{ page.intro }}
      </p>
    </PageHero>

    <section class="py-16 sm:py-20">
      <UContainer class="max-w-2xl">
        <div
          class="rounded-box border-t-4 border-primary bg-zinc-100 p-6 text-center sm:p-10"
        >
          <UIcon name="i-lucide-lock-keyhole" class="size-10 text-primary" />
          <UButton
            :to="portalUrl"
            target="_blank"
            rel="noopener"
            icon="i-lucide-log-in"
            size="xl"
            class="mt-5 h-14 px-8"
          >
            {{ page.button }}
          </UButton>
          <p class="mt-4 text-sm text-zinc-600">{{ page.note }}</p>
        </div>
        <div class="mt-8 grid gap-2 text-center text-sm">
          <p>
            {{ page.noAccount }}
            <ULink
              raw
              :to="localePath('/accounts')"
              class="font-semibold text-chs-700 underline"
              >{{ page.accountsLink }}</ULink
            >
          </p>
          <p class="text-zinc-600">
            {{ page.help }}
            <a
              :href="business.phoneHref"
              class="font-semibold text-chs-700 underline"
              >{{ business.phoneDisplay }}</a
            >.
          </p>
        </div>
      </UContainer>
    </section>
  </div>
</template>
