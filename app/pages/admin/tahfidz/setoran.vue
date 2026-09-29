<template>
  <AdminCrud
    resource="tahfidz"
    title="Tahfidz"
    subtitle="Setoran & capaian hafalan santri"
    icon="i-lucide-book-open-check"
    title-key="santri"
    subtitle-key="surah"
    badge-key="nilai"
    filter-key="jenis"
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
  { key: 'rombel', label: 'Rombel', type: 'text' },
  { key: 'juz', label: 'Juz', type: 'text', placeholder: 'Contoh: Juz 1' },
  { key: 'surah', label: 'Surah / Ayat', type: 'text', placeholder: 'Contoh: Al-Baqarah 1-20' },
  { key: 'ayat', label: 'Jumlah Ayat', type: 'number' },
  { key: 'jenis', label: 'Jenis Setoran', type: 'select', options: ['Setoran Baru', 'Murojaah', 'Ujian'] },
  { key: 'nilai', label: 'Predikat', type: 'select', options: ['Mumtaz', 'Jayyid Jiddan', 'Jayyid', 'Maqbul', 'Rasib'] },
  { key: 'pengampu', label: 'Pengampu', type: 'text' },
  { key: 'tanggal', label: 'Tanggal', type: 'date' },
  { key: 'catatan', label: 'Catatan', type: 'textarea' },
]

const metaKeys = [
  { key: 'juz', icon: 'i-lucide-bookmark' },
  { key: 'jenis', icon: 'i-lucide-tag' },
  { key: 'ayat', icon: 'i-lucide-hash', prefix: 'Ayat ' },
  { key: 'pengampu', icon: 'i-lucide-user' },
]

function badgeColor(row: any) {
  const n = String(row.nilai ?? '').toLowerCase()
  if (n === 'mumtaz') return 'success'
  if (n === 'jayyid jiddan' || n === 'jayyid') return 'info'
  if (n === 'maqbul') return 'warning'
  if (n === 'rasib') return 'error'
  return 'neutral'
}

function summaryFn(list: any[]): CrudSummaryItem[] {
  const ayat = list.reduce((t, r) => t + (Number(r.ayat) || 0), 0)
  return [
    { label: 'Total Setoran', value: list.length, tone: 'primary' },
    { label: 'Total Ayat', value: ayat, tone: 'green' },
    { label: 'Mumtaz', value: list.filter(r => r.nilai === 'Mumtaz').length, tone: 'green' },
    { label: 'Perlu Perbaikan', value: list.filter(r => ['Maqbul', 'Rasib'].includes(r.nilai)).length, tone: 'rose' },
  ]
}

useHead({ title: 'Tahfidz — Panel Admin' })
</script>
