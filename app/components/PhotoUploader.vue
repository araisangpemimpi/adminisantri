<!--
  Pemilih banyak foto sekaligus (bulk).
  - Mendukung pilih banyak & drag-and-drop.
  - Foto dikompres di klien (canvas) agar hemat kuota penyimpanan.
  - Otomatis diunggah ke Supabase Storage bila terkonfigurasi; jika tidak,
    disimpan sebagai data URL lokal sehingga tetap berfungsi offline.
-->
<template>
  <div class="space-y-3">
    <!-- Area pilih / drop -->
    <label
      class="flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl border-2 border-dashed border-[var(--hairline)] px-4 py-6 text-center transition hover:border-[var(--brand-600)] hover:bg-[var(--surface-muted)]"
      :class="dragging ? 'border-[var(--brand-600)] bg-[var(--surface-muted)]' : ''"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <UIcon name="i-lucide-image-plus" class="size-7 brand-text" />
      <span class="text-sm font-semibold">Pilih beberapa foto sekaligus</span>
      <span class="text-[11px] text-[var(--ink-muted)]">JPG, PNG, atau WEBP • bisa pilih banyak / tarik & lepas</span>
      <input
        ref="inputEl" type="file" accept="image/*" multiple class="hidden"
        @change="onSelect"
      >
    </label>

    <!-- Progress unggah -->
    <div v-if="uploading" class="flex items-center gap-2 rounded-2xl bg-[var(--surface-muted)] px-3.5 py-2.5 text-xs">
      <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin brand-text" />
      Mengunggah {{ done }}/{{ total }} foto…
    </div>

    <!-- Pratinjau -->
    <div v-if="items.length" class="space-y-2">
      <div class="flex items-center justify-between">
        <p class="text-[11px] font-bold uppercase tracking-wide text-[var(--ink-muted)]">{{ items.length }} foto siap</p>
        <button class="text-[11px] font-semibold text-rose-600" @click="clear">Hapus semua</button>
      </div>
      <div class="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
        <div v-for="(it, i) in items" :key="i" class="group relative aspect-square overflow-hidden rounded-xl bg-[var(--surface-muted)]">
          <img :src="it.preview" :alt="it.judul" class="size-full object-cover">
          <button
            class="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
            aria-label="Hapus foto" @click="removeAt(i)"
          >
            <UIcon name="i-lucide-x" class="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface PickedPhoto {
  /** URL final (Supabase Storage atau data URL). */
  gambar: string
  /** Data URL untuk pratinjau. */
  preview: string
  judul: string
}

const props = withDefaults(defineProps<{
  albumId?: string
  /** Nama file asli dipakai sebagai judul awal. */
  useFilenameAsTitle?: boolean
  maxDimension?: number
  quality?: number
}>(), {
  useFilenameAsTitle: true,
  maxDimension: 1600,
  quality: 0.82,
})

const items = ref<PickedPhoto[]>([])
const uploading = ref(false)
const done = ref(0)
const total = ref(0)
const dragging = ref(false)
const inputEl = ref<HTMLInputElement | null>(null)

function onSelect(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files) void process([...files])
  if (inputEl.value) inputEl.value.value = ''
}

function onDrop(e: DragEvent) {
  dragging.value = false
  const files = [...(e.dataTransfer?.files ?? [])].filter(f => f.type.startsWith('image/'))
  if (files.length) void process(files)
}

function slug(nama: string) {
  return nama.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim()
}

async function process(files: File[]) {
  uploading.value = true
  total.value = files.length
  done.value = 0
  try {
    for (const file of files) {
      const { preview, blob } = await compress(file)
      const url = await upload(blob, file.name)
      items.value.push({
        gambar: url,
        preview,
        judul: props.useFilenameAsTitle ? slug(file.name) : '',
      })
      done.value++
    }
  }
  finally {
    uploading.value = false
  }
}

/** Kompres di klien agar unggahan ringan. */
async function compress(file: File): Promise<{ preview: string, blob: Blob }> {
  const dataUrl = await readAsDataURL(file)
  const img = await loadImage(dataUrl)

  const scale = Math.min(1, props.maxDimension / Math.max(img.width, img.height))
  const w = Math.round(img.width * scale)
  const h = Math.round(img.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return { preview: dataUrl, blob: file }
  ctx.drawImage(img, 0, 0, w, h)

  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob(b => resolve(b ?? file), 'image/jpeg', props.quality)
  })
  const preview = canvas.toDataURL('image/jpeg', 0.7)
  return { preview, blob }
}

/** Unggah ke Supabase Storage; fallback ke data URL lokal. */
async function upload(blob: Blob, namaAsli: string): Promise<string> {
  const sb = await getSupabase()
  if (sb) {
    try {
      const ext = 'jpg'
      const path = `galeri/${props.albumId ?? 'umum'}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const { error } = await sb.storage.from('galeri').upload(path, blob, { contentType: 'image/jpeg', upsert: false })
      if (!error) {
        const { data } = sb.storage.from('galeri').getPublicUrl(path)
        if (data?.publicUrl) return data.publicUrl
      }
    }
    catch { /* fallback lokal */ }
  }
  return blobToDataURL(blob)
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(new Error('Gagal membaca berkas'))
    r.readAsDataURL(file)
  })
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(new Error('Gagal memproses gambar'))
    r.readAsDataURL(blob)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Gambar tidak valid'))
    img.src = src
  })
}

function removeAt(i: number) {
  items.value.splice(i, 1)
}

function clear() {
  items.value = []
}

defineExpose({
  items,
  uploading,
  clear,
  /** Ambil foto hasil pilih lalu reset komponen. */
  take() {
    const out = [...items.value]
    items.value = []
    return out
  },
})
</script>
