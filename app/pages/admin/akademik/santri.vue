<template>
  <AdminCrud
    resource="santri"
    title="Santri"
    subtitle="Kelola data santri pesantren"
    icon="i-lucide-users"
    title-key="nama"
    subtitle-key="nis"
    badge-key="status"
    initials-key="nama"
    filter-key="rombel"
    :fields="fields"
    :meta-keys="metaKeys"
    :summary-fn="summaryFn"
    :badge-color="badgeColor"
  />
</template>

<script setup lang="ts">
import type { CrudField, CrudSummaryItem } from '~/components/AdminCrud.vue'
import { useAdminStore } from '~/composables/useAdminStore'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { color } = useStatusColor()

const fields: CrudField[] = [
  { key: 'nama', label: 'Nama Lengkap', type: 'text', required: true },
  { key: 'nis', label: 'NIS', type: 'text', placeholder: 'Nomor induk santri' },
  { key: 'jk', label: 'Jenis Kelamin', type: 'select', options: ['L', 'P'] },
  { key: 'rombel', label: 'Rombel', type: 'text', placeholder: 'Contoh: 7A' },
  { key: 'kamar', label: 'Kamar / Asrama', type: 'text' },
  { key: 'wali', label: 'Nama Wali', type: 'text' },
  { key: 'hp', label: 'No. HP Wali', type: 'text' },
  { key: 'asal', label: 'Daerah Asal', type: 'text' },
  { key: 'tahunMasuk', label: 'Tahun Masuk', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Tidak Aktif', 'Lulus'] },
]

const metaKeys = [
  { key: 'rombel', icon: 'i-lucide-door-open', prefix: 'Rombel ' },
  { key: 'kamar', icon: 'i-lucide-bed-double' },
  { key: 'hp', icon: 'i-lucide-phone' },
]

function summaryFn(list: any[]): CrudSummaryItem[] {
  return [
    { label: 'Total Santri', value: list.length, tone: 'primary' },
    { label: 'Santri Putra', value: list.filter(s => s.jk === 'L').length },
    { label: 'Santri Putri', value: list.filter(s => s.jk === 'P').length },
    { label: 'Mukim', value: list.filter(s => s.kamar).length, tone: 'green' },
  ]
}

function badgeColor(row: any) { return color(row.status) }

useHead({ title: 'Santri — Panel Admin' })
</script>
