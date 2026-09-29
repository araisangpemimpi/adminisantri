<template>
  <AdminCrud
    resource="munaqosah"
    title="Ujian Munaqosah"
    subtitle="Ujian hafalan akhir & predikat"
    icon="i-lucide-graduation-cap"
    title-key="santri"
    subtitle-key="juz"
    badge-key="status"
    filter-key="status"
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
  { key: 'juz', label: 'Juz yang Diuji', type: 'text', required: true, placeholder: 'Contoh: Juz 1-5' },
  { key: 'penguji', label: 'Penguji', type: 'text' },
  { key: 'nilai', label: 'Nilai (0-100)', type: 'number' },
  { key: 'predikat', label: 'Predikat', type: 'select', options: ['Mumtaz', 'Jayyid Jiddan', 'Jayyid', 'Maqbul', 'Rasib'] },
  { key: 'status', label: 'Status', type: 'select', options: ['Lulus', 'Mengulang', 'Menunggu'] },
  { key: 'tanggal', label: 'Tanggal Ujian', type: 'date' },
  { key: 'catatan', label: 'Catatan Penguji', type: 'textarea' },
]

const metaKeys = [
  { key: 'penguji', icon: 'i-lucide-user-check' },
  { key: 'nilai', icon: 'i-lucide-star', prefix: 'Nilai ' },
  { key: 'tanggal', icon: 'i-lucide-calendar' },
]

function badgeColor(row: any) { return color(row.status) }

function summaryFn(list: any[]): CrudSummaryItem[] {
  const nilai = list.map(r => Number(r.nilai) || 0).filter(Boolean)
  return [
    { label: 'Total Ujian', value: list.length, tone: 'primary' },
    { label: 'Lulus', value: list.filter(r => r.status === 'Lulus').length, tone: 'green' },
    { label: 'Mengulang', value: list.filter(r => r.status === 'Mengulang').length, tone: 'rose' },
    { label: 'Rata Nilai', value: nilai.length ? (nilai.reduce((a, b) => a + b, 0) / nilai.length).toFixed(1) : '0' },
  ]
}

useHead({ title: 'Ujian Munaqosah — Panel Admin' })
</script>
