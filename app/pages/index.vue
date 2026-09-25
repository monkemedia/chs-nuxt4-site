<script setup lang="ts">
import { services } from "~/data/services";

const { business } = useAppConfig();

const { phoneDisplay, phoneHref } = business;

usePageSeo({
  title: "Hydraulic Repairs Llanelli & Carmarthenshire | CHS",
  description:
    "Hydraulic hose replacement, ram repairs, fault finding and mobile call-outs from Cross Hands, covering Llanelli, Carmarthenshire and South Wales.",
  path: "/",
});

const trust = [
  { icon: "bolt", label: ["Fast", "turnaround"] },
  { icon: "wrench", label: ["On-site", "support"] },
  { icon: "shield", label: ["Quality", "you can trust"] },
];

const benefits = [
  {
    icon: "timer",
    title: ["Fast", "response"],
    text: "Get back up and running quickly.",
  },
  {
    icon: "users",
    title: ["Experienced", "team"],
    text: "Real-world expertise across multiple sectors.",
  },
  {
    icon: "shield",
    title: ["Quality", "components"],
    text: "We use trusted, durable parts and materials.",
  },
  {
    icon: "pin",
    title: ["On-site", "nationwide"],
    text: "Mobile service to your site, workshop or farm.",
  },
];

const onsite = [
  "Emergency call-outs",
  "On-site hose replacement",
  "Hydraulic system diagnostics",
  "Plant, agricultural & commercial",
  "Flexible, reliable scheduling",
];

const sectors = [
  { icon: "excavator", label: ["Plant &", "construction"] },
  { icon: "tractor", label: ["Agriculture", "& farms"] },
  { icon: "factory", label: ["Industrial", "& manufacturing"] },
  { icon: "truck", label: ["Commercial", "vehicles"] },
  { icon: "cog", label: ["And more"] },
];
</script>

<template>
  <div>
    <section class="hero" aria-labelledby="hero-title">
      <NuxtPicture
        class="hero-media"
        src="/images/hero.jpg"
        alt="Red hydraulic cylinder with polished ram and hoses"
        sizes="524px"
        width="524"
        height="328"
        densities="x1"
        format="avif,webp"
        :preload="{ fetchPriority: 'high' }"
        :img-attrs="{ fetchpriority: 'high' }"
      />
      <div class="hero-shade" aria-hidden="true"></div>
      <div class="container hero-content">
        <h1 id="hero-title">
          <span class="eyebrow hero-eyebrow"
            >Hydraulic repairs in Llanelli &amp; Carmarthenshire</span
          >
          Keeping <span>industry</span> <em>moving</em>
        </h1>
        <p class="hero-copy">
          Expert hydraulic repair, hose supply and on-site service for plant,
          agriculture, commercial and industrial customers across Llanelli,
          Carmarthenshire and South Wales.
        </p>
        <div class="hero-bottom">
          <div class="hero-actions">
            <a class="button button-red" :href="phoneHref"
              ><AppIcon name="phone" class="icon-fill" /> Call now
              <AppIcon name="chevron"
            /></a>
            <a class="button button-outline" href="#services"
              >Our services <AppIcon name="chevron"
            /></a>
          </div>
          <ul class="trust-row" aria-label="Key benefits">
            <li v-for="item in trust" :key="item.icon">
              <AppIcon :name="item.icon" /><span
                >{{ item.label[0] }}<br />{{ item.label[1] }}</span
              >
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section
      id="services"
      class="section services"
      aria-labelledby="services-title"
    >
      <div class="container">
        <div class="section-head">
          <div>
            <p class="kicker">Our services</p>
            <h2 id="services-title">Complete hydraulic solutions</h2>
          </div>
          <div class="section-head-aside">
            <p>
              From emergency hose replacements to full system repairs, we keep
              your equipment running with minimal downtime.
            </p>
            <NuxtLink class="text-link" to="/services"
              >View all services <AppIcon name="chevron"
            /></NuxtLink>
          </div>
        </div>
        <div class="service-grid">
          <ServiceCard
            v-for="service in services"
            :key="service.slug"
            :service="service"
          />
        </div>
      </div>
    </section>

    <section id="why" class="why" aria-labelledby="why-title">
      <div class="container">
        <p class="kicker">Why choose CHS</p>
        <h2 id="why-title">Minimum downtime.<br />Maximum support.</h2>
        <ul class="benefits">
          <li v-for="item in benefits" :key="item.icon">
            <AppIcon :name="item.icon" />
            <strong>{{ item.title[0] }}<br />{{ item.title[1] }}</strong>
            <p>{{ item.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <section id="about" class="onsite" aria-labelledby="onsite-title">
      <div class="onsite-image">
        <NuxtPicture
          src="/images/van.jpg"
          alt="CHS Crosshands Hydraulic Services mobile service van on site"
          sizes="444px"
          width="444"
          height="200"
          densities="x1"
          format="avif,webp"
          loading="lazy"
        />
      </div>
      <div class="onsite-copy">
        <p class="kicker">On-site hydraulic service</p>
        <h2 id="onsite-title">We come to you</h2>
        <p>
          Our fully equipped mobile service unit can carry out repairs, hose
          replacements and system diagnostics on-site, helping you avoid costly
          downtime.
        </p>
        <a class="button button-red" :href="phoneHref"
          >Book a service <AppIcon name="chevron"
        /></a>
      </div>
      <ul class="checklist">
        <li v-for="item in onsite" :key="item">
          <span><AppIcon name="check" /></span>{{ item }}
        </li>
      </ul>
    </section>

    <section id="sectors" class="sectors" aria-labelledby="sectors-title">
      <div class="sectors-intro">
        <p class="kicker">Our sectors</p>
        <h2 id="sectors-title">
          Proud to support <span>a wide range of industries.</span>
        </h2>
      </div>
      <ul class="sector-list">
        <li v-for="sector in sectors" :key="sector.icon">
          <AppIcon :name="sector.icon" />
          <span
            >{{ sector.label[0]
            }}<template v-if="sector.label[1]"
              ><br />{{ sector.label[1] }}</template
            ></span
          >
        </li>
      </ul>
    </section>

    <section class="cta" aria-labelledby="cta-title">
      <div class="container cta-inner">
        <div>
          <p class="kicker">Need hydraulic support?</p>
          <h2 id="cta-title">Let's keep your equipment moving.</h2>
          <p>Call CHS to discuss a repair, service or on-site visit.</p>
        </div>
        <div class="cta-actions">
          <a class="button button-red" :href="phoneHref"
            ><AppIcon name="phone" class="icon-fill" /> {{ phoneDisplay }}</a
          >
          <NuxtLink class="button button-outline" to="/contact"
            >Send an enquiry <AppIcon name="chevron"
          /></NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
