<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-extrabold">Jadwal Pelajaran</h1>
        <p class="text-sm text-[var(--ink-muted)]">Susunan jadwal per hari dan rombel.</p>
      </div>
      <UButton icon="i-lucide-plus" @click="openForm()">Tambah Jadwal</UButton>
    </div>

    <UInput v-model="q" placeholder="Cari mapel, guru, atau ruang…" icon="i-lucide-search" class="w-full" />

    <EmptyState v-if="!grouped.length" icon="i-lucide-calendar-clock" title="Belum ada jadwal" subtitle="Tambahkan jadwal pelajaran terlebih dahulu." />

    <div v-for="g in grouped" :key="g.hari" class="space-y-2.5">
      <div class="flex items-center gap-2">
        <div class="grid size-7 place-items-center rounded-xl brand-gradient text-white">
          <UIcon name="i-lucide-calendar" class="size-3.5" />
        </div>
        <p class="text-sm font-extrabold">{{ g.hari }}</p>
        <UBadge size="xs" color="neutral" variant="soft">{{ g.items.length }} sesi</UBadge>
      </div>
      <div class="space-y-2">
        <div v-for="j in g.items" :key="j.id" class="card-soft card-accent flex items-center gap-3 p-3.5 pl-5">
          <div class="grid w-16 shrink-0 place-items-center rounded-xl bg-[var(--surface-muted)] py-1.5">
            <p class="tabular text-xs font-extrabold">{{ j.jam_mulai }}</p>
            <p class="tabular text-[10px] text-[var(--ink-muted)]">{{ j.jam_selesai }}</p>
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-bold">{{ j.mapel }}</p>
            <div class="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-[var(--ink-muted)]">
              <span class="flex items-center gap-1"><UIcon name="i-lucide-door-open" class="size-3" /> {{ j.rombel }}</span>
              <span v-if="j.ruang" class="flex items-center gap-1"><UIcon name="i-lucide-map-pin" class="size-3" /> {{ j.ruang }}</span>
              <span v-if="j.guru" class="flex items-center gap-1"><UIcon name="i-lucide-user" class="size-3" /> {{ j.guru }}</span>
            </div>
          </div>
          <div class="flex shrink-0 gap-1.5">
            <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-pencil" aria-label="Ubah" @click="openForm(j)" />
            <UButton size="xs" color="error" variant="soft" icon="i-lucide-trash" aria-label="Hapus" @click="remove(j)" />
          </div>
        </div>
      </div>
    </div>

    <UModal v-model:open="modalOpen" :title="editing ? 'Ubah Jadwal' : 'Tambah Jadwal'" scrollable>
      <template #body>
        <form class="space-y-4" @submit.prevent="save">
          <UFormField label="Hari" required>
            <USelect v-model="form.hari" :items="HARI_LIST" icon="i-lucide-calendar" class="w-full" />
          </UFormField>
          <div class="grid grid-cols-2 gap-3">
            <UFormField label="Jam Mulai">
              <UInput v-model="form.jam_mulai" type="time" class="w-full" />
            </UFormField>
            <UFormField label="Jam Selesai">
              <UInput v-model="form.jam_selesai" type="time" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="Mata Pelajaran" required>
            <USelect v-model="form.mapel" :items="mapelItems" icon="i-lucide-book-open" class="w-full" />
          </UFormField>
          <UFormField label="Rombel" required>
            <USelect v-model="form.rombel" :items="rombelItems" icon="i-lucide-door-open" class="w-full" />
          </UFormField>
          <UFormField label="Guru Pengampu">
            <USelect v-model="form.guru" :items="guruItems" icon="i-lucide-user" class="w-full" />
          </UFormField>
          <UFormField label="Ruang">
            <UInput v-model="form.ruang" icon="i-lucide-map-pin" class="w-full" />
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

const HARI_LIST = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Ahad']

const store = useAdminStore('jadwal')
const mapelStore = useAdminStore('mapel')
const rombelStore = useAdminStore('rombel')
const guruStore = useAdminStore('guru')
const toast = useToast()

const q = ref('')
const modalOpen = ref(false)
const editing = ref<any | null>(null)
const form = reactive({ hari: 'Senin', jam_mulai: '07:00', jam_selesai: '08:30', mapel: '', rombel: '', guru: '', ruang: '' })

const mapelItems = computed(() => mapelStore.rows.value.map(m => m.nama))
const rombelItems = computed(() => rombelStore.rows.value.map(r => r.nama))
const guruItems = computed(() => guruStore.rows.value.map(g => g.nama))

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return store.rows.value
  return store.rows.value.filter(j =>
    `${j.mapel} ${j.guru} ${j.ruang} ${j.rombel}`.toLowerCase().includes(term),
  )
})

const grouped = computed(() =>
  HARI_LIST
    .map(hari => ({
      hari,
      items: filtered.value
        .filter(j => j.hari === hari)
        .sort((a, b) => String(a.jam_mulai).localeCompare(String(b.jam_mulai))),
    }))
    .filter(g => g.items.length),
)

function openForm(j?: any) {
  editing.value = j ?? null
  Object.assign(form, j
    ? { hari: j.hari, jam_mulai: j.jam_mulai, jam_selesai: j.jam_selesai, mapel: j.mapel, rombel: j.rombel, guru: j.guru ?? '', ruang: j.ruang ?? '' }
    : { hari: 'Senin', jam_mulai: '07:00', jam_selesai: '08:30', mapel: mapelItems.value[0] ?? '', rombel: rombelItems.value[0] ?? '', guru: '', ruang: '' })
  modalOpen.value = true
}

async function save() {
  if (!form.mapel || !form.rombel) {
    toast.add({ title: 'Mapel dan rombel wajib diisi', color: 'error' })
    return
  }
  if (editing.value) {
    await store.update(String(editing.value.id), { ...form })
    toast.add({ title: 'Jadwal diperbarui', color: 'success' })
  }
  else {
    await store.create({ ...form, aktif: true })
    toast.add({ title: 'Jadwal ditambahkan', color: 'success' })
  }
  modalOpen.value = false
}

async function remove(j: any) {
  if (!confirm(`Hapus jadwal ${j.mapel} (${j.hari})?`)) return
  await store.remove(String(j.id))
  toast.add({ title: 'Jadwal dihapus', color: 'success' })
}

useHead({ title: 'Jadwal Pelajaran — Panel Admin' })
onMounted(() => {
  store.fetchAll()
  mapelStore.fetchAll()
  rombelStore.fetchAll()
  guruStore.fetchAll()
})
</script>
