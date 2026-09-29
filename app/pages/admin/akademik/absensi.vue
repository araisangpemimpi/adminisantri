<template>
  <AdminCrud
    resource="absensi"
    title="Absensi"
    subtitle="Rekap kehadiran santri per sesi"
    icon="i-lucide-clipboard-check"
    title-key="rombel"
    subtitle-key="sesi"
    badge-key="tanggal"
    filter-key="sesi"
    :fields="fields"
    :meta-keys="metaKeys"
    :summary-fn="summaryFn"
  />
</template>

<script setup lang="ts">
import type { CrudField, CrudSummaryItem } from '~/components/AdminCrud.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const fields: CrudField[] = [
  { key: 'tanggal', label: 'Tanggal', type: 'date', required: true },
  { key: 'sesi', label: 'Sesi / Waktu', type: 'select', options: ['Subuh', 'Dhuha', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya', 'Kajian Pagi', 'Kajian Malam'] },
  { key: 'rombel', label: 'Rombel', type: 'text', required: true, placeholder: 'Contoh: 7A' },
  { key: 'hadir', label: 'Hadir', type: 'number' },
  { key: 'sakit', label: 'Sakit', type: 'number' },
  { key: 'izin', label: 'Izin', type: 'number' },
  { key: 'alpa', label: 'Alpa', type: 'number' },
  { key: 'pengampu', label: 'Pengampu / Musyrif', type: 'text' },
  { key: 'catatan', label: 'Catatan', type: 'textarea' },
]

const metaKeys = [
  { key: 'hadir', icon: 'i-lucide-circle-check', prefix: 'Hadir ' },
  { key: 'sakit', icon: 'i-lucide-thermometer', prefix: 'Sakit ' },
  { key: 'izin', icon: 'i-lucide-file-check', prefix: 'Izin ' },
  { key: 'alpa', icon: 'i-lucide-circle-x', prefix: 'Alpa ' },
  { key: 'pengampu', icon: 'i-lucide-user' },
]

function summaryFn(list: any[]): CrudSummaryItem[] {
  const sum = (key: string) => list.reduce((t, a) => t + (Number(a[key]) || 0), 0)
  const hadir = sum('hadir')
  const total = hadir + sum('sakit') + sum('izin') + sum('alpa')
  return [
    { label: 'Sesi Tercatat', value: list.length, tone: 'primary' },
    { label: 'Total Hadir', value: hadir, tone: 'green' },
    { label: 'Sakit/Izin', value: sum('sakit') + sum('izin'), tone: 'amber' },
    { label: 'Persentase', value: `${total ? Math.round((hadir / total) * 100) : 0}%` },
  ]
}

useHead({ title: 'Absensi — Panel Admin' })
</script>
