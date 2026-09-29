<template>
  <div>
    <PageHeader title="Mata Pelajaran" subtitle="Kurikulum pesantren" icon="i-lucide-book-open" />

    <div class="mt-5 px-4">
      <div v-for="kat in kategori" :key="kat.nama" class="mb-5">
        <p class="eyebrow mb-2">{{ kat.nama }}</p>
        <div class="space-y-2.5">
          <article v-for="item in kat.items" :key="item.id" class="card-soft card-accent p-4 pl-5">
            <div class="flex items-start justify-between gap-3">
              <p class="text-sm font-bold">{{ item.nama }}</p>
              <UBadge size="xs" color="neutral" variant="soft">{{ item.jam }} JP</UBadge>
            </div>
            <p v-if="item.pengampu" class="mt-1 flex items-center gap-1 text-xs text-[var(--ink-muted)]">
              <UIcon name="i-lucide-user" class="size-3" /> {{ item.pengampu }}
            </p>
          </article>
        </div>
      </div>

      <EmptyState v-if="!store.rows.value.length" icon="i-lucide-book-open" title="Belum ada mata pelajaran" subtitle="Data mapel akan tampil di sini." />
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useAdminStore('mapel')

const kategori = computed(() => {
  const groups = new Map<string, any[]>()
  for (const row of store.rows.value.filter(r => r.aktif !== false)) {
    const key = row.kategori || 'Umum'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(row)
  }
  return [...groups.entries()].map(([nama, items]) => ({ nama, items }))
})

useHead({ title: 'Mata Pelajaran' })
onMounted(() => store.fetchAll())
</script>
