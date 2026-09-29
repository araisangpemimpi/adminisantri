<template>
  <div>
    <PageHeader title="Agenda Pesantren" subtitle="Jadwal kegiatan & acara" icon="i-lucide-calendar-days" />

    <div class="mt-5 px-4">
      <!-- Filter kategori -->
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
        <div
          v-for="item in filtered" :key="item.id"
          class="card-soft card-accent flex gap-3.5 p-4 pl-5"
        >
          <div class="grid size-14 shrink-0 place-items-center rounded-2xl brand-soft">
            <p class="text-lg font-extrabold leading-none">{{ day(item.tanggal) }}</p>
            <p class="text-[10px] font-bold uppercase">{{ month(item.tanggal) }}</p>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <UBadge size="xs" color="neutral" variant="soft">{{ item.kategori }}</UBadge>
              <span class="text-[11px] font-semibold brand-text">{{ relatif(item.tanggal) }}</span>
            </div>
            <p class="mt-1 text-sm font-bold leading-snug">{{ item.judul }}</p>
            <div class="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[var(--ink-muted)]">
              <span class="flex items-center gap-1"><UIcon name="i-lucide-clock" class="size-3" /> {{ item.jam }} WIB</span>
              <span class="flex items-center gap-1"><UIcon name="i-lucide-map-pin" class="size-3" /> {{ item.lokasi }}</span>
            </div>
          </div>
        </div>

        <EmptyState v-if="!filtered.length" icon="i-lucide-calendar-x" title="Belum ada agenda" subtitle="Agenda akan tampil di sini." />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useAdminStore('agenda')
const { tanggalRelatif, BULAN } = useFormat()
const filter = ref('Semua')

const kategori = computed(() => ['Semua', ...new Set(store.rows.value.map(r => r.kategori).filter(Boolean))])

const filtered = computed(() =>
  filter.value === 'Semua' ? store.rows.value : store.rows.value.filter(r => r.kategori === filter.value),
)

function day(v: unknown) {
  const d = new Date(String(v))
  return Number.isNaN(d.getTime()) ? '—' : d.getDate()
}
function month(v: unknown) {
  const d = new Date(String(v))
  return Number.isNaN(d.getTime()) ? '' : BULAN[d.getMonth()]?.slice(0, 3)
}
function relatif(v: unknown) { return tanggalRelatif(v) }

useHead({ title: 'Agenda' })
onMounted(() => store.fetchAll())
</script>
