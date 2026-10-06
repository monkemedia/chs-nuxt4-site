<script setup lang="ts">
import * as z from "zod"

// Staff app sign-in (see server/utils/staffAuth.ts). English only, client-rendered, never indexed.
defineI18nRoute(false)
definePageMeta({ layout: "staff", middleware: "staff" })

const { user, copy } = useStaff()
const router = useRouter()
const runtimeConfig = useRuntimeConfig()
const t = copy.signIn

const schema = z.object({
  email: z.email(t.email),
  password: z.string().min(1, t.password),
})
const state = reactive({ email: "", password: "" })
const status = ref<"idle" | "loading">("idle")
const error = ref("")

async function onSubmit() {
  status.value = "loading"
  error.value = ""
  try {
    user.value = await $fetch<StaffUser>("/api/staff/login", {
      method: "POST",
      body: { ...state },
    })
    await router.replace("/staff")
  } catch (e) {
    const code = (e as { statusCode?: number }).statusCode
    error.value = code === 401 ? t.wrong : code === 429 ? t.tooMany : t.failed
  } finally {
    status.value = "idle"
  }
}
</script>

<template>
  <div class="mx-auto max-w-md pt-6 sm:pt-16">
    <UForm
      :schema="schema"
      :state="state"
      class="space-y-5 rounded-box border-t-4 border-primary bg-white p-6 shadow-sm sm:p-8"
      @submit="onSubmit"
    >
      <div>
        <h1 class="heading-display text-4xl">{{ t.title }}</h1>
        <p class="mt-1 text-zinc-600">{{ t.intro }}</p>
      </div>
      <UFormField eager-validation :label="t.email" name="email">
        <UInput
          v-model="state.email"
          type="email"
          autocomplete="username"
          inputmode="email"
          size="xl"
          class="w-full"
        />
      </UFormField>
      <UFormField eager-validation :label="t.password" name="password">
        <UInput
          v-model="state.password"
          type="password"
          autocomplete="current-password"
          size="xl"
          class="w-full"
        />
      </UFormField>
      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        icon="i-lucide-circle-alert"
        :description="error"
        role="alert"
      />
      <UButton
        type="submit"
        size="xl"
        block
        icon="i-lucide-log-in"
        :loading="status === 'loading'"
      >
        {{ t.submit }}
      </UButton>
      <p
        v-if="runtimeConfig.public.fergusMockHint"
        class="text-center text-sm text-zinc-500"
      >
        {{ t.demo }}
      </p>
    </UForm>
  </div>
</template>
