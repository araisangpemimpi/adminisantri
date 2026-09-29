<template>
  <div class="relative grid min-h-dvh place-items-center overflow-hidden p-5" style="background-color: var(--surface-muted)">
    <!-- Latar dekoratif -->
    <div class="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full brand-gradient opacity-20 blur-3xl" />
    <div class="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full brand-gradient opacity-20 blur-3xl" />

    <div class="relative w-full max-w-sm">
      <div class="mb-6 flex flex-col items-center text-center">
        <div class="grid size-16 place-items-center rounded-3xl brand-gradient shadow-xl">
          <UIcon name="i-lucide-moon-star" class="size-8 text-white" />
        </div>
        <h1 class="mt-4 text-xl font-extrabold">{{ settings.siteName }}</h1>
        <p class="text-sm text-[var(--ink-muted)]">Panel Admin Pesantren</p>
      </div>

      <div class="card-soft p-6">
        <form class="space-y-4" @submit.prevent="submit">
          <UFormField label="Username atau Email">
            <UInput v-model="username" placeholder="admin" icon="i-lucide-user" size="lg" class="w-full" autocomplete="username" />
          </UFormField>
          <UFormField label="Password">
            <UInput
              v-model="password" :type="show ? 'text' : 'password'" placeholder="••••••••"
              icon="i-lucide-lock" size="lg" class="w-full" autocomplete="current-password"
              :ui="{ trailing: 'pe-1' }"
            >
              <template #trailing>
                <UButton
                  :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'" color="neutral" variant="link" size="sm"
                  :aria-label="show ? 'Sembunyikan' : 'Tampilkan'" @click="show = !show"
                />
              </template>
            </UInput>
          </UFormField>

          <UAlert v-if="error" color="error" variant="soft" icon="i-lucide-alert-circle" :description="error" />

          <UButton type="submit" block size="lg" icon="i-lucide-log-in" :loading="loading">Masuk</UButton>
        </form>
      </div>

      <!-- Akun demo -->
      <div class="card-soft mt-4 p-4">
        <p class="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--ink-muted)]">
          <UIcon name="i-lucide-info" class="size-3.5" /> Akun Demo
        </p>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="a in demo" :key="a.username"
            class="rounded-xl border border-[var(--hairline)] p-2.5 text-left transition hover:bg-[var(--surface-muted)]"
            @click="fill(a)"
          >
            <p class="text-xs font-bold">{{ a.label }}</p>
            <p class="text-[10px] text-[var(--ink-muted)]">{{ a.username }} / {{ a.password }}</p>
          </button>
        </div>
      </div>

      <NuxtLink to="/" class="mt-4 flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--ink-muted)]">
        <UIcon name="i-lucide-arrow-left" class="size-3.5" /> Kembali ke situs
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'admin' })

const { settings, load } = useSiteSettings()
const { login } = useAuth()

const username = ref('')
const password = ref('')
const show = ref(false)
const loading = ref(false)
const error = ref('')

const demo = [
  { label: 'Super Admin', username: 'superadmin', password: 'superadmin123' },
  { label: 'Administrator', username: 'admin', password: 'admin123' },
  { label: 'Pengurus', username: 'pengurus', password: 'pengurus123' },
  { label: 'Ustadz', username: 'ustadz', password: 'ustadz123' },
  { label: 'Bendahara', username: 'bendahara', password: 'bendahara123' },
]

function fill(a: { username: string, password: string }) {
  username.value = a.username
  password.value = a.password
  error.value = ''
}

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const res = await login(username.value, password.value)
    if (res.ok) await navigateTo('/admin')
    else error.value = res.message || 'Login gagal'
  }
  finally {
    loading.value = false
  }
}

useHead({ title: 'Masuk — Panel Admin' })
onMounted(() => load())
</script>
