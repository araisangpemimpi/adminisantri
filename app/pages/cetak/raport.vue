<template>
  <div class="min-h-dvh bg-neutral-100 p-4 print:bg-white print:p-0">
    <!-- Toolbar -->
    <div class="mx-auto mb-4 flex max-w-3xl items-center justify-between gap-3 print:hidden">
      <div>
        <h1 class="text-lg font-extrabold">Cetak Raport</h1>
        <p class="text-xs text-[var(--ink-muted)]">{{ raport?.santri || 'Tidak ada data' }}</p>
      </div>
      <div class="flex gap-2">
        <UButton color="neutral" variant="soft" icon="i-lucide-arrow-left" @click="kembali">Kembali</UButton>
        <UButton icon="i-lucide-printer" @click="cetak">Cetak / Simpan PDF</UButton>
      </div>
    </div>

    <EmptyState v-if="!raport" icon="i-lucide-file-text" title="Tidak ada raport" subtitle="Pilih raport di halaman Raport Semester terlebih dahulu." class="mx-auto max-w-3xl" />

    <!-- Dokumen -->
    <div v-else class="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow print:max-w-none print:rounded-none print:p-0 print:shadow-none">
      <!-- Kop -->
      <div class="flex items-center gap-4 border-b-2 border-neutral-800 pb-4">
        <div class="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl brand-gradient">
          <img v-if="settings.logo" :src="settings.logo" class="size-full object-cover">
          <UIcon v-else name="i-lucide-moon-star" class="size-8 text-white" />
        </div>
        <div class="min-w-0 flex-1 text-center">
          <h1 class="text-lg font-extrabold uppercase text-neutral-900">{{ settings.siteName }}</h1>
          <p class="text-xs text-neutral-600">{{ settings.alamat }}</p>
          <p class="text-xs text-neutral-600">{{ settings.telepon }} • {{ settings.email }}</p>
        </div>
      </div>

      <div class="mt-4 text-center">
        <h2 class="text-base font-extrabold uppercase text-neutral-900">Laporan Hasil Belajar Santri</h2>
        <p class="text-xs text-neutral-600">Semester {{ raport.semester }} • Tahun Ajaran {{ raport.tahun }}</p>
      </div>

      <!-- Identitas -->
      <div class="mt-5 grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
        <div class="flex gap-2"><span class="w-24 shrink-0 text-neutral-500">Nama Santri</span><span class="font-bold text-neutral-900">: {{ raport.santri }}</span></div>
        <div class="flex gap-2"><span class="w-24 shrink-0 text-neutral-500">Rombel</span><span class="font-semibold text-neutral-900">: {{ raport.rombel }}</span></div>
        <div class="flex gap-2"><span class="w-24 shrink-0 text-neutral-500">NIS</span><span class="font-semibold text-neutral-900">: {{ raport.nis || '—' }}</span></div>
        <div class="flex gap-2"><span class="w-24 shrink-0 text-neutral-500">Wali Kelas</span><span class="font-semibold text-neutral-900">: {{ raport.wali || '—' }}</span></div>
      </div>

      <!-- Nilai per mapel -->
      <table class="mt-5 w-full border-collapse text-xs">
        <thead>
          <tr class="bg-neutral-100">
            <th class="border border-neutral-300 px-2 py-1.5 text-left">No</th>
            <th class="border border-neutral-300 px-2 py-1.5 text-left">Mata Pelajaran</th>
            <th class="border border-neutral-300 px-2 py-1.5 text-center">Nilai</th>
            <th class="border border-neutral-300 px-2 py-1.5 text-center">Predikat</th>
            <th class="border border-neutral-300 px-2 py-1.5 text-center">Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(m, i) in rekap" :key="m.mapel">
            <td class="border border-neutral-300 px-2 py-1.5 text-center">{{ i + 1 }}</td>
            <td class="border border-neutral-300 px-2 py-1.5">{{ m.mapel }}</td>
            <td class="tabular border border-neutral-300 px-2 py-1.5 text-center font-semibold">{{ m.nilai.toFixed(1) }}</td>
            <td class="border border-neutral-300 px-2 py-1.5 text-center font-bold">{{ predikat(m.nilai) }}</td>
            <td class="border border-neutral-300 px-2 py-1.5 text-center">{{ m.nilai >= 75 ? 'Tuntas' : 'Belum Tuntas' }}</td>
          </tr>
          <tr v-if="!rekap.length">
            <td colspan="5" class="border border-neutral-300 px-2 py-4 text-center text-neutral-500">Belum ada data penilaian.</td>
          </tr>
        </tbody>
      </table>

      <!-- Rekap -->
      <div class="mt-5 grid grid-cols-3 gap-3 text-xs">
        <div class="rounded-xl border border-neutral-300 p-3 text-center">
          <p class="text-neutral-500">Rata-rata</p>
          <p class="tabular text-xl font-extrabold text-neutral-900">{{ (Number(raport.rata) || 0).toFixed(1) }}</p>
        </div>
        <div class="rounded-xl border border-neutral-300 p-3 text-center">
          <p class="text-neutral-500">Poin Sikap</p>
          <p class="tabular text-xl font-extrabold text-neutral-900">{{ raport.poinSikap ?? 100 }}</p>
        </div>
        <div class="rounded-xl border border-neutral-300 p-3 text-center">
          <p class="text-neutral-500">Predikat</p>
          <p class="text-xl font-extrabold text-neutral-900">{{ predikat(raport.rata) }}</p>
        </div>
      </div>

      <!-- Catatan -->
      <div class="mt-5 rounded-xl border border-neutral-300 p-3 text-xs">
        <p class="font-bold text-neutral-700">Catatan Wali Kelas</p>
        <p class="mt-1 leading-relaxed text-neutral-600">{{ raport.catatan || '—' }}</p>
      </div>

      <!-- Tanda tangan -->
      <div class="mt-8 flex justify-between text-xs">
        <div class="text-center">
          <p class="text-neutral-500">Mengetahui,</p>
          <p class="text-neutral-500">Orang Tua / Wali</p>
          <div class="h-16" />
          <p class="border-t border-neutral-400 px-6 pt-1 text-neutral-500">(............................)</p>
        </div>
        <div class="text-center">
          <p class="text-neutral-500">{{ settings.alamat.split(',').pop()?.trim() || 'Pesantren' }}, {{ tanggalCetak }}</p>
          <p class="text-neutral-500">Wali Kelas</p>
          <div class="h-16" />
          <p class="border-t border-neutral-400 px-6 pt-1 text-neutral-500">{{ raport.wali || '(............................)' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from '~/composables/useAdminStore'

definePageMeta({ layout: false })

const { settings, load } = useSiteSettings()
const { tanggal } = useFormat()
const penilaianStore = useAdminStore('penilaian')

const raport = ref<any | null>(null)
const tanggalCetak = computed(() => tanggal(new Date(), { hari: false }))

/** Rekap nilai per mapel dari Penilaian KD. */
const rekap = computed(() => {
  if (!raport.value) return []
  const byMapel = new Map<string, number[]>()
  for (const p of penilaianStore.rows.value) {
    if (p.santri !== raport.value.santri) continue
    const list = byMapel.get(p.mapel) ?? []
    list.push(Number(p.nilai) || 0)
    byMapel.set(p.mapel, list)
  }
  return [...byMapel.entries()].map(([mapel, nilai]) => ({
    mapel,
    nilai: nilai.reduce((a, b) => a + b, 0) / nilai.length,
  }))
})

function predikat(n: unknown) {
  const v = Number(n) || 0
  if (v >= 90) return 'A'
  if (v >= 80) return 'B'
  if (v >= 70) return 'C'
  if (v >= 60) return 'D'
  return 'E'
}

function cetak() {
  window.print()
}

async function kembali() {
  await navigateTo('/admin/akademik/raport')
}

useHead({ title: 'Cetak Raport' })
onMounted(async () => {
  load()
  await penilaianStore.fetchAll()
  if (!import.meta.client) return
  try {
    const raw = localStorage.getItem('pesantren-cetak-raport')
    raport.value = raw ? JSON.parse(raw) : null
  }
  catch { raport.value = null }
})
</script>

<style scoped>
@page {
  size: A4;
  margin: 15mm;
}
</style>
