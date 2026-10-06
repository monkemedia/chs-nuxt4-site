<script setup lang="ts">
const content = useContent()
const localePath = useLocalePath()
const page = computed(() => content.value.privacyPage)

usePageSeo({ ...page.value.seo, path: "/privacy" })
useBreadcrumbs([
  { name: content.value.common.home, path: "/" },
  { name: page.value.crumb, path: "/privacy" },
])

// Details only CHS can supply (ICO number, form service, retention periods) are [placeholders].
if (import.meta.server && JSON.stringify(page.value).includes("["))
  console.warn(
    "[privacy] The privacy notice has [placeholders]: fill them in in app/content/<locale>/index.ts (privacyPage).",
  )

const crumbs = computed(() => [
  { label: content.value.common.home, to: localePath("/") },
  { label: page.value.crumb, class: "text-white" },
])
const updated = computed(() =>
  dayjs(page.value.updated)
    .locale(content.value.dateLocale)
    .format("D MMMM YYYY"),
)
</script>

<template>
  <div>
    <PageHero labelledby="privacy-title">
      <UBreadcrumb
        :items="crumbs"
        separator-icon="i-lucide-slash"
        :ui="heroBreadcrumbUi"
      />
      <h1
        id="privacy-title"
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
      <UContainer>
        <article class="max-w-3xl">
          <p class="text-sm font-semibold text-zinc-500">
            <time :datetime="page.updated">{{
              page.updatedLabel(updated)
            }}</time>
          </p>
          <template v-for="section in page.sections" :key="section.title">
            <h2
              class="heading-display mt-12 mb-4 text-[clamp(22px,2.6vw,28px)]"
            >
              {{ section.title }}
            </h2>
            <p
              v-for="(paragraph, i) in section.text"
              :key="i"
              class="mb-4 text-[17px] text-zinc-700"
            >
              {{ paragraph }}
            </p>
            <ul v-if="section.list.length" class="grid gap-3">
              <li
                v-for="(item, i) in section.list"
                :key="i"
                class="flex items-start gap-3 text-[17px] text-zinc-700"
              >
                <UIcon
                  name="i-lucide-check"
                  class="mt-1 size-5 shrink-0 text-primary"
                />
                {{ item }}
              </li>
            </ul>
          </template>
        </article>
      </UContainer>
    </section>
  </div>
</template>
