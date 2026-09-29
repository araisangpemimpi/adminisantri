<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-extrabold">Laporan PSB</h1>
        <p class="text-sm text-[var(--ink-muted)]">Rekapitulasi pendaftaran & hasil seleksi.</p>
      </div>
      <UButton icon="i-lucide-download" @click="eksporCsv">Ekspor CSV</UButton>
    </div>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold brand-text">{{ total }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Total Pendaftar</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-green-600 dark:text-green-400">{{ perStatus.Diterima }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Diterima</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-cyan-600 dark:text-cyan-400">{{ rasio }}%</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Tingkat Diterima</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-amber-600 dark:text-amber-400">{{ rataNilai }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Rata Nilai Seleksi</p>
      </div>
    </div>

    <!-- Per status -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-chart-pie" class="size-4 brand-text" />
          <p class="text-sm font-extrabold">Status Pendaftaran</p>
        </div>
      </template>
      <div class="space-y-3">
        <div v-for="s in statusList" :key="s.status">
          <div class="mb-1 flex items-center justify-between text-xs">
            <span class="font-semibold">{{ s.status }}</span>
            <span class="tabular font-bold">{{ s.jumlah }} ({{ s.persen }}%)</span>
          </div>
          <div class="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
            <div class="h-full rounded-full" :class="s.warna" :style="{ width: s.persen + '%' }" />
          </div>
        </div>
        <p v-if="!total" class="py-4 text-center text-sm text-[var(--ink-muted)]">Belum ada pendaftar.</p>
      </div>
    </UCard>

    <!-- Per jenjang -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-layers" class="size-4 brand-text" />
          <p class="text-sm font-extrabold">Per Jenjang</p>
        </div>
      </template>
      <div class="grid grid-cols-2 gap-3">
        <div v-for="j in perJenjang" :key="j.jenjang" class="rounded-2xl bg-[var(--surface-muted)] p-3.5 text-center">
          <p class="tabular text-xl font-extrabold brand-text">{{ j.jumlah }}</p>
          <p class="text-[11px] font-semibold text-[var(--ink-muted)]">{{ j.jenjang }}</p>
          <p class="mt-0.5 text-[10px] text-[var(--ink-muted)]">{{ j.lulus }} diterima</p>
        </div>
      </div>
    </UCard>

    <!-- Per gelombang -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-calendar-range" class="size-4 brand-text" />
          <p class="text-sm font-extrabold">Per Gelombang</p>
        </div>
      </template>
      <div class="space-y-2.5">
        <div v-for="g in perGelombang" :key="g.gelombang" class="flex items-center justify-between rounded-2xl bg-[var(--surface-muted)] p-3">
          <div>
            <p class="text-sm font-semibold">{{ g.gelombang }}</p>
            <p class="text-[11px] text-[var(--ink-muted)]">{{ g.lulus }} diterima dari {{ g.jumlah }}</p>
          </div>
          <p class="tabular text-base font-extrabold brand-text">{{ g.jumlah }}</p>
        </div>
        <p v-if="!perGelombang.length" class="py-4 text-center text-sm text-[var(--ink-muted)]">Belum ada data.</p>
      </div>
    </UCard>

    <!-- Kelengkapan berkas -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-file-check" class="size-4 brand-text" />
          <p class="text-sm font-extrabold">Kelengkapan Berkas</p>
        </div>
      </template>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <p class="tabular text-2xl font-extrabold brand-text">{{ persenBerkas }}%</p>
            <p class="text-[11px] text-[var(--ink-muted)]">{{ lengkap }} dari {{ total }} pendaftar lengkap</p>
          </div>
          <div class="grid size-14 place-items-center rounded-2xl brand-soft">
            <UIcon name="i-lucide-file-check-2" class="size-7" />
          </div>
        </div>
        <div class="h-2.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
          <div class="h-full rounded-full brand-gradient" :style="{ width: persenBerkas + '%' }" />
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from '~/composables/useAdminStore'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const store = useAdminStore('psb')
const toast = useToast()

const rows = computed(() => store.rows.value)
const total = computed(() => rows.value.length)

const perStatus = computed(() => {
  const out: Record<string, number> = { Menunggu: 0, Terverifikasi: 0, Diterima: 0, Ditolak: 0 }
  for (const p of rows.value) {
    const s = String(p.status ?? 'Menunggu')
    out[s] = (out[s] ?? 0) + 1
  }
  return out
})

const statusList = computed(() => {
  const warna: Record<string, string> = {
    Menunggu: 'bg-amber-500',
    Terverifikasi: 'bg-cyan-500',
    Diterima: 'bg-green-500',
    Ditolak: 'bg-rose-500',
  }
  return Object.entries(perStatus.value).map(([status, jumlah]) => ({
    status,
    jumlah,
    persen: total.value ? Math.round((jumlah / total.value) * 100) : 0,
    warna: warna[status] ?? 'bg-neutral-400',
  }))
})

const rasio = computed(() => total.value ? Math.round((perStatus.value.Diterima / total.value) * 100) : 0)

const rataNilai = computed(() => {
  const n = rows.value.map(p => Number(p.nilaiSeleksi) || 0).filter(Boolean)
  return n.length ? (n.reduce((a, b) => a + b, 0) / n.length).toFixed(1) : '0'
})

const perJenjang = computed(() => {
  const map = new Map<string, { jumlah: number, lulus: number }>()
  for (const p of rows.value) {
    const j = String(p.jenjang ?? 'Lainnya')
    const cur = map.get(j) ?? { jumlah: 0, lulus: 0 }
    cur.jumlah++
    if (p.status === 'Diterima') cur.lulus++
    map.set(j, cur)
  }
  return [...map.entries()].map(([jenjang, v]) => ({ jenjang, ...v }))
})

const perGelombang = computed(() => {
  const map = new Map<string, { jumlah: number, lulus: number }>()
  for (const p of rows.value) {
    const g = String(p.gelombang ?? 'Belum ditentukan')
    const cur = map.get(g) ?? { jumlah: 0, lulus: 0 }
    cur.jumlah++
    if (p.status === 'Diterima') cur.lulus++
    map.set(g, cur)
  }
  return [...map.entries()].map(([gelombang, v]) => ({ gelombang, ...v }))
    .sort((a, b) => a.gelombang.localeCompare(b.gelombang))
})

const lengkap = computed(() =>
  rows.value.filter(p => Array.isArray(p.berkas) && p.berkas.length >= 3).length,
)
const persenBerkas = computed(() => total.value ? Math.round((lengkap.value / total.value) * 100) : 0)

function eksporCsv() {
  if (!import.meta.client) return
  const head = ['No Pendaftaran', 'Kode Unik', 'Nama', 'JK', 'Jenjang', 'Gelombang', 'Asal Sekolah', 'Wali', 'WhatsApp', 'Nilai Seleksi', 'Status', 'Berkas']
  const data = rows.value.map(p => [
    p.noPendaftaran, p.kodeUnik, p.nama, p.jk, p.jenjang, p.gelombang,
    p.asalSekolah, p.wali, p.hp, p.nilaiSeleksi, p.status,
    Array.isArray(p.berkas) ? p.berkas.join('; ') : '',
  ])
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = [head, ...data].map(r => r.map(esc).join(',')).join('\r\n')

  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `laporan-psb-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
  toast.add({ title: 'CSV diunduh', description: `${data.length} pendaftar`, color: 'success' })
}

useHead({ title: 'Laporan PSB — Panel Admin' })
onMounted(() => store.fetchAll())
</script>
