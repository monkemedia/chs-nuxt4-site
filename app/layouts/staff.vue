<script setup lang="ts">
// Staff app shell: a slim dark bar (logo, who's signed in, sign out) and the page, sized for
// phones and iPads, with room for the iPhone notch and home bar. Installable from the browser
// (staff.webmanifest). Never indexed.
const { user, api, copy } = useStaff()
const router = useRouter()

useHead({
  title: copy.seoTitle,
  htmlAttrs: { lang: "en-GB" },
  meta: [
    { name: "robots", content: "noindex, nofollow" },
    { name: "theme-color", content: "#0d1012" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "mobile-web-app-capable", content: "yes" },
    {
      name: "apple-mobile-web-app-status-bar-style",
      content: "black-translucent",
    },
    { name: "apple-mobile-web-app-title", content: copy.appName },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1, viewport-fit=cover",
    },
  ],
  link: [{ rel: "manifest", href: "/staff.webmanifest" }],
})

async function signOut() {
  await api("/api/staff/logout", { method: "POST" }).catch(() => {})
  user.value = null
  await router.replace("/staff/login")
}
</script>

<template>
  <div class="min-h-dvh bg-zinc-100 text-ink-950">
    <header
      class="sticky top-0 z-30 bg-ink-950 pt-[env(safe-area-inset-top)] text-white"
    >
      <div
        class="mx-auto flex h-14 max-w-3xl items-center gap-3 px-[max(1rem,env(safe-area-inset-left))]"
      >
        <NuxtLink to="/staff" class="flex items-center gap-2.5">
          <img
            src="/images/chs-logo-mark-white.png"
            alt=""
            width="68"
            height="30"
            class="h-7 w-auto"
          />
          <span class="text-sm font-semibold tracking-wide text-white/80">
            Staff
          </span>
        </NuxtLink>
        <div v-if="user" class="ms-auto flex items-center gap-2">
          <span class="hidden text-sm text-white/70 sm:inline">{{
            user.firstName
          }}</span>
          <UButton
            icon="i-lucide-log-out"
            color="neutral"
            variant="ghost"
            size="lg"
            class="text-white hover:bg-white/10"
            :aria-label="copy.signOut"
            @click="signOut"
          />
        </div>
      </div>
    </header>
    <main
      class="mx-auto max-w-3xl px-[max(1rem,env(safe-area-inset-left))] pt-4 pb-[max(2rem,env(safe-area-inset-bottom))]"
    >
      <slot />
    </main>
  </div>
</template>
