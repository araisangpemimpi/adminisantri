<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-extrabold">Peran & Akses</h1>
        <p class="text-sm text-[var(--ink-muted)]">Atur hak akses setiap peran terhadap modul aplikasi.</p>
      </div>
      <UButton icon="i-lucide-plus" @click="openCreate">Tambah Peran</UButton>
    </div>

    <div class="space-y-3">
      <UCard v-for="role in roles" :key="role.id">
        <template #header>
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="grid size-10 shrink-0 place-items-center rounded-2xl brand-soft">
                <UIcon name="i-lucide-shield-check" class="size-5" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <p class="text-sm font-extrabold">{{ role.nama }}</p>
                  <UBadge v-if="role.isSystem" size="xs" color="neutral" variant="soft">Sistem</UBadge>
                </div>
                <p class="text-xs text-[var(--ink-muted)]">{{ role.deskripsi }}</p>
              </div>
            </div>
            <div class="flex shrink-0 gap-1.5">
              <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-pencil" aria-label="Ubah" @click="openEdit(role)" />
              <UButton v-if="!role.isSystem" size="xs" color="error" variant="soft" icon="i-lucide-trash" aria-label="Hapus" @click="remove(role)" />
            </div>
          </div>
        </template>

        <div class="space-y-3">
          <div>
            <p class="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--ink-muted)]">Akses Modul</p>
            <div v-if="role.resources === '*'" class="flex items-center gap-2 rounded-xl brand-soft px-3 py-2 text-xs font-semibold">
              <UIcon name="i-lucide-check-circle-2" class="size-4" /> Semua modul
            </div>
            <div v-else class="flex flex-wrap gap-1.5">
              <span v-for="r in role.resources" :key="r" class="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-[11px] font-medium">
                {{ resourceLabel(r) }}
              </span>
              <span v-if="!role.resources.length" class="text-xs text-[var(--ink-muted)]">Tidak ada akses modul.</span>
            </div>
          </div>
          <div>
            <p class="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--ink-muted)]">Aksi Diizinkan</p>
            <div class="flex flex-wrap gap-1.5">
              <UBadge v-for="a in role.actions" :key="a" size="sm" color="primary" variant="soft">{{ ACTION_LABEL[a] }}</UBadge>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Modal -->
    <UModal v-model:open="modalOpen" :title="editing ? 'Ubah Peran' : 'Tambah Peran'" scrollable>
      <template #body>
        <form class="space-y-4" @submit.prevent="save">
          <UFormField label="Nama Peran" required>
            <UInput v-model="form.nama" icon="i-lucide-shield" class="w-full" />
          </UFormField>
          <UFormField label="Deskripsi">
            <UTextarea v-model="form.deskripsi" :rows="2" autoresize class="w-full" />
          </UFormField>

          <UFormField label="Akses Semua Modul">
            <div class="flex items-center justify-between rounded-2xl bg-[var(--surface-muted)] px-3.5 py-2.5">
              <span class="text-sm font-medium">Izinkan seluruh modul</span>
              <USwitch v-model="allModules" />
            </div>
          </UFormField>

          <UFormField v-if="!allModules" label="Pilih Modul">
            <div class="grid max-h-56 grid-cols-2 gap-2 overflow-y-auto rounded-2xl border border-[var(--hairline)] p-3">
              <label v-for="r in managedResources" :key="r.key" class="flex items-center gap-2 text-xs">
                <UCheckbox :model-value="form.resources.includes(r.key)" @update:model-value="toggleResource(r.key)" />
                <span class="truncate">{{ r.label }}</span>
              </label>
            </div>
          </UFormField>

          <UFormField label="Aksi Diizinkan">
            <div class="grid grid-cols-2 gap-2">
              <label v-for="a in allActions" :key="a" class="flex items-center gap-2 rounded-xl bg-[var(--surface-muted)] px-3 py-2 text-xs">
                <UCheckbox :model-value="form.actions.includes(a)" @update:model-value="toggleAction(a)" />
                {{ ACTION_LABEL[a] }}
              </label>
            </div>
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
import { ALL_RESOURCES } from '~/composables/useResources'
import type { Action, Role } from '~/composables/useAuthz'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { roles, load, saveRole, removeRole, allActions } = useAuthz()
const toast = useToast()

const ACTION_LABEL: Record<string, string> = {
  read: 'Lihat',
  create: 'Tambah',
  update: 'Ubah',
  delete: 'Hapus',
}

const managedResources = ALL_RESOURCES.filter(r => r.managed && r.key !== 'users' && r.key !== 'roles')

function resourceLabel(key: string) {
  return ALL_RESOURCES.find(r => r.key === key)?.label ?? key
}

const modalOpen = ref(false)
const editing = ref<Role | null>(null)
const allModules = ref(false)
const form = reactive<{ nama: string, deskripsi: string, resources: string[], actions: Action[] }>({
  nama: '',
  deskripsi: '',
  resources: [],
  actions: ['read'],
})

function openCreate() {
  editing.value = null
  allModules.value = false
  Object.assign(form, { nama: '', deskripsi: '', resources: [], actions: ['read'] as Action[] })
  modalOpen.value = true
}

function openEdit(role: Role) {
  editing.value = role
  allModules.value = role.resources === '*'
  Object.assign(form, {
    nama: role.nama,
    deskripsi: role.deskripsi,
    resources: role.resources === '*' ? [] : [...role.resources],
    actions: [...role.actions],
  })
  modalOpen.value = true
}

function toggleResource(key: string) {
  const set = new Set(form.resources)
  if (set.has(key)) set.delete(key)
  else set.add(key)
  form.resources = [...set]
}

function toggleAction(a: Action) {
  const set = new Set(form.actions)
  if (set.has(a)) set.delete(a)
  else set.add(a)
  form.actions = [...set]
}

function save() {
  if (!form.nama) return
  const id = editing.value?.id ?? `role-${Date.now().toString(36)}`
  saveRole({
    id,
    nama: form.nama,
    deskripsi: form.deskripsi,
    resources: allModules.value ? '*' : form.resources,
    actions: form.actions,
    isSystem: editing.value?.isSystem,
  })
  modalOpen.value = false
  toast.add({ title: 'Peran disimpan', color: 'success' })
}

function remove(role: Role) {
  if (!confirm(`Hapus peran “${role.nama}”?`)) return
  removeRole(role.id)
  toast.add({ title: 'Peran dihapus', color: 'success' })
}

useHead({ title: 'Peran & Akses — Panel Admin' })
onMounted(() => load())
</script>
