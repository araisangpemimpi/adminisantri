<template>
  <div class="space-y-7 pt-5">
    <template v-for="id in aktif" :key="id">
      <!-- Hero -->
      <LandingHero v-if="id === 'hero'" />

      <!-- Statistik -->
      <LandingStats v-else-if="id === 'stats'" />

      <!-- Agenda -->
      <section v-else-if="id === 'agenda'" class="px-4">
        <SectionTitle eyebrow="Jadwal" title="Agenda Terdekat" subtitle="Kegiatan pesantren yang akan datang" to="/agenda" />
        <div class="mt-3 space-y-2.5">
          <NuxtLink
            v-for="item in agendaUpcoming.slice(0, 3)" :key="item.id" to="/agenda"
            class="card-soft card-hover card-accent flex items-center gap-3 p-3.5 pl-5"
          >
            <div class="grid size-12 shrink-0 place-items-center rounded-2xl brand-soft">
              <p class="text-[15px] font-extrabold leading-none">{{ day(item.tanggal) }}</p>
              <p class="text-[9px] font-bold uppercase">{{ month(item.tanggal) }}</p>
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-bold">{{ item.judul }}</p>
              <p class="mt-0.5 flex items-center gap-1 truncate text-xs text-[var(--ink-muted)]">
                <UIcon name="i-lucide-clock" class="size-3" /> {{ item.jam }} • {{ item.lokasi }}
              </p>
            </div>
            <UBadge size="xs" color="neutral" variant="soft">{{ item.kategori }}</UBadge>
          </NuxtLink>
          <p v-if="!agendaUpcoming.length" class="card-soft p-6 text-center text-sm text-[var(--ink-muted)]">Belum ada agenda.</p>
        </div>
      </section>

      <!-- Pengumuman -->
      <section v-else-if="id === 'pengumuman'" class="px-4">
        <SectionTitle eyebrow="Informasi" title="Pengumuman" subtitle="Kabar terbaru dari pesantren" to="/pengumuman" />
        <div class="mt-3 space-y-2.5">
          <NuxtLink
            v-for="item in pengumuman.slice(0, 3)" :key="item.id" to="/pengumuman"
            class="card-soft card-hover block p-4"
          >
            <div class="mb-1.5 flex items-center gap-2">
              <UBadge v-if="item.penting" size="xs" color="error" variant="soft" icon="i-lucide-alert-circle">Penting</UBadge>
              <UBadge size="xs" color="neutral" variant="soft">{{ item.kategori }}</UBadge>
              <span class="ml-auto text-[11px] text-[var(--ink-muted)]">{{ relatif(item.tanggal) }}</span>
            </div>
            <p class="text-sm font-bold leading-snug">{{ item.judul }}</p>
            <p class="mt-1 line-clamp-2 text-xs text-[var(--ink-muted)]">{{ item.isi }}</p>
          </NuxtLink>
          <p v-if="!pengumuman.length" class="card-soft p-6 text-center text-sm text-[var(--ink-muted)]">Belum ada pengumuman.</p>
        </div>
      </section>

      <!-- Prestasi -->
      <section v-else-if="id === 'prestasi'" class="px-4">
        <SectionTitle eyebrow="Capaian" title="Prestasi Terbaru" subtitle="Kebanggaan santri kami" to="/prestasi" />
        <div class="no-scrollbar snap-x-mandatory -mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-1">
          <NuxtLink
            v-for="item in prestasiTampil.slice(0, 5)" :key="item.id" to="/prestasi"
            class="card-soft card-hover snap-center-always w-60 shrink-0 overflow-hidden"
          >
            <div class="relative h-32 w-full overflow-hidden bg-[var(--surface-muted)]">
              <img :src="item.gambar" :alt="item.judul" loading="lazy" class="size-full object-cover">
              <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5">
                <UBadge size="xs" color="primary" variant="solid">{{ item.tingkat }}</UBadge>
              </div>
            </div>
            <div class="p-3.5">
              <p class="line-clamp-2 text-sm font-bold leading-snug">{{ item.judul }}</p>
              <p class="mt-1 flex items-center gap-1 truncate text-xs text-[var(--ink-muted)]">
                <UIcon name="i-lucide-user" class="size-3" /> {{ item.nama }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- Galeri -->
      <section v-else-if="id === 'galeri'" class="px-4">
        <SectionTitle eyebrow="Dokumentasi" title="Galeri Pesantren" to="/galeri" />
        <div class="mt-3 grid grid-cols-3 gap-2">
          <NuxtLink
            v-for="item in galeriPreview" :key="item.id" to="/galeri"
            class="group relative aspect-square overflow-hidden rounded-2xl bg-[var(--surface-muted)]"
          >
            <img :src="item.gambar" :alt="item.judul" loading="lazy" class="size-full object-cover transition duration-300 group-active:scale-105">
            <div class="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent opacity-70" />
            <p class="absolute inset-x-1.5 bottom-1.5 line-clamp-2 text-[10px] font-semibold leading-tight text-white">{{ item.judul }}</p>
          </NuxtLink>
        </div>
        <p v-if="!galeriPreview.length" class="card-soft mt-3 p-6 text-center text-sm text-[var(--ink-muted)]">Belum ada foto galeri.</p>
      </section>

      <!-- Ekskul -->
      <section v-else-if="id === 'ekskul'" class="px-4">
        <SectionTitle eyebrow="Pengembangan Diri" title="Ekstrakurikuler" to="/ekskul" />
        <div class="no-scrollbar -mx-4 mt-3 flex gap-2.5 overflow-x-auto px-4 pb-1">
          <NuxtLink
            v-for="item in ekskulAktif.slice(0, 6)" :key="item.id" to="/ekskul"
            class="card-soft card-hover flex w-28 shrink-0 flex-col items-center gap-2 p-3 text-center"
          >
            <div class="grid size-11 place-items-center rounded-2xl brand-soft">
              <UIcon :name="item.ikon || 'i-lucide-medal'" class="size-5" />
            </div>
            <p class="text-xs font-bold leading-tight">{{ item.nama }}</p>
          </NuxtLink>
        </div>
      </section>

      <!-- PSB CTA -->
      <section v-else-if="id === 'psb'" class="px-4">
        <NuxtLink to="/psb" class="block overflow-hidden rounded-3xl brand-gradient pattern-islamic p-5 text-white shadow-lg">
          <div class="flex items-center gap-4">
            <div class="min-w-0 flex-1">
              <p class="text-[11px] font-bold uppercase tracking-wider text-white/75">Pendaftaran Santri Baru</p>
              <p class="mt-1 text-lg font-extrabold leading-tight">Bergabung bersama kami tahun ini</p>
              <p class="mt-1 text-xs text-white/80">Proses mudah, biaya terjangkau, beasiswa tersedia.</p>
            </div>
            <div class="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/20">
              <UIcon name="i-lucide-arrow-right" class="size-6" />
            </div>
          </div>
        </NuxtLink>
      </section>

      <!-- Kontak cepat -->
      <section v-else-if="id === 'kontak'" class="px-4 pb-2">
        <SectionTitle eyebrow="Hubungi Kami" title="Butuh informasi?" to="/kontak" />
        <div class="mt-3 grid grid-cols-2 gap-2.5">
          <a :href="`https://wa.me/${settings.wa}`" target="_blank" rel="noopener" class="card-soft card-hover flex items-center gap-3 p-3.5">
            <div class="grid size-9 place-items-center rounded-xl bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400">
              <UIcon name="i-lucide-message-circle" class="size-4" />
            </div>
            <span class="text-xs font-bold">WhatsApp</span>
          </a>
          <a :href="`tel:${settings.telepon.replace(/[^0-9+]/g, '')}`" class="card-soft card-hover flex items-center gap-3 p-3.5">
            <div class="grid size-9 place-items-center rounded-xl brand-soft">
              <UIcon name="i-lucide-phone" class="size-4" />
            </div>
            <span class="text-xs font-bold">Telepon</span>
          </a>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
const { settings, load } = useSiteSettings()
const { aktif, load: loadSections } = useLandingSections()
const { tanggalRelatif, BULAN } = useFormat()

const agendaStore = useAdminStore('agenda')
const pengumumanStore = useAdminStore('pengumuman')
const prestasiStore = useAdminStore('prestasi')
const albumStore = useAdminStore('album')
const fotoStore = useAdminStore('foto')
const ekskulStore = useAdminStore('ekskul')

const agenda = agendaStore.rows
const pengumuman = pengumumanStore.rows
const prestasi = prestasiStore.rows
const ekskul = ekskulStore.rows

const agendaUpcoming = computed(() =>
  [...agenda.value]
    .filter(a => new Date(String(a.tanggal)).getTime() >= Date.now() - 86400000)
    .sort((a, b) => new Date(String(a.tanggal)).getTime() - new Date(String(b.tanggal)).getTime()),
)

const prestasiTampil = computed(() => prestasi.value.filter(p => p.aktif !== false))
const ekskulAktif = computed(() => ekskul.value.filter(e => e.aktif !== false))

/** Pratinjau galeri: foto dari album yang aktif. */
const galeriPreview = computed(() => {
  const albumAktif = new Set(albumStore.rows.value.filter(a => a.aktif !== false).map(a => String(a.id)))
  return fotoStore.rows.value
    .filter(f => f.tampil !== false && albumAktif.has(String(f.albumId)))
    .slice(0, 6)
})

function day(v: unknown) {
  const d = new Date(String(v))
  return Number.isNaN(d.getTime()) ? '—' : d.getDate()
}
function month(v: unknown) {
  const d = new Date(String(v))
  return Number.isNaN(d.getTime()) ? '' : BULAN[d.getMonth()]?.slice(0, 3)
}
function relatif(v: unknown) { return tanggalRelatif(v) }

useHead({ title: `${settings.value.siteName} — Beranda` })

onMounted(() => {
  load()
  loadSections()
  for (const s of [agendaStore, pengumumanStore, prestasiStore, albumStore, fotoStore, ekskulStore]) s.fetchAll()
})
</script>
