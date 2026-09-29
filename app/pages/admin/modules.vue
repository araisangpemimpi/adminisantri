<template>
  <div class="space-y-4">
    <!-- Hanya Super Admin -->
    <template v-if="!bolehAtur">
      <EmptyState
        icon="i-lucide-shield-x"
        title="Akses terbatas"
        subtitle="Hanya Super Admin yang dapat mengatur modul yang aktif."
      >
        <UButton to="/admin" icon="i-lucide-arrow-left" color="neutral" variant="soft" class="mt-1">Kembali ke Dashboard</UButton>
      </EmptyState>
    </template>

    <template v-else>
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 class="text-xl font-extrabold">Modul</h1>
          <p class="text-sm text-[var(--ink-muted)]">Aktifkan atau nonaktifkan kelompok modul pesantren.</p>
        </div>
        <UButton color="neutral" variant="soft" icon="i-lucide-rotate-ccw" @click="resetAll">Reset</UButton>
      </div>

      <UAlert color="warning" variant="soft" icon="i-lucide-shield-check" title="Khusus Super Admin">
        <template #description>
          Perubahan di sini memengaruhi sidebar <b>semua pengguna</b>. Administrator dan peran lain
          hanya dapat mengoperasikan modul, tidak mengubah daftar modul aktif.
        </template>
      </UAlert>

      <div class="space-y-3">
        <UCard v-for="m in modules" :key="m.id" :class="!m.aktif ? 'opacity-60' : ''">
          <template #header>
            <div class="flex items-center gap-3.5">
              <div
                class="grid size-11 shrink-0 place-items-center rounded-2xl"
                :class="m.aktif ? 'brand-gradient text-white' : 'bg-[var(--surface-muted)] text-[var(--ink-muted)]'"
              >
                <UIcon :name="m.ikon" class="size-5" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <p class="text-sm font-extrabold">{{ m.title }}</p>
                  <UBadge size="xs" :color="m.aktif ? 'primary' : 'neutral'" variant="soft">
                    {{ m.aktif ? 'Aktif' : 'Nonaktif' }}
                  </UBadge>
                  <UBadge v-if="m.wajib" size="xs" color="neutral" variant="soft">Wajib</UBadge>
                </div>
                <p class="mt-0.5 text-xs leading-relaxed text-[var(--ink-muted)]">{{ m.deskripsi }}</p>
              </div>
              <USwitch :model-value="m.aktif" :disabled="m.wajib" @update:model-value="v => ubahModul(m.id, !!v)" />
            </div>
          </template>

          <div class="flex flex-wrap gap-1.5">
            <UButton
              v-for="it in m.items" :key="it.to"
              size="xs" color="neutral" variant="soft" :icon="it.icon"
              :to="it.to" :disabled="!m.aktif"
            >
              {{ it.label }}
            </UButton>
          </div>
        </UCard>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { user } = useAuth()
const { bisa, load: loadAuthz } = useAuthz()
const { modules, load, setActiveJikaBoleh, reset } = useModules()
const toast = useToast()

/** Hanya pemegang kapabilitas 'modul' (Super Admin). */
const bolehAtur = computed(() => bisa(user.value, 'modul'))

function ubahModul(id: string, aktif: boolean) {
  if (!setActiveJikaBoleh(id, aktif, bolehAtur.value)) return
  const m = modules.value.find(x => x.id === id)
  toast.add({ title: `${m?.title ?? 'Modul'} ${aktif ? 'diaktifkan' : 'dinonaktifkan'}`, color: 'success' })
}

function resetAll() {
  if (!confirm('Kembalikan semua modul ke pengaturan awal?')) return
  reset()
  toast.add({ title: 'Modul direset', color: 'success' })
}

useHead({ title: 'Modul — Panel Admin' })
onMounted(() => {
  loadAuthz()
  load()
})
</script>
