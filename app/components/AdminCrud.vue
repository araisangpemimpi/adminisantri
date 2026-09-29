<!-- CRUD generik untuk seluruh modul admin (CSR only, offline-first). -->
<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-extrabold">{{ title }}</h1>
        <p v-if="subtitle" class="text-sm text-[var(--ink-muted)]">{{ subtitle }}</p>
      </div>
      <UButton icon="i-lucide-plus" @click="openCreate">Tambah</UButton>
    </div>

    <!-- Pencarian + filter -->
    <div class="flex flex-wrap gap-2">
      <UInput v-model="q" placeholder="Cari data…" icon="i-lucide-search" class="min-w-40 flex-1" />
      <USelect
        v-if="filterKey && filterOptions.length > 1"
        v-model="filterValue" :items="filterOptions" icon="i-lucide-filter" class="w-40"
      />
    </div>

    <!-- Ringkasan statistik -->
    <div v-if="summary.length" class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div v-for="s in summary" :key="s.label" class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold" :class="s.tone ? TONE_TEXT[s.tone] : ''">{{ s.value }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">{{ s.label }}</p>
      </div>
    </div>

    <!-- Daftar: satu kolom di mobile, grid di desktop -->
    <div v-if="loading && !rows.length" class="card-soft p-10 text-center text-sm text-[var(--ink-muted)]">
      <UIcon name="i-lucide-loader-circle" class="mx-auto size-6 animate-spin" />
      <p class="mt-2">Memuat data…</p>
    </div>

    <EmptyState v-else-if="!filtered.length" :icon="icon" :title="`Belum ada data ${title.toLowerCase()}`" subtitle="Klik tombol Tambah untuk menambahkan data baru." />

    <div v-else class="grid gap-2.5 xl:grid-cols-2">
      <div
        v-for="row in filtered" :key="row.id"
        class="card-soft card-hover flex items-center gap-3.5 p-3.5"
      >
        <div v-if="row.image || row.gambar" class="size-12 shrink-0 overflow-hidden rounded-2xl bg-[var(--surface-muted)]">
          <img :src="row.image || row.gambar" alt="" class="size-full object-cover">
        </div>
        <div
          v-else-if="display(row).initials"
          class="grid size-12 shrink-0 place-items-center rounded-2xl brand-soft text-sm font-extrabold"
        >
          {{ display(row).initials }}
        </div>
        <div v-else class="grid size-12 shrink-0 place-items-center rounded-2xl brand-soft">
          <UIcon :name="icon" class="size-5" />
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="truncate text-sm font-bold">{{ display(row).title }}</p>
            <UBadge
              v-if="display(row).badge" size="xs"
              :color="badgeColor ? badgeColor(row) : 'neutral'" variant="soft"
            >
              {{ display(row).badge }}
            </UBadge>
          </div>
          <p v-if="display(row).subtitle" class="mt-0.5 truncate text-xs text-[var(--ink-muted)]">{{ display(row).subtitle }}</p>
          <div v-if="display(row).meta.length" class="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
            <span v-for="(m, i) in display(row).meta" :key="i" class="flex items-center gap-1 text-[11px] text-[var(--ink-muted)]">
              <UIcon :name="m.icon" class="size-3" /> {{ m.text }}
            </span>
          </div>
        </div>

        <div class="flex shrink-0 flex-col gap-1.5">
          <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-pencil" aria-label="Ubah" @click="openEdit(row)" />
          <UButton size="xs" color="error" variant="soft" icon="i-lucide-trash" aria-label="Hapus" @click="confirmDelete(row)" />
        </div>
      </div>
    </div>

    <!-- Modal form -->
    <UModal v-model:open="modalOpen" :title="editing ? `Ubah ${title}` : `Tambah ${title}`" scrollable>
      <template #body>
        <form class="space-y-4" @submit.prevent="save">
          <UFormField
            v-for="f in (editing && f.editHidden ? [] : fields)"
            v-show="!(editing && f.editHidden)"
            :key="f.key" :label="f.label" :required="f.required"
          >
            <UInput
              v-if="f.type === 'text' || f.type === 'number' || f.type === 'date' || f.type === 'time'"
              v-model="form[f.key]" :type="f.type" :placeholder="f.placeholder || f.label"
              :icon="fieldIcon(f)" class="w-full"
            />
            <UTextarea
              v-else-if="f.type === 'textarea'" v-model="form[f.key]"
              :placeholder="f.placeholder || f.label" :rows="3" autoresize class="w-full"
            />
            <USelect
              v-else-if="f.type === 'select'" v-model="form[f.key]"
              :items="f.options || []" :icon="fieldIcon(f)" class="w-full"
            />
            <UInput
              v-else-if="f.type === 'image'" v-model="form[f.key]"
              placeholder="https://… atau unggah" icon="i-lucide-image" class="w-full"
            />
            <div v-else-if="f.type === 'switch'" class="flex items-center justify-between rounded-2xl bg-[var(--surface-muted)] px-3.5 py-2.5">
              <span class="text-sm font-medium">{{ f.label }}</span>
              <USwitch v-model="form[f.key]" />
            </div>
          </UFormField>

          <div class="flex gap-2 pt-1">
            <UButton type="button" color="neutral" variant="soft" class="flex-1" @click="modalOpen = false">Batal</UButton>
            <UButton type="submit" class="flex-[2]" :loading="saving" icon="i-lucide-check">Simpan</UButton>
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { ResourceKey } from '~/composables/useResources'

export interface CrudField {
  key: string
  label: string
  type: 'text' | 'number' | 'textarea' | 'date' | 'time' | 'select' | 'switch' | 'image'
  options?: string[]
  required?: boolean
  placeholder?: string
  /** Sembunyikan saat mengubah data (mis. password). */
  editHidden?: boolean
}

