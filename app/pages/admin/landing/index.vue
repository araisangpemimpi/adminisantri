<template>
  <div class="space-y-5">
    <div>
      <h1 class="text-xl font-extrabold">Landing Page</h1>
      <p class="text-sm text-[var(--ink-muted)]">Kelola seluruh konten halaman depan pesantren.</p>
    </div>

    <!-- Pratinjau -->
    <NuxtLink to="/" class="brand-gradient pattern-islamic flex items-center gap-4 rounded-3xl p-5 text-white shadow-lg">
      <div class="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/20">
        <UIcon name="i-lucide-eye" class="size-6" />
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-extrabold">Lihat halaman depan</p>
        <p class="text-xs text-white/75">Pratinjau tampilan yang dilihat pengunjung</p>
      </div>
      <UIcon name="i-lucide-arrow-up-right" class="size-5 shrink-0" />
    </NuxtLink>

    <!-- Grid seksi -->
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <NuxtLink
        v-for="s in sections" :key="s.to" :to="s.to"
        class="card-soft card-hover flex flex-col gap-3 p-4"
      >
        <div class="flex items-center justify-between">
          <div class="grid size-10 place-items-center rounded-2xl brand-soft">
            <UIcon :name="s.icon" class="size-5" />
          </div>
          <span class="tabular text-sm font-extrabold text-[var(--ink-muted)]">{{ s.count }}</span>
        </div>
        <p class="text-sm font-bold leading-tight">{{ s.label }}</p>
      </NuxtLink>
    </div>

    <!-- Pengaturan identitas -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-palette" class="size-4 brand-text" />
            <p class="text-sm font-extrabold">Identitas & Tema</p>
          </div>
          <UButton to="/admin/settings" size="xs" color="neutral" variant="soft" trailing-icon="i-lucide-arrow-right">Atur</UButton>
        </div>
      </template>
      <p class="text-sm text-[var(--ink-muted)]">
        Ubah nama pesantren, logo, visi & misi, warna brand, serta mode terang/gelap dari halaman Tema & Identitas.
      </p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from '~/composables/useAdminStore'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const hero = useAdminStore('hero').rows
const agenda = useAdminStore('agenda').rows
const pengumuman = useAdminStore('pengumuman').rows
const prestasi = useAdminStore('prestasi').rows
const galeri = useAdminStore('album').rows
const ekskul = useAdminStore('ekskul').rows
const kontak = useAdminStore('kontak').rows
const psb = useAdminStore('psb').rows
const biaya = useAdminStore('biaya').rows

const sections = computed(() => [
  { label: 'Tampilan', icon: 'i-lucide-layout-panel-top', to: '/admin/landing/tampilan', count: 'Atur' },
  { label: 'Hero Slider', icon: 'i-lucide-images', to: '/admin/landing/hero', count: hero.value.length },
  { label: 'Profil', icon: 'i-lucide-moon-star', to: '/admin/settings', count: '—' },
  { label: 'Agenda', icon: 'i-lucide-calendar-days', to: '/admin/landing/agenda', count: agenda.value.length },
  { label: 'Pengumuman', icon: 'i-lucide-megaphone', to: '/admin/landing/pengumuman', count: pengumuman.value.length },
  { label: 'Prestasi', icon: 'i-lucide-trophy', to: '/admin/landing/prestasi', count: prestasi.value.length },
  { label: 'Galeri', icon: 'i-lucide-image', to: '/admin/landing/galeri', count: `${galeri.value.length} album` },
  { label: 'PSB', icon: 'i-lucide-clipboard-list', to: '/admin/landing/psb', count: psb.value.length },
  { label: 'Biaya PSB', icon: 'i-lucide-receipt', to: '/admin/landing/biaya', count: `${biaya.value.length} komponen` },
  { label: 'Kontak', icon: 'i-lucide-phone', to: '/admin/landing/kontak', count: kontak.value.length },
  { label: 'Ekskul', icon: 'i-lucide-medal', to: '/admin/ekskul', count: ekskul.value.length },
])

useHead({ title: 'Landing Page — Panel Admin' })

onMounted(() => {
  for (const k of ['hero', 'agenda', 'pengumuman', 'prestasi', 'album', 'ekskul', 'kontak', 'psb', 'biaya'] as const) {
    useAdminStore(k).fetchAll()
  }
})
</script>
