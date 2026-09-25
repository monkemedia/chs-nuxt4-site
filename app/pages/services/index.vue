<script setup lang="ts">
const content = useContent()
const localePath = useLocalePath()
const page = computed(() => content.value.servicesPage)

usePageSeo({ ...page.value.seo, path: "/services" })
useBreadcrumbs([
  { name: content.value.common.home, path: "/" },
  { name: page.value.crumb, path: "/services" },
])

const crumbs = computed(() => [
  { label: content.value.common.home, to: localePath("/") },
  { label: page.value.crumb, class: "text-white" },
])
</script>

<template>
  <div>
    <PageHero labelledby="services-title">
      <UBreadcrumb
        :items="crumbs"
        separator-icon="i-lucide-slash"
        :ui="heroBreadcrumbUi"
      />
      <h1
        id="services-title"
        class="heading-display text-[clamp(40px,6vw,76px)] leading-[0.95] tracking-tight"
      >
        {{ page.title[0] }}
        <em class="text-primary not-italic">{{ page.title[1] }}</em>
      </h1>
      <p class="mt-5 max-w-xl text-base text-zinc-200 sm:text-lg">
        {{ page.intro }}
      </p>
    </PageHero>

    <section class="py-16 sm:py-20" :aria-label="page.listLabel">
      <UContainer>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ServiceCard
            v-for="service in content.services"
            :key="service.slug"
            :service="service"
            heading-level="h2"
          />
        </div>
      </UContainer>
    </section>

    <CtaBand
      :kicker="page.cta.kicker"
      :title="page.cta.title"
      :text="page.cta.text"
    />
  </div>
</template>
