<template>
  <AdminCrud
    resource="penempatan"
    title="Penempatan Kamar"
    subtitle="Penempatan santri ke kamar asrama"
    icon="i-lucide-door-closed"
    title-key="santri"
    subtitle-key="asrama"
    badge-key="status"
    filter-key="asrama"
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
  { key: 'asrama', label: 'Asrama', type: 'text', required: true },
  { key: 'kamar', label: 'Nomor Kamar', type: 'text', placeholder: 'Contoh: A-01' },
  { key: 'bed', label: 'Nomor Bed', type: 'text' },
  { key: 'musyrif', label: 'Musyrif', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Pindah', 'Keluar'] },
  { key: 'tanggal', label: 'Tanggal Masuk', type: 'date' },
]

const metaKeys = [
  { key: 'kamar', icon: 'i-lucide-door-closed', prefix: 'Kamar ' },
  { key: 'bed', icon: 'i-lucide-bed', prefix: 'Bed ' },
  { key: 'musyrif', icon: 'i-lucide-user-check' },
]

function badgeColor(row: any) { return color(row.status) }

function summaryFn(list: any[]): CrudSummaryItem[] {
  const kamar = new Set(list.map(p => p.kamar).filter(Boolean))
  return [
    { label: 'Total Penempatan', value: list.length, tone: 'primary' },
    { label: 'Aktif', value: list.filter(p => p.status === 'Aktif').length, tone: 'green' },
    { label: 'Kamar Terpakai', value: kamar.size },
    { label: 'Keluar/Pindah', value: list.filter(p => p.status !== 'Aktif').length, tone: 'rose' },
  ]
}

useHead({ title: 'Penempatan Kamar — Panel Admin' })
</script>
