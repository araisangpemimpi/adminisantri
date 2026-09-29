<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-extrabold">Pendaftar PSB</h1>
        <p class="text-sm text-[var(--ink-muted)]">Kelola pendaftaran, berkas, dan hasil seleksi.</p>
      </div>
      <UButton icon="i-lucide-user-plus" @click="openForm()">Tambah Pendaftar</UButton>
    </div>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold brand-text">{{ store.rows.value.length }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Total Pendaftar</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-amber-600 dark:text-amber-400">{{ count('Menunggu') }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Menunggu</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-green-600 dark:text-green-400">{{ count('Diterima') }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Diterima</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-rose-600 dark:text-rose-400">{{ count('Ditolak') }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Ditolak</p>
      </div>
    </div>

    <div class="flex flex-wrap gap-2">
      <UInput v-model="q" placeholder="Cari nama, no. pendaftaran, atau kode…" icon="i-lucide-search" class="min-w-44 flex-1" />
      <USelect v-model="filter" :items="['Semua', 'Menunggu', 'Terverifikasi', 'Diterima', 'Ditolak']" icon="i-lucide-filter" class="w-40" />
    </div>

    <EmptyState v-if="!filtered.length" icon="i-lucide-clipboard-list" title="Belum ada pendaftar" subtitle="Pendaftar dari halaman publik akan muncul di sini." />

    <div v-else class="space-y-2.5">
      <div v-for="p in filtered" :key="p.id" class="card-soft p-4">
        <div class="flex items-start gap-3.5">
          <div class="grid size-11 shrink-0 place-items-center rounded-2xl brand-soft text-xs font-extrabold">{{ inisial(p.nama) }}</div>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="truncate text-sm font-bold">{{ p.nama }}</p>
              <UBadge size="xs" :color="color(p.status)" variant="soft">{{ p.status }}</UBadge>
            </div>
            <p class="tabular mt-0.5 text-xs font-semibold brand-text">{{ p.noPendaftaran || '—' }}</p>
            <p class="text-[11px] text-[var(--ink-muted)]">
              Kode: <b class="tabular">{{ p.kodeUnik || '—' }}</b> • {{ p.jenjang }} • {{ p.gelombang || '—' }}
            </p>
          </div>
        </div>

        <div class="mt-3 grid grid-cols-2 gap-2 text-[11px]">
          <div class="flex items-center gap-1.5 text-[var(--ink-muted)]">
            <UIcon name="i-lucide-school" class="size-3" /> {{ p.asalSekolah || '—' }}
          </div>
          <div class="flex items-center gap-1.5 text-[var(--ink-muted)]">
            <UIcon name="i-lucide-phone" class="size-3" /> {{ p.hp || '—' }}
          </div>
          <div class="flex items-center gap-1.5 text-[var(--ink-muted)]">
            <UIcon name="i-lucide-users" class="size-3" /> {{ p.wali || '—' }}
          </div>
          <div class="flex items-center gap-1.5 text-[var(--ink-muted)]">
            <UIcon name="i-lucide-calendar" class="size-3" /> {{ tanggalSingkat(p.created_at) }}
          </div>
        </div>

        <!-- Berkas -->
        <div v-if="berkas(p).length" class="mt-2.5 flex flex-wrap gap-1.5">
          <UBadge v-for="b in berkas(p)" :key="b" size="xs" color="success" variant="soft" icon="i-lucide-check">{{ b }}</UBadge>
        </div>
        <p v-else class="mt-2.5 text-[11px] text-amber-600 dark:text-amber-400">Belum ada berkas terunggah.</p>

        <div class="mt-3 flex flex-wrap gap-1.5">
          <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-file-check" @click="kelolaBerkas(p)">Berkas</UButton>
          <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-clipboard-edit" @click="openForm(p)">Ubah</UButton>
          <UButton v-if="p.status === 'Menunggu'" size="xs" color="neutral" variant="soft" icon="i-lucide-circle-check" @click="ubahStatus(p, 'Terverifikasi')">Verifikasi</UButton>
          <UButton v-if="p.hp" size="xs" color="neutral" variant="soft" icon="i-lucide-message-circle" @click="hubungi(p)">WA</UButton>
          <UButton size="xs" color="error" variant="soft" icon="i-lucide-trash" aria-label="Hapus" @click="remove(p)" />
        </div>
      </div>
    </div>

    <!-- Modal form -->
    <UModal v-model:open="modalOpen" :title="editing ? 'Ubah Pendaftar' : 'Tambah Pendaftar'" scrollable>
      <template #body>
        <form class="space-y-4" @submit.prevent="save">
          <UFormField label="Nomor Pendaftaran" help="Otomatis bila dikosongkan.">
            <UInput v-model="form.noPendaftaran" icon="i-lucide-hash" class="w-full" />
          </UFormField>
          <UFormField label="Nama Calon Santri" required>
            <UInput v-model="form.nama" icon="i-lucide-user" class="w-full" />
          </UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Jenis Kelamin">
              <USelect v-model="form.jk" :items="['L', 'P']" class="w-full" />
            </UFormField>
            <UFormField label="Jenjang">
              <USelect v-model="form.jenjang" :items="['Tsanawiyah', 'Aliyah']" class="w-full" />
            </UFormField>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Tempat Lahir">
              <UInput v-model="form.tempatLahir" class="w-full" />
            </UFormField>
            <UFormField label="Tanggal Lahir">
              <UInput v-model="form.tanggalLahir" type="date" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="Asal Sekolah">
            <UInput v-model="form.asalSekolah" icon="i-lucide-school" class="w-full" />
          </UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Nama Wali">
              <UInput v-model="form.wali" icon="i-lucide-users" class="w-full" />
            </UFormField>
            <UFormField label="No. WhatsApp">
              <UInput v-model="form.hp" icon="i-lucide-phone" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="Alamat">
            <UTextarea v-model="form.alamat" :rows="2" autoresize class="w-full" />
          </UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Gelombang">
              <USelect v-model="form.gelombang" :items="['Gelombang 1', 'Gelombang 2', 'Gelombang 3']" class="w-full" />
            </UFormField>
            <UFormField label="Nilai Seleksi">
              <UInput v-model="form.nilaiSeleksi" type="number" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="Status">
            <USelect v-model="form.status" :items="['Menunggu', 'Terverifikasi', 'Diterima', 'Ditolak']" class="w-full" />
          </UFormField>
          <UFormField label="Catatan Panitia">
            <UTextarea v-model="form.catatan" :rows="2" autoresize class="w-full" />
          </UFormField>
          <div class="flex gap-2 pt-1">
            <UButton type="button" color="neutral" variant="soft" class="flex-1" @click="modalOpen = false">Batal</UButton>
            <UButton type="submit" class="flex-[2]" icon="i-lucide-check">Simpan</UButton>
          </div>
        </form>
      </template>
    </UModal>

    <!-- Modal berkas -->
    <UModal v-model:open="berkasOpen" :title="`Berkas — ${berkasTarget?.nama ?? ''}`" scrollable>
      <template #body>
        <div class="space-y-4">
          <p class="text-xs text-[var(--ink-muted)]">Centang berkas yang sudah diterima/diverifikasi.</p>
          <div class="space-y-2">
            <label
              v-for="b in SYARAT_BERKAS" :key="b"
              class="flex items-center gap-3 rounded-2xl bg-[var(--surface-muted)] p-3.5"
            >
              <UCheckbox
                :model-value="berkas(berkasTarget).includes(b)"
                @update:model-value="() => toggleBerkas(b)"
              />
              <span class="text-sm">{{ b }}</span>
            </label>
          </div>
          <div class="flex gap-2 pt-1">
            <UButton color="neutral" variant="soft" class="flex-1" @click="berkasOpen = false">Tutup</UButton>
            <UButton color="primary" class="flex-[2]" icon="i-lucide-check" @click="simpanBerkas">Simpan Berkas</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from '~/composables/useAdminStore'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const SYARAT_BERKAS = ['Akta Kelahiran', 'Kartu Keluarga', 'Ijazah/SKL', 'Pas Foto 3x4', 'Surat Sehat', 'Rapor']

const store = useAdminStore('psb')
const { settings, load: loadSettings } = useSiteSettings()
const { inisial, tanggalSingkat } = useFormat()
const { color } = useStatusColor()
const { nomorPendaftaran, kodeUnik } = useNumbering()
const toast = useToast()

const q = ref('')
const filter = ref('Semua')
const modalOpen = ref(false)
const editing = ref<any | null>(null)
const berkasOpen = ref(false)
const berkasTarget = ref<any | null>(null)
const berkasDraft = ref<string[]>([])

const form = reactive({
  noPendaftaran: '', kodeUnik: '', nama: '', jk: 'L', jenjang: 'Tsanawiyah',
  tempatLahir: '', tanggalLahir: '', asalSekolah: '', wali: '', hp: '', alamat: '',
  gelombang: 'Gelombang 1', nilaiSeleksi: 0, status: 'Menunggu', catatan: '',
})

function count(status: string) {
  return store.rows.value.filter(p => p.status === status).length
}

function berkas(p: any): string[] {
  if (!p) return []
  if (Array.isArray(p.berkas)) return p.berkas
  return []
}

const filtered = computed(() => {
  let list = store.rows.value
  if (filter.value !== 'Semua') list = list.filter(p => p.status === filter.value)
  const term = q.value.trim().toLowerCase()
  if (term) list = list.filter(p => `${p.nama} ${p.noPendaftaran} ${p.kodeUnik} ${p.hp}`.toLowerCase().includes(term))
  return list
})

function openForm(p?: any) {
  editing.value = p ?? null
  Object.assign(form, p
    ? {
        noPendaftaran: p.noPendaftaran ?? '', kodeUnik: p.kodeUnik ?? '', nama: p.nama, jk: p.jk ?? 'L',
        jenjang: p.jenjang ?? 'Tsanawiyah', tempatLahir: p.tempatLahir ?? '', tanggalLahir: p.tanggalLahir ?? '',
        asalSekolah: p.asalSekolah ?? '', wali: p.wali ?? '', hp: p.hp ?? '', alamat: p.alamat ?? '',
        gelombang: p.gelombang ?? 'Gelombang 1', nilaiSeleksi: p.nilaiSeleksi ?? 0, status: p.status ?? 'Menunggu', catatan: p.catatan ?? '',
      }
    : {
        noPendaftaran: nomorPendaftaran(store.rows.value.map(x => String(x.noPendaftaran ?? ''))),
        kodeUnik: kodeUnik(), nama: '', jk: 'L', jenjang: 'Tsanawiyah', tempatLahir: '', tanggalLahir: '',
        asalSekolah: '', wali: '', hp: '', alamat: '', gelombang: 'Gelombang 1', nilaiSeleksi: 0, status: 'Menunggu', catatan: '',
      })
  modalOpen.value = true
}

async function save() {
  if (!form.nama.trim()) {
    toast.add({ title: 'Nama wajib diisi', color: 'error' })
    return
  }
  const payload = { ...form, nilaiSeleksi: Number(form.nilaiSeleksi) || 0 }
  if (editing.value) {
    await store.update(String(editing.value.id), payload)
    toast.add({ title: 'Data diperbarui', color: 'success' })
  }
  else {
    await store.create({ ...payload, berkas: [], created_at: new Date().toISOString() })
    toast.add({ title: 'Pendaftar ditambahkan', description: form.noPendaftaran, color: 'success' })
  }
  modalOpen.value = false
}

function kelolaBerkas(p: any) {
  berkasTarget.value = p
  berkasDraft.value = [...berkas(p)]
  berkasOpen.value = true
}

function toggleBerkas(b: string) {
  const i = berkasDraft.value.indexOf(b)
  if (i >= 0) berkasDraft.value.splice(i, 1)
  else berkasDraft.value.push(b)
}

async function simpanBerkas() {
  if (!berkasTarget.value) return
  await store.update(String(berkasTarget.value.id), { berkas: [...berkasDraft.value] })
  toast.add({ title: 'Berkas diperbarui', color: 'success' })
  berkasOpen.value = false
}

async function ubahStatus(p: any, status: string) {
  await store.update(String(p.id), { status })
  toast.add({ title: `Status: ${status}`, color: 'success' })
}

function hubungi(p: any) {
  const nomor = String(p.hp ?? '').replace(/[^0-9]/g, '')
  const wa = nomor.startsWith('0') ? `62${nomor.slice(1)}` : nomor
  const pesan = `Assalamualaikum,\n\nTerima kasih telah mendaftar di ${settings.value.siteName}.\n\nNomor Pendaftaran: ${p.noPendaftaran}\nKode Unik: ${p.kodeUnik}\nNama: ${p.nama}\nStatus: ${p.status}\n\nSimpan nomor & kode tersebut untuk cek hasil seleksi.\n\nTerima kasih.`
  window.open(`https://wa.me/${wa || settings.value.wa}?text=${encodeURIComponent(pesan)}`, '_blank')
}

async function remove(p: any) {
  if (!confirm(`Hapus pendaftar “${p.nama}”?`)) return
  await store.remove(String(p.id))
  toast.add({ title: 'Pendaftar dihapus', color: 'success' })
}

useHead({ title: 'Pendaftar PSB — Panel Admin' })
onMounted(() => {
  store.fetchAll()
  loadSettings()
})
</script>
