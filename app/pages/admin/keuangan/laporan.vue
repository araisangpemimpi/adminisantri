<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-extrabold">Laporan Keuangan</h1>
        <p class="text-sm text-[var(--ink-muted)]">Rekap siap audit dengan ekspor CSV.</p>
      </div>
      <div class="flex gap-2">
        <UButton color="neutral" variant="soft" icon="i-lucide-printer" @click="cetak">Cetak</UButton>
        <UButton icon="i-lucide-download" @click="eksporCsv">Ekspor CSV</UButton>
      </div>
    </div>

    <!-- Periode -->
    <div class="card-soft p-4">
      <p class="eyebrow mb-2.5">Periode Laporan</p>
      <div class="grid grid-cols-2 gap-3">
        <UFormField label="Dari Tanggal">
          <UInput v-model="dari" type="date" class="w-full" />
        </UFormField>
        <UFormField label="Sampai Tanggal">
          <UInput v-model="sampai" type="date" class="w-full" />
        </UFormField>
      </div>
      <div class="mt-2.5 flex flex-wrap gap-1.5">
        <UButton v-for="p in preset" :key="p.label" size="xs" color="neutral" variant="soft" @click="pakaiPreset(p.bulan)">
          {{ p.label }}
        </UButton>
      </div>
    </div>

    <!-- Ringkasan -->
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-green-600 dark:text-green-400">{{ rupiah(totalMasuk) }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Penerimaan</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-amber-600 dark:text-amber-400">{{ rupiah(totalKeluar) }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Pengeluaran</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold" :class="saldo >= 0 ? 'brand-text' : 'text-rose-600 dark:text-rose-400'">{{ rupiah(saldo) }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Saldo Bersih</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-cyan-600 dark:text-cyan-400">{{ filtered.length }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Jumlah Transaksi</p>
      </div>
    </div>

    <!-- Rincian per jenis -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-chart-column" class="size-4 brand-text" />
          <p class="text-sm font-extrabold">Rincian per Jenis</p>
        </div>
      </template>
      <div class="space-y-3">
        <div v-for="r in perJenis" :key="r.jenis">
          <div class="mb-1 flex items-center justify-between text-xs">
            <span class="font-semibold">{{ r.jenis }}</span>
            <span class="tabular font-bold">{{ rupiah(r.total) }}</span>
          </div>
          <div class="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
            <div
              class="h-full rounded-full"
              :class="r.arah === 'Masuk' ? 'bg-green-500' : 'bg-amber-500'"
              :style="{ width: persen(r.total) + '%' }"
            />
          </div>
          <p class="mt-0.5 text-[10px] text-[var(--ink-muted)]">{{ r.jumlah }} transaksi • {{ r.arah }}</p>
        </div>
        <p v-if="!perJenis.length" class="py-4 text-center text-sm text-[var(--ink-muted)]">Tidak ada transaksi pada periode ini.</p>
      </div>
    </UCard>

    <!-- Rekap SPP -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-receipt-text" class="size-4 brand-text" />
          <p class="text-sm font-extrabold">Rekap Tagihan SPP</p>
        </div>
      </template>
      <div class="space-y-2.5">
        <div class="flex items-center justify-between rounded-2xl bg-[var(--surface-muted)] p-3">
          <span class="text-xs font-semibold">Total Tagihan</span>
          <span class="tabular text-sm font-extrabold">{{ rupiah(tagihanTotal) }}</span>
        </div>
        <div class="flex items-center justify-between rounded-2xl bg-green-50 p-3 dark:bg-green-500/10">
          <span class="text-xs font-semibold text-green-700 dark:text-green-400">Terbayar</span>
          <span class="tabular text-sm font-extrabold text-green-700 dark:text-green-400">{{ rupiah(tagihanLunas) }}</span>
        </div>
        <div class="flex items-center justify-between rounded-2xl bg-rose-50 p-3 dark:bg-rose-500/10">
          <span class="text-xs font-semibold text-rose-700 dark:text-rose-400">Tunggakan</span>
          <span class="tabular text-sm font-extrabold text-rose-700 dark:text-rose-400">{{ rupiah(tagihanTotal - tagihanLunas) }}</span>
        </div>
        <div class="h-2.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
          <div class="h-full rounded-full brand-gradient" :style="{ width: (tagihanTotal ? (tagihanLunas / tagihanTotal) * 100 : 0) + '%' }" />
        </div>
        <p class="text-center text-[11px] text-[var(--ink-muted)]">
          Tingkat ketercapaian {{ tagihanTotal ? Math.round((tagihanLunas / tagihanTotal) * 100) : 0 }}%
        </p>
      </div>
    </UCard>

    <!-- Daftar transaksi -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-list" class="size-4 brand-text" />
          <p class="text-sm font-extrabold">Detail Transaksi</p>
        </div>
      </template>
      <div class="-mx-4 overflow-x-auto sm:mx-0">
        <table class="w-full min-w-[36rem] text-xs">
          <thead>
            <tr class="border-b border-[var(--hairline)] text-left text-[var(--ink-muted)]">
              <th class="px-4 py-2 font-semibold">Tanggal</th>
              <th class="px-4 py-2 font-semibold">Nomor</th>
              <th class="px-4 py-2 font-semibold">Santri</th>
              <th class="px-4 py-2 font-semibold">Jenis</th>
              <th class="px-4 py-2 text-right font-semibold">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="t in filtered" :key="t.id" class="border-b border-[var(--hairline)]">
              <td class="px-4 py-2 whitespace-nowrap">{{ tanggalSingkat(t.tanggal) }}</td>
              <td class="tabular px-4 py-2 whitespace-nowrap">{{ t.nomor }}</td>
              <td class="px-4 py-2">{{ t.santri }}</td>
              <td class="px-4 py-2">{{ t.jenis }}</td>
              <td class="tabular px-4 py-2 text-right font-semibold" :class="t.arah === 'Masuk' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'">
                {{ t.arah === 'Masuk' ? '+' : '−' }}{{ rupiah(t.jumlah) }}
              </td>
            </tr>
            <tr v-if="!filtered.length">
              <td colspan="5" class="px-4 py-6 text-center text-[var(--ink-muted)]">Tidak ada transaksi.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from '~/composables/useAdminStore'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const transaksiStore = useAdminStore('transaksi')
const tagihanStore = useAdminStore('tagihan')
const { rupiah, tanggalSingkat, BULAN } = useFormat()
const { settings } = useSiteSettings()
const toast = useToast()

const awalBulan = () => {
  const d = new Date()
  d.setDate(1)
  return d.toISOString().slice(0, 10)
}
const hariIni = () => new Date().toISOString().slice(0, 10)

const dari = ref(awalBulan())
const sampai = ref(hariIni())

const preset = computed(() => {
  const d = new Date()
  const out = [{ label: 'Bulan ini', bulan: 0 }]
  for (let i = 1; i <= 3; i++) {
    const b = new Date(d.getFullYear(), d.getMonth() - i, 1)
    out.push({ label: `${BULAN[b.getMonth()]} ${b.getFullYear()}`, bulan: i })
  }
  return out
})

function pakaiPreset(bulanLalu: number) {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - bulanLalu, 1)
  const end = bulanLalu === 0 ? now : new Date(now.getFullYear(), now.getMonth() - bulanLalu + 1, 0)
  dari.value = start.toISOString().slice(0, 10)
  sampai.value = end.toISOString().slice(0, 10)
}

const filtered = computed(() =>
  transaksiStore.rows.value.filter((t) => {
    const d = String(t.tanggal ?? '')
    return (!dari.value || d >= dari.value) && (!sampai.value || d <= sampai.value)
  }),
)

const totalMasuk = computed(() => filtered.value.filter(t => t.arah === 'Masuk').reduce((a, t) => a + (Number(t.jumlah) || 0), 0))
const totalKeluar = computed(() => filtered.value.filter(t => t.arah === 'Keluar').reduce((a, t) => a + (Number(t.jumlah) || 0), 0))
const saldo = computed(() => totalMasuk.value - totalKeluar.value)

const perJenis = computed(() => {
  const map = new Map<string, { jenis: string, total: number, jumlah: number, arah: string }>()
  for (const t of filtered.value) {
    const key = String(t.jenis ?? 'Lainnya')
    const cur = map.get(key) ?? { jenis: key, total: 0, jumlah: 0, arah: String(t.arah ?? 'Masuk') }
    cur.total += Number(t.jumlah) || 0
    cur.jumlah += 1
    map.set(key, cur)
  }
  return [...map.values()].sort((a, b) => b.total - a.total)
})

const maxJenis = computed(() => Math.max(1, ...perJenis.value.map(r => r.total)))
function persen(v: number) { return Math.round((v / maxJenis.value) * 100) }

const tagihanTotal = computed(() => tagihanStore.rows.value.reduce((t, r) => t + (Number(r.jumlah) || 0), 0))
const tagihanLunas = computed(() => tagihanStore.rows.value.filter(r => r.status === 'Lunas').reduce((t, r) => t + (Number(r.jumlah) || 0), 0))

function eksporCsv() {
  if (!import.meta.client) return
  const head = ['Tanggal', 'Nomor', 'Santri', 'NIS', 'Jenis', 'Arah', 'Jumlah', 'Metode', 'Referensi', 'Petugas', 'Catatan']
  const rows = filtered.value.map(t => [
    t.tanggal, t.nomor, t.santri, t.nis, t.jenis, t.arah, t.jumlah, t.metode, t.referensi, t.petugas, t.catatan,
  ])
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = [head, ...rows].map(r => r.map(esc).join(',')).join('\r\n')

  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `laporan-keuangan-${dari.value}_${sampai.value}.csv`
  a.click()
  URL.revokeObjectURL(url)
  toast.add({ title: 'CSV diunduh', description: `${rows.length} transaksi`, color: 'success' })
}

function cetak() { window.print() }

useHead({ title: 'Laporan Keuangan — Panel Admin' })
onMounted(() => {
  transaksiStore.fetchAll()
  tagihanStore.fetchAll()
})
</script>
