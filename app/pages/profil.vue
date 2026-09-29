<template>
  <div>
    <PageHeader title="Profil Pesantren" :subtitle="settings.tagline" icon="i-lucide-moon-star" />

    <div class="mt-5 space-y-4 px-4">
      <!-- Identitas -->
      <div class="card-soft overflow-hidden">
        <div class="flex flex-col items-center gap-3 p-6 text-center brand-gradient-soft">
          <div class="grid size-20 place-items-center overflow-hidden rounded-3xl brand-gradient ring-4 ring-[var(--surface)]">
            <img v-if="settings.logo" :src="settings.logo" class="size-full object-cover">
            <UIcon v-else name="i-lucide-moon-star" class="size-9 text-white" />
          </div>
          <div>
            <h2 class="text-lg font-extrabold">{{ settings.siteName }}</h2>
            <p class="text-xs text-[var(--ink-muted)]">{{ settings.alamat }}</p>
          </div>
          <div class="flex gap-2">
            <UBadge color="primary" variant="soft" size="sm">Akreditasi {{ settings.akreditasi }}</UBadge>
            <UBadge color="neutral" variant="soft" size="sm">Berdiri {{ settings.berdiri }}</UBadge>
          </div>
        </div>
      </div>

      <!-- Visi & Misi -->
      <div class="card-soft card-accent p-5 pl-6">
        <div class="mb-2 flex items-center gap-2">
          <UIcon name="i-lucide-eye" class="size-4 brand-text" />
          <h3 class="text-sm font-extrabold uppercase tracking-wide">Visi</h3>
        </div>
        <p class="text-sm leading-relaxed text-[var(--ink-muted)]">{{ settings.visi }}</p>
      </div>

      <div class="card-soft p-5">
        <div class="mb-2.5 flex items-center gap-2">
          <UIcon name="i-lucide-list-checks" class="size-4 brand-text" />
          <h3 class="text-sm font-extrabold uppercase tracking-wide">Misi</h3>
        </div>
        <ul class="space-y-2.5">
          <li v-for="(m, i) in misiList" :key="i" class="flex gap-3">
            <span class="grid size-5 shrink-0 place-items-center rounded-full brand-soft text-[10px] font-bold">{{ i + 1 }}</span>
            <p class="text-sm leading-relaxed text-[var(--ink-muted)]">{{ m }}</p>
          </li>
        </ul>
      </div>

      <!-- Fasilitas -->
      <div class="card-soft p-5">
        <div class="mb-3 flex items-center gap-2">
          <UIcon name="i-lucide-building-2" class="size-4 brand-text" />
          <h3 class="text-sm font-extrabold uppercase tracking-wide">Fasilitas</h3>
        </div>
        <div class="grid grid-cols-2 gap-2.5">
          <div v-for="f in fasilitas" :key="f.nama" class="flex items-center gap-2.5 rounded-2xl bg-[var(--surface-muted)] p-3">
            <UIcon :name="f.ikon" class="size-4 brand-text" />
            <span class="text-xs font-semibold">{{ f.nama }}</span>
          </div>
        </div>
      </div>

      <!-- Kontak ringkas -->
      <div class="card-soft divide-y divide-[var(--hairline)]">
        <div v-for="k in kontak" :key="k.label" class="flex items-center gap-3 p-3.5">
          <div class="grid size-9 shrink-0 place-items-center rounded-xl brand-soft">
            <UIcon :name="k.ikon" class="size-4" />
          </div>
          <div class="min-w-0">
            <p class="text-[10px] font-bold uppercase tracking-wide text-[var(--ink-muted)]">{{ k.label }}</p>
            <p class="truncate text-sm font-semibold">{{ k.nilai }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { settings, load } = useSiteSettings()

const misiList = computed(() =>
  settings.value.misi.split(';').map(s => s.trim()).filter(Boolean),
)

const fasilitas = [
  { nama: 'Masjid Jami’', ikon: 'i-lucide-landmark' },
  { nama: 'Asrama Santri', ikon: 'i-lucide-bed-double' },
  { nama: 'Ruang Kelas', ikon: 'i-lucide-school' },
  { nama: 'Perpustakaan', ikon: 'i-lucide-book-open' },
  { nama: 'Lab Komputer', ikon: 'i-lucide-cpu' },
  { nama: 'Lapangan Olahraga', ikon: 'i-lucide-dribbble' },
]

const kontak = computed(() => [
  { label: 'Alamat', ikon: 'i-lucide-map-pin', nilai: settings.value.alamat },
  { label: 'Telepon', ikon: 'i-lucide-phone', nilai: settings.value.telepon },
  { label: 'Email', ikon: 'i-lucide-mail', nilai: settings.value.email },
  { label: 'Jam Layanan', ikon: 'i-lucide-clock', nilai: settings.value.jam },
])

useHead({ title: `Profil — ${settings.value.siteName}` })
onMounted(() => load())
</script>
