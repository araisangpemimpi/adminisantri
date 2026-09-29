<template>
  <AdminCrud
    resource="hero"
    title="Hero Slider"
    subtitle="Slide utama di halaman depan"
    icon="i-lucide-images"
    title-key="judul"
    subtitle-key="deskripsi"
    badge-key="badge"
    :fields="fields"
    :meta-keys="metaKeys"
    :summary-fn="summaryFn"
  />
</template>

<script setup lang="ts">
import type { CrudField, CrudSummaryItem } from '~/components/AdminCrud.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const fields: CrudField[] = [
  { key: 'judul', label: 'Judul Slide', type: 'text', required: true },
  { key: 'deskripsi', label: 'Deskripsi', type: 'textarea' },
  { key: 'gambar', label: 'URL Gambar', type: 'image' },
  { key: 'badge', label: 'Badge / Label', type: 'text', placeholder: 'Contoh: PSB' },
  { key: 'link', label: 'Tautan', type: 'text', placeholder: '/psb' },
  { key: 'urutan', label: 'Urutan Tampil', type: 'number' },
  { key: 'aktif', label: 'Aktif', type: 'switch' },
]

const metaKeys = [
  { key: 'link', icon: 'i-lucide-link' },
  { key: 'urutan', icon: 'i-lucide-list-ordered', prefix: 'Urutan ' },
]

function summaryFn(list: any[]): CrudSummaryItem[] {
  return [
    { label: 'Total Slide', value: list.length, tone: 'primary' },
    { label: 'Aktif', value: list.filter(s => s.aktif).length, tone: 'green' },
    { label: 'Non-aktif', value: list.filter(s => !s.aktif).length, tone: 'rose' },
  ]
}

useHead({ title: 'Hero Slider — Panel Admin' })
</script>
