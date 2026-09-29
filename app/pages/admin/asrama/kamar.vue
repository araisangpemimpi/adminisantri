<template>
  <div class="space-y-4">
    <AdminCrud
      resource="asrama"
      title="Asrama"
      subtitle="Kelola kamar, kapasitas & musyrif"
      icon="i-lucide-bed-double"
      title-key="nama"
      subtitle-key="musyrif"
      badge-key="jenis"
      filter-key="jenis"
      :fields="fields"
      :meta-keys="metaKeys"
      :summary-fn="summaryFn"
    />
  </div>
</template>

<script setup lang="ts">
import type { CrudField, CrudSummaryItem } from '~/components/AdminCrud.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const fields: CrudField[] = [
  { key: 'nama', label: 'Nama Asrama', type: 'text', required: true },
  { key: 'gedung', label: 'Gedung', type: 'text' },
  { key: 'jenis', label: 'Jenis', type: 'select', options: ['Putra', 'Putri'] },
  { key: 'kapasitas', label: 'Kapasitas', type: 'number' },
  { key: 'terisi', label: 'Terisi', type: 'number' },
  { key: 'kamar', label: 'Jumlah Kamar', type: 'number' },
  { key: 'musyrif', label: 'Musyrif / Pembina', type: 'text' },
  { key: 'fasilitas', label: 'Fasilitas', type: 'text' },
  { key: 'aktif', label: 'Aktif', type: 'switch' },
]

const metaKeys = [
  { key: 'gedung', icon: 'i-lucide-building-2' },
  { key: 'kamar', icon: 'i-lucide-door-closed', prefix: 'Kamar ' },
  { key: 'fasilitas', icon: 'i-lucide-sparkles' },
]

function summaryFn(list: any[]): CrudSummaryItem[] {
  const kapasitas = list.reduce((t, a) => t + (Number(a.kapasitas) || 0), 0)
  const terisi = list.reduce((t, a) => t + (Number(a.terisi) || 0), 0)
  const sisa = Math.max(0, kapasitas - terisi)
  return [
    { label: 'Total Asrama', value: list.length, tone: 'primary' },
    { label: 'Terisi', value: `${terisi}/${kapasitas}`, tone: 'green' },
    { label: 'Sisa Kamar', value: sisa, tone: 'amber' },
    { label: 'Okupansi', value: `${kapasitas ? Math.round((terisi / kapasitas) * 100) : 0}%` },
  ]
}

useHead({ title: 'Asrama — Panel Admin' })
</script>
