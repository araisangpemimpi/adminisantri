<template>
  <div class="min-h-dvh bg-neutral-100 p-4 print:bg-white print:p-0">
    <div class="mx-auto mb-4 flex max-w-2xl items-center justify-between gap-3 print:hidden">
      <div>
        <h1 class="text-lg font-extrabold">Cetak Invoice</h1>
        <p class="text-xs text-[var(--ink-muted)]">{{ inv?.nomor || 'Tidak ada data' }}</p>
      </div>
      <div class="flex gap-2">
        <UButton color="neutral" variant="soft" icon="i-lucide-arrow-left" @click="kembali">Kembali</UButton>
        <UButton icon="i-lucide-printer" @click="cetak">Cetak / Simpan PDF</UButton>
      </div>
    </div>

    <EmptyState v-if="!inv" icon="i-lucide-file-invoice" title="Tidak ada invoice" subtitle="Pilih invoice di halaman Invoice Digital." class="mx-auto max-w-2xl" />

    <div v-else class="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow print:max-w-none print:rounded-none print:p-0 print:shadow-none">
      <!-- Kop -->
      <div class="flex items-start justify-between gap-4 border-b-2 border-neutral-800 pb-4">
        <div class="flex items-center gap-3">
          <div class="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl brand-gradient">
            <img v-if="settings.logo" :src="settings.logo" class="size-full object-cover">
            <UIcon v-else name="i-lucide-moon-star" class="size-7 text-white" />
          </div>
          <div>
            <h1 class="text-base font-extrabold uppercase text-neutral-900">{{ settings.siteName }}</h1>
            <p class="text-[11px] text-neutral-600">{{ settings.alamat }}</p>
            <p class="text-[11px] text-neutral-600">{{ settings.telepon }} • {{ settings.email }}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-lg font-extrabold uppercase text-neutral-900">Invoice</p>
          <p class="tabular text-xs text-neutral-600">{{ inv.nomor }}</p>
        </div>
      </div>

      <!-- Info -->
      <div class="mt-5 flex justify-between gap-6">
        <div class="text-xs">
          <p class="font-bold uppercase text-neutral-500">Ditagihkan kepada</p>
          <p class="mt-1 text-sm font-bold text-neutral-900">{{ inv.santri }}</p>
          <p class="text-neutral-600">NIS: {{ inv.nis || '—' }}</p>
          <p class="text-neutral-600">Rombel: {{ inv.rombel || '—' }}</p>
        </div>
        <div class="text-right text-xs">
          <p class="font-bold uppercase text-neutral-500">Detail</p>
          <p class="mt-1 text-neutral-600">Tanggal: {{ tanggalSingkat(inv.tanggal) }}</p>
          <p class="text-neutral-600">Jatuh tempo: {{ tanggalSingkat(inv.jatuh_tempo) }}</p>
          <p class="text-neutral-600">Metode: {{ inv.metode }}</p>
        </div>
      </div>

      <!-- Rincian -->
      <table class="mt-5 w-full border-collapse text-xs">
        <thead>
          <tr class="bg-neutral-100">
            <th class="border border-neutral-300 px-3 py-2 text-left">Deskripsi</th>
            <th class="border border-neutral-300 px-3 py-2 text-left">Periode</th>
            <th class="border border-neutral-300 px-3 py-2 text-right">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-neutral-300 px-3 py-2">{{ inv.jenis }}</td>
            <td class="border border-neutral-300 px-3 py-2">{{ inv.periode }}</td>
            <td class="tabular border border-neutral-300 px-3 py-2 text-right">{{ rupiah(inv.jumlah) }}</td>
          </tr>
          <tr>
            <td colspan="2" class="border border-neutral-300 px-3 py-2 text-right font-bold">Total</td>
            <td class="tabular border border-neutral-300 px-3 py-2 text-right text-base font-extrabold">{{ rupiah(inv.jumlah) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Status -->
      <div class="mt-4 flex items-center justify-between">
        <p class="text-xs text-neutral-500">{{ inv.catatan || '' }}</p>
        <span
          class="rounded-lg px-3 py-1.5 text-xs font-extrabold uppercase"
          :class="inv.status === 'Lunas' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
        >
          {{ inv.status }}
        </span>
      </div>

      <!-- Catatan pembayaran -->
      <div class="mt-6 rounded-xl bg-neutral-50 p-4 text-[11px] leading-relaxed text-neutral-600">
        <p class="font-bold text-neutral-700">Informasi Pembayaran</p>
        <p class="mt-1">Pembayaran dapat dilakukan melalui transfer bank pesantren atau tunai di bendahara.</p>
        <p>Mohon cantumkan nomor invoice <b>{{ inv.nomor }}</b> pada berita transfer.</p>
        <p class="mt-1">Konfirmasi: {{ settings.telepon }} • {{ settings.email }}</p>
      </div>

      <!-- Tanda tangan -->
      <div class="mt-8 flex justify-end text-xs">
        <div class="text-center">
          <p class="text-neutral-500">{{ tanggalSingkat(new Date()) }}</p>
          <p class="text-neutral-500">Bendahara</p>
          <div class="h-16" />
          <p class="border-t border-neutral-400 px-6 pt-1 text-neutral-500">(............................)</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { settings, load } = useSiteSettings()
const { rupiah, tanggalSingkat } = useFormat()

const inv = ref<any | null>(null)

function cetak() { window.print() }
async function kembali() { await navigateTo('/admin/keuangan/invoice') }

useHead({ title: 'Cetak Invoice' })
onMounted(() => {
  load()
  if (!import.meta.client) return
  try {
    const raw = localStorage.getItem('pesantren-cetak-invoice')
    inv.value = raw ? JSON.parse(raw) : null
  }
  catch { inv.value = null }
})
</script>

<style scoped>
@page {
  size: A4;
  margin: 15mm;
}
</style>
