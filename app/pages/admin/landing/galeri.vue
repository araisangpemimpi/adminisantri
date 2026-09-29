<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-extrabold">Album Galeri</h1>
        <p class="text-sm text-[var(--ink-muted)]">Kelola album dan foto dokumentasi pesantren.</p>
      </div>
      <UButton icon="i-lucide-folder-plus" @click="openAlbumForm()">Album Baru</UButton>
    </div>

    <!-- Ringkasan -->
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold brand-text">{{ albums.length }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Total Album</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-cyan-600 dark:text-cyan-400">{{ totalFoto }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Total Foto</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-violet-600 dark:text-violet-400">{{ totalSlide }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Ditampilkan</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-amber-600 dark:text-amber-400">{{ tanpaJudul }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Foto Tanpa Judul</p>
      </div>
    </div>

    <UInput v-model="q" placeholder="Cari album…" icon="i-lucide-search" class="w-full" />

    <!-- Daftar album -->
    <EmptyState
      v-if="!filtered.length"
      icon="i-lucide-folder-open"
      title="Belum ada album"
      subtitle="Buat album terlebih dahulu, lalu unggah banyak foto sekaligus."
    />

    <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="album in filtered" :key="album.id" class="card-soft overflow-hidden">
        <!-- Cover -->
        <button class="relative block h-36 w-full overflow-hidden bg-[var(--surface-muted)]" @click="openAlbum(album)">
          <img v-if="cover(album)" :src="cover(album)!" :alt="album.nama" class="size-full object-cover">
          <div v-else class="grid size-full place-items-center">
            <UIcon name="i-lucide-image-off" class="size-7 text-[var(--ink-muted)]" />
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
          <div class="absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
            <UBadge size="xs" color="primary" variant="solid">{{ fotos(album).length }} foto</UBadge>
            <UBadge v-if="!album.aktif" size="xs" color="neutral" variant="soft">Draft</UBadge>
          </div>
        </button>

        <!-- Info -->
        <div class="p-3.5">
          <p class="truncate text-sm font-extrabold">{{ album.nama }}</p>
          <p class="mt-0.5 line-clamp-2 min-h-8 text-xs text-[var(--ink-muted)]">{{ album.deskripsi || 'Tanpa deskripsi' }}</p>
          <div class="mt-2 flex items-center gap-1.5 text-[11px] text-[var(--ink-muted)]">
            <UIcon name="i-lucide-calendar" class="size-3" /> {{ tanggalSingkat(album.tanggal) }}
          </div>

          <div class="mt-3 flex gap-1.5">
            <UButton size="xs" icon="i-lucide-upload" class="flex-1" @click="openUpload(album)">Unggah Foto</UButton>
            <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-images" aria-label="Kelola foto" @click="openAlbum(album)" />
            <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-pencil" aria-label="Ubah album" @click="openAlbumForm(album)" />
            <UButton size="xs" color="error" variant="soft" icon="i-lucide-trash" aria-label="Hapus album" @click="hapusAlbum(album)" />
          </div>
        </div>
      </div>
    </div>

    <!-- ===================== Modal unggah bulk ===================== -->
    <UModal v-model:open="uploadOpen" :title="`Unggah Foto — ${uploadTarget?.nama ?? ''}`" scrollable>
      <template #body>
        <div class="space-y-4">
          <PhotoUploader ref="uploaderRef" :album-id="uploadTarget?.id" />

          <UFormField label="Judul otomatis" help="Dipakai untuk foto yang belum punya judul. Dapat diubah setelah diunggah.">
            <UInput v-model="judulPrefix" placeholder="Contoh: Kegiatan Maulid" icon="i-lucide-type" class="w-full" />
          </UFormField>

          <UFormField label="Tanggal foto">
            <UInput v-model="uploadTanggal" type="date" icon="i-lucide-calendar" class="w-full" />
          </UFormField>

          <div class="flex gap-2 pt-1">
            <UButton color="neutral" variant="soft" class="flex-1" @click="uploadOpen = false">Batal</UButton>
            <UButton class="flex-[2]" icon="i-lucide-check" :loading="saving" :disabled="!canSave" @click="simpanBulk">
              Simpan {{ pendingCount }} Foto
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- ===================== Modal form album ===================== -->
    <UModal v-model:open="formOpen" :title="editingAlbum ? 'Ubah Album' : 'Album Baru'" scrollable>
      <template #body>
        <form class="space-y-4" @submit.prevent="simpanAlbum">
          <UFormField label="Nama Album" required>
            <UInput v-model="albumForm.nama" placeholder="Contoh: Wisuda Tahfidz 2026" icon="i-lucide-folder" class="w-full" />
          </UFormField>
          <UFormField label="Deskripsi">
            <UTextarea v-model="albumForm.deskripsi" :rows="2" autoresize class="w-full" />
          </UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Kategori">
              <USelect v-model="albumForm.kategori" :items="kategoriList" icon="i-lucide-tag" class="w-full" />
            </UFormField>
            <UFormField label="Tanggal">
              <UInput v-model="albumForm.tanggal" type="date" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="Tampilkan di halaman publik">
            <div class="flex items-center justify-between rounded-2xl bg-[var(--surface-muted)] px-3.5 py-2.5">
              <span class="text-sm font-medium">Album aktif</span>
              <USwitch v-model="albumForm.aktif" />
            </div>
          </UFormField>
          <div class="flex gap-2 pt-1">
            <UButton type="button" color="neutral" variant="soft" class="flex-1" @click="formOpen = false">Batal</UButton>
            <UButton type="submit" class="flex-[2]" icon="i-lucide-check">Simpan Album</UButton>
          </div>
        </form>
      </template>
    </UModal>

    <!-- ===================== Modal kelola foto album ===================== -->
    <UModal v-model:open="manageOpen" :title="activeAlbum?.nama" scrollable>
      <template #body>
        <div v-if="activeAlbum" class="space-y-4">
          <div class="flex items-center justify-between">
            <p class="text-sm text-[var(--ink-muted)]">{{ fotos(activeAlbum).length }} foto dalam album ini</p>
            <UButton size="xs" icon="i-lucide-plus" @click="openUpload(activeAlbum); manageOpen = false">Tambah Foto</UButton>
          </div>

          <EmptyState v-if="!fotos(activeAlbum).length" icon="i-lucide-image-plus" title="Album masih kosong" subtitle="Unggah beberapa foto sekaligus lewat tombol Tambah Foto." />

          <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div v-for="foto in fotos(activeAlbum)" :key="foto.id" class="card-soft overflow-hidden">
              <div class="relative h-28 bg-[var(--surface-muted)]">
                <img :src="foto.gambar" :alt="foto.judul" class="size-full object-cover">
                <button
                  class="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-black/60 text-white"
                  aria-label="Hapus foto" @click="hapusFoto(foto)"
                >
                  <UIcon name="i-lucide-trash-2" class="size-3.5" />
                </button>
              </div>
              <div class="p-2.5">
                <UInput v-model="foto.judul" size="xs" placeholder="Judul foto" class="w-full" @blur="simpanFoto(foto)" />
                <div class="mt-1.5 flex items-center justify-between">
                  <UBadge size="xs" :color="foto.tampil ? 'primary' : 'neutral'" variant="soft">
                    {{ foto.tampil ? 'Tampil' : 'Disembunyikan' }}
                  </UBadge>
                  <UButton
                    size="xs" color="neutral" variant="ghost"
                    :icon="foto.tampil ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    :aria-label="foto.tampil ? 'Sembunyikan' : 'Tampilkan'"
                    @click="toggleTampil(foto)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from '~/composables/useAdminStore'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const albumStore = useAdminStore('album')
const fotoStore = useAdminStore('foto')
const { tanggalSingkat } = useFormat()
const toast = useToast()

const albums = albumStore.rows
const q = ref('')

const kategoriList = ['Umum', 'Kegiatan', 'Belajar', 'Ibadah', 'Wisuda', 'Olahraga', 'Prestasi']

function fotos(album: any) {
  return fotoStore.rows.value.filter(f => String(f.albumId) === String(album.id))
}
function cover(album: any) {
  const list = fotos(album).filter(f => f.tampil !== false)
  return list[0]?.gambar ?? fotos(album)[0]?.gambar ?? null
}

const totalFoto = computed(() => fotoStore.rows.value.length)
const totalSlide = computed(() => fotoStore.rows.value.filter(f => f.tampil !== false).length)
const tanpaJudul = computed(() => fotoStore.rows.value.filter(f => !f.judul).length)

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return albums.value
  return albums.value.filter(a => `${a.nama} ${a.deskripsi ?? ''} ${a.kategori ?? ''}`.toLowerCase().includes(term))
})

