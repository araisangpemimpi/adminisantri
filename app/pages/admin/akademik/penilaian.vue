<template>
  <AdminCrud
    resource="penilaian"
    title="Penilaian KD"
    subtitle="Nilai santri per kompetensi dasar"
    icon="i-lucide-clipboard-list"
    title-key="santri"
    subtitle-key="mapel"
    badge-key="jenis"
    filter-key="mapel"
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

const fields: CrudField[] = [
  { key: 'santri', label: 'Nama Santri', type: 'text', required: true },
  { key: 'nis', label: 'NIS', type: 'text' },
  { key: 'rombel', label: 'Rombel', type: 'text' },
  { key: 'mapel', label: 'Mata Pelajaran', type: 'text', required: true },
  { key: 'kd', label: 'Kode KD', type: 'text', placeholder: 'Contoh: KD-3.1' },
  { key: 'jenis', label: 'Jenis Penilaian', type: 'select', options: ['Harian', 'Praktik', 'Tugas', 'UTS', 'UAS'] },
  { key: 'nilai', label: 'Nilai (0-100)', type: 'number', required: true },
  { key: 'semester', label: 'Semester', type: 'select', options: ['Ganjil', 'Genap'] },
  { key: 'guru', label: 'Guru Penilai', type: 'text' },
  { key: 'tanggal', label: 'Tanggal', type: 'date' },
]

const metaKeys = [
  { key: 'kd', icon: 'i-lucide-list-checks' },
  { key: 'semester', icon: 'i-lucide-calendar' },
  { key: 'guru', icon: 'i-lucide-user' },
]

function badgeColor(row: any) {
  const n = Number(row.nilai) || 0
  if (n >= 85) return 'success'
  if (n >= 75) return 'info'
  if (n >= 60) return 'warning'
  return 'error'
}

function summaryFn(list: any[]): CrudSummaryItem[] {
  const nilai = list.map(r => Number(r.nilai) || 0)
  const rata = nilai.length ? nilai.reduce((a, b) => a + b, 0) / nilai.length : 0
  return [
    { label: 'Total Nilai', value: list.length, tone: 'primary' },
    { label: 'Rata-rata', value: rata.toFixed(1), tone: 'green' },
    { label: 'Tuntas', value: list.filter(r => (Number(r.nilai) || 0) >= 75).length },
    { label: 'Belum Tuntas', value: list.filter(r => (Number(r.nilai) || 0) < 75).length, tone: 'rose' },
  ]
}

useHead({ title: 'Penilaian KD — Panel Admin' })
</script>
