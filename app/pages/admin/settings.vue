<template>
  <div class="space-y-5">
    <div>
      <h1 class="text-xl font-extrabold">Tema & Identitas</h1>
      <p class="text-sm text-[var(--ink-muted)]">Atur identitas pesantren, warna brand, dan mode tampilan.</p>
    </div>

    <!-- Mode tampilan -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-sun-moon" class="size-4 brand-text" />
          <p class="text-sm font-extrabold">Mode Tampilan</p>
        </div>
      </template>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="m in modes" :key="m.id"
          class="flex items-center gap-3 rounded-2xl border-2 p-3.5 transition"
          :class="settings.mode === m.id ? 'border-[var(--brand-600)] brand-soft' : 'border-[var(--hairline)]'"
          @click="setMode(m.id)"
        >
          <UIcon :name="m.icon" class="size-5" />
          <div class="text-left">
            <p class="text-sm font-bold">{{ m.label }}</p>
            <p class="text-[11px] text-[var(--ink-muted)]">{{ m.desc }}</p>
          </div>
        </button>
      </div>
    </UCard>

    <!-- Palet warna -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-palette" class="size-4 brand-text" />
          <p class="text-sm font-extrabold">Warna Brand</p>
        </div>
      </template>
      <div class="grid grid-cols-4 gap-3 sm:grid-cols-7">
        <button
          v-for="p in palettes" :key="p.id"
          class="flex flex-col items-center gap-1.5"
          @click="setPalette(p.id)"
        >
          <div
            class="grid size-12 place-items-center rounded-2xl ring-2 transition"
            :class="settings.paletteId === p.id ? 'ring-[var(--brand-600)] ring-offset-2 ring-offset-[var(--surface)]' : 'ring-transparent'"
            :style="{ background: `linear-gradient(135deg, ${p.primary}, ${p.dark})` }"
          >
            <UIcon v-if="settings.paletteId === p.id" name="i-lucide-check" class="size-5 text-white" />
          </div>
          <span class="text-[10px] font-semibold leading-tight text-center">{{ p.nama.split(' ')[0] }}</span>
        </button>
      </div>
    </UCard>

    <!-- Identitas -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-building-2" class="size-4 brand-text" />
          <p class="text-sm font-extrabold">Identitas Pesantren</p>
        </div>
      </template>

      <div class="mb-5 flex items-center gap-4">
        <div class="grid size-16 shrink-0 place-items-center overflow-hidden rounded-3xl brand-gradient">
          <img v-if="settings.logo" :src="settings.logo" class="size-full object-cover">
          <UIcon v-else name="i-lucide-moon-star" class="size-7 text-white" />
        </div>
        <div class="min-w-0 flex-1">
          <UFormField label="URL Logo">
            <UInput v-model="draft.logo" placeholder="https://…" icon="i-lucide-image" class="w-full" />
          </UFormField>
        </div>
      </div>

      <div class="space-y-3.5">
        <UFormField label="Nama Pesantren">
          <UInput v-model="draft.siteName" icon="i-lucide-moon-star" class="w-full" />
        </UFormField>
        <UFormField label="Tagline">
          <UInput v-model="draft.tagline" icon="i-lucide-quote" class="w-full" />
        </UFormField>
        <div class="grid grid-cols-2 gap-3">
          <UFormField label="Akreditasi">
            <UInput v-model="draft.akreditasi" class="w-full" />
          </UFormField>
          <UFormField label="Tahun Berdiri">
            <UInput v-model="draft.berdiri" class="w-full" />
          </UFormField>
        </div>
        <UFormField label="Visi" help="Kalimat visi pesantren.">
          <UTextarea v-model="draft.visi" :rows="2" autoresize class="w-full" />
        </UFormField>
        <UFormField label="Misi" help="Pisahkan setiap poin misi dengan tanda titik koma (;).">
          <UTextarea v-model="draft.misi" :rows="4" autoresize class="w-full" />
        </UFormField>
        <div class="grid grid-cols-2 gap-3">
          <UFormField label="Telepon">
            <UInput v-model="draft.telepon" icon="i-lucide-phone" class="w-full" />
          </UFormField>
          <UFormField label="WhatsApp">
            <UInput v-model="draft.wa" icon="i-lucide-message-circle" class="w-full" />
          </UFormField>
        </div>
        <UFormField label="Email">
          <UInput v-model="draft.email" icon="i-lucide-mail" class="w-full" />
        </UFormField>
        <UFormField label="Alamat">
          <UTextarea v-model="draft.alamat" :rows="2" autoresize class="w-full" />
        </UFormField>
        <UFormField label="Jam Layanan">
          <UInput v-model="draft.jam" icon="i-lucide-clock" class="w-full" />
        </UFormField>
        <UFormField label="URL Google Maps">
          <UInput v-model="draft.maps" icon="i-lucide-map-pin" class="w-full" />
        </UFormField>
      </div>
    </UCard>

    <!-- Aksi -->
    <div class="sticky bottom-4 flex gap-2">
      <UButton color="neutral" variant="soft" class="flex-1" icon="i-lucide-rotate-ccw" @click="reset">Reset</UButton>
      <UButton class="flex-[2]" icon="i-lucide-save" @click="save">Simpan Pengaturan</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { settings, palettes, setPalette, setMode, update, persist, load } = useSiteSettings()
const toast = useToast()

const modes = [
  { id: 'light' as const, label: 'Terang', desc: 'Tema siang', icon: 'i-lucide-sun' },
  { id: 'dark' as const, label: 'Gelap', desc: 'Tema malam', icon: 'i-lucide-moon' },
]

const draft = reactive({ ...settings.value })

function reset() {
  Object.assign(draft, settings.value)
}

async function save() {
  update({ ...draft })
  const sb = await getSupabase()
  if (sb) {
    try {
      await sb.from('site_settings').upsert({
        id: 1,
        site_name: draft.siteName,
        tagline: draft.tagline,
        visi: draft.visi,
        misi: draft.misi,
        telepon: draft.telepon,
        email: draft.email,
        alamat: draft.alamat,
        jam: draft.jam,
        wa: draft.wa,
        maps: draft.maps,
        akreditasi: draft.akreditasi,
        berdiri: draft.berdiri,
        logo_url: draft.logo,
        palette_id: settings.value.paletteId,
        mode: settings.value.mode,
      })
    }
    catch { /* tetap tersimpan lokal */ }
  }
  persist()
  toast.add({ title: 'Pengaturan disimpan', color: 'success' })
}

useHead({ title: 'Tema & Identitas — Panel Admin' })
onMounted(() => {
  load()
  Object.assign(draft, settings.value)
})
</script>
