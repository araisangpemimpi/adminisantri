<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-extrabold">Laporan Progres Tahfidz</h1>
        <p class="text-sm text-[var(--ink-muted)]">Kirim laporan hafalan ke wali via WhatsApp.</p>
      </div>
      <UButton icon="i-lucide-send" :disabled="!terpilih.length" @click="kirimTerpilih">
        Kirim ({{ terpilih.length }})
      </UButton>
    </div>

    <UAlert color="info" variant="soft" icon="i-lucide-info">
      <template #description>
        Progres dihitung dari <b>Target Hafalan</b> dan <b>Setoran Harian</b>.
        Laporan dikirim ke nomor WhatsApp wali yang tercatat di data santri.
      </template>
    </UAlert>

    <UInput v-model="q" placeholder="Cari santri…" icon="i-lucide-search" class="w-full" />

    <div class="flex items-center justify-between">
      <p class="text-xs text-[var(--ink-muted)]">{{ filtered.length }} santri • {{ terpilih.length }} dipilih</p>
      <div class="flex gap-1.5">
        <UButton size="xs" color="neutral" variant="soft" @click="terpilih = filtered.map(r => r.santri)">Pilih semua</UButton>
        <UButton size="xs" color="neutral" variant="soft" :disabled="!terpilih.length" @click="terpilih = []">Kosongkan</UButton>
      </div>
    </div>

    <EmptyState v-if="!filtered.length" icon="i-lucide-send" title="Belum ada data" subtitle="Tambahkan target hafalan terlebih dahulu." />

    <div v-else class="space-y-2.5">
      <div v-for="r in filtered" :key="r.santri" class="card-soft p-4">
        <div class="flex items-start gap-3">
          <UCheckbox :model-value="terpilih.includes(r.santri)" @update:model-value="() => toggle(r.santri)" />
          <div class="grid size-11 shrink-0 place-items-center rounded-2xl brand-soft text-xs font-extrabold">{{ inisial(r.santri) }}</div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-bold">{{ r.santri }}</p>
            <p class="truncate text-xs text-[var(--ink-muted)]">{{ r.rombel }} • Wali: {{ r.wali || '—' }}</p>
          </div>
          <UBadge size="xs" :color="r.persen >= 80 ? 'success' : r.persen >= 40 ? 'info' : 'warning'" variant="soft">
            {{ r.persen }}%
          </UBadge>
        </div>

        <div class="mt-3 grid grid-cols-3 gap-2">
          <div class="rounded-2xl bg-[var(--surface-muted)] p-2.5 text-center">
            <p class="tabular text-base font-extrabold brand-text">{{ r.capaian }}/{{ r.target }}</p>
            <p class="text-[10px] font-semibold text-[var(--ink-muted)]">Juz</p>
          </div>
          <div class="rounded-2xl bg-[var(--surface-muted)] p-2.5 text-center">
            <p class="tabular text-base font-extrabold">{{ r.setoranCount }}</p>
            <p class="text-[10px] font-semibold text-[var(--ink-muted)]">Setoran</p>
          </div>
          <div class="rounded-2xl bg-[var(--surface-muted)] p-2.5 text-center">
            <p class="tabular text-base font-extrabold">{{ r.ayat }}</p>
            <p class="text-[10px] font-semibold text-[var(--ink-muted)]">Ayat</p>
          </div>
        </div>

        <div class="mt-2.5">
          <div class="mb-1 flex justify-between text-[10px] text-[var(--ink-muted)]">
            <span>Progres target</span>
            <span class="font-bold">{{ r.persen }}%</span>
          </div>
          <div class="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
            <div class="h-full rounded-full brand-gradient" :style="{ width: Math.min(100, r.persen) + '%' }" />
          </div>
        </div>

        <p v-if="r.terakhir" class="mt-2 text-[11px] text-[var(--ink-muted)]">
          Setoran terakhir: {{ r.terakhirSurah }} • {{ relatif(r.terakhir) }}
        </p>

        <div class="mt-3 flex gap-1.5">
          <UButton size="xs" icon="i-lucide-message-circle" :disabled="!r.hp" @click="kirimWa(r)">Kirim WA</UButton>
          <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-eye" @click="pratinjau(r)">Pratinjau</UButton>
        </div>
      </div>
    </div>

    <UModal v-model:open="modalOpen" title="Pratinjau Laporan" scrollable>
      <template #body>
        <div class="space-y-3">
          <div class="rounded-2xl bg-[var(--surface-muted)] p-4">
            <pre class="whitespace-pre-wrap font-sans text-xs leading-relaxed">{{ pesanPratinjau }}</pre>
          </div>
          <div class="flex gap-2">
            <UButton color="neutral" variant="soft" class="flex-1" @click="modalOpen = false">Tutup</UButton>
            <UButton class="flex-[2]" icon="i-lucide-message-circle" @click="kirimDariPratinjau">Kirim WhatsApp</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from '~/composables/useAdminStore'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const targetStore = useAdminStore('targetTahfidz')
