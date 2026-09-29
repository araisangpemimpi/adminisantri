<template>
  <AdminCrud
    resource="event"
    title="Event"
    subtitle="Kelola acara & kegiatan pesantren"
    icon="i-lucide-party-popper"
    title-key="nama"
    subtitle-key="lokasi"
    badge-key="status"
    filter-key="kategori"
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
const { tanggal } = useFormat()

const fields: CrudField[] = [
  { key: 'nama', label: 'Nama Event', type: 'text', required: true },
  { key: 'kategori', label: 'Kategori', type: 'select', options: ['Keagamaan', 'Akademik', 'Sosial', 'Olahraga', 'Seni'] },
  { key: 'tanggal', label: 'Tanggal', type: 'date' },
  { key: 'lokasi', label: 'Lokasi', type: 'text' },
  { key: 'penanggungJawab', label: 'Penanggung Jawab', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: ['Terjadwal', 'Berlangsung', 'Selesai', 'Batal'] },
  { key: 'deskripsi', label: 'Deskripsi', type: 'textarea' },
  { key: 'aktif', label: 'Tampilkan', type: 'switch' },
]

const metaKeys = [
  { key: 'tanggal', icon: 'i-lucide-calendar' },
  { key: 'penanggungJawab', icon: 'i-lucide-user-cog' },
]

function summaryFn(list: any[]): CrudSummaryItem[] {
  return [
    { label: 'Total Event', value: list.length, tone: 'primary' },
    { label: 'Terjadwal', value: list.filter(e => e.status === 'Terjadwal').length, tone: 'amber' },
    { label: 'Selesai', value: list.filter(e => e.status === 'Selesai').length, tone: 'green' },
    { label: 'Batal', value: list.filter(e => e.status === 'Batal').length, tone: 'rose' },
  ]
}

function badgeColor(row: any) { return color(row.status) }

useHead({ title: 'Event — Panel Admin' })
</script>
