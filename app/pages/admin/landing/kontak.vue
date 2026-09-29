<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-extrabold">Pesan Kontak</h1>
        <p class="text-sm text-[var(--ink-muted)]">Pesan yang dikirim pengunjung melalui halaman kontak.</p>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold brand-text">{{ store.rows.value.length }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Total Pesan</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-amber-600 dark:text-amber-400">{{ baru }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Baru</p>
      </div>
    </div>

    <EmptyState v-if="!store.rows.value.length" icon="i-lucide-mail" title="Belum ada pesan" subtitle="Pesan dari pengunjung akan tampil di sini." />

    <div v-else class="space-y-2.5">
      <article v-for="m in store.rows.value" :key="m.id" class="card-soft p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="grid size-10 shrink-0 place-items-center rounded-2xl brand-soft text-xs font-extrabold">{{ inisial(m.nama) }}</div>
            <div>
              <p class="text-sm font-bold">{{ m.nama }}</p>
              <p class="text-[11px] text-[var(--ink-muted)]">{{ m.hp }} <span v-if="m.email">• {{ m.email }}</span></p>
            </div>
          </div>
          <UBadge size="xs" :color="color(m.status)" variant="soft">{{ m.status }}</UBadge>
        </div>
        <p class="mt-3 rounded-2xl bg-[var(--surface-muted)] p-3 text-sm leading-relaxed">{{ m.pesan }}</p>
        <div class="mt-3 flex gap-2">
          <UButton
            v-if="m.hp" size="xs" color="neutral" variant="soft" icon="i-lucide-message-circle"
            :to="`https://wa.me/${normalizeWa(m.hp)}`" target="_blank"
          >
            Balas via WA
          </UButton>
          <UButton
            v-if="m.status !== 'Selesai'" size="xs" color="neutral" variant="soft" icon="i-lucide-check"
            @click="markSelesai(m)"
          >
            Tandai Selesai
          </UButton>
          <UButton size="xs" color="error" variant="soft" icon="i-lucide-trash" aria-label="Hapus" @click="remove(m)" />
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from '~/composables/useAdminStore'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const store = useAdminStore('kontak')
const { inisial } = useFormat()
const { color } = useStatusColor()
const toast = useToast()

const baru = computed(() => store.rows.value.filter(m => m.status === 'Baru').length)

function normalizeWa(hp: string) {
  const digits = String(hp).replace(/[^0-9]/g, '')
  return digits.startsWith('0') ? `62${digits.slice(1)}` : digits
}

async function markSelesai(m: any) {
  await store.update(String(m.id), { status: 'Selesai' })
  toast.add({ title: 'Pesan ditandai selesai', color: 'success' })
}

async function remove(m: any) {
  if (!confirm(`Hapus pesan dari “${m.nama}”?`)) return
  await store.remove(String(m.id))
  toast.add({ title: 'Pesan dihapus', color: 'success' })
}

useHead({ title: 'Pesan Kontak — Panel Admin' })
onMounted(() => store.fetchAll())
</script>
