<script setup lang="ts">
// ISO 9001 badge for dark backgrounds (footer). Shows the official URS/UKAS mark once
// app.config `business.certification.mark` is set, otherwise a text badge. The certificate
// number is left out while it's still a [placeholder].
const { business } = useAppConfig()
const content = useContent()
const { certification } = business
const hasNumber = !certification.certificateNumber.startsWith("[")
</script>

<template>
  <div class="flex items-center gap-4">
    <span v-if="certification.mark" class="shrink-0 rounded-box bg-white p-2">
      <NuxtPicture
        :src="certification.mark"
        :alt="
          content.certification.markAlt(
            certification.standard,
            certification.body,
            certification.accreditation,
          )
        "
        sizes="120px"
        width="120"
        densities="x1 x2"
        format="avif,webp"
        loading="lazy"
        :img-attrs="{ class: 'h-12 w-auto' }"
      />
    </span>
    <UIcon
      v-else
      name="i-lucide-shield-check"
      class="size-10 shrink-0 text-chs-400"
    />
    <p class="text-xs leading-relaxed">
      <strong class="block text-sm text-white">{{
        content.certification.certified(certification.standard)
      }}</strong>
      {{
        content.certification.by(
          certification.body,
          certification.accreditation,
        )
      }}<template v-if="hasNumber"
        ><br />{{
          content.certification.number(certification.certificateNumber)
        }}</template
      >
    </p>
  </div>
</template>
