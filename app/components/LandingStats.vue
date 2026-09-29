<template>
  <section class="px-4">
    <div class="card-soft grid grid-cols-4 divide-x divide-[var(--hairline)] overflow-hidden">
      <div v-for="s in items" :key="s.label" class="px-1.5 py-3.5 text-center">
        <p class="tabular text-xl font-extrabold brand-text">{{ s.value }}</p>
        <p class="mt-0.5 text-[10px] font-semibold leading-tight text-[var(--ink-muted)]">{{ s.label }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const santri = useAdminStore('santri').rows
const guru = useAdminStore('guru').rows
const rombel = useAdminStore('rombel').rows
const ekskulStore = useAdminStore('ekskul')

const items = computed(() => [
  { label: 'Santri', value: santri.value.length },
  { label: 'Guru', value: guru.value.length },
  { label: 'Rombel', value: rombel.value.length },
  { label: 'Ekskul', value: ekskulStore.rows.value.length },
])

onMounted(() => {
  for (const s of [useAdminStore('santri'), useAdminStore('guru'), useAdminStore('rombel'), ekskulStore]) s.fetchAll()
})
</script>
