<template>
  <AdminCrud
    resource="mapel"
    title="Mata Pelajaran"
    subtitle="Kelola kurikulum & mata pelajaran"
    icon="i-lucide-book-open"
    title-key="nama"
    subtitle-key="pengampu"
    badge-key="kategori"
    filter-key="kategori"
    :fields="fields"
    :meta-keys="metaKeys"
    :summary-fn="summaryFn"
  />
</template>

<script setup lang="ts">
import type { CrudField, CrudSummaryItem } from '~/components/AdminCrud.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const fields: CrudField[] = [
  { key: 'nama', label: 'Nama Mata Pelajaran', type: 'text', required: true },
  { key: 'kategori', label: 'Kategori', type: 'select', options: ['Diniyah', 'Bahasa', 'Umum', 'Keterampilan'] },
  { key: 'jam', label: 'Jumlah Jam Pelajaran', type: 'number' },
  { key: 'pengampu', label: 'Guru Pengampu', type: 'text' },
  { key: 'aktif', label: 'Aktif', type: 'switch' },
]

const metaKeys = [
  { key: 'jam', icon: 'i-lucide-clock', prefix: 'JP: ' },
  { key: 'pengampu', icon: 'i-lucide-user' },
]

function summaryFn(list: any[]): CrudSummaryItem[] {
  const totalJam = list.reduce((sum, m) => sum + (Number(m.jam) || 0), 0)
  return [
    { label: 'Total Mapel', value: list.length, tone: 'primary' },
    { label: 'Total Jam', value: `${totalJam} JP` },
    { label: 'Diniyah', value: list.filter(m => m.kategori === 'Diniyah').length },
    { label: 'Aktif', value: list.filter(m => m.aktif).length, tone: 'green' },
  ]
}

useHead({ title: 'Mata Pelajaran — Panel Admin' })
</script>
