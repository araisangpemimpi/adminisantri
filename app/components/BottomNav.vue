<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[440px] border-t border-[var(--hairline)] bg-[var(--surface)]/95 backdrop-blur-lg"
    style="padding-bottom: env(safe-area-inset-bottom)"
  >
    <div class="grid grid-cols-5 px-1.5 py-1.5">
      <NuxtLink
        v-for="m in mainMenu" :key="m.to" :to="m.to"
        class="flex flex-col items-center gap-0.5 rounded-2xl px-1 py-1.5 text-[10px] font-semibold transition"
        :class="isActive(m.to)
          ? 'brand-soft text-[var(--brand-text)] font-bold'
          : 'text-[var(--ink-muted)] active:bg-[var(--surface-muted)]'"
        :aria-current="isActive(m.to) ? 'page' : undefined"
      >
        <UIcon :name="m.icon" class="size-[22px]" :class="isActive(m.to) ? '' : 'opacity-70'" />
        {{ m.label }}
      </NuxtLink>

      <button
        class="flex flex-col items-center gap-0.5 rounded-2xl px-1 py-1.5 text-[10px] font-semibold transition"
        :class="open ? 'brand-soft text-[var(--brand-text)] font-bold' : 'text-[var(--ink-muted)]'"
        @click="open = true"
      >
        <UIcon name="i-lucide-layout-grid" class="size-[22px]" :class="open ? '' : 'opacity-70'" />
        Lainnya
      </button>
    </div>
  </nav>

  <USlideover v-model:open="open" title="Menu Lainnya" :ui="{ content: 'max-w-[440px] mx-auto' }">
    <template #body>
      <div class="mb-4 flex items-center justify-between rounded-2xl border border-[var(--hairline)] p-3.5">
        <div class="flex items-center gap-2.5">
          <UIcon name="i-lucide-user-round" class="size-4 text-[var(--ink-muted)]" />
          <div>
            <p class="text-sm font-semibold">{{ user ? user.nama : 'Tamu' }}</p>
            <p class="text-xs text-[var(--ink-muted)]">{{ user ? 'Masuk sebagai ' + user.username : 'Belum masuk' }}</p>
          </div>
        </div>
        <UButton size="xs" :to="user ? '/admin' : '/admin/login'" :icon="user ? 'i-lucide-layout-dashboard' : 'i-lucide-log-in'" @click="open = false">
          {{ user ? 'Dashboard' : 'Masuk' }}
        </UButton>
      </div>

      <div class="grid grid-cols-3 gap-2.5">
        <NuxtLink
          v-for="m in moreMenu" :key="m.to" :to="m.to" @click="open = false"
          class="card-soft card-hover flex flex-col items-center gap-2 p-3.5 text-center"
        >
          <div class="grid size-10 place-items-center rounded-2xl brand-soft">
            <UIcon :name="m.icon" class="size-5" />
          </div>
          <span class="text-xs font-semibold">{{ m.label }}</span>
        </NuxtLink>
      </div>

      <div class="mt-4 flex items-center justify-between rounded-2xl border border-[var(--hairline)] p-3.5">
        <div class="flex items-center gap-2.5">
          <UIcon name="i-lucide-sun-moon" class="size-4 text-[var(--ink-muted)]" />
          <span class="text-sm font-medium">Mode tampilan</span>
        </div>
        <ThemeSwitcher />
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
const open = ref(false)
const route = useRoute()
const { user } = useAuth()

const mainMenu = [
  { label: 'Beranda', icon: 'i-lucide-home', to: '/' },
  { label: 'Agenda', icon: 'i-lucide-calendar-days', to: '/agenda' },
  { label: 'Info', icon: 'i-lucide-megaphone', to: '/pengumuman' },
  { label: 'PSB', icon: 'i-lucide-clipboard-list', to: '/psb' },
]

const moreMenu = [
  { label: 'Profil', icon: 'i-lucide-moon-star', to: '/profil' },
  { label: 'Prestasi', icon: 'i-lucide-trophy', to: '/prestasi' },
  { label: 'Galeri', icon: 'i-lucide-image', to: '/galeri' },
  { label: 'Ekskul', icon: 'i-lucide-medal', to: '/ekskul' },
  { label: 'Guru', icon: 'i-lucide-contact', to: '/guru' },
  { label: 'Mapel', icon: 'i-lucide-book-open', to: '/mapel' },
  { label: 'Kontak', icon: 'i-lucide-phone', to: '/kontak' },
  { label: 'Admin', icon: 'i-lucide-settings', to: '/admin' },
]

function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}
</script>
