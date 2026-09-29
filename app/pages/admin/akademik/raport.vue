<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-extrabold">Raport Semester</h1>
        <p class="text-sm text-[var(--ink-muted)]">Nilai dihitung otomatis dari Penilaian KD + poin sikap.</p>
      </div>
      <UButton icon="i-lucide-plus" @click="openForm()">Buat Raport</UButton>
    </div>

    <UAlert color="info" variant="soft" icon="i-lucide-calculator">
      <template #description>
        Saat menyimpan, rata-rata nilai diambil dari <b>Penilaian KD</b> santri tersebut,
        dan <b>poin sikap</b> diambil dari modul <b>Pembinaan</b> (100 − akumulasi poin pelanggaran).
      </template>
    </UAlert>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold brand-text">{{ store.rows.value.length }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Total Raport</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-green-600 dark:text-green-400">{{ finalCount }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Final</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-amber-600 dark:text-amber-400">{{ drafCount }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Draf</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-cyan-600 dark:text-cyan-400">{{ rataKelas }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Rata-rata</p>
      </div>
    </div>

    <UInput v-model="q" placeholder="Cari santri atau rombel…" icon="i-lucide-search" class="w-full" />

    <EmptyState v-if="!filtered.length" icon="i-lucide-file-text" title="Belum ada raport" subtitle="Buat raport untuk menghitung nilai semester." />

    <div v-else class="space-y-2.5">
      <div v-for="r in filtered" :key="r.id" class="card-soft p-4">
        <div class="flex items-start gap-3.5">
          <div class="grid size-12 shrink-0 place-items-center rounded-2xl brand-soft text-sm font-extrabold">{{ inisial(r.santri) }}</div>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="text-sm font-bold">{{ r.santri }}</p>
              <UBadge size="xs" :color="r.status === 'Final' ? 'success' : 'warning'" variant="soft">{{ r.status }}</UBadge>
              <UBadge v-if="r.peringkat" size="xs" color="neutral" variant="soft">Peringkat {{ r.peringkat }}</UBadge>
            </div>
            <p class="mt-0.5 text-xs text-[var(--ink-muted)]">
              {{ r.rombel }} • {{ r.semester }} {{ r.tahun }} • Wali: {{ r.wali || '—' }}
            </p>
          </div>
        </div>

        <div class="mt-3 grid grid-cols-3 gap-2">
          <div class="rounded-2xl bg-[var(--surface-muted)] p-2.5 text-center">
            <p class="tabular text-lg font-extrabold brand-text">{{ fmt(r.rata) }}</p>
            <p class="text-[10px] font-semibold text-[var(--ink-muted)]">Rata Nilai</p>
          </div>
          <div class="rounded-2xl bg-[var(--surface-muted)] p-2.5 text-center">
            <p class="tabular text-lg font-extrabold" :class="sikapColor(r.poinSikap)">{{ r.poinSikap }}</p>
            <p class="text-[10px] font-semibold text-[var(--ink-muted)]">Poin Sikap</p>
          </div>
          <div class="rounded-2xl bg-[var(--surface-muted)] p-2.5 text-center">
            <p class="tabular text-lg font-extrabold">{{ predikat(r.rata) }}</p>
            <p class="text-[10px] font-semibold text-[var(--ink-muted)]">Predikat</p>
          </div>
        </div>

        <p v-if="r.catatan" class="mt-3 rounded-2xl bg-[var(--surface-muted)] p-3 text-xs leading-relaxed">
          <span class="font-bold">Catatan wali:</span> {{ r.catatan }}
        </p>

        <div class="mt-3 flex flex-wrap gap-1.5">
          <UButton size="xs" icon="i-lucide-printer" to="/cetak/raport" target="_blank" @click="siapkanCetak(r)">
            Cetak Raport
          </UButton>
          <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-calculator" @click="hitungUlang(r)">Hitung Ulang</UButton>
          <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-pencil" aria-label="Ubah" @click="openForm(r)" />
          <UButton size="xs" color="error" variant="soft" icon="i-lucide-trash" aria-label="Hapus" @click="remove(r)" />
        </div>
      </div>
    </div>

    <UModal v-model:open="modalOpen" :title="editing ? 'Ubah Raport' : 'Buat Raport'" scrollable>
      <template #body>
        <form class="space-y-4" @submit.prevent="save">
          <UFormField label="Santri" required>
            <USelect v-model="form.santri" :items="santriItems" icon="i-lucide-user" class="w-full" />
          </UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Rombel">
              <UInput v-model="form.rombel" class="w-full" />
            </UFormField>
            <UFormField label="Tahun Ajaran">
              <UInput v-model="form.tahun" class="w-full" />
            </UFormField>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Semester">
              <USelect v-model="form.semester" :items="['Ganjil', 'Genap']" class="w-full" />
            </UFormField>
            <UFormField label="Status">
              <USelect v-model="form.status" :items="['Draf', 'Final']" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="Wali Kelas">
            <UInput v-model="form.wali" icon="i-lucide-user" class="w-full" />
          </UFormField>
          <UFormField label="Catatan Wali">
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

const store = useAdminStore('raport')
const santriStore = useAdminStore('santri')
const penilaianStore = useAdminStore('penilaian')
const pembinaanStore = useAdminStore('pembinaan')
const { inisial } = useFormat()
const toast = useToast()

const q = ref('')
const modalOpen = ref(false)
const editing = ref<any | null>(null)
const form = reactive({
  santri: '', rombel: '', semester: 'Ganjil', tahun: '2026/2027',
  wali: '', catatan: '', status: 'Draf',
})

const santriItems = computed(() => santriStore.rows.value.map(s => s.nama))

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return store.rows.value
  return store.rows.value.filter(r => `${r.santri} ${r.rombel} ${r.semester}`.toLowerCase().includes(term))
})

