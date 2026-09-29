<template>
  <AdminCrud
    resource="konseling"
    title="Konseling"
    subtitle="Catatan sesi konseling & pendampingan santri"
    icon="i-lucide-heart-handshake"
    title-key="santri"
    subtitle-key="ringkasan"
    badge-key="status"
    filter-key="jenis"
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
  { key: 'nis', label: 'NIS', type: 'text' },
  { key: 'rombel', label: 'Rombel', type: 'text' },
  { key: 'jenis', label: 'Jenis Konseling', type: 'select', options: ['Akademik', 'Pribadi', 'Sosial', 'Kedisiplinan', 'Karier'] },
  { key: 'konselor', label: 'Konselor / Pembimbing', type: 'text' },
  { key: 'tanggal', label: 'Tanggal Sesi', type: 'date' },
  { key: 'ringkasan', label: 'Ringkasan Masalah', type: 'textarea', required: true },
  { key: 'tindakLanjut', label: 'Tindak Lanjut', type: 'textarea' },
  { key: 'status', label: 'Status', type: 'select', options: ['Berlangsung', 'Selesai', 'Dirujuk'] },
  { key: 'rahasia', label: 'Bersifat Rahasia', type: 'switch' },
]

const metaKeys = [
  { key: 'jenis', icon: 'i-lucide-tag' },
  { key: 'konselor', icon: 'i-lucide-user-check' },
  { key: 'tanggal', icon: 'i-lucide-calendar' },
]

function badgeColor(row: any) { return color(row.status) }

function summaryFn(list: any[]): CrudSummaryItem[] {
  return [
    { label: 'Total Sesi', value: list.length, tone: 'primary' },
    { label: 'Berlangsung', value: list.filter(r => r.status === 'Berlangsung').length, tone: 'amber' },
    { label: 'Selesai', value: list.filter(r => r.status === 'Selesai').length, tone: 'green' },
    { label: 'Rahasia', value: list.filter(r => r.rahasia).length },
  ]
}

useHead({ title: 'Konseling — Panel Admin' })
</script>
