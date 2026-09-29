<template>
  <div class="space-y-5">
    <!-- Sapaan -->
    <div class="brand-gradient pattern-islamic relative overflow-hidden rounded-3xl p-5 text-white shadow-lg">
      <p class="text-xs text-white/80">Assalamualaikum,</p>
      <p class="text-xl font-extrabold">{{ greeting }}, {{ firstName }}</p>
      <p class="mt-1 text-xs text-white/75">{{ hariIni }} • {{ todayText }}</p>
    </div>

    <!-- Statistik utama -->
    <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard v-for="s in cards" :key="s.label" v-bind="s" />
    </div>

    <!-- Dua kolom di desktop -->
    <div class="grid gap-5 lg:grid-cols-2">
      <div class="space-y-5">
    <!-- Keuangan -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-wallet" class="size-4 brand-text" />
            <p class="text-sm font-extrabold">Ringkasan Pembayaran</p>
          </div>
          <UButton to="/admin/keuangan/tagihan" size="xs" color="neutral" variant="soft" trailing-icon="i-lucide-arrow-right">Kelola</UButton>
        </div>
      </template>
      <div class="space-y-4">
        <div class="flex items-end justify-between">
          <div>
            <p class="text-[11px] uppercase tracking-wide text-[var(--ink-muted)]">Diterima</p>
            <p class="tabular text-2xl font-extrabold brand-text">{{ rupiah(stats.pemasukan) }}</p>
          </div>
          <div class="text-right">
            <p class="text-[11px] uppercase tracking-wide text-[var(--ink-muted)]">Target</p>
            <p class="tabular text-sm font-bold">{{ rupiah(stats.target) }}</p>
          </div>
        </div>
        <div>
          <div class="mb-1.5 flex justify-between text-[11px] text-[var(--ink-muted)]">
            <span>Tingkat ketercapaian</span>
            <span class="font-bold">{{ stats.persen }}%</span>
          </div>
          <div class="h-2.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
            <div class="h-full rounded-full brand-gradient transition-all" :style="{ width: Math.min(stats.persen, 100) + '%' }" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-2xl bg-green-50 p-3 dark:bg-green-500/10">
            <p class="text-[11px] text-green-700 dark:text-green-400">Lunas</p>
            <p class="tabular text-lg font-extrabold text-green-700 dark:text-green-400">{{ stats.lunas }}</p>
          </div>
          <div class="rounded-2xl bg-amber-50 p-3 dark:bg-amber-500/10">
            <p class="text-[11px] text-amber-700 dark:text-amber-400">Belum Bayar</p>
            <p class="tabular text-lg font-extrabold text-amber-700 dark:text-amber-400">{{ stats.belum }}</p>
          </div>
        </div>
      </div>
    </UCard>

    <!-- Perlu perhatian -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-bell-ring" class="size-4 brand-text" />
          <p class="text-sm font-extrabold">Perlu Perhatian</p>
        </div>
      </template>
      <div class="space-y-2.5">
        <NuxtLink to="/admin/asrama/perizinan" class="flex items-center gap-3 rounded-2xl bg-[var(--surface-muted)] p-3">
          <div class="grid size-9 place-items-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
            <UIcon name="i-lucide-file-clock" class="size-4" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold">Perizinan menunggu</p>
            <p class="text-xs text-[var(--ink-muted)]">{{ stats.izinMenunggu }} pengajuan perlu diproses</p>
          </div>
          <UIcon name="i-lucide-chevron-right" class="size-4 text-[var(--ink-muted)]" />
        </NuxtLink>
        <NuxtLink to="/admin/psb/pendaftar" class="flex items-center gap-3 rounded-2xl bg-[var(--surface-muted)] p-3">
          <div class="grid size-9 place-items-center rounded-xl brand-soft">
            <UIcon name="i-lucide-clipboard-list" class="size-4" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold">Pendaftar PSB baru</p>
            <p class="text-xs text-[var(--ink-muted)]">{{ stats.psbBaru }} pendaftar belum diverifikasi</p>
          </div>
          <UIcon name="i-lucide-chevron-right" class="size-4 text-[var(--ink-muted)]" />
        </NuxtLink>
      </div>
    </UCard>

    <!-- Agenda terdekat -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-calendar-days" class="size-4 brand-text" />
            <p class="text-sm font-extrabold">Agenda Terdekat</p>
          </div>
          <UButton to="/admin/landing/agenda" size="xs" color="neutral" variant="soft" trailing-icon="i-lucide-arrow-right">Kelola</UButton>
        </div>
      </template>
      <div class="space-y-2.5">
        <div v-for="a in upcoming" :key="a.id" class="flex items-center gap-3">
          <div class="grid size-10 shrink-0 place-items-center rounded-xl brand-soft">
            <UIcon name="i-lucide-calendar" class="size-4" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold">{{ a.judul }}</p>
            <p class="truncate text-xs text-[var(--ink-muted)]">{{ tanggal(a.tanggal) }} • {{ a.jam }}</p>
          </div>
          <span class="shrink-0 text-[11px] font-semibold brand-text">{{ relatif(a.tanggal) }}</span>
        </div>
        <p v-if="!upcoming.length" class="py-4 text-center text-sm text-[var(--ink-muted)]">Belum ada agenda.</p>
      </div>
    </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { user } = useAuth()
const { rupiah, tanggal, tanggalRelatif, HARI } = useFormat()
const { stats, loadAll } = useDashboardStats()
const agendaStore = useAdminStore('agenda')

const firstName = computed(() => user.value?.nama?.split(' ')[0] ?? 'Admin')

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 11) return 'Selamat pagi'
  if (h < 15) return 'Selamat siang'
  if (h < 18) return 'Selamat sore'
  return 'Selamat malam'
})

const hariIni = computed(() => HARI[new Date().getDay()])
const todayText = computed(() => tanggal(new Date(), { hari: false }))

const cards = computed(() => [
  { label: 'Total Santri', value: stats.value.santri, icon: 'i-lucide-users', to: '/admin/akademik/santri', tone: 'primary' },
  { label: 'Guru & Ustadz', value: stats.value.guru, icon: 'i-lucide-contact', to: '/admin/akademik/guru', tone: 'cyan' },
  { label: 'Rombel', value: stats.value.rombel, icon: 'i-lucide-door-open', to: '/admin/akademik/rombel', tone: 'violet' },
  { label: 'Santri Mukim', value: stats.value.santriMukim, icon: 'i-lucide-bed-double', to: '/admin/asrama/penempatan', tone: 'amber' },
])

const upcoming = computed(() =>
  [...agendaStore.rows.value]
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
    .filter(a => new Date(a.tanggal).getTime() >= Date.now() - 86400000)
    .slice(0, 4),
)

function relatif(v: unknown) { return tanggalRelatif(v) }

useHead({ title: 'Dashboard — Panel Admin' })
onMounted(() => {
  loadAll()
  agendaStore.fetchAll()
})
</script>