const setoranStore = useAdminStore('tahfidz')
const santriStore = useAdminStore('santri')
const { settings, load: loadSettings } = useSiteSettings()
const { inisial, tanggalRelatif } = useFormat()
const toast = useToast()

const q = ref('')
const terpilih = ref<string[]>([])
const modalOpen = ref(false)
const pesanPratinjau = ref('')
const targetPratinjau = ref<any | null>(null)

/** Gabungkan target + setoran + data wali. */
const baris = computed(() =>
  targetStore.rows.value.map((t) => {
    const setoran = setoranStore.rows.value.filter(s => s.santri === t.santri)
    const ayat = setoran.reduce((a, s) => a + (Number(s.ayat) || 0), 0)
    const target = Number(t.targetJuz) || 0
    const capaian = Number(t.capaianJuz) || 0
    const terakhir = [...setoran].sort((a, b) => String(b.tanggal).localeCompare(String(a.tanggal)))[0]
    const santri = santriStore.rows.value.find(s => s.nama === t.santri)
    return {
      santri: t.santri,
      rombel: t.rombel ?? santri?.rombel ?? '',
      wali: santri?.wali ?? '',
      hp: santri?.hp ?? '',
      target,
      capaian,
      persen: target ? Math.round((capaian / target) * 100) : 0,
      setoranCount: setoran.length,
      ayat,
      terakhir: terakhir?.tanggal ?? null,
      terakhirSurah: terakhir?.surah ?? '',
      pembimbing: t.pembimbing ?? '',
    }
  }),
)

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return baris.value
  return baris.value.filter(r => `${r.santri} ${r.rombel} ${r.wali}`.toLowerCase().includes(term))
})

function toggle(nama: string) {
  const i = terpilih.value.indexOf(nama)
  if (i >= 0) terpilih.value.splice(i, 1)
  else terpilih.value.push(nama)
}

function relatif(v: unknown) { return tanggalRelatif(v) }

function susunPesan(r: any) {
  return `Assalamualaikum warahmatullahi wabarakatuh,

Berikut laporan progres hafalan Al-Qur'an ananda:

Nama      : ${r.santri}
Rombel    : ${r.rombel}
Pembimbing: ${r.pembimbing || '—'}

Progres Hafalan
• Capaian   : ${r.capaian} dari target ${r.target} juz (${r.persen}%)
• Setoran   : ${r.setoranCount} kali
• Total ayat: ${r.ayat} ayat
${r.terakhirSurah ? `• Terakhir  : ${r.terakhirSurah}\n` : ''}
Mohon dukungan dan doa agar ananda dapat mencapai target hafalannya.

Terima kasih.
${settings.value.siteName}`
}

function bukaWa(r: any, pesan: string) {
  const nomor = String(r.hp ?? '').replace(/[^0-9]/g, '')
  const wa = nomor.startsWith('0') ? `62${nomor.slice(1)}` : nomor
  window.open(`https://wa.me/${wa || settings.value.wa}?text=${encodeURIComponent(pesan)}`, '_blank')
}

function kirimWa(r: any) {
  bukaWa(r, susunPesan(r))
  toast.add({ title: 'Membuka WhatsApp', description: r.santri, color: 'success' })
}

function pratinjau(r: any) {
  targetPratinjau.value = r
  pesanPratinjau.value = susunPesan(r)
  modalOpen.value = true
}

function kirimDariPratinjau() {
  if (targetPratinjau.value) bukaWa(targetPratinjau.value, pesanPratinjau.value)
  modalOpen.value = false
}

/** Kirim berurutan (dengan jeda) agar tidak diblokir browser. */
function kirimTerpilih() {
  const list = baris.value.filter(r => terpilih.value.includes(r.santri))
  let i = 0
  const next = () => {
    if (i >= list.length) {
      toast.add({ title: 'Selesai', description: `${list.length} laporan dibuka`, color: 'success' })
      return
    }
    const r = list[i]!
    bukaWa(r, susunPesan(r))
    i++
    setTimeout(next, 900)
  }
  next()
}

useHead({ title: 'Laporan Progres Tahfidz — Panel Admin' })
onMounted(() => {
  for (const s of [targetStore, setoranStore, santriStore]) s.fetchAll()
  loadSettings()
})
</script>
