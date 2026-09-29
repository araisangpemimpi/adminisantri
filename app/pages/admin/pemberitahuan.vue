<template>
  <AdminCrud
    resource="pemberitahuan"
    title="Pemberitahuan"
    subtitle="Pengumuman internal untuk santri & wali"
    icon="i-lucide-bell-ring"
    title-key="judul"
    subtitle-key="isi"
    badge-key="prioritas"
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

const fields: CrudField[] = [
  { key: 'judul', label: 'Judul Pemberitahuan', type: 'text', required: true },
  { key: 'isi', label: 'Isi Pemberitahuan', type: 'textarea', required: true },
  { key: 'kategori', label: 'Kategori', type: 'select', options: ['Umum', 'Akademik', 'Keuangan', 'Libur', 'Kegiatan', 'Kesehatan'] },
  { key: 'prioritas', label: 'Prioritas', type: 'select', options: ['Normal', 'Tinggi', 'Mendesak'] },
  { key: 'sasaran', label: 'Sasaran', type: 'select', options: ['Semua', 'Santri', 'Wali Santri', 'Guru'] },
  { key: 'tanggal', label: 'Tanggal', type: 'date' },
  { key: 'aktif', label: 'Aktif', type: 'switch' },
]

const metaKeys = [
  { key: 'sasaran', icon: 'i-lucide-users' },
  { key: 'kategori', icon: 'i-lucide-tag' },
  { key: 'tanggal', icon: 'i-lucide-calendar' },
]

function badgeColor(row: any) {
  const p = String(row.prioritas ?? '').toLowerCase()
  if (p === 'mendesak') return 'error'
  if (p === 'tinggi') return 'warning'
  return 'neutral'
}

function summaryFn(list: any[]): CrudSummaryItem[] {
  return [
    { label: 'Total', value: list.length, tone: 'primary' },
    { label: 'Aktif', value: list.filter(p => p.aktif).length, tone: 'green' },
    { label: 'Prioritas Tinggi', value: list.filter(p => p.prioritas === 'Tinggi').length, tone: 'amber' },
    { label: 'Mendesak', value: list.filter(p => p.prioritas === 'Mendesak').length, tone: 'rose' },
  ]
}

useHead({ title: 'Pemberitahuan — Panel Admin' })
</script>
