<script setup lang="ts">
import { services } from '~/data/services'

const { business } = useAppConfig()
const endpoint = useRuntimeConfig().public.contactFormEndpoint as string

usePageSeo({
  title: 'Contact CHS Hydraulics | Cross Hands, Llanelli',
  description: 'Contact Crosshands Hydraulic Services for hose replacement, ram repairs, fault finding and on-site call-outs across Llanelli and Carmarthenshire.',
  path: '/contact'
})

const serviceOptions = [...services.map(s => ({ value: s.slug, label: s.h1 })), { value: 'other', label: 'Something else' }]

const urgencies = ['Emergency – machine is down', 'Within the next few days', 'Just after a quote']

const form = ref<HTMLFormElement | null>(null)
const result = ref<HTMLElement | null>(null)
const service = ref('')
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')

// Service links elsewhere on the site point here with ?service=<slug>. This page is
// prerendered at /contact, so on a direct load the router briefly reports no query while
// hydrating; watch the live route so the value is picked up once it's restored.
const router = useRouter()
function preselect(requested: unknown) {
  if (typeof requested === 'string' && serviceOptions.some(s => s.value === requested)) service.value = requested
}
onMounted(() => {
  preselect(router.currentRoute.value.query.service)
  watch(() => router.currentRoute.value.query.service, preselect)
})

async function submit() {
  if (!form.value || status.value === 'sending') return
  if (!endpoint) {
    console.error('Contact form endpoint missing: set NUXT_PUBLIC_CONTACT_FORM_ENDPOINT.')
    status.value = 'error'
    return
  }
  status.value = 'sending'
  try {
    const response = await fetch(endpoint, { method: 'POST', body: new FormData(form.value), headers: { Accept: 'application/json' } })
    status.value = response.ok ? 'sent' : 'error'
  } catch {
    status.value = 'error'
  }
  if (status.value === 'sent') form.value.reset()
  await nextTick()
  result.value?.focus()
}
</script>

<template>
  <div>
    <PageHero labelledby="contact-title">
      <p class="eyebrow">Contact <span aria-hidden="true">|</span> Quotes <span aria-hidden="true">|</span> Call-outs</p>
      <h1 id="contact-title">Get in <em>touch</em></h1>
      <p class="page-hero-copy">Machine down, need a hose made up or want a quote for a ram rebuild? Call us, or send the details below and we'll get back to you.</p>
    </PageHero>

    <section class="section contact" aria-label="Contact options">
      <div class="container contact-grid">
        <div class="contact-form-card">
          <div v-if="status === 'sent'" ref="result" class="form-result form-result-ok" tabindex="-1" role="status">
            <AppIcon name="check" />
            <div>
              <h2>Thanks, your enquiry has been sent</h2>
              <p>We'll be in touch as soon as possible. If your machine is down, call us on <a :href="business.phoneHref">{{ business.phoneDisplay }}</a>.</p>
              <button class="text-link" type="button" @click="status = 'idle'">Send another enquiry <AppIcon name="chevron" /></button>
            </div>
          </div>

          <form v-else ref="form" class="contact-form" :action="endpoint || undefined" method="POST" @submit.prevent="submit">
            <p class="kicker">Send an enquiry</p>
            <h2>Tell us what you need</h2>
            <p class="form-note">Fields marked <span aria-hidden="true">*</span><span class="visually-hidden">with an asterisk</span> are required.</p>

            <input type="hidden" name="_subject" value="New website enquiry – CHS Hydraulic Services">
            <!-- Honeypot: hidden from people, filled in by spam bots. -->
            <div class="visually-hidden" aria-hidden="true">
              <label for="f-company-website">Leave this field empty</label>
              <input id="f-company-website" type="text" name="_gotcha" tabindex="-1" autocomplete="off">
            </div>

            <div class="field-grid">
              <div class="field">
                <label for="f-name">Name <span aria-hidden="true">*</span></label>
                <input id="f-name" name="name" type="text" autocomplete="name" required>
              </div>
              <div class="field">
                <label for="f-company">Company <span class="optional">(optional)</span></label>
                <input id="f-company" name="company" type="text" autocomplete="organization">
              </div>
              <div class="field">
                <label for="f-phone">Phone <span aria-hidden="true">*</span></label>
                <input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required>
              </div>
              <div class="field">
                <label for="f-email">Email <span aria-hidden="true">*</span></label>
                <input id="f-email" name="email" type="email" autocomplete="email" required>
              </div>
              <div class="field">
                <label for="f-service">Service <span aria-hidden="true">*</span></label>
                <select id="f-service" v-model="service" name="service" required>
                  <option value="" disabled>Choose a service</option>
                  <option v-for="option in serviceOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
                </select>
              </div>
              <div class="field">
                <label for="f-location">Location or postcode <span class="optional">(optional)</span></label>
                <input id="f-location" name="location" type="text" autocomplete="postal-code" placeholder="e.g. SA14">
              </div>
            </div>

            <fieldset class="field urgency">
              <legend>How urgent is it? <span aria-hidden="true">*</span></legend>
              <label v-for="(option, i) in urgencies" :key="option" class="choice">
                <input type="radio" name="urgency" :value="option" required :checked="i === 1">
                <span>{{ option }}</span>
              </label>
            </fieldset>

            <div class="field">
              <label for="f-message">Details <span aria-hidden="true">*</span></label>
              <textarea id="f-message" name="message" rows="6" required placeholder="Machine make/model, what's gone wrong, part numbers if you have them…" />
            </div>

            <div v-if="status === 'error'" ref="result" class="form-result form-result-error" tabindex="-1" role="alert">
              <AppIcon name="alert" />
              <p>Sorry, your enquiry couldn't be sent. Please try again, or call us on <a :href="business.phoneHref">{{ business.phoneDisplay }}</a>.</p>
            </div>

            <div class="form-actions">
              <button class="button button-red" type="submit" :disabled="status === 'sending'">
                {{ status === 'sending' ? 'Sending…' : 'Send enquiry' }} <AppIcon name="chevron" />
              </button>
              <p>We only use your details to respond to your enquiry.</p>
            </div>
          </form>
        </div>

        <aside class="contact-aside" aria-label="Contact details">
          <div class="emergency-card">
            <p class="kicker">Machine down?</p>
            <h2>Call for emergency call&#8209;outs</h2>
            <a class="button emergency-call" :href="business.phoneHref"><AppIcon name="phone" class="icon-fill" /> {{ business.phoneDisplay }}</a>
          </div>

          <ul class="contact-details">
            <li>
              <AppIcon name="phone" />
              <div><h3>Phone</h3><a :href="business.phoneHref">{{ business.phoneDisplay }}</a></div>
            </li>
            <li>
              <AppIcon name="mail" />
              <div><h3>Email</h3><a :href="`mailto:${business.email}`">{{ business.email }}</a></div>
            </li>
            <li>
              <AppIcon name="pin" />
              <div><h3>Based in</h3><p>{{ business.location }}</p></div>
            </li>
            <li>
              <AppIcon name="clock" />
              <div>
                <h3>Opening hours</h3>
                <dl class="hours">
                  <template v-for="row in business.hours" :key="row.days"><dt>{{ row.days }}</dt><dd>{{ row.time }}</dd></template>
                </dl>
              </div>
            </li>
          </ul>

          <div class="service-area">
            <h3>Areas we cover</h3>
            <ul>
              <li v-for="area in business.serviceArea" :key="area">{{ area }}</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>
