<template>
  <div>
    <PageHeader title="Hubungi Kami" subtitle="Kami siap membantu" icon="i-lucide-phone" />

    <div class="mt-5 px-4 pb-2">
      <!-- Aksi cepat -->
      <div class="mb-4 grid grid-cols-2 gap-2.5">
        <a :href="`https://wa.me/${settings.wa}`" target="_blank" rel="noopener" class="card-soft card-hover flex flex-col gap-2 p-4">
          <div class="grid size-10 place-items-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400">
            <UIcon name="i-lucide-message-circle" class="size-5" />
          </div>
          <div>
            <p class="text-sm font-bold">WhatsApp</p>
            <p class="text-[11px] text-[var(--ink-muted)]">{{ settings.wa }}</p>
          </div>
        </a>
        <a :href="`tel:${settings.telepon.replace(/[^0-9+]/g, '')}`" class="card-soft card-hover flex flex-col gap-2 p-4">
          <div class="grid size-10 place-items-center rounded-2xl brand-soft">
            <UIcon name="i-lucide-phone" class="size-5" />
          </div>
          <div>
            <p class="text-sm font-bold">Telepon</p>
            <p class="text-[11px] text-[var(--ink-muted)]">{{ settings.telepon }}</p>
          </div>
        </a>
        <a :href="`mailto:${settings.email}`" class="card-soft card-hover flex flex-col gap-2 p-4">
          <div class="grid size-10 place-items-center rounded-2xl brand-soft">
            <UIcon name="i-lucide-mail" class="size-5" />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-bold">Email</p>
            <p class="truncate text-[11px] text-[var(--ink-muted)]">{{ settings.email }}</p>
          </div>
        </a>
        <a :href="settings.maps" target="_blank" rel="noopener" class="card-soft card-hover flex flex-col gap-2 p-4">
          <div class="grid size-10 place-items-center rounded-2xl brand-soft">
            <UIcon name="i-lucide-map-pin" class="size-5" />
          </div>
          <div>
            <p class="text-sm font-bold">Lokasi</p>
            <p class="text-[11px] text-[var(--ink-muted)]">Lihat peta</p>
          </div>
        </a>
      </div>

      <!-- Alamat & jam -->
      <div class="card-soft mb-4 divide-y divide-[var(--hairline)]">
        <div class="flex items-start gap-3 p-4">
          <UIcon name="i-lucide-map-pin" class="mt-0.5 size-4 shrink-0 brand-text" />
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wide text-[var(--ink-muted)]">Alamat</p>
            <p class="text-sm">{{ settings.alamat }}</p>
          </div>
        </div>
        <div class="flex items-start gap-3 p-4">
          <UIcon name="i-lucide-clock" class="mt-0.5 size-4 shrink-0 brand-text" />
          <div>
            <p class="text-[10px] font-bold uppercase tracking-wide text-[var(--ink-muted)]">Jam Layanan</p>
            <p class="text-sm">{{ settings.jam }}</p>
          </div>
        </div>
      </div>

      <!-- Formulir pesan -->
      <div class="card-soft p-4">
        <p class="eyebrow mb-3">Kirim Pesan</p>
        <form class="space-y-3" @submit.prevent="submit">
          <UInput v-model="form.nama" placeholder="Nama Anda" icon="i-lucide-user" class="w-full" />
          <div class="grid grid-cols-2 gap-3">
            <UInput v-model="form.hp" placeholder="No. HP" icon="i-lucide-phone" class="w-full" />
            <UInput v-model="form.email" placeholder="Email" icon="i-lucide-mail" class="w-full" />
          </div>
          <UTextarea v-model="form.pesan" placeholder="Tulis pesan atau pertanyaan Anda…" :rows="4" autoresize class="w-full" />
          <UButton type="submit" block icon="i-lucide-send" :loading="saving">Kirim Pesan</UButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { settings, load } = useSiteSettings()
const store = useAdminStore('kontak')
const toast = useToast()
const saving = ref(false)

const form = reactive({ nama: '', hp: '', email: '', pesan: '' })

async function submit() {
  if (!form.nama || !form.pesan) {
    toast.add({ title: 'Nama dan pesan wajib diisi', color: 'error' })
    return
  }
  saving.value = true
  try {
    await store.create({ ...form, status: 'Baru' })
    toast.add({ title: 'Pesan terkirim!', description: 'Kami akan segera menghubungi Anda.', color: 'success' })
    Object.assign(form, { nama: '', hp: '', email: '', pesan: '' })
  }
  finally {
    saving.value = false
  }
}

useHead({ title: 'Kontak' })
onMounted(() => load())
</script>