/* ---------------- Album ---------------- */
const formOpen = ref(false)
const editingAlbum = ref<any | null>(null)
const albumForm = reactive({ nama: '', deskripsi: '', kategori: 'Kegiatan', tanggal: '', aktif: true })

function openAlbumForm(album?: any) {
  editingAlbum.value = album ?? null
  Object.assign(albumForm, album
    ? { nama: album.nama, deskripsi: album.deskripsi ?? '', kategori: album.kategori ?? 'Kegiatan', tanggal: album.tanggal ?? '', aktif: album.aktif !== false }
    : { nama: '', deskripsi: '', kategori: 'Kegiatan', tanggal: new Date().toISOString().slice(0, 10), aktif: true })
  formOpen.value = true
}

async function simpanAlbum() {
  if (!albumForm.nama) return
  if (editingAlbum.value) {
    await albumStore.update(String(editingAlbum.value.id), { ...albumForm })
    toast.add({ title: 'Album diperbarui', color: 'success' })
  }
  else {
    await albumStore.create({ ...albumForm })
    toast.add({ title: 'Album dibuat', color: 'success' })
  }
  formOpen.value = false
}

async function hapusAlbum(album: any) {
  const jumlah = fotos(album).length
  if (!confirm(`Hapus album “${album.nama}”${jumlah ? ` beserta ${jumlah} fotonya` : ''}?`)) return
  for (const f of fotos(album)) await fotoStore.remove(String(f.id))
  await albumStore.remove(String(album.id))
  toast.add({ title: 'Album dihapus', color: 'success' })
}

