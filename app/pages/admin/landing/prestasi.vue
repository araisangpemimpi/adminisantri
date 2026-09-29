<template>
  <AdminCrud
    resource="prestasi"
    title="Prestasi"
    subtitle="Kelola capaian santri"
    icon="i-lucide-trophy"
    title-key="judul"
    subtitle-key="nama"
    badge-key="tingkat"
    filter-key="tingkat"
    :fields="fields"
    :meta-keys="metaKeys"
    :summary-fn="summaryFn"
  />
</template>

<script setup lang="ts">
import type { CrudField, CrudSummaryItem } from '~/components/AdminCrud.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const fields: CrudField[] = [
  { key: 'judul', label: 'Judul Prestasi', type: 'text', required: true },
  { key: 'nama', label: 'Nama Peraih', type: 'text' },
  { key: 'tingkat', label: 'Tingkat', type: 'select', options: ['Pesantren', 'Kecamatan', 'Kabupaten', 'Provinsi', 'Nasional', 'Internasional'] },
  { key: 'kategori', label: 'Kategori', type: 'select', options: ['Tahfidz & Qira’at', 'Akademik', 'Olahraga', 'Seni', 'Bahasa'] },
  { key: 'tahun', label: 'Tahun', type: 'text' },
  { key: 'gambar', label: 'URL Gambar', type: 'image' },
  { key: 'deskripsi', label: 'Deskripsi', type: 'textarea' },
  { key: 'aktif', label: 'Tampilkan', type: 'switch' },
]

const metaKeys = [
  { key: 'nama', icon: 'i-lucide-user' },
  { key: 'tahun', icon: 'i-lucide-calendar' },
  { key: 'kategori', icon: 'i-lucide-tag' },
]

function summaryFn(list: any[]): CrudSummaryItem[] {
  return [
    { label: 'Total Prestasi', value: list.length, tone: 'primary' },
    { label: 'Nasional+', value: list.filter(p => ['Nasional', 'Internasional'].includes(p.tingkat)).length, tone: 'green' },
    { label: 'Provinsi', value: list.filter(p => p.tingkat === 'Provinsi').length },
    { label: 'Tampil', value: list.filter(p => p.aktif).length },
  ]
}

useHead({ title: 'Prestasi — Panel Admin' })
</script>
