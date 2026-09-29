<template>
  <AdminCrud
    resource="targetTahfidz"
    title="Target Hafalan"
    subtitle="Target hafalan per santri dengan progres"
    icon="i-lucide-target"
    title-key="santri"
    subtitle-key="targetSurah"
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
  { key: 'targetJuz', label: 'Target (Juz)', type: 'number', required: true },
  { key: 'capaianJuz', label: 'Capaian (Juz)', type: 'number' },
  { key: 'targetSurah', label: 'Cakupan', type: 'text', placeholder: 'Contoh: Juz 1-5' },
  { key: 'pembimbing', label: 'Pembimbing', type: 'text' },
  { key: 'periode', label: 'Periode', type: 'text', placeholder: '2026/2027' },
  { key: 'deadline', label: 'Target Selesai', type: 'date' },
  { key: 'status', label: 'Status', type: 'select', options: ['Berjalan', 'Tercapai', 'Terlambat'] },
  { key: 'catatan', label: 'Catatan', type: 'textarea' },
]

const metaKeys = [
  { key: 'capaianJuz', icon: 'i-lucide-bookmark', prefix: 'Capaian ' },
  { key: 'targetJuz', icon: 'i-lucide-target', prefix: '/ ' },
  { key: 'pembimbing', icon: 'i-lucide-user' },
  { key: 'deadline', icon: 'i-lucide-calendar' },
]

function badgeColor(row: any) { return color(row.status) }

function summaryFn(list: any[]): CrudSummaryItem[] {
  const target = list.reduce((t, r) => t + (Number(r.targetJuz) || 0), 0)
  const capai = list.reduce((t, r) => t + (Number(r.capaianJuz) || 0), 0)
  return [
    { label: 'Total Target', value: list.length, tone: 'primary' },
    { label: 'Total Juz Target', value: target },
    { label: 'Total Juz Capaian', value: capai, tone: 'green' },
    { label: 'Tercapai', value: list.filter(r => r.status === 'Tercapai').length, tone: 'green' },
  ]
}

useHead({ title: 'Target Hafalan — Panel Admin' })
</script>
