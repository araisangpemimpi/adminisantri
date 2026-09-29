<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-extrabold">Tampilan Landing Page</h1>
        <p class="text-sm text-[var(--ink-muted)]">Pilih bagian mana yang ingin ditampilkan dan atur urutannya.</p>
      </div>
      <div class="flex gap-2">
        <UButton color="neutral" variant="soft" icon="i-lucide-rotate-ccw" @click="resetAll">Reset</UButton>
        <UButton to="/" target="_blank" icon="i-lucide-eye" trailing-icon="i-lucide-arrow-up-right">Pratinjau</UButton>
      </div>
    </div>

    <UAlert color="info" variant="soft" icon="i-lucide-info">
      <template #description>
        Urutan di bawah mengikuti urutan tampil di halaman depan. Hero Slider tidak dapat dimatikan
        karena merupakan bagian utama halaman.
      </template>
    </UAlert>

    <!-- Pratinjau susunan -->
    <div class="card-soft p-4">
      <p class="eyebrow mb-2.5">Susunan Tampil</p>
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="id in aktif" :key="id"
          class="rounded-full brand-soft px-2.5 py-1 text-[11px] font-semibold"
        >
          {{ nama(id) }}
        </span>
      </div>
    </div>

    <!-- Daftar bagian -->
    <div class="space-y-2.5">
      <div
        v-for="(s, i) in sections" :key="s.id"
        class="card-soft flex items-center gap-3 p-3.5 transition"
        :class="!s.aktif ? 'opacity-60' : ''"
      >
        <div class="grid size-10 shrink-0 place-items-center rounded-2xl" :class="s.aktif ? 'brand-soft' : 'bg-[var(--surface-muted)] text-[var(--ink-muted)]'">
          <UIcon :name="s.ikon" class="size-5" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="truncate text-sm font-bold">{{ s.nama }}</p>
            <UBadge v-if="s.wajib" size="xs" color="neutral" variant="soft">Wajib</UBadge>
          </div>
          <p class="truncate text-xs text-[var(--ink-muted)]">{{ s.deskripsi }}</p>
        </div>

        <!-- Atur urutan -->
        <div class="flex shrink-0 flex-col">
          <UButton
            size="xs" color="neutral" variant="ghost" icon="i-lucide-chevron-up" aria-label="Naikkan"
            :disabled="i === 0" @click="move(s.id, -1)"
          />
          <UButton
            size="xs" color="neutral" variant="ghost" icon="i-lucide-chevron-down" aria-label="Turunkan"
            :disabled="i === sections.length - 1" @click="move(s.id, 1)"
          />
        </div>

        <USwitch
          :model-value="s.aktif" :disabled="s.wajib"
          @update:model-value="v => toggle(s.id, !!v)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { sections, aktif, load, toggle, move, reset } = useLandingSections()
const toast = useToast()

function nama(id: string) {
  return sections.value.find(s => s.id === id)?.nama ?? id
}

function resetAll() {
  if (!confirm('Kembalikan susunan landing page ke pengaturan awal?')) return
  reset()
  toast.add({ title: 'Susunan direset', color: 'success' })
}

useHead({ title: 'Tampilan Landing Page — Panel Admin' })
onMounted(() => load())
</script>
