<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-extrabold">Invoice Digital</h1>
        <p class="text-sm text-[var(--ink-muted)]">Terbitkan & kirim invoice ke wali santri.</p>
      </div>
      <UButton icon="i-lucide-plus" @click="openForm()">Buat Invoice</UButton>
    </div>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold brand-text">{{ store.rows.value.length }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Total Invoice</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-green-600 dark:text-green-400">{{ rupiah(totalLunas) }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Terbayar</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-amber-600 dark:text-amber-400">{{ rupiah(totalOutstanding) }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Outstanding</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-rose-600 dark:text-rose-400">{{ jatuhTempo }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Jatuh Tempo</p>
      </div>
    </div>

    <UInput v-model="q" placeholder="Cari nomor invoice atau santri…" icon="i-lucide-search" class="w-full" />

    <EmptyState v-if="!filtered.length" icon="i-lucide-file-invoice" title="Belum ada invoice" subtitle="Buat invoice untuk tagihan santri." />

    <div v-else class="space-y-2.5">
      <div v-for="iv in filtered" :key="iv.id" class="card-soft p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="tabular text-xs font-bold brand-text">{{ iv.nomor }}</p>
            <p class="mt-0.5 truncate text-sm font-bold">{{ iv.santri }}</p>
            <p class="truncate text-xs text-[var(--ink-muted)]">{{ iv.jenis }} • {{ iv.periode }} • {{ iv.rombel }}</p>
          </div>
          <UBadge size="xs" :color="color(iv.status)" variant="soft">{{ iv.status }}</UBadge>
        </div>

        <div class="mt-3 flex items-end justify-between gap-3 rounded-2xl bg-[var(--surface-muted)] p-3">
          <div>
            <p class="text-[10px] font-semibold uppercase text-[var(--ink-muted)]">Jumlah</p>
            <p class="tabular text-lg font-extrabold">{{ rupiah(iv.jumlah) }}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] font-semibold uppercase text-[var(--ink-muted)]">Jatuh Tempo</p>
            <p class="text-xs font-semibold">{{ tanggalSingkat(iv.jatuh_tempo) }}</p>
          </div>
        </div>

        <div class="mt-3 flex flex-wrap gap-1.5">
          <UButton size="xs" icon="i-lucide-printer" @click="cetakInvoice(iv)">Cetak</UButton>
          <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-send" @click="kirimWa(iv)">Kirim WA</UButton>
          <UButton v-if="iv.status !== 'Lunas'" size="xs" color="neutral" variant="soft" icon="i-lucide-check" @click="tandaiLunas(iv)">Tandai Lunas</UButton>
          <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-pencil" aria-label="Ubah" @click="openForm(iv)" />
          <UButton size="xs" color="error" variant="soft" icon="i-lucide-trash" aria-label="Hapus" @click="remove(iv)" />
        </div>
      </div>
    </div>

    <UModal v-model:open="modalOpen" :title="editing ? 'Ubah Invoice' : 'Buat Invoice'" scrollable>
      <template #body>
        <form class="space-y-4" @submit.prevent="save">
          <UFormField label="Nomor Invoice" help="Dibuat otomatis, dapat diubah.">
            <UInput v-model="form.nomor" icon="i-lucide-hash" class="w-full" />
          </UFormField>
          <UFormField label="Santri" required>
            <USelect v-model="form.santri" :items="santriItems" icon="i-lucide-user" class="w-full" />
          </UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Jenis">
              <USelect v-model="form.jenis" :items="['SPP', 'Uang Pangkal', 'Daftar Ulang', 'Seragam', 'Kitab', 'Lainnya']" class="w-full" />
            </UFormField>
            <UFormField label="Periode">
              <UInput v-model="form.periode" placeholder="September 2026" class="w-full" />
            </UFormField>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Jumlah (Rp)">
              <UInput v-model="form.jumlah" type="number" icon="i-lucide-banknote" class="w-full" />
            </UFormField>
            <UFormField label="Jatuh Tempo">
              <UInput v-model="form.jatuh_tempo" type="date" class="w-full" />
            </UFormField>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Metode">
              <USelect v-model="form.metode" :items="['Transfer', 'Tunai', 'QRIS']" class="w-full" />
            </UFormField>
            <UFormField label="Status">
              <USelect v-model="form.status" :items="['Draf', 'Terkirim', 'Lunas', 'Jatuh Tempo']" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="Catatan">
            <UTextarea v-model="form.catatan" :rows="2" autoresize class="w-full" />
          </UFormField>
          <div class="flex gap-2 pt-1">
            <UButton type="button" color="neutral" variant="soft" class="flex-1" @click="modalOpen = false">Batal</UButton>
            <UButton type="submit" class="flex-[2]" icon="i-lucide-check">Simpan</UButton>
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from '~/composables/useAdminStore'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const store = useAdminStore('invoice')
const santriStore = useAdminStore('santri')
const { settings, load: loadSettings } = useSiteSettings()
const { rupiah, tanggalSingkat } = useFormat()
const { color } = useStatusColor()
const { nomorInvoice } = useNumbering()
const toast = useToast()

const q = ref('')
const modalOpen = ref(false)
const editing = ref<any | null>(null)
const form = reactive({
  nomor: '', santri: '', jenis: 'SPP', periode: '', jumlah: 450000,
  jatuh_tempo: '', metode: 'Transfer', status: 'Draf', catatan: '', nis: '', rombel: '',
})

const santriItems = computed(() => santriStore.rows.value.map(s => s.nama))

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return store.rows.value
  return store.rows.value.filter(iv => `${iv.nomor} ${iv.santri} ${iv.periode}`.toLowerCase().includes(term))
})

