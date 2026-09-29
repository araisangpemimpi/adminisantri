<template>
  <div class="min-h-dvh bg-neutral-100 p-4 print:bg-white print:p-0">
    <!-- Toolbar (tidak tercetak) -->
    <div class="mx-auto mb-4 flex max-w-3xl items-center justify-between gap-3 print:hidden">
      <div>
        <h1 class="text-lg font-extrabold">Cetak Kartu Santri</h1>
        <p class="text-xs text-[var(--ink-muted)]">{{ santri.length }} kartu siap dicetak</p>
      </div>
      <div class="flex gap-2">
        <UButton color="neutral" variant="soft" icon="i-lucide-arrow-left" @click="kembali">Kembali</UButton>
        <UButton icon="i-lucide-printer" @click="cetak">Cetak / Simpan PDF</UButton>
      </div>
    </div>

    <EmptyState v-if="!santri.length" icon="i-lucide-id-card" title="Tidak ada kartu" subtitle="Pilih santri di halaman Kartu Santri terlebih dahulu." class="mx-auto max-w-3xl" />

    <!-- Kartu -->
    <div v-else class="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2 print:max-w-none print:grid-cols-2 print:gap-2">
      <div
        v-for="s in santri" :key="s.id"
        class="kartu relative overflow-hidden rounded-2xl bg-white shadow print:shadow-none print:break-inside-avoid"
      >
        <!-- Header -->
        <div class="brand-gradient pattern-islamic flex items-center gap-2.5 px-3.5 py-2.5 text-white">
          <div class="grid size-8 place-items-center rounded-lg bg-white/20">
            <UIcon name="i-lucide-moon-star" class="size-4" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-[11px] font-extrabold leading-tight">{{ settings.siteName }}</p>
            <p class="text-[8px] text-white/75">Kartu Identitas Santri</p>
          </div>
          <p class="text-[8px] font-bold text-white/75">TA {{ tahun }}</p>
        </div>

        <!-- Isi -->
        <div class="flex gap-3 p-3.5">
          <div class="min-w-0 flex-1">
            <p class="text-[9px] font-bold uppercase tracking-wide text-neutral-400">Nama</p>
            <p class="truncate text-[13px] font-extrabold leading-tight text-neutral-900">{{ s.nama }}</p>

            <div class="mt-2 space-y-1">
              <div class="flex gap-2">
                <span class="w-12 shrink-0 text-[9px] text-neutral-400">NIS</span>
                <span class="tabular text-[10px] font-semibold text-neutral-800">{{ s.nis || '—' }}</span>
              </div>
              <div class="flex gap-2">
                <span class="w-12 shrink-0 text-[9px] text-neutral-400">Rombel</span>
                <span class="text-[10px] font-semibold text-neutral-800">{{ s.rombel || '—' }}</span>
              </div>
              <div class="flex gap-2">
                <span class="w-12 shrink-0 text-[9px] text-neutral-400">Asrama</span>
                <span class="truncate text-[10px] font-semibold text-neutral-800">{{ s.kamar || 'Non-mukim' }}</span>
              </div>
              <div class="flex gap-2">
                <span class="w-12 shrink-0 text-[9px] text-neutral-400">Asal</span>
                <span class="truncate text-[10px] font-semibold text-neutral-800">{{ s.asal || '—' }}</span>
              </div>
            </div>
          </div>

          <div class="shrink-0 text-center">
            <img v-if="qrMap[String(s.id)]" :src="qrMap[String(s.id)]" alt="QR" class="size-[72px] rounded-lg border border-neutral-200">
            <div v-else class="grid size-[72px] place-items-center rounded-lg border border-dashed border-neutral-300 text-[8px] text-neutral-400">QR</div>
            <p class="mt-1 text-[7px] text-neutral-400">Scan untuk verifikasi</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between border-t border-dashed border-neutral-200 px-3.5 py-2">
          <p class="text-[7px] text-neutral-400">{{ settings.alamat }}</p>
          <p class="text-[7px] font-semibold text-neutral-500">Kartu ini milik pesantren</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { settings, load } = useSiteSettings()
const { toDataUrl, santriPayload } = useQr()

const santri = ref<any[]>([])
const qrMap = reactive<Record<string, string>>({})
const tahun = `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`

function muat() {
  if (!import.meta.client) return
  try {
    const raw = localStorage.getItem('pesantren-cetak-kartu')
    santri.value = raw ? JSON.parse(raw) : []
  }
  catch { santri.value = [] }
}

async function generateQr() {
  for (const s of santri.value) {
    qrMap[String(s.id)] = await toDataUrl(santriPayload(s), { width: 220 })
  }
}

function cetak() {
  window.print()
}

async function kembali() {
  await navigateTo('/admin/akademik/kartu')
}

useHead({ title: 'Cetak Kartu Santri' })
onMounted(async () => {
  load()
  muat()
  await generateQr()
})
</script>

<style scoped>
@page {
  size: A4;
  margin: 10mm;
}
@media print {
  .kartu {
    border: 1px solid #e5e5e5;
  }
}
</style>
