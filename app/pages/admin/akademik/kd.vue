<template>
  <AdminCrud
    resource="kd"
    title="Kompetensi Dasar"
    subtitle="Kompetensi dasar (KD) per mapel & kelas"
    icon="i-lucide-list-checks"
    title-key="kode"
    subtitle-key="deskripsi"
    badge-key="mapel"
    filter-key="mapel"
    :fields="fields"
    :meta-keys="metaKeys"
    :summary-fn="summaryFn"
  />
</template>

<script setup lang="ts">
import type { CrudField, CrudSummaryItem } from '~/components/AdminCrud.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const fields: CrudField[] = [
  { key: 'kode', label: 'Kode KD', type: 'text', required: true, placeholder: 'Contoh: KD-3.1' },
  { key: 'mapel', label: 'Mata Pelajaran', type: 'text', required: true },
  { key: 'kelas', label: 'Kelas', type: 'select', options: ['7', '8', '9', '10', '11', '12'] },
  { key: 'semester', label: 'Semester', type: 'select', options: ['Ganjil', 'Genap'] },
  { key: 'deskripsi', label: 'Rumusan Kompetensi', type: 'textarea', required: true },
  { key: 'kkm', label: 'KKM', type: 'number' },
  { key: 'aktif', label: 'Aktif', type: 'switch' },
]

const metaKeys = [
  { key: 'kelas', icon: 'i-lucide-layers', prefix: 'Kelas ' },
  { key: 'semester', icon: 'i-lucide-calendar' },
  { key: 'kkm', icon: 'i-lucide-target', prefix: 'KKM ' },
]

function summaryFn(list: any[]): CrudSummaryItem[] {
  const mapel = new Set(list.map(k => k.mapel).filter(Boolean))
  return [
    { label: 'Total KD', value: list.length, tone: 'primary' },
    { label: 'Mata Pelajaran', value: mapel.size },
    { label: 'Aktif', value: list.filter(k => k.aktif).length, tone: 'green' },
    { label: 'Rata KKM', value: list.length ? Math.round(list.reduce((t, k) => t + (Number(k.kkm) || 0), 0) / list.length) : 0 },
  ]
}

useHead({ title: 'Kompetensi Dasar — Panel Admin' })
</script>