const totalLunas = computed(() => store.rows.value.filter(i => i.status === 'Lunas').reduce((t, i) => t + (Number(i.jumlah) || 0), 0))
const totalOutstanding = computed(() => store.rows.value.filter(i => i.status !== 'Lunas').reduce((t, i) => t + (Number(i.jumlah) || 0), 0))
const jatuhTempo = computed(() => store.rows.value.filter(i => i.status === 'Jatuh Tempo').length)

function openForm(iv?: any) {
  editing.value = iv ?? null
  const nomorBaru = nomorInvoice(store.rows.value.map(i => String(i.nomor ?? '')))
  const d = new Date()
  const periode = `${['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][d.getMonth()]} ${d.getFullYear()}`
  Object.assign(form, iv
    ? { nomor: iv.nomor, santri: iv.santri, jenis: iv.jenis, periode: iv.periode, jumlah: iv.jumlah, jatuh_tempo: iv.jatuh_tempo, metode: iv.metode, status: iv.status, catatan: iv.catatan ?? '', nis: iv.nis ?? '', rombel: iv.rombel ?? '' }
    : { nomor: nomorBaru, santri: santriItems.value[0] ?? '', jenis: 'SPP', periode, jumlah: 450000, jatuh_tempo: new Date().toISOString().slice(0, 10), metode: 'Transfer', status: 'Draf', catatan: '', nis: '', rombel: '' })
  modalOpen.value = true
}

async function save() {
  if (!form.santri) {
    toast.add({ title: 'Santri wajib dipilih', color: 'error' })
    return
  }
  const s = santriStore.rows.value.find(x => x.nama === form.santri)
  const payload = { ...form, nis: s?.nis ?? form.nis, rombel: s?.rombel ?? form.rombel, jumlah: Number(form.jumlah) || 0 }
  if (editing.value) {
    await store.update(String(editing.value.id), payload)
    toast.add({ title: 'Invoice diperbarui', color: 'success' })
  }
  else {
    await store.create({ ...payload, tanggal: new Date().toISOString().slice(0, 10) })
    toast.add({ title: 'Invoice dibuat', description: form.nomor, color: 'success' })
  }
  modalOpen.value = false
}

function cetakInvoice(iv: any) {
  if (!import.meta.client) return
  localStorage.setItem('pesantren-cetak-invoice', JSON.stringify(iv))
  window.open('/cetak/invoice', '_blank')
}

function kirimWa(iv: any) {
  const s = santriStore.rows.value.find(x => x.nama === iv.santri)
  const tujuan = String(s?.hp ?? '').replace(/[^0-9]/g, '')
  const nomor = tujuan.startsWith('0') ? `62${tujuan.slice(1)}` : tujuan
  const pesan = `Assalamualaikum,\n\nBerikut kami sampaikan invoice pembayaran:\n\nNo. Invoice: ${iv.nomor}\nNama: ${iv.santri}\nJenis: ${iv.jenis}\nPeriode: ${iv.periode}\nJumlah: ${rupiah(iv.jumlah)}\nJatuh tempo: ${tanggalSingkat(iv.jatuh_tempo)}\n\nTerima kasih.\n${settings.value.siteName}`
  const url = nomor
    ? `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`
    : `https://wa.me/${settings.value.wa}?text=${encodeURIComponent(pesan)}`
  window.open(url, '_blank')
  void store.update(String(iv.id), { status: iv.status === 'Draf' ? 'Terkirim' : iv.status })
}

async function tandaiLunas(iv: any) {
  await store.update(String(iv.id), { status: 'Lunas' })
  toast.add({ title: 'Invoice ditandai lunas', color: 'success' })
}

async function remove(iv: any) {
  if (!confirm(`Hapus invoice ${iv.nomor}?`)) return
  await store.remove(String(iv.id))
  toast.add({ title: 'Invoice dihapus', color: 'success' })
}

useHead({ title: 'Invoice Digital — Panel Admin' })
onMounted(() => {
  store.fetchAll()
  santriStore.fetchAll()
  loadSettings()
})
</script>
