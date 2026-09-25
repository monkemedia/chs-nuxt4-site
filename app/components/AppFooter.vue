<script setup lang="ts">
import { services } from '~/data/services'

const { business } = useAppConfig()
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <NuxtPicture class="footer-logo" src="/images/chs-logo-white.png" alt="CHS Crosshands Hydraulic Services" sizes="130px" width="130" height="64" densities="x1 x2" format="avif,webp" loading="lazy" />
        <p>Hydraulic repair, hose supply and on-site service from Cross Hands, covering Llanelli, Carmarthenshire and South Wales.</p>
      </div>
      <nav aria-labelledby="footer-services">
        <h2 id="footer-services" class="footer-heading">Services</h2>
        <ul>
          <li v-for="service in services" :key="service.slug"><NuxtLink :to="`/services/${service.slug}`">{{ service.h1 }}</NuxtLink></li>
        </ul>
      </nav>
      <nav aria-labelledby="footer-explore">
        <h2 id="footer-explore" class="footer-heading">Explore</h2>
        <ul>
          <li><NuxtLink to="/services">All services</NuxtLink></li>
          <li><NuxtLink to="/#sectors">Sectors</NuxtLink></li>
          <li><NuxtLink to="/#why">Why CHS</NuxtLink></li>
          <li><NuxtLink to="/contact">Contact</NuxtLink></li>
        </ul>
      </nav>
      <div>
        <h2 class="footer-heading">Get in touch</h2>
        <ul>
          <li><a :href="business.phoneHref">{{ business.phoneDisplay }}</a></li>
          <li><a :href="`mailto:${business.email}`">{{ business.email }}</a></li>
          <li>{{ business.location }}</li>
        </ul>
      </div>
    </div>
    <div class="container footer-base">
      <p>© {{ new Date().getFullYear() }} {{ business.name }}.</p>
    </div>
  </footer>
</template>
