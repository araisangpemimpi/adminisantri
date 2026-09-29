<template>
  <AdminCrud
    resource="piket"
    title="Jadwal Piket"
    subtitle="Pembagian tugas piket asrama"
    icon="i-lucide-broom"
    title-key="petugas"
    subtitle-key="tugas"
    badge-key="hari"
    filter-key="asrama"
    :fields="fields"
    :meta-keys="metaKeys"
    :summary-fn="summaryFn"
  />
</template>

<script setup lang="ts">
import type { CrudField, CrudSummaryItem } from '~/components/AdminCrud.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const fields: CrudField[] = [
  { key: 'hari', label: 'Hari', type: 'select', options: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Ahad'], required: true },
  { key: 'asrama', label: 'Asrama', type: 'text' },
  { key: 'kamar', label: 'Kamar', type: 'text' },
  { key: 'petugas', label: 'Petugas', type: 'text', required: true, placeholder: 'Nama santri (pisahkan dengan koma)' },
  { key: 'tugas', label: 'Tugas', type: 'text', placeholder: 'Contoh: Sapu & pel ruang utama' },
  { key: 'pengawas', label: 'Pengawas / Musyrif', type: 'text' },
  { key: 'aktif', label: 'Aktif', type: 'switch' },
]

const metaKeys = [
  { key: 'asrama', icon: 'i-lucide-building-2' },
  { key: 'kamar', icon: 'i-lucide-door-closed' },
  { key: 'pengawas', icon: 'i-lucide-user-check' },
]

function summaryFn(list: any[]): CrudSummaryItem[] {
  const asrama = new Set(list.map(p => p.asrama).filter(Boolean))
  return [
    { label: 'Total Piket', value: list.length, tone: 'primary' },
    { label: 'Asrama', value: asrama.size },
    { label: 'Aktif', value: list.filter(p => p.aktif).length, tone: 'green' },
  ]
}

useHead({ title: 'Jadwal Piket — Panel Admin' })
</script>
