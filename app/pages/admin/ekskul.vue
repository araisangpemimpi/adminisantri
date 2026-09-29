<template>
  <AdminCrud
    resource="ekskul"
    title="Ekstrakurikuler"
    subtitle="Kelola kegiatan pengembangan diri"
    icon="i-lucide-medal"
    title-key="nama"
    subtitle-key="deskripsi"
    badge-key="hari"
    filter-key="hari"
    :fields="fields"
    :meta-keys="metaKeys"
    :summary-fn="summaryFn"
  />
</template>

<script setup lang="ts">
import type { CrudField, CrudSummaryItem } from '~/components/AdminCrud.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const fields: CrudField[] = [
  { key: 'nama', label: 'Nama Ekstrakurikuler', type: 'text', required: true },
  { key: 'deskripsi', label: 'Deskripsi', type: 'textarea' },
  { key: 'pembina', label: 'Pembina', type: 'text' },
  { key: 'hari', label: 'Hari', type: 'select', options: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Ahad'] },
  { key: 'jam', label: 'Waktu', type: 'text', placeholder: 'Contoh: 15.00–17.00' },
  { key: 'lokasi', label: 'Lokasi', type: 'text' },
  { key: 'ikon', label: 'Ikon (Lucide)', type: 'text', placeholder: 'i-lucide-medal', editHidden: false },
  { key: 'aktif', label: 'Aktif', type: 'switch' },
]

const metaKeys = [
  { key: 'jam', icon: 'i-lucide-clock' },
  { key: 'lokasi', icon: 'i-lucide-map-pin' },
  { key: 'pembina', icon: 'i-lucide-user-check' },
]

function summaryFn(list: any[]): CrudSummaryItem[] {
  return [
    { label: 'Total Ekskul', value: list.length, tone: 'primary' },
    { label: 'Aktif', value: list.filter(e => e.aktif).length, tone: 'green' },
    { label: 'Ada Pembina', value: list.filter(e => e.pembina).length },
    { label: 'Non-aktif', value: list.filter(e => !e.aktif).length, tone: 'rose' },
  ]
}

useHead({ title: 'Ekstrakurikuler — Panel Admin' })
</script>
