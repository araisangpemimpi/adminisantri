<template>
  <AdminCrud
    resource="pembinaan"
    title="Pembinaan Santri"
    subtitle="Catatan pelanggaran & tindakan pembinaan"
    icon="i-lucide-shield-alert"
    title-key="santri"
    subtitle-key="jenis"
    badge-key="status"
    filter-key="kategori"
    initials-key="santri"
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
  { key: 'jenis', label: 'Bentuk Pelanggaran', type: 'text', required: true, placeholder: 'Contoh: Terlambat shalat berjamaah' },
  { key: 'kategori', label: 'Kategori', type: 'select', options: ['Ringan', 'Sedang', 'Berat'] },
  { key: 'poin', label: 'Poin Pelanggaran', type: 'number' },
  { key: 'tindakan', label: 'Tindakan Pembinaan', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: ['Dalam Pembinaan', 'Selesai'] },
  { key: 'pembina', label: 'Pembina', type: 'text' },
  { key: 'tanggal', label: 'Tanggal', type: 'date' },
  { key: 'catatan', label: 'Catatan', type: 'textarea' },
]

const metaKeys = [
  { key: 'kategori', icon: 'i-lucide-tag' },
  { key: 'poin', icon: 'i-lucide-triangle-alert', prefix: 'Poin ' },
  { key: 'pembina', icon: 'i-lucide-user-check' },
  { key: 'tanggal', icon: 'i-lucide-calendar' },
]

function badgeColor(row: any) { return color(row.status) }

function summaryFn(list: any[]): CrudSummaryItem[] {
  const poin = list.reduce((t, r) => t + (Number(r.poin) || 0), 0)
  return [
    { label: 'Total Catatan', value: list.length, tone: 'primary' },
    { label: 'Dalam Pembinaan', value: list.filter(r => r.status === 'Dalam Pembinaan').length, tone: 'amber' },
    { label: 'Selesai', value: list.filter(r => r.status === 'Selesai').length, tone: 'green' },
    { label: 'Total Poin', value: poin, tone: 'rose' },
  ]
}

useHead({ title: 'Pembinaan Santri — Panel Admin' })
</script>
