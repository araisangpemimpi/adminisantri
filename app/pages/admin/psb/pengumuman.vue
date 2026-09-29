<template>
  <AdminCrud
    resource="psbPengumuman"
    title="Pengumuman Hasil"
    subtitle="Publikasi hasil seleksi penerimaan santri"
    icon="i-lucide-megaphone"
    title-key="judul"
    subtitle-key="gelombang"
    badge-key="status"
    filter-key="status"
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
  { key: 'judul', label: 'Judul Pengumuman', type: 'text', required: true },
  { key: 'gelombang', label: 'Gelombang', type: 'select', options: ['Gelombang 1', 'Gelombang 2', 'Gelombang 3'] },
  { key: 'tahun', label: 'Tahun Ajaran', type: 'text', placeholder: '2026/2027' },
  { key: 'isi', label: 'Isi Pengumuman', type: 'textarea', required: true },
  { key: 'tanggalPengumuman', label: 'Tanggal Pengumuman', type: 'date' },
  { key: 'jumlahLulus', label: 'Jumlah Lulus', type: 'number' },
  { key: 'jumlahTidakLulus', label: 'Jumlah Tidak Lulus', type: 'number' },
  { key: 'status', label: 'Status', type: 'select', options: ['Draf', 'Terbit', 'Ditutup'] },
  { key: 'aktif', label: 'Tampilkan di halaman publik', type: 'switch' },
]

const metaKeys = [
  { key: 'gelombang', icon: 'i-lucide-layers' },
  { key: 'tanggalPengumuman', icon: 'i-lucide-calendar' },
  { key: 'jumlahLulus', icon: 'i-lucide-check', prefix: 'Lulus ' },
]

function badgeColor(row: any) { return color(row.status) }

function summaryFn(list: any[]): CrudSummaryItem[] {
  return [
    { label: 'Total Pengumuman', value: list.length, tone: 'primary' },
    { label: 'Terbit', value: list.filter(p => p.status === 'Terbit').length, tone: 'green' },
    { label: 'Draf', value: list.filter(p => p.status === 'Draf').length, tone: 'amber' },
    { label: 'Total Lulus', value: list.reduce((t, p) => t + (Number(p.jumlahLulus) || 0), 0) },
  ]
}

useHead({ title: 'Pengumuman Hasil PSB — Panel Admin' })
</script>
