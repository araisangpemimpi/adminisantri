<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-xl font-extrabold">Poin Sikap</h1>
      <p class="text-sm text-[var(--ink-muted)]">Akumulasi poin pelanggaran & penghargaan per santri.</p>
    </div>

    <UAlert color="info" variant="soft" icon="i-lucide-calculator">
      <template #description>
        <b>Poin Sikap = 100 − (poin pelanggaran) + (poin penghargaan)</b>, dibatasi 0–100.
        Nilai ini otomatis masuk ke <b>Raport Semester</b> saat dihitung ulang.
      </template>
    </UAlert>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold brand-text">{{ rows.length }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Santri Terpantau</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-green-600 dark:text-green-400">{{ baik }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Sikap Baik (≥90)</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-amber-600 dark:text-amber-400">{{ sedang }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Perlu Perhatian</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-rose-600 dark:text-rose-400">{{ buruk }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Pembinaan Khusus</p>
      </div>
    </div>

    <UInput v-model="q" placeholder="Cari santri…" icon="i-lucide-search" class="w-full" />

    <EmptyState v-if="!filtered.length" icon="i-lucide-gauge" title="Belum ada data poin" subtitle="Catat pelanggaran atau prestasi santri terlebih dahulu." />

    <div v-else class="space-y-2.5">
      <div v-for="r in filtered" :key="r.santri" class="card-soft p-4">
        <div class="flex items-center gap-3.5">
          <div class="grid size-11 shrink-0 place-items-center rounded-2xl brand-soft text-xs font-extrabold">{{ inisial(r.santri) }}</div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-bold">{{ r.santri }}</p>
            <p class="truncate text-xs text-[var(--ink-muted)]">{{ r.rombel }}</p>
          </div>
          <div class="text-right">
            <p class="tabular text-xl font-extrabold" :class="warnaPoin(r.poin)">{{ r.poin }}</p>
            <p class="text-[10px] font-semibold text-[var(--ink-muted)]">Poin Sikap</p>
          </div>
        </div>

        <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
          <div class="h-full rounded-full transition-all" :class="barPoin(r.poin)" :style="{ width: r.poin + '%' }" />
        </div>

        <div class="mt-3 grid grid-cols-3 gap-2 text-center">
          <div class="rounded-2xl bg-[var(--surface-muted)] p-2.5">
            <p class="tabular text-sm font-extrabold text-rose-600 dark:text-rose-400">{{ r.pelanggaran }}</p>
            <p class="text-[10px] font-semibold text-[var(--ink-muted)]">Pelanggaran</p>
          </div>
          <div class="rounded-2xl bg-[var(--surface-muted)] p-2.5">
            <p class="tabular text-sm font-extrabold text-amber-600 dark:text-amber-400">{{ r.poinPelanggaran }}</p>
            <p class="text-[10px] font-semibold text-[var(--ink-muted)]">Poin −</p>
          </div>
          <div class="rounded-2xl bg-[var(--surface-muted)] p-2.5">
            <p class="tabular text-sm font-extrabold text-green-600 dark:text-green-400">{{ r.poinPrestasi }}</p>
            <p class="text-[10px] font-semibold text-[var(--ink-muted)]">Poin +</p>
          </div>
        </div>

        <div class="mt-3 flex gap-1.5">
          <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-shield-alert" to="/admin/pembinaan/pelanggaran">Pelanggaran</UButton>
          <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-medal" to="/admin/pembinaan/prestasi">Prestasi</UButton>
          <UButton
            v-if="r.poin < 70" size="xs" color="error" variant="soft" icon="i-lucide-message-circle"
            @click="hubungiWali(r)"
          >
            Hubungi Wali
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from '~/composables/useAdminStore'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const pelanggaranStore = useAdminStore('pembinaan')
const prestasiStore = useAdminStore('prestasi_santri')
const santriStore = useAdminStore('santri')
const { settings, load: loadSettings } = useSiteSettings()
const { inisial } = useFormat()
const toast = useToast()

const q = ref('')

/** Hitung poin sikap tiap santri dari pelanggaran & prestasi. */
const rows = computed(() =>
  santriStore.rows.value.map((s) => {
    const pelanggaran = pelanggaranStore.rows.value.filter(p => p.santri === s.nama)
    const prestasi = prestasiStore.rows.value.filter(p => p.santri === s.nama)
    const poinPelanggaran = pelanggaran.reduce((t, p) => t + (Number(p.poin) || 0), 0)
    const poinPrestasi = prestasi.reduce((t, p) => t + (Number(p.poin) || 0), 0)
    const poin = Math.max(0, Math.min(100, 100 - poinPelanggaran + poinPrestasi))
    return {
      santri: s.nama,
      rombel: s.rombel ?? '',
      jk: s.jk,
      pelanggaran: pelanggaran.length,
      poinPelanggaran,
      poinPrestasi,
      poin,
    }
  }).sort((a, b) => a.poin - b.poin),
)

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return rows.value
  return rows.value.filter(r => `${r.santri} ${r.rombel}`.toLowerCase().includes(term))
})

const baik = computed(() => rows.value.filter(r => r.poin >= 90).length)
const sedang = computed(() => rows.value.filter(r => r.poin >= 70 && r.poin < 90).length)
const buruk = computed(() => rows.value.filter(r => r.poin < 70).length)

function warnaPoin(p: number) {
  if (p >= 90) return 'text-green-600 dark:text-green-400'
  if (p >= 70) return 'text-amber-600 dark:text-amber-400'
  return 'text-rose-600 dark:text-rose-400'
}
function barPoin(p: number) {
  if (p >= 90) return 'bg-green-500'
  if (p >= 70) return 'bg-amber-500'
  return 'bg-rose-500'
}

function hubungiWali(r: any) {
  const s = santriStore.rows.value.find(x => x.nama === r.santri)
  const nomor = String(s?.hp ?? '').replace(/[^0-9]/g, '')
  const wa = nomor.startsWith('0') ? `62${nomor.slice(1)}` : nomor
  const pesan = `Assalamualaikum,\n\nKami ingin menginformasikan perkembangan sikap ananda:\n\nNama: ${r.santri}\nRombel: ${r.rombel}\nPoin sikap: ${r.poin} (dari 100)\nPelanggaran tercatat: ${r.pelanggaran}\n\nKami mohon kerja sama Bapak/Ibu untuk pembinaan di rumah. Terima kasih.\n\n${settings.value.siteName}`
  window.open(`https://wa.me/${wa || settings.value.wa}?text=${encodeURIComponent(pesan)}`, '_blank')
  toast.add({ title: 'Membuka WhatsApp', description: r.santri, color: 'success' })
}

useHead({ title: 'Poin Sikap — Panel Admin' })
onMounted(() => {
  for (const s of [pelanggaranStore, prestasiStore, santriStore]) s.fetchAll()
  loadSettings()
})
</script>
