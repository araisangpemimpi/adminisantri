<template>
  <div>
    <PageHeader title="Prestasi Santri" subtitle="Capaian membanggakan" icon="i-lucide-trophy" />

    <div class="mt-5 px-4">
      <div class="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
        <button
          v-for="k in kategori" :key="k"
          class="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition"
          :class="filter === k ? 'brand-gradient text-white' : 'card-soft text-[var(--ink-muted)]'"
          @click="filter = k"
        >
          {{ k }}
        </button>
      </div>

      <div class="space-y-3">
        <article v-for="item in filtered" :key="item.id" class="card-soft card-hover overflow-hidden">
          <div class="relative h-40 w-full overflow-hidden bg-[var(--surface-muted)]">
            <img :src="item.gambar" :alt="item.judul" loading="lazy" class="size-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
            <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3.5">
              <UBadge size="xs" color="primary" variant="solid">{{ item.tingkat }}</UBadge>
              <span class="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">{{ item.tahun }}</span>
            </div>
          </div>
          <div class="p-4">
            <p class="text-sm font-bold leading-snug">{{ item.judul }}</p>
            <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--ink-muted)]">
              <span class="flex items-center gap-1"><UIcon name="i-lucide-user" class="size-3" /> {{ item.nama }}</span>
              <span class="flex items-center gap-1"><UIcon name="i-lucide-tag" class="size-3" /> {{ item.kategori }}</span>
            </div>
            <p class="mt-2 text-xs leading-relaxed text-[var(--ink-muted)]">{{ item.deskripsi }}</p>
          </div>
        </article>

        <EmptyState v-if="!filtered.length" icon="i-lucide-trophy" title="Belum ada prestasi" subtitle="Prestasi santri akan tampil di sini." />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useAdminStore('prestasi')
const filter = ref('Semua')

const kategori = computed(() => ['Semua', ...new Set(store.rows.value.map(r => r.kategori).filter(Boolean))])
const filtered = computed(() =>
  filter.value === 'Semua' ? store.rows.value : store.rows.value.filter(r => r.kategori === filter.value),
)

useHead({ title: 'Prestasi' })
onMounted(() => store.fetchAll())
</script>