export interface CrudSummaryItem {
  label: string
  value: string | number
  tone?: 'primary' | 'green' | 'amber' | 'rose'
}

const props = withDefaults(defineProps<{
  resource: ResourceKey
  title: string
  subtitle?: string
  icon: string
  fields: CrudField[]
  titleKey: string
  subtitleKey?: string
  badgeKey?: string
  /** Kunci untuk kolom meta tambahan (ikon + kunci). */
  metaKeys?: Array<{ key: string, icon: string, prefix?: string }>
  /** Nama kolom untuk filter dropdown. */
  filterKey?: string
  /** Hitung ringkasan dari data. */
  summaryFn?: (rows: any[]) => CrudSummaryItem[]
  /** Warna badge dinamis. */
  badgeColor?: (row: any) => string
  /** Ambil inisial dari kolom nama. */
  initialsKey?: string
}>(), {})

const TONE_TEXT: Record<string, string> = {
  primary: 'brand-text',
  green: 'text-green-600 dark:text-green-400',
  amber: 'text-amber-600 dark:text-amber-400',
  rose: 'text-rose-600 dark:text-rose-400',
}

const store = useAdminStore(props.resource)
const rows = store.rows
const loading = store.loading

const toast = useToast()
const { inisial } = useFormat()

const q = ref('')
const filterValue = ref('Semua')
const modalOpen = ref(false)
const saving = ref(false)
const editing = ref<any | null>(null)
const form = reactive<Record<string, any>>({})

const filterOptions = computed(() => {
  if (!props.filterKey) return []
  const values = [...new Set(rows.value.map(r => r[props.filterKey!]).filter(v => v !== undefined && v !== null && v !== ''))]
  return ['Semua', ...values.map(String)]
})

const filtered = computed(() => {
  let list = [...rows.value]
  if (props.filterKey && filterValue.value !== 'Semua') {
    list = list.filter(r => String(r[props.filterKey!]) === filterValue.value)
  }
  const term = q.value.trim().toLowerCase()
  if (term) {
    list = list.filter(r => Object.values(r).some(v => String(v ?? '').toLowerCase().includes(term)))
  }
  return list
})

const summary = computed(() => (props.summaryFn ? props.summaryFn(rows.value) : []))

function display(row: any) {
  const meta: Array<{ icon: string, text: string }> = []
  for (const m of props.metaKeys ?? []) {
    const raw = row[m.key]
    if (raw === undefined || raw === null || raw === '') continue
    meta.push({ icon: m.icon, text: m.prefix ? `${m.prefix}${raw}` : String(raw) })
  }
  return {
    title: String(row[props.titleKey] ?? '—'),
    subtitle: props.subtitleKey ? String(row[props.subtitleKey] ?? '') : '',
    badge: props.badgeKey ? row[props.badgeKey] : '',
    initials: props.initialsKey ? inisial(row[props.initialsKey]) : '',
    meta,
  }
}

function fieldIcon(f: CrudField) {
  if (f.type === 'image') return 'i-lucide-image'
  if (f.type === 'number') return 'i-lucide-hash'
  if (f.type === 'date') return 'i-lucide-calendar'
  if (f.type === 'time') return 'i-lucide-clock'
  const k = f.key.toLowerCase()
  if (k.includes('nama')) return 'i-lucide-user'
  if (k.includes('judul')) return 'i-lucide-type'
  if (k.includes('hp') || k.includes('telepon') || k.includes('wa')) return 'i-lucide-phone'
  if (k.includes('email')) return 'i-lucide-mail'
  if (k.includes('alamat') || k.includes('lokasi')) return 'i-lucide-map-pin'
  if (k.includes('ikon')) return 'i-lucide-shapes'
  if (k.includes('link') || k.includes('url')) return 'i-lucide-link'
  return 'i-lucide-pencil'
}

function blank() {
  const o: Record<string, any> = {}
  for (const f of props.fields) {
    o[f.key] = f.type === 'switch' ? true : f.type === 'number' ? 0 : ''
  }
  return o
}

function openCreate() {
  editing.value = null
  Object.keys(form).forEach(k => delete form[k])
  Object.assign(form, blank())
  modalOpen.value = true
}

function openEdit(row: any) {
  editing.value = row
  Object.keys(form).forEach(k => delete form[k])
  Object.assign(form, blank())
  for (const f of props.fields) {
    const v = row[f.key]
    if (v !== undefined && v !== null) form[f.key] = f.type === 'number' ? Number(v) : v
  }
  modalOpen.value = true
}

async function save() {
  saving.value = true
  try {
    const payload: Record<string, any> = {}
    for (const f of props.fields) {
      if (editing.value && f.editHidden && !form[f.key]) continue
      payload[f.key] = f.type === 'number' ? Number(form[f.key]) || 0 : form[f.key]
    }
    if (editing.value) {
      await store.update(String(editing.value.id), payload)
      toast.add({ title: 'Data diperbarui', color: 'success' })
    }
    else {
      await store.create(payload)
      toast.add({ title: 'Data ditambahkan', color: 'success' })
    }
    modalOpen.value = false
  }
  finally {
    saving.value = false
  }
}

function confirmDelete(row: any) {
  const label = display(row).title
  if (!confirm(`Hapus “${label}”? Tindakan ini tidak dapat dibatalkan.`)) return
  void remove(row)
}

async function remove(row: any) {
  await store.remove(String(row.id))
  toast.add({ title: 'Data dihapus', color: 'success' })
}

onMounted(() => store.fetchAll())
</script>
