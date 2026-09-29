<template>
  <AdminCrud
    resource="perizinan"
    title="Perizinan"
    subtitle="Kelola izin keluar, pulang & sakit santri"
    icon="i-lucide-file-check"
    title-key="santri"
    subtitle-key="alasan"
    badge-key="status"
    filter-key="jenis"
    :fields="fields"
    :meta-keys="metaKeys"
    :summary-fn="summaryFn"
    :badge-color="badgeColor"
  />
</template>

<script setup lang="ts">
import type { CrudField, CrudSummaryItem } from '~/components/AdminCrud.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { color } = useStatusColor()

const fields: CrudField[] = [
  { key: 'santri', label: 'Nama Santri', type: 'text', required: true },
  { key: 'rombel', label: 'Rombel', type: 'text' },
  { key: 'jenis', label: 'Jenis Izin', type: 'select', options: ['Pulang', 'Keluar', 'Sakit', 'Urusan Keluarga'] },
  { key: 'mulai', label: 'Tanggal Mulai', type: 'date' },
  { key: 'selesai', label: 'Tanggal Selesai', type: 'date' },
  { key: 'alasan', label: 'Alasan', type: 'textarea' },
  { key: 'status', label: 'Status', type: 'select', options: ['Menunggu', 'Disetujui', 'Ditolak', 'Selesai'] },
  { key: 'penanggungJawab', label: 'Penanggung Jawab', type: 'text' },
]

const metaKeys = [
  { key: 'jenis', icon: 'i-lucide-tag' },
  { key: 'mulai', icon: 'i-lucide-calendar' },
  { key: 'penanggungJawab', icon: 'i-lucide-user-check' },
]

function summaryFn(list: any[]): CrudSummaryItem[] {
  return [
    { label: 'Total Izin', value: list.length, tone: 'primary' },
    { label: 'Menunggu', value: list.filter(p => p.status === 'Menunggu').length, tone: 'amber' },
    { label: 'Disetujui', value: list.filter(p => p.status === 'Disetujui').length, tone: 'green' },
    { label: 'Ditolak', value: list.filter(p => p.status === 'Ditolak').length, tone: 'rose' },
  ]
}

function badgeColor(row: any) { return color(row.status) }

useHead({ title: 'Perizinan — Panel Admin' })
</script>
