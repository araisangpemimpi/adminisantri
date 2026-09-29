<!--
  Layout Admin.
  - Sidebar tetap (fixed) di kiri pada layar >= md (768px); dapat diciutkan jadi hanya ikon.
  - Di layar kecil, sidebar menjadi drawer dari kiri.
  - Preferensi ciut disimpan di localStorage.
-->
<template>
  <div class="min-h-dvh" style="background-color: var(--surface-muted)">
    <!-- ============================ SIDEBAR DESKTOP ============================ -->
    <aside
      class="fixed inset-y-0 left-0 z-40 hidden flex-col border-e border-[var(--hairline)] bg-[var(--surface)] transition-[width] duration-300 md:flex"
      :class="ciut ? 'w-[72px]' : 'w-64'"
    >
      <!-- Merek -->
      <div class="flex shrink-0 items-center gap-2.5 border-b border-[var(--hairline)] px-3.5 py-3.5" :class="ciut ? 'justify-center px-0' : ''">
        <div class="grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl brand-gradient">
          <img v-if="settings.logo" :src="settings.logo" :alt="settings.siteName" class="size-full object-cover">
          <UIcon v-else name="i-lucide-moon-star" class="size-5 text-white" />
        </div>
        <div v-if="!ciut" class="min-w-0 flex-1 leading-tight">
          <p class="truncate text-[13px] font-extrabold">{{ settings.siteName }}</p>
          <p class="truncate text-[10px] text-[var(--ink-muted)]">Panel Admin</p>
        </div>
      </div>

      <!-- Navigasi -->
      <nav class="no-scrollbar min-h-0 flex-1 overflow-y-auto px-2.5 py-3" aria-label="Navigasi admin">
        <AdminNav :groups="nav" :collapsed="ciut" />
      </nav>

      <!-- Kaki -->
      <div class="shrink-0 border-t border-[var(--hairline)] p-3">
        <template v-if="ciut">
          <UButton to="/" color="neutral" variant="soft" icon="i-lucide-eye" square block title="Lihat Situs" aria-label="Lihat Situs" />
          <UButton color="error" variant="ghost" icon="i-lucide-log-out" square block class="mt-1.5" title="Keluar" aria-label="Keluar" @click="doLogout" />
        </template>
        <template v-else>
          <div class="mb-2 flex items-center gap-2.5 rounded-xl bg-[var(--surface-muted)] p-2.5">
            <div class="grid size-8 shrink-0 place-items-center rounded-lg brand-soft text-[11px] font-extrabold">{{ inisial(user?.nama) }}</div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-[11px] font-bold">{{ user?.nama }}</p>
              <p class="truncate text-[10px] text-[var(--ink-muted)]">{{ role?.nama ?? 'Admin' }}</p>
            </div>
          </div>
          <UButton to="/" color="neutral" variant="soft" icon="i-lucide-eye" size="sm" block class="justify-start">Lihat Situs</UButton>
          <UButton color="error" variant="ghost" icon="i-lucide-log-out" size="sm" block class="mt-1.5 justify-start" @click="doLogout">Keluar</UButton>
        </template>
      </div>
    </aside>

    <!-- ============================ KOLOM KANAN ============================ -->
    <div class="min-w-0 transition-[padding] duration-300" :class="ciut ? 'md:pl-[72px]' : 'md:pl-64'">
      <!-- Topbar -->
      <header class="sticky top-0 z-30 border-b border-[var(--hairline)] bg-[var(--surface)]/90 backdrop-blur-lg">
        <div class="flex items-center gap-2.5 px-4 py-2.5">
          <!-- Satu tombol: mobile → drawer, desktop → ciutkan -->
          <UButton
            color="neutral" variant="ghost" square class="hidden md:inline-flex"
            :icon="ciut ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left'"
            :aria-label="ciut ? 'Tampilkan sidebar' : 'Sembunyikan sidebar'"
            @click="toggleCiut"
          />
          <UButton
            color="neutral" variant="ghost" icon="i-lucide-menu" square aria-label="Menu navigasi"
            class="md:hidden" @click="drawer = true"
          />

          <!-- Judul halaman -->
          <div class="min-w-0 flex-1">
            <p class="truncate text-[10px] font-bold uppercase tracking-wider text-[var(--ink-muted)]">Panel Admin</p>
            <h1 class="truncate text-[15px] font-extrabold leading-tight">{{ judulHalaman }}</h1>
          </div>

          <UBadge v-if="role" size="xs" color="neutral" variant="soft" class="hidden lg:inline-flex">{{ role.nama }}</UBadge>
          <ThemeSwitcher />
          <UButton to="/" icon="i-lucide-home" color="neutral" variant="ghost" size="sm" aria-label="Lihat situs" class="hidden sm:inline-flex" />
          <UButton icon="i-lucide-log-out" color="neutral" variant="ghost" size="sm" aria-label="Keluar" class="md:hidden" @click="doLogout" />
        </div>
      </header>

      <!-- Konten -->
      <main class="px-4 py-5 pb-24 md:pb-10">
        <slot />
      </main>
    </div>

    <!-- ============================ DRAWER MOBILE ============================ -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-250 ease-out" enter-from-class="opacity-0"
        leave-active-class="transition duration-200 ease-in" leave-to-class="opacity-0"
      >
        <div v-if="drawer" class="fixed inset-0 z-50 md:hidden">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="drawer = false" />
          <Transition
            enter-active-class="transition duration-250 ease-out" enter-from-class="-translate-x-full"
            leave-active-class="transition duration-200 ease-in" leave-to-class="-translate-x-full"
            appear
          >
            <aside class="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-[var(--surface)] shadow-2xl">
              <div class="flex shrink-0 items-center gap-2.5 border-b border-[var(--hairline)] p-4">
                <div class="grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl brand-gradient">
                  <img v-if="settings.logo" :src="settings.logo" class="size-full object-cover">
                  <UIcon v-else name="i-lucide-moon-star" class="size-5 text-white" />
                </div>
                <div class="min-w-0 flex-1 leading-tight">
                  <p class="truncate text-sm font-extrabold">{{ settings.siteName }}</p>
                  <p class="truncate text-[11px] text-[var(--ink-muted)]">{{ role?.nama ?? 'Admin' }}</p>
                </div>
                <UButton icon="i-lucide-x" color="neutral" variant="ghost" square aria-label="Tutup menu" @click="drawer = false" />
              </div>

              <nav class="no-scrollbar min-h-0 flex-1 overflow-y-auto p-3" @click="onNavClick">
                <AdminNav :groups="nav" />
              </nav>

              <div class="shrink-0 border-t border-[var(--hairline)] p-3">
                <div class="mb-2 flex items-center gap-2.5 rounded-xl bg-[var(--surface-muted)] p-2.5">
                  <div class="grid size-8 shrink-0 place-items-center rounded-lg brand-soft text-[11px] font-extrabold">{{ inisial(user?.nama) }}</div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-[11px] font-bold">{{ user?.nama }}</p>
                    <p class="truncate text-[10px] text-[var(--ink-muted)]">{{ user?.username }}</p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <UButton to="/" color="neutral" variant="soft" icon="i-lucide-eye" size="sm" block @click="drawer = false">Lihat Situs</UButton>
                  <UButton color="error" variant="soft" icon="i-lucide-log-out" size="sm" block @click="doLogout">Keluar</UButton>
                </div>
              </div>
            </aside>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { AdminNavItem } from '~/composables/useModules'