const finalCount = computed(() => store.rows.value.filter(r => r.status === 'Final').length)
const drafCount = computed(() => store.rows.value.filter(r => r.status !== 'Final').length)
const rataKelas = computed(() => {
  const v = store.rows.value.map(r => Number(r.rata) || 0).filter(Boolean)
  return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : '0'
})

function fmt(v: unknown) {
  const n = Number(v)
  return Number.isFinite(n) && n ? n.toFixed(1) : '—'
}

function predikat(n: unknown) {
  const v = Number(n) || 0
  if (v >= 90) return 'A'
  if (v >= 80) return 'B'
  if (v >= 70) return 'C'
  if (v >= 60) return 'D'
  return 'E'
}

function sikapColor(v: unknown) {
  const n = Number(v) || 0
  if (n >= 90) return 'text-green-600 dark:text-green-400'
  if (n >= 75) return 'text-amber-600 dark:text-amber-400'
  return 'text-rose-600 dark:text-rose-400'
}

/** Hitung rata-rata dari Penilaian KD santri. */
function hitungRata(santri: string) {
  const nilai = penilaianStore.rows.value
    .filter(p => p.santri === santri)
    .map(p => Number(p.nilai) || 0)
  if (!nilai.length) return 0
  return Number((nilai.reduce((a, b) => a + b, 0) / nilai.length).toFixed(1))
}

/** Poin sikap = 100 − akumulasi poin pelanggaran. */
function hitungSikap(santri: string) {
  const poin = pembinaanStore.rows.value
    .filter(p => p.santri === santri)
    .reduce((t, p) => t + (Number(p.poin) || 0), 0)
  return Math.max(0, 100 - poin)
}

function openForm(r?: any) {
  editing.value = r ?? null
  Object.assign(form, r
    ? { santri: r.santri, rombel: r.rombel, semester: r.semester, tahun: r.tahun, wali: r.wali ?? '', catatan: r.catatan ?? '', status: r.status ?? 'Draf' }
    : { santri: santriItems.value[0] ?? '', rombel: '', semester: 'Ganjil', tahun: '2026/2027', wali: '', catatan: '', status: 'Draf' })
  modalOpen.value = true
}

async function save() {
  if (!form.santri) {
    toast.add({ title: 'Santri wajib dipilih', color: 'error' })
    return
  }
  const s = santriStore.rows.value.find(x => x.nama === form.santri)
  const payload = {
    ...form,
    nis: s?.nis ?? '',
    rombel: form.rombel || s?.rombel || '',
    rata: hitungRata(form.santri),
    poinSikap: hitungSikap(form.santri),
    tanggal: new Date().toISOString().slice(0, 10),
  }
  if (editing.value) {
    await store.update(String(editing.value.id), payload)
    toast.add({ title: 'Raport diperbarui', color: 'success' })
  }
  else {
    await store.create(payload)
    toast.add({ title: 'Raport dibuat', color: 'success' })
  }
  modalOpen.value = false
}

async function hitungUlang(r: any) {
  await store.update(String(r.id), {
    rata: hitungRata(r.santri),
    poinSikap: hitungSikap(r.santri),
  })
  toast.add({ title: 'Nilai dihitung ulang', color: 'success' })
}

function siapkanCetak(r: any) {
  if (!import.meta.client) return
  localStorage.setItem('pesantren-cetak-raport', JSON.stringify(r))
}

async function remove(r: any) {
  if (!confirm(`Hapus raport ${r.santri}?`)) return
  await store.remove(String(r.id))
  toast.add({ title: 'Raport dihapus', color: 'success' })
}

useHead({ title: 'Raport Semester — Panel Admin' })
onMounted(() => {
  for (const s of [store, santriStore, penilaianStore, pembinaanStore]) s.fetchAll()
})
</script>
