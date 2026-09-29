<template>
  <AdminCrud
    resource="kelasParalel"
    title="Kelas Paralel"
    subtitle="Pembagian kelas paralel dalam satu rombel"
    icon="i-lucide-layers"
    title-key="nama"
    subtitle-key="wali"
    badge-key="program"
    filter-key="program"
    :fields="fields"
    :meta-keys="metaKeys"
    :summary-fn="summaryFn"
  />
</template>

<script setup lang="ts">
import type { CrudField, CrudSummaryItem } from '~/components/AdminCrud.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const fields: CrudField[] = [
  { key: 'nama', label: 'Nama Kelas Paralel', type: 'text', required: true, placeholder: 'Contoh: 7A-1' },
  { key: 'rombel', label: 'Rombel Induk', type: 'text', placeholder: 'Contoh: 7A' },
  { key: 'tingkat', label: 'Tingkat', type: 'select', options: ['7', '8', '9', '10', '11', '12'] },
  { key: 'program', label: 'Program', type: 'select', options: ['Reguler', 'Tahfidz', 'Sains', 'Bahasa'] },
  { key: 'ruang', label: 'Ruang', type: 'text' },
  { key: 'wali', label: 'Wali Kelas', type: 'text' },
  { key: 'jumlah', label: 'Jumlah Santri', type: 'number' },
  { key: 'kapasitas', label: 'Kapasitas', type: 'number' },
  { key: 'aktif', label: 'Aktif', type: 'switch' },
]

const metaKeys = [
  { key: 'rombel', icon: 'i-lucide-door-open', prefix: 'Rombel ' },
  { key: 'ruang', icon: 'i-lucide-map-pin' },
  { key: 'jumlah', icon: 'i-lucide-users', prefix: '' },
  { key: 'kapasitas', icon: 'i-lucide-gauge', prefix: '/ ' },
]

function summaryFn(list: any[]): CrudSummaryItem[] {
  const jumlah = list.reduce((t, k) => t + (Number(k.jumlah) || 0), 0)
  const kapasitas = list.reduce((t, k) => t + (Number(k.kapasitas) || 0), 0)
  return [
    { label: 'Total Kelas', value: list.length, tone: 'primary' },
    { label: 'Total Santri', value: jumlah },
    { label: 'Kapasitas', value: kapasitas },
    { label: 'Okupansi', value: `${kapasitas ? Math.round((jumlah / kapasitas) * 100) : 0}%`, tone: 'green' },
  ]
}

useHead({ title: 'Kelas Paralel — Panel Admin' })
</script>
