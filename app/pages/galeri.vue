<template>
  <div>
    <PageHeader title="Galeri Pesantren" subtitle="Album dokumentasi kegiatan" icon="i-lucide-image" />

    <div class="mt-5 px-4 pb-2">
      <!-- Filter kategori -->
      <div v-if="kategori.length > 2" class="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
        <button
          v-for="k in kategori" :key="k"
          class="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition"
          :class="filter === k ? 'brand-gradient text-white' : 'card-soft text-[var(--ink-muted)]'"
          @click="filter = k"
        >
          {{ k }}
        </button>
      </div>

      <!-- Grid album -->
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="album in filteredAlbums" :key="album.id"
          class="card-soft card-hover group relative aspect-[4/5] overflow-hidden text-left"
          @click="openAlbum(album)"
        >
          <img
            v-if="sampul(album)" :src="sampul(album)!" :alt="album.nama" loading="lazy"
            class="size-full object-cover transition duration-500 group-active:scale-105"
          >
          <div v-else class="grid size-full place-items-center bg-[var(--surface-muted)]">
            <UIcon name="i-lucide-image-off" class="size-8 text-[var(--ink-muted)]" />
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          <div class="absolute inset-x-0 bottom-0 p-3">
            <p class="line-clamp-2 text-sm font-extrabold leading-tight text-white">{{ album.nama }}</p>
            <p class="mt-1 flex items-center gap-1 text-[11px] text-white/75">
              <UIcon name="i-lucide-images" class="size-3" /> {{ albumFotos(album).length }} foto
            </p>
          </div>
          <UBadge size="xs" color="primary" variant="solid" class="absolute left-2.5 top-2.5">{{ album.kategori }}</UBadge>
        </button>
      </div>

      <EmptyState v-if="!filteredAlbums.length" icon="i-lucide-image-off" title="Galeri kosong" subtitle="Album dokumentasi akan tampil di sini." class="mt-3" />
    </div>

    <!-- ===================== Lightbox album ===================== -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0">
        <!--
          Penutup: klik area latar mana pun. Tombol tutup & kembali diberi
          @click.stop agar tidak memicu penutupan ganda. Ini memperbaiki bug
          sebelumnya di mana @click.self tidak pernah kena karena adanya
          lapisan (stacking context) di dalamnya.
        -->
        <div v-if="albumOpen" class="fixed inset-0 z-[80] flex flex-col bg-black/95" @click="closeAlbum">
          <!-- Header -->
          <div class="flex items-center gap-3 p-4" @click.stop>
            <button
              class="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Tutup album" @click="closeAlbum"
            >
              <UIcon name="i-lucide-arrow-left" class="size-5" />
            </button>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-bold text-white">{{ activeAlbum?.nama }}</p>
              <p class="text-[11px] text-white/60">{{ photos.length }} foto • ketuk area gelap untuk menutup</p>
            </div>
            <button
              class="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Tutup" @click="closeAlbum"
            >
              <UIcon name="i-lucide-x" class="size-5" />
            </button>
          </div>

          <!-- Foto utama -->
          <div class="relative flex flex-1 items-center justify-center overflow-hidden px-4" @click.stop>
            <img
              v-if="currentPhoto" :key="currentPhoto.id" :src="currentPhoto.gambar" :alt="currentPhoto.judul"
              class="max-h-[58vh] w-full rounded-2xl object-contain"
            >

            <button
              v-if="photos.length > 1"
              class="absolute left-2 grid size-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
              aria-label="Foto sebelumnya" @click="prev"
            >
              <UIcon name="i-lucide-chevron-left" class="size-5" />
            </button>
            <button
              v-if="photos.length > 1"
              class="absolute right-2 grid size-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-black/70"
              aria-label="Foto berikutnya" @click="next"
            >
              <UIcon name="i-lucide-chevron-right" class="size-5" />
            </button>
          </div>

          <!-- Info + thumbnail -->
          <div class="p-5 pb-8" @click.stop>
            <p class="text-center text-sm font-bold text-white">{{ currentPhoto?.judul }}</p>
            <p class="mt-1 text-center text-xs text-white/60">{{ currentPhoto?.deskripsi }}</p>

            <div v-if="photos.length > 1" class="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
              <button
                v-for="(p, i) in photos" :key="p.id"
                class="size-12 shrink-0 overflow-hidden rounded-xl ring-2 transition"
                :class="i === index ? 'ring-white' : 'ring-transparent opacity-50'"
                :aria-label="p.judul" @click="index = i"
              >
                <img :src="p.gambar" :alt="p.judul" class="size-full object-cover">
              </button>
            </div>

            <!-- Navigasi mobile -->
            <div v-if="photos.length > 1" class="mt-4 flex items-center justify-center gap-3">
              <button class="flex items-center gap-1 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white" @click="prev">
                <UIcon name="i-lucide-chevron-left" class="size-4" /> Sebelumnya
              </button>
              <span class="tabular text-xs text-white/60">{{ index + 1 }} / {{ photos.length }}</span>
              <button class="flex items-center gap-1 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white" @click="next">
                Berikutnya <UIcon name="i-lucide-chevron-right" class="size-4" />
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const albumStore = useAdminStore('album')
const fotoStore = useAdminStore('foto')

const filter = ref('Semua')
const albumOpen = ref(false)
const activeAlbum = ref<any | null>(null)
const index = ref(0)

const albums = computed(() => albumStore.rows.value.filter(a => a.aktif !== false))

const kategori = computed(() => ['Semua', ...new Set(albums.value.map(a => a.kategori).filter(Boolean))])
const filteredAlbums = computed(() =>
  filter.value === 'Semua' ? albums.value : albums.value.filter(a => a.kategori === filter.value),
)

const photos = computed(() => {
  if (!activeAlbum.value) return []
  return visibleFotos(activeAlbum.value)
})

const currentPhoto = computed(() => photos.value[index.value] ?? null)

function visibleFotos(album: any) {
  return fotoStore.rows.value.filter(f => String(f.albumId) === String(album.id) && f.tampil !== false)
}

function albumFotos(album: any) {
  return visibleFotos(album)
}

function sampul(album: any) {
  return album.sampul || visibleFotos(album)[0]?.gambar || null
}

function openAlbum(album: any) {
  activeAlbum.value = album
  index.value = 0
  albumOpen.value = true
  if (import.meta.client) document.body.style.overflow = 'hidden'
}

function closeAlbum() {
  albumOpen.value = false
  activeAlbum.value = null
  if (import.meta.client) document.body.style.overflow = ''
}

function prev() {
  if (!photos.value.length) return
  index.value = (index.value - 1 + photos.value.length) % photos.value.length
}

function next() {
  if (!photos.value.length) return
  index.value = (index.value + 1) % photos.value.length
}

function onKey(e: KeyboardEvent) {
  if (!albumOpen.value) return
  if (e.key === 'Escape') closeAlbum()
  else if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
}

useHead({ title: 'Galeri' })

onMounted(() => {
  albumStore.fetchAll()
  fotoStore.fetchAll()
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (import.meta.client) document.body.style.overflow = ''
})
</script>
