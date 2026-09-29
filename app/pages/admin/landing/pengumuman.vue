<template>
  <AdminCrud
    resource="pengumuman"
    title="Pengumuman"
    subtitle="Kelola informasi resmi"
    icon="i-lucide-megaphone"
    title-key="judul"
    subtitle-key="isi"
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
  { key: 'judul', label: 'Judul Pengumuman', type: 'text', required: true },
  { key: 'isi', label: 'Isi Pengumuman', type: 'textarea', required: true },
  { key: 'tanggal', label: 'Tanggal', type: 'date' },
  { key: 'kategori', label: 'Kategori', type: 'select', options: ['Umum', 'Akademik', 'Keuangan', 'PSB'] },
  { key: 'penting', label: 'Tandai Penting', type: 'switch' },
]

const metaKeys = [
  { key: 'tanggal', icon: 'i-lucide-calendar' },
]

function summaryFn(list: any[]): CrudSummaryItem[] {
  return [
    { label: 'Total', value: list.length, tone: 'primary' },
    { label: 'Penting', value: list.filter(p => p.penting).length, tone: 'rose' },
    { label: 'Akademik', value: list.filter(p => p.kategori === 'Akademik').length },
    { label: 'Keuangan', value: list.filter(p => p.kategori === 'Keuangan').length },
  ]
}

useHead({ title: 'Pengumuman — Panel Admin' })
</script>
