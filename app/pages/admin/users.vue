<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-extrabold">Pengguna</h1>
        <p class="text-sm text-[var(--ink-muted)]">Kelola akun yang dapat mengakses panel admin.</p>
      </div>
      <div class="flex gap-2">
        <UButton color="neutral" variant="soft" icon="i-lucide-shield-check" to="/admin/roles">Peran</UButton>
        <UButton icon="i-lucide-plus" @click="openCreate">Tambah Pengguna</UButton>
      </div>
    </div>

    <!-- Ringkasan -->
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold brand-text">{{ users.length }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Total Pengguna</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-green-600 dark:text-green-400">{{ aktifCount }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Aktif</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-cyan-600 dark:text-cyan-400">{{ roles.length }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Peran</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-amber-600 dark:text-amber-400">{{ adminCount }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Administrator</p>
      </div>
    </div>

    <UAlert color="info" variant="soft" icon="i-lucide-info" title="Password default">
      <template #description>
        Pengguna baru dapat masuk dengan password <b>{username}123</b> (contoh: <b>{{ (form.username || 'operator').toLowerCase() }}123</b>).
        Data pengguna disimpan lokal dan disinkronkan ke Supabase bila terkonfigurasi.
      </template>
    </UAlert>

    <UInput v-model="q" placeholder="Cari nama atau username…" icon="i-lucide-search" class="w-full" />

    <EmptyState v-if="!filtered.length" icon="i-lucide-users" title="Belum ada pengguna" subtitle="Tambahkan pengguna untuk memberi akses panel admin." />

    <div v-else class="space-y-2.5">
      <div v-for="u in filtered" :key="u.id" class="card-soft flex items-center gap-3.5 p-3.5">
        <div class="grid size-11 shrink-0 place-items-center rounded-2xl brand-soft text-sm font-extrabold">{{ inisial(u.nama) }}</div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="truncate text-sm font-bold">{{ u.nama }}</p>
            <UBadge v-if="u.aktif === false" size="xs" color="neutral" variant="soft">Nonaktif</UBadge>
          </div>
          <p class="truncate text-xs text-[var(--ink-muted)]">@{{ u.username }}</p>
        </div>
        <UBadge size="xs" color="neutral" variant="soft">{{ roleName(u.roleId) }}</UBadge>
        <div class="flex shrink-0 gap-1.5">
          <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-pencil" aria-label="Ubah" @click="openEdit(u)" />
          <UButton
            size="xs" color="error" variant="soft" icon="i-lucide-trash" aria-label="Hapus"
            :disabled="u.id === currentUser?.id" @click="remove(u)"
          />
        </div>
      </div>
    </div>

    <UModal v-model:open="modalOpen" :title="editing ? 'Ubah Pengguna' : 'Tambah Pengguna'" scrollable>
      <template #body>
        <form class="space-y-4" @submit.prevent="save">
          <UFormField label="Nama Lengkap" required>
            <UInput v-model="form.nama" icon="i-lucide-user" class="w-full" />
          </UFormField>
          <UFormField label="Username" required help="Dipakai untuk login. Tidak boleh sama.">
            <UInput v-model="form.username" icon="i-lucide-at-sign" class="w-full" />
          </UFormField>
          <UFormField label="Peran">
            <USelect v-model="form.roleId" :items="roleItems" icon="i-lucide-shield-check" class="w-full" />
          </UFormField>
          <UFormField label="Status">
            <div class="flex items-center justify-between rounded-2xl bg-[var(--surface-muted)] px-3.5 py-2.5">
              <span class="text-sm font-medium">Akun aktif</span>
              <USwitch v-model="form.aktif" />
            </div>
          </UFormField>
          <div class="flex gap-2 pt-1">
            <UButton type="button" color="neutral" variant="soft" class="flex-1" @click="modalOpen = false">Batal</UButton>
            <UButton type="submit" class="flex-[2]" icon="i-lucide-check" :loading="saving">Simpan</UButton>
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { user: currentUser } = useAuth()
const { roles, load: loadAuthz } = useAuthz()
const { inisial } = useFormat()
const toast = useToast()

const store = useAdminStore('users')
const users = store.rows

const q = ref('')
const modalOpen = ref(false)
const saving = ref(false)
const editing = ref<any | null>(null)
const form = reactive({ nama: '', username: '', roleId: 'operator', aktif: true })

const roleItems = computed(() => roles.value.map(r => ({ label: r.nama, value: r.id })))
function roleName(id: string) { return roles.value.find(r => r.id === id)?.nama ?? id }

const aktifCount = computed(() => users.value.filter(u => u.aktif !== false).length)
const adminCount = computed(() => users.value.filter(u => u.roleId === 'admin').length)

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return users.value
  return users.value.filter(u => `${u.nama} ${u.username} ${roleName(u.roleId)}`.toLowerCase().includes(term))
})

function openCreate() {
  editing.value = null
  Object.assign(form, { nama: '', username: '', roleId: 'operator', aktif: true })
  modalOpen.value = true
}

function openEdit(u: any) {
  editing.value = u
  Object.assign(form, {
    nama: u.nama, username: u.username, roleId: u.roleId, aktif: u.aktif !== false,
  })
  modalOpen.value = true
}

async function save() {
  if (!form.nama.trim() || !form.username.trim()) {
    toast.add({ title: 'Nama dan username wajib diisi', color: 'error' })
    return
  }
  const username = form.username.trim().toLowerCase()

  // Cegah duplikat username.
  const bentrok = users.value.find(u => u.username.toLowerCase() === username && u.id !== editing.value?.id)
  if (bentrok) {
    toast.add({ title: 'Username sudah dipakai', description: `“${username}” sudah digunakan pengguna lain.`, color: 'error' })
    return
  }

  saving.value = true
  try {
    if (editing.value) {
      await store.update(String(editing.value.id), { ...form, username })
      toast.add({ title: 'Pengguna diperbarui', color: 'success' })
    }
    else {
      await store.create({ ...form, username, password: `${username}123` })
      toast.add({ title: 'Pengguna ditambahkan', color: 'success' })
    }
    modalOpen.value = false
  }
  finally {
    saving.value = false
  }
}

async function remove(u: any) {
  if (!confirm(`Hapus pengguna “${u.nama}”?`)) return
  await store.remove(String(u.id))
  toast.add({ title: 'Pengguna dihapus', color: 'success' })
}

useHead({ title: 'Pengguna — Panel Admin' })
onMounted(() => {
  loadAuthz()
  store.fetchAll()
})
</script>
