<script setup lang="ts">
const { business } = useAppConfig()

usePageSeo({
  title: 'About CHS | Hydraulic Engineers in Cross Hands, Llanelli',
  description: 'Crosshands Hydraulic Services is a hydraulic repair and supply business in Cross Hands, Carmarthenshire, with a workshop and mobile unit serving Llanelli and South Wales.',
  path: '/about'
})
useBreadcrumbs([
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' }
])

const crumbs = [
  { label: 'Home', to: '/' },
  { label: 'About', class: 'text-white' }
]

// "2004" is the Companies House incorporation date for Crosshands Hydraulic Services LLP; confirm with the business.
const facts = [
  { value: '2004', label: 'Established' },
  { value: 'Cross Hands', label: 'Workshop base' },
  { value: 'Mobile', label: 'On-site service unit' },
  { value: 'South Wales', label: 'Area we cover' }
]

const values = [
  { icon: 'i-lucide-message-square-text', title: 'Straight answers', text: 'We tell you what\'s wrong, what it needs and what it\'ll cost before we start, with no surprises.' },
  { icon: 'i-lucide-hard-hat', title: 'Practical experience', text: 'Hands-on hydraulic work every day across plant, farm, commercial and industrial machinery.' },
  { icon: 'i-lucide-map-pinned', title: 'Local and reachable', text: 'Based in Cross Hands, so we\'re close to Llanelli, Carmarthen, Ammanford and Swansea when you need us.' }
]

const ways = [
  {
    icon: 'i-lucide-warehouse',
    title: 'At our workshop',
    text: 'Bring hoses, rams and components to our Cross Hands workshop. Most hoses are made up while you wait, and rams are stripped, inspected and rebuilt in-house.',
    link: { label: 'Hose repair & replacement', to: '/services/hydraulic-hoses' }
  },
  {
    icon: 'i-lucide-truck',
    title: 'On your site',
    text: 'When the machine can\'t come to us, our fully equipped mobile unit goes to it: building sites, quarries, farms and yards across South Wales.',
    link: { label: 'On-site & mobile service', to: '/services/on-site-hydraulic-service' }
  }
]
</script>

<template>
  <div>
    <PageHero labelledby="about-title">
      <UBreadcrumb :items="crumbs" separator-icon="i-lucide-slash" :ui="heroBreadcrumbUi" />
      <h1 id="about-title" class="heading-display text-[clamp(40px,6vw,76px)] leading-[0.95] tracking-tight">
        About <em class="text-primary not-italic">CHS</em>
      </h1>
      <p class="mt-5 max-w-xl text-base text-zinc-200 sm:text-lg">
        A hydraulic repair and supply business in Cross Hands, Carmarthenshire, keeping plant, farm and industrial machinery working across South Wales.
      </p>
    </PageHero>

    <section class="py-16 sm:py-20" aria-labelledby="who-title">
      <UContainer class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p class="kicker mb-3 text-chs-600">Who we are</p>
          <h2 id="who-title" class="heading-display mb-6 text-[clamp(28px,3.6vw,40px)]">Hydraulic specialists, close to home</h2>
          <div class="space-y-4 text-zinc-600">
            <p class="text-[17px] text-ink-950 sm:text-[19px]">
              {{ business.name }} repairs, services and supplies hydraulic equipment for customers across Llanelli, Carmarthenshire and South Wales.
            </p>
            <p>
              From a burst hose on an excavator to a leaking ram on a tractor loader or a fault on an industrial press, we find the problem, fix it properly and get you back to work.
            </p>
            <p>
              We run a workshop at Cross Hands and a fully equipped mobile service unit, so we can work wherever makes most sense for you and your machine.
            </p>
          </div>
        </div>
        <NuxtPicture
          src="/images/van.jpg"
          alt="CHS Crosshands Hydraulic Services mobile service van"
          sizes="444px"
          width="444"
          height="200"
          densities="x1"
          format="avif,webp"
          loading="lazy"
          :img-attrs="{ class: 'aspect-[444/250] w-full object-cover shadow-[0_10px_30px_rgba(15,22,26,0.12)]' }"
        />
      </UContainer>
    </section>

    <section class="bg-ink-900 text-white" aria-label="CHS at a glance">
      <UContainer>
        <dl class="grid grid-cols-2 divide-white/15 lg:grid-cols-4 lg:divide-x">
          <div v-for="fact in facts" :key="fact.label" class="px-2 py-8 lg:px-8 lg:first:pl-0">
            <dt class="kicker text-[11px] text-chs-400">{{ fact.label }}</dt>
            <dd class="heading-display mt-2 text-2xl sm:text-3xl">{{ fact.value }}</dd>
          </div>
        </dl>
      </UContainer>
    </section>

    <section class="py-16 sm:py-20" aria-labelledby="values-title">
      <UContainer>
        <p class="kicker mb-3 text-chs-600">How we work</p>
        <h2 id="values-title" class="heading-display mb-10 text-[clamp(28px,3.6vw,40px)]">What you can expect from us</h2>
        <ul class="grid gap-5 md:grid-cols-3">
          <li v-for="value in values" :key="value.title" class="border-t-3 border-primary bg-zinc-100 p-6 sm:p-7">
            <UIcon :name="value.icon" class="size-9 text-primary" />
            <h3 class="heading-display mt-4 mb-2 text-lg">{{ value.title }}</h3>
            <p class="text-sm text-zinc-600">{{ value.text }}</p>
          </li>
        </ul>
      </UContainer>
    </section>

    <section class="bg-zinc-100 py-16 sm:py-20" aria-labelledby="ways-title">
      <UContainer>
        <p class="kicker mb-3 text-chs-600">Workshop or on-site</p>
        <h2 id="ways-title" class="heading-display mb-10 text-[clamp(28px,3.6vw,40px)]">Two ways we can help</h2>
        <div class="grid gap-5 md:grid-cols-2">
          <article v-for="way in ways" :key="way.title" class="flex flex-col bg-white p-6 shadow-[0_10px_30px_rgba(15,22,26,0.08)] sm:p-8">
            <span class="grid size-14 place-items-center bg-primary text-white">
              <UIcon :name="way.icon" class="size-7" />
            </span>
            <h3 class="heading-display mt-5 mb-3 text-xl">{{ way.title }}</h3>
            <p class="mb-6 flex-1 text-zinc-600">{{ way.text }}</p>
            <ULink raw :to="way.link.to" class="inline-flex items-center gap-2 self-start border-b-2 border-primary pb-1 text-[13px] font-extrabold tracking-wider uppercase hover:text-chs-600">
              {{ way.link.label }} <UIcon name="i-lucide-chevron-right" class="size-4 text-primary" />
            </ULink>
          </article>
        </div>
      </UContainer>
    </section>

    <section class="py-16 sm:py-20" aria-labelledby="areas-title">
      <UContainer class="grid items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div>
          <p class="kicker mb-3 text-chs-600">Where we work</p>
          <h2 id="areas-title" class="heading-display mb-4 text-[clamp(28px,3.6vw,40px)]">Areas we cover</h2>
          <p class="text-zinc-600">Based at Cross Hands, we're well placed for customers right across the region. Not sure if we cover you? Just ask.</p>
        </div>
        <ul class="flex flex-wrap gap-2.5">
          <li v-for="area in business.serviceArea" :key="area">
            <UBadge :label="area" color="neutral" variant="outline" size="xl" icon="i-lucide-map-pin" class="bg-white text-ink-950 ring-zinc-300" :ui="{ leadingIcon: 'text-primary' }" />
          </li>
        </ul>
      </UContainer>
    </section>

    <CtaBand />
  </div>
</template>
