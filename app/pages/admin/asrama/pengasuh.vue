<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-xl font-extrabold">Koordinasi Pengasuh</h1>
      <p class="text-sm text-[var(--ink-muted)]">Pantauan kondisi asrama untuk musyrif & pengasuh.</p>
    </div>

    <!-- Ringkasan kondisi -->
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold brand-text">{{ santriMukim }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Santri Mukim</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-amber-600 dark:text-amber-400">{{ izinAktif }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Sedang Izin</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-rose-600 dark:text-rose-400">{{ pelanggaranAktif }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Dalam Pembinaan</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-cyan-600 dark:text-cyan-400">{{ okupansi }}%</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Okupansi</p>
      </div>
    </div>

    <!-- Kondisi per asrama -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-building-2" class="size-4 brand-text" />
          <p class="text-sm font-extrabold">Kondisi per Asrama</p>
        </div>
      </template>
      <div class="space-y-3">
        <div v-for="a in asramaList" :key="a.id" class="rounded-2xl bg-[var(--surface-muted)] p-3.5">
          <div class="flex items-center justify-between gap-2">
            <div class="min-w-0">
              <p class="truncate text-sm font-bold">{{ a.nama }}</p>
              <p class="text-[11px] text-[var(--ink-muted)]">{{ a.musyrif || 'Belum ada musyrif' }}</p>
            </div>
            <UBadge size="xs" color="neutral" variant="soft">{{ a.jenis }}</UBadge>
          </div>
          <div class="mt-2.5">
            <div class="mb-1 flex justify-between text-[11px] text-[var(--ink-muted)]">
              <span>{{ a.terisi }} / {{ a.kapasitas }} santri</span>
              <span class="font-bold">{{ a.kapasitas ? Math.round((a.terisi / a.kapasitas) * 100) : 0 }}%</span>
            </div>
            <div class="h-2 overflow-hidden rounded-full bg-[var(--surface)]">
              <div class="h-full rounded-full brand-gradient" :style="{ width: Math.min(100, a.kapasitas ? (a.terisi / a.kapasitas) * 100 : 0) + '%' }" />
            </div>
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            <UBadge v-if="a.izin" size="xs" color="warning" variant="soft">{{ a.izin }} izin aktif</UBadge>
            <UBadge v-if="a.pelanggaran" size="xs" color="error" variant="soft">{{ a.pelanggaran }} pembinaan</UBadge>
            <UBadge v-if="!a.izin && !a.pelanggaran" size="xs" color="success" variant="soft">Kondisi aman</UBadge>
          </div>
        </div>
        <p v-if="!asramaList.length" class="py-4 text-center text-sm text-[var(--ink-muted)]">Belum ada data asrama.</p>
      </div>
    </UCard>

    <!-- Santri izin -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-file-check" class="size-4 brand-text" />
            <p class="text-sm font-extrabold">Izin Berjalan</p>
          </div>
          <UButton to="/admin/asrama/perizinan" size="xs" color="neutral" variant="soft" trailing-icon="i-lucide-arrow-right">Kelola</UButton>
        </div>
      </template>
      <div class="space-y-2.5">
        <div v-for="iz in izinList" :key="iz.id" class="flex items-center gap-3 rounded-2xl bg-[var(--surface-muted)] p-3">
          <div class="grid size-9 shrink-0 place-items-center rounded-xl brand-soft text-xs font-extrabold">{{ inisial(iz.santri) }}</div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold">{{ iz.santri }}</p>
            <p class="truncate text-xs text-[var(--ink-muted)]">{{ iz.jenis }} • s.d. {{ tanggalSingkat(iz.selesai) }}</p>
          </div>
          <UBadge size="xs" :color="color(iz.status)" variant="soft">{{ iz.status }}</UBadge>
        </div>
        <p v-if="!izinList.length" class="py-4 text-center text-sm text-[var(--ink-muted)]">Tidak ada izin berjalan.</p>
      </div>
    </UCard>

    <!-- Perlu perhatian -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-alert-triangle" class="size-4 brand-text" />
          <p class="text-sm font-extrabold">Perlu Perhatian</p>
        </div>
      </template>
      <div class="space-y-2.5">
        <NuxtLink v-for="p in pembinaanAktif" :key="p.id" to="/admin/pembinaan/pelanggaran" class="flex items-center gap-3 rounded-2xl bg-[var(--surface-muted)] p-3">
          <div class="grid size-9 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400">
            <UIcon name="i-lucide-shield-alert" class="size-4" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold">{{ p.santri }}</p>
            <p class="truncate text-xs text-[var(--ink-muted)]">{{ p.jenis }} • {{ p.poin }} poin</p>
          </div>
          <UIcon name="i-lucide-chevron-right" class="size-4 text-[var(--ink-muted)]" />
        </NuxtLink>
        <p v-if="!pembinaanAktif.length" class="py-4 text-center text-sm text-[var(--ink-muted)]">Tidak ada kasus aktif.</p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from '~/composables/useAdminStore'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const asramaStore = useAdminStore('asrama')
const penempatanStore = useAdminStore('penempatan')
const perizinanStore = useAdminStore('perizinan')
const pembinaanStore = useAdminStore('pembinaan')

const { inisial, tanggalSingkat } = useFormat()
const { color } = useStatusColor()

const santriMukim = computed(() => penempatanStore.rows.value.filter(p => p.status === 'Aktif').length)

const izinList = computed(() =>
  perizinanStore.rows.value.filter(p => ['Disetujui', 'Menunggu'].includes(p.status)),
)
const izinAktif = computed(() => izinList.value.length)

const pembinaanAktif = computed(() =>
  pembinaanStore.rows.value.filter(p => p.status === 'Dalam Pembinaan'),
)
const pelanggaranAktif = computed(() => pembinaanAktif.value.length)

const asramaList = computed(() =>
  asramaStore.rows.value.map((a) => {
    const nama = String(a.nama)
    const izin = perizinanStore.rows.value.filter(p =>
      ['Disetujui', 'Menunggu'].includes(p.status)).length
    const pelanggaran = pembinaanAktif.value.length
    return { ...a, izin: Math.round(izin / Math.max(1, asramaStore.rows.value.length)), pelanggaran: Math.round(pelanggaran / Math.max(1, asramaStore.rows.value.length)) }
  }),
)

const okupansi = computed(() => {
  const kapasitas = asramaStore.rows.value.reduce((t, a) => t + (Number(a.kapasitas) || 0), 0)
  const terisi = asramaStore.rows.value.reduce((t, a) => t + (Number(a.terisi) || 0), 0)
  return kapasitas ? Math.round((terisi / kapasitas) * 100) : 0
})

useHead({ title: 'Koordinasi Pengasuh — Panel Admin' })
onMounted(() => {
  for (const s of [asramaStore, penempatanStore, perizinanStore, pembinaanStore]) s.fetchAll()
})
</script>
