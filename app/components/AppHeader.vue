<template>
  <!-- Header publik: gradient brand + pola geometri, lengkung bawah -->
  <header class="relative z-40">
    <div class="brand-gradient pattern-islamic rounded-b-[28px] px-4 pb-7 pt-4 shadow-lg shadow-[color-mix(in_srgb,var(--brand-700)_35%,transparent)]">
      <div class="flex items-center gap-3">
        <div class="grid size-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/25">
          <img v-if="settings.logo" :src="settings.logo" :alt="settings.siteName" class="size-full object-cover">
          <UIcon v-else name="i-lucide-moon-star" class="size-6 text-white" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-[15px] font-extrabold leading-tight text-white">{{ settings.siteName }}</p>
          <p class="truncate text-[11px] text-white/75">{{ settings.tagline }}</p>
        </div>
        <div class="flex shrink-0 items-center gap-1">
          <ThemeSwitcher />
          <UButton
            :icon="user ? 'i-lucide-layout-dashboard' : 'i-lucide-log-in'"
            color="neutral" variant="ghost" size="sm"
            class="text-white hover:bg-white/15"
            :to="user ? '/admin' : '/admin/login'"
            :aria-label="user ? 'Dashboard admin' : 'Masuk'"
          />
        </div>
      </div>

      <!-- Search pintasan -->
      <button
        class="mt-4 flex w-full items-center gap-2.5 rounded-2xl bg-white/15 px-3.5 py-2.5 text-left text-white/80 backdrop-blur ring-1 ring-white/20 transition active:scale-[0.99]"
        @click="openSearch"
      >
        <UIcon name="i-lucide-search" class="size-4" />
        <span class="text-[13px]">Cari agenda, pengumuman, prestasi…</span>
      </button>
    </div>

    <!-- Panel pencarian -->
    <Teleport to="body">
      <div v-if="searchOpen" class="fixed inset-0 z-[60] flex items-start justify-center bg-black/45 p-4 pt-20 backdrop-blur-sm" @click.self="searchOpen = false">
        <div class="w-full max-w-[420px] overflow-hidden rounded-3xl border border-[var(--hairline)] bg-[var(--surface)] shadow-2xl">
          <div class="flex items-center gap-2 border-b border-[var(--hairline)] px-4 py-3">
            <UIcon name="i-lucide-search" class="size-4 text-[var(--ink-muted)]" />
            <input
              ref="inputEl"
              v-model="q"
              placeholder="Ketik untuk mencari…"
              class="w-full bg-transparent text-sm outline-none placeholder:text-[var(--ink-muted)]"
              @keydown.enter="goToResults"
            >
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" aria-label="Tutup" @click="searchOpen = false" />
          </div>
          <div class="max-h-[60vh] overflow-y-auto p-2">
            <template v-if="q.trim()">
              <p v-if="!results.length" class="px-3 py-6 text-center text-sm text-[var(--ink-muted)]">Tidak ada hasil untuk “{{ q }}”.</p>
              <NuxtLink
                v-for="r in results" :key="r.to + r.title"
                :to="r.to"
                class="flex items-center gap-3 rounded-2xl px-3 py-2.5 hover:bg-[var(--surface-muted)]"
                @click="searchOpen = false"
              >
                <div class="grid size-9 shrink-0 place-items-center rounded-xl brand-soft">
                  <UIcon :name="r.icon" class="size-4" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold">{{ r.title }}</p>
                  <p class="truncate text-xs text-[var(--ink-muted)]">{{ r.subtitle }}</p>
                </div>
                <UIcon name="i-lucide-chevron-right" class="size-4 shrink-0 text-[var(--ink-muted)]" />
              </NuxtLink>
            </template>
            <div v-else class="px-3 py-4">
              <p class="mb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--ink-muted)]">Pintasan</p>
              <div class="flex flex-wrap gap-2">
                <button v-for="s in suggestions" :key="s" class="rounded-full border border-[var(--hairline)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--surface-muted)]" @click="q = s">{{ s }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
import { RESOURCES } from '~/composables/useResources'

const { settings, load } = useSiteSettings()
const { user, load: loadAuth } = useAuth()

const searchOpen = ref(false)
const q = ref('')
const inputEl = ref<HTMLInputElement | null>(null)

const suggestions = ['Maulid Nabi', 'PSB 2026', 'Syahriah', 'Tahfidz']

const index = computed(() => {
  const sources: Array<{ key: keyof typeof RESOURCES, to: string, titleKey: string, subKey?: string }> = [
    { key: 'agenda', to: '/agenda', titleKey: 'judul', subKey: 'lokasi' },
    { key: 'pengumuman', to: '/pengumuman', titleKey: 'judul', subKey: 'kategori' },
    { key: 'prestasi', to: '/prestasi', titleKey: 'judul', subKey: 'tingkat' },
    { key: 'galeri', to: '/galeri', titleKey: 'judul', subKey: 'kategori' },
    { key: 'ekskul', to: '/ekskul', titleKey: 'nama', subKey: 'hari' },
    { key: 'mapel', to: '/mapel', titleKey: 'nama', subKey: 'kategori' },
  ]
  return sources.map((s) => {
    const store = useAdminStore(s.key)
    return { ...s, rows: store.rows }
  })
})

const results = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return []
  const out: Array<{ title: string, subtitle: string, icon: string, to: string }> = []
  for (const src of index.value) {
    for (const row of src.rows.value) {
      const title = String(row[src.titleKey] ?? '')
      const hay = Object.values(row).map(v => String(v ?? '')).join(' ').toLowerCase()
      if (hay.includes(term)) {
        out.push({
          title,
          subtitle: src.subKey ? String(row[src.subKey] ?? '') : RESOURCES[src.key].label,
          icon: RESOURCES[src.key].icon,
          to: src.to,
        })
      }
      if (out.length >= 12) break
    }
    if (out.length >= 12) break
  }
  return out
})

async function openSearch() {
  searchOpen.value = true
  await nextTick()
  inputEl.value?.focus()
}

function goToResults() {
  if (results.value[0]) {
    navigateTo(results.value[0].to)
    searchOpen.value = false
  }
}

function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') searchOpen.value = false
}

onMounted(() => {
  load()
  loadAuth()
  // Muat data untuk indeks pencarian (ringan, hanya resource publik).
  for (const key of ['agenda', 'pengumuman', 'prestasi', 'galeri', 'ekskul', 'mapel'] as const) {
    useAdminStore(key).fetchAll()
  }
  window.addEventListener('keydown', onEsc)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onEsc))
</script>