/* ---------------- Unggah bulk ---------------- */
const uploadOpen = ref(false)
const uploadTarget = ref<any | null>(null)
const uploaderRef = ref<InstanceType<any> | null>(null)
const judulPrefix = ref('')
const uploadTanggal = ref('')
const saving = ref(false)

const pendingCount = computed(() => uploaderRef.value?.items?.length ?? 0)
const canSave = computed(() => pendingCount.value > 0 && !uploaderRef.value?.uploading)

function openUpload(album: any) {
  uploadTarget.value = album
  judulPrefix.value = album.nama ?? ''
  uploadTanggal.value = album.tanggal || new Date().toISOString().slice(0, 10)
  uploadOpen.value = true
}

async function simpanBulk() {
  const uploader = uploaderRef.value
  if (!uploader || !uploader.items.length) return
  saving.value = true
  try {
    const picked = uploader.take() as Array<{ gambar: string, judul: string }>
    const rows = picked.map((p, i) => ({
      albumId: String(uploadTarget.value.id),
      album: uploadTarget.value.nama,
      judul: p.judul || (judulPrefix.value ? `${judulPrefix.value} ${i + 1}` : ''),
      gambar: p.gambar,
      kategori: uploadTarget.value.kategori ?? 'Kegiatan',
      deskripsi: '',
      tanggal: uploadTanggal.value,
      tampil: true,
    }))
    await fotoStore.createMany(rows)
    toast.add({ title: `${rows.length} foto ditambahkan`, color: 'success' })
    uploadOpen.value = false
  }
  finally {
    saving.value = false
  }
}

/* ---------------- Kelola foto ---------------- */
const manageOpen = ref(false)
const activeAlbum = ref<any | null>(null)

function openAlbum(album: any) {
  activeAlbum.value = album
  manageOpen.value = true
}

async function simpanFoto(foto: any) {
  await fotoStore.update(String(foto.id), { judul: foto.judul })
}

async function toggleTampil(foto: any) {
  await fotoStore.update(String(foto.id), { tampil: !foto.tampil })
}

async function hapusFoto(foto: any) {
  if (!confirm('Hapus foto ini?')) return
  await fotoStore.remove(String(foto.id))
  toast.add({ title: 'Foto dihapus', color: 'success' })
}

useHead({ title: 'Album Galeri — Panel Admin' })
onMounted(async () => {
  await Promise.all([albumStore.fetchAll(), fotoStore.fetchAll()])
})
</script>
