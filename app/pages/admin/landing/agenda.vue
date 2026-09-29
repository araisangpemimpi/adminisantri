<template>
  <AdminCrud
    resource="agenda"
    title="Agenda"
    subtitle="Kelola jadwal kegiatan"
    icon="i-lucide-calendar-days"
    title-key="judul"
    subtitle-key="lokasi"
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
  { key: 'judul', label: 'Judul Agenda', type: 'text', required: true },
  { key: 'tanggal', label: 'Tanggal', type: 'date', required: true },
  { key: 'jam', label: 'Waktu', type: 'time' },
  { key: 'lokasi', label: 'Lokasi', type: 'text' },
  { key: 'kategori', label: 'Kategori', type: 'select', options: ['Kajian', 'Lomba', 'Rapat', 'Acara', 'Libur'] },
]

const metaKeys = [
  { key: 'tanggal', icon: 'i-lucide-calendar' },
  { key: 'jam', icon: 'i-lucide-clock', prefix: 'Pukul ' },
]

function summaryFn(list: any[]): CrudSummaryItem[] {
  const now = Date.now()
  return [
    { label: 'Total Agenda', value: list.length, tone: 'primary' },
    { label: 'Akan Datang', value: list.filter(a => new Date(a.tanggal).getTime() >= now).length, tone: 'green' },
    { label: 'Sudah Lewat', value: list.filter(a => new Date(a.tanggal).getTime() < now).length },
    { label: 'Kajian', value: list.filter(a => a.kategori === 'Kajian').length },
  ]
}

useHead({ title: 'Agenda — Panel Admin' })
</script>
