<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-extrabold">Tagihan SPP</h1>
        <p class="text-sm text-[var(--ink-muted)]">Tagihan bulanan santri dengan status otomatis.</p>
      </div>
      <UButton icon="i-lucide-wand-2" @click="generate">Generate Tagihan Bulan Ini</UButton>
    </div>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold brand-text">{{ rupiah(totalTagih) }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Total Tagihan</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-green-600 dark:text-green-400">{{ rupiah(totalLunas) }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Terbayar</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-amber-600 dark:text-amber-400">{{ belum }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Belum Bayar</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-rose-600 dark:text-rose-400">{{ terlambat }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Terlambat</p>
      </div>
    </div>

    <div class="flex flex-wrap gap-2">
      <UInput v-model="q" placeholder="Cari santri…" icon="i-lucide-search" class="min-w-40 flex-1" />
      <USelect v-model="filter" :items="['Semua', 'Belum Bayar', 'Lunas', 'Terlambat']" icon="i-lucide-filter" class="w-40" />
    </div>

    <EmptyState v-if="!filtered.length" icon="i-lucide-receipt-text" title="Belum ada tagihan" subtitle="Klik Generate untuk membuat tagihan bulan ini." />

    <div v-else class="space-y-2.5">
      <div v-for="t in filtered" :key="t.id" class="card-soft flex items-center gap-3.5 p-3.5">
        <div class="grid size-11 shrink-0 place-items-center rounded-2xl brand-soft text-xs font-extrabold">{{ inisial(t.santri) }}</div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="truncate text-sm font-bold">{{ t.santri }}</p>
            <UBadge size="xs" :color="color(t.status)" variant="soft">{{ t.status }}</UBadge>
          </div>
          <p class="truncate text-xs text-[var(--ink-muted)]">{{ t.jenis }} • {{ t.periode }} • {{ t.rombel }}</p>
          <p class="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--ink-muted)]">
            <UIcon name="i-lucide-calendar" class="size-3" /> Jatuh tempo {{ tanggalSingkat(t.jatuh_tempo) }}
          </p>
        </div>
        <div class="shrink-0 text-right">
          <p class="tabular text-sm font-extrabold">{{ rupiah(t.jumlah) }}</p>
        </div>
        <div class="flex shrink-0 gap-1.5">
          <UButton v-if="t.status !== 'Lunas'" size="xs" color="neutral" variant="soft" icon="i-lucide-check" aria-label="Tandai lunas" @click="tandaiLunas(t)" />
          <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-pencil" aria-label="Ubah" @click="openForm(t)" />
          <UButton size="xs" color="error" variant="soft" icon="i-lucide-trash" aria-label="Hapus" @click="remove(t)" />
        </div>
      </div>
    </div>

    <UModal v-model:open="modalOpen" :title="editing ? 'Ubah Tagihan' : 'Tambah Tagihan'" scrollable>
      <template #body>
        <form class="space-y-4" @submit.prevent="save">
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
          <UFormField label="Status">
            <USelect v-model="form.status" :items="['Belum Bayar', 'Lunas', 'Terlambat']" class="w-full" />
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

const store = useAdminStore('tagihan')
const santriStore = useAdminStore('santri')
const { inisial, rupiah, tanggalSingkat, BULAN } = useFormat()
const { color } = useStatusColor()
const toast = useToast()

const q = ref('')
const filter = ref('Semua')
const modalOpen = ref(false)
const editing = ref<any | null>(null)
const form = reactive({ santri: '', jenis: 'SPP', periode: '', jumlah: 450000, jatuh_tempo: '', status: 'Belum Bayar', nis: '', rombel: '', tahun: '2026/2027' })

const santriItems = computed(() => santriStore.rows.value.map(s => s.nama))

const filtered = computed(() => {
  let list = store.rows.value
  if (filter.value !== 'Semua') list = list.filter(t => t.status === filter.value)
  const term = q.value.trim().toLowerCase()
  if (term) list = list.filter(t => `${t.santri} ${t.periode} ${t.jenis}`.toLowerCase().includes(term))
  return list
})

const totalTagih = computed(() => store.rows.value.reduce((t, r) => t + (Number(r.jumlah) || 0), 0))
const totalLunas = computed(() => store.rows.value.filter(r => r.status === 'Lunas').reduce((t, r) => t + (Number(r.jumlah) || 0), 0))
const belum = computed(() => store.rows.value.filter(r => r.status === 'Belum Bayar').length)
const terlambat = computed(() => store.rows.value.filter(r => r.status === 'Terlambat').length)

const periodeSekarang = () => {
  const d = new Date()
  return `${BULAN[d.getMonth()]} ${d.getFullYear()}`
}

/** Buat tagihan SPP untuk semua santri aktif bulan ini (lewati yang sudah ada). */
async function generate() {
  const periode = periodeSekarang()
  const sudah = new Set(
    store.rows.value.filter(t => t.periode === periode && t.jenis === 'SPP').map(t => String(t.santri)),
  )
  const target = santriStore.rows.value.filter(s => s.status === 'Aktif' && !sudah.has(String(s.nama)))
  if (!target.length) {
    toast.add({ title: 'Tagihan bulan ini sudah lengkap', color: 'neutral' })
    return
  }
  if (!confirm(`Buat tagihan SPP ${periode} untuk ${target.length} santri?`)) return

  const jatuh = new Date()
  jatuh.setDate(10)
  const rows = target.map(s => ({
    santri: s.nama,
    nis: s.nis ?? '',
    rombel: s.rombel ?? '',
    jenis: 'SPP',
    periode,
    jumlah: 450000,
    jatuh_tempo: jatuh.toISOString().slice(0, 10),
    status: 'Belum Bayar',
    tahun: '2026/2027',
  }))
  await store.createMany(rows)
  toast.add({ title: `${rows.length} tagihan dibuat`, description: `Periode ${periode}`, color: 'success' })
}

function openForm(t?: any) {
  editing.value = t ?? null
  Object.assign(form, t
    ? { santri: t.santri, jenis: t.jenis, periode: t.periode, jumlah: t.jumlah, jatuh_tempo: t.jatuh_tempo, status: t.status, nis: t.nis ?? '', rombel: t.rombel ?? '', tahun: t.tahun ?? '2026/2027' }
    : { santri: santriItems.value[0] ?? '', jenis: 'SPP', periode: periodeSekarang(), jumlah: 450000, jatuh_tempo: new Date().toISOString().slice(0, 10), status: 'Belum Bayar', nis: '', rombel: '', tahun: '2026/2027' })
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
    toast.add({ title: 'Tagihan diperbarui', color: 'success' })
  }
  else {
    await store.create(payload)
    toast.add({ title: 'Tagihan ditambahkan', color: 'success' })
  }
  modalOpen.value = false
}

async function tandaiLunas(t: any) {
  await store.update(String(t.id), { status: 'Lunas' })
  toast.add({ title: 'Tagihan ditandai lunas', color: 'success' })
}

async function remove(t: any) {
  if (!confirm(`Hapus tagihan ${t.santri} (${t.periode})?`)) return
  await store.remove(String(t.id))
  toast.add({ title: 'Tagihan dihapus', color: 'success' })
}

useHead({ title: 'Tagihan SPP — Panel Admin' })
onMounted(() => {
  store.fetchAll()
  santriStore.fetchAll()
})
</script>
