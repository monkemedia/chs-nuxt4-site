<script setup lang="ts">
// Inline stroke icons (24×24 grid) so the page ships no icon font or library.
const icons: Record<string, string> = {
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  bolt: '<circle cx="12" cy="12" r="10"/><path d="M13 5.5 8 13h4l-1 5.5 5-7.5h-4z"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  ring: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  cog: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M10 2h4M19 5.5 17.5 7"/>',
  users: '<circle cx="12" cy="7" r="3"/><circle cx="5" cy="9" r="2.2"/><circle cx="19" cy="9" r="2.2"/><path d="M7 21v-3a5 5 0 0 1 10 0v3M1.5 19v-1.5A3.5 3.5 0 0 1 5 14h.5M22.5 19v-1.5A3.5 3.5 0 0 0 19 14h-.5"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  excavator: '<rect x="1.5" y="17" width="13" height="4" rx="2"/><path d="M3 17v-5h4l2 3v2M7 12V9h2l1 3M9 15l5-9 6 4-1 4"/><path d="M19 14h3l-1 3h-3z"/>',
  tractor: '<circle cx="7" cy="16" r="4"/><circle cx="18.5" cy="18" r="2.5"/><path d="M4 12.5V5h6l2 6h8a1 1 0 0 1 1 1v4M11 16h5M15 11V7"/>',
  factory: '<path d="M2 21V10l6 4v-4l6 4V3h4v4h2v14z"/><path d="M6 17h2M11 17h2M16 17h2"/>',
  truck: '<path d="M14 17V5H2v12h2M14 9h4l4 4v4h-2M14 17h1"/><circle cx="6.5" cy="17.5" r="2"/><circle cx="17.5" cy="17.5" r="2"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  alert: '<circle cx="12" cy="12" r="10"/><path d="M12 7v6M12 16.5v.5"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>'
}

defineProps<{ name: keyof typeof icons | string }>()
</script>

<template>
  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" v-html="icons[name]" />
</template>
