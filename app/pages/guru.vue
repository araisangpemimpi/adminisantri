<template>
  <div>
    <PageHeader title="Guru & Ustadz" subtitle="Pendidik dan pengasuh pesantren" icon="i-lucide-contact" />

    <div class="mt-5 space-y-2.5 px-4">
      <article v-for="item in list" :key="item.id" class="card-soft card-hover flex items-center gap-3.5 p-3.5">
        <div class="grid size-12 shrink-0 place-items-center rounded-2xl brand-soft text-sm font-extrabold">
          {{ inisial(item.nama) }}
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-bold">{{ item.nama }}</p>
          <p class="truncate text-xs text-[var(--ink-muted)]">{{ item.jabatan || item.mapel }}</p>
          <div class="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-[var(--ink-muted)]">
            <span v-if="item.mapel" class="flex items-center gap-1"><UIcon name="i-lucide-book-open" class="size-3" /> {{ item.mapel }}</span>
            <span v-if="item.hp" class="flex items-center gap-1"><UIcon name="i-lucide-phone" class="size-3" /> {{ item.hp }}</span>
          </div>
        </div>
        <UBadge v-if="item.status" size="xs" :color="color(item.status)" variant="soft">{{ item.status }}</UBadge>
      </article>

      <EmptyState v-if="!list.length" icon="i-lucide-contact" title="Belum ada data guru" subtitle="Data guru dan ustadz akan tampil di sini." />
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useAdminStore('guru')
const { inisial } = useFormat()
const { color } = useStatusColor()

const list = computed(() => store.rows.value.filter(r => r.status !== 'Tidak Aktif'))

useHead({ title: 'Guru & Ustadz' })
onMounted(() => store.fetchAll())
</script>