const route = useRoute()
const drawer = ref(false)
const ciut = ref(false)

const { user, load: loadAuth, logout } = useAuth()
const { load: loadAuthz, roleOf, can, bisa } = useAuthz()
const { settings, load: loadSettings } = useSiteSettings()
const { modules, load: loadModules } = useModules()
const { inisial } = useFormat()

const role = computed(() => roleOf(user.value))

const nav = computed(() => {
  const u = user.value
  const allow = (r: string) => can(u, r, 'read')

  const utama: AdminNavItem[] = [{ label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/admin' }]

  const konten: AdminNavItem[] = [
    { label: 'Landing Page', icon: 'i-lucide-panels-top-left', to: '/admin/landing', resource: 'landing' },
    { label: 'Pemberitahuan', icon: 'i-lucide-bell-ring', to: '/admin/pemberitahuan', resource: 'pemberitahuan' },
    { label: 'Ekstrakurikuler', icon: 'i-lucide-medal', to: '/admin/ekskul', resource: 'ekskul' },
    { label: 'Event', icon: 'i-lucide-party-popper', to: '/admin/event', resource: 'event' },
  ].filter(i => allow(i.resource!))

  // Enam kelompok modul: hanya tampil bila modul aktif & peran punya akses.
  const groups = modules.value
    .filter(m => m.aktif)
    .map(m => ({
      title: m.title,
      icon: m.ikon,
      items: m.items.filter(i => allow(i.resource ?? m.id)),
    }))
    .filter(g => g.items.length)

  const sistem: AdminNavItem[] = [
    { label: 'Pengguna', icon: 'i-lucide-user-cog', to: '/admin/users', resource: 'users' },
    { label: 'Peran & Akses', icon: 'i-lucide-shield-check', to: '/admin/roles', resource: 'roles' },
    { label: 'Tema & Identitas', icon: 'i-lucide-palette', to: '/admin/settings', resource: 'settings' },
  ].filter(i => allow(i.resource!))

  // Modul hanya untuk Super Admin (kapabilitas khusus).
  if (bisa(u, 'modul')) {
    sistem.splice(2, 0, { label: 'Modul', icon: 'i-lucide-blocks', to: '/admin/modules', resource: 'modules' })
  }

  return [
    { title: 'Utama', items: utama },
    { title: 'Konten', items: konten },
    ...groups,
    { title: 'Sistem', items: sistem },
  ].filter(g => g.items.length)
})

/** Label halaman aktif untuk topbar. */
const judulHalaman = computed(() => {
  const semua = nav.value.flatMap(g => g.items)
  const cocok = semua
    .filter(i => route.path === i.to || route.path.startsWith(`${i.to}/`))
    .sort((a, b) => b.to.length - a.to.length)[0]
  if (cocok) return cocok.label
  if (route.path === '/admin') return 'Dashboard'
  return 'Panel Admin'
})

function toggleCiut() {
  ciut.value = !ciut.value
  if (import.meta.client) {
    try { localStorage.setItem('admin-sidebar-ciut', ciut.value ? '1' : '0') } catch { /* abaikan */ }
  }
}

async function doLogout() {
  drawer.value = false
  logout()
  await navigateTo('/admin/login')
}

function onNavClick(e: Event) {
  if ((e.target as HTMLElement).closest('a')) drawer.value = false
}

function onEsc(e: KeyboardEvent) {
  if (e.key === 'Escape') drawer.value = false
}

watch(drawer, (open) => {
  if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
})
watch(() => route.path, () => { drawer.value = false })

onMounted(() => {
  loadAuth()
  loadAuthz()
  loadSettings()
  loadModules()
  try { ciut.value = localStorage.getItem('admin-sidebar-ciut') === '1' } catch { /* abaikan */ }
  window.addEventListener('keydown', onEsc)
})
onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onEsc)
})
</script>
