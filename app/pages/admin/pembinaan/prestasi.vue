<template>
  <AdminCrud
    resource="prestasi_santri"
    title="Prestasi Santri"
    subtitle="Prestasi individu yang menambah poin sikap"
    icon="i-lucide-medal"
    title-key="judul"
    subtitle-key="santri"
    badge-key="tingkat"
    filter-key="kategori"
    initials-key="santri"
    :fields="fields"
    :meta-keys="metaKeys"
    :summary-fn="summaryFn"
  />
</template>

<script setup lang="ts">
import type { CrudField, CrudSummaryItem } from '~/components/AdminCrud.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const fields: CrudField[] = [
  { key: 'judul', label: 'Nama Prestasi', type: 'text', required: true },
  { key: 'santri', label: 'Nama Santri', type: 'text', required: true },
  { key: 'nis', label: 'NIS', type: 'text' },
  { key: 'rombel', label: 'Rombel', type: 'text' },
  { key: 'kategori', label: 'Kategori', type: 'select', options: ['Tahfidz', 'Akademik', 'Olahraga', 'Seni', 'Bahasa', 'Kepemimpinan'] },
  { key: 'tingkat', label: 'Tingkat', type: 'select', options: ['Pesantren', 'Kecamatan', 'Kabupaten', 'Provinsi', 'Nasional', 'Internasional'] },
  { key: 'poin', label: 'Poin Penghargaan', type: 'number', help: 'Poin positif yang mengurangi akumulasi poin pelanggaran.' },
  { key: 'tahun', label: 'Tahun', type: 'text' },
  { key: 'pemberi', label: 'Pemberi Penghargaan', type: 'text' },
  { key: 'tanggal', label: 'Tanggal', type: 'date' },
  { key: 'keterangan', label: 'Keterangan', type: 'textarea' },
]

const metaKeys = [
  { key: 'santri', icon: 'i-lucide-user' },
  { key: 'poin', icon: 'i-lucide-plus-circle', prefix: '+' },
  { key: 'pemberi', icon: 'i-lucide-award' },
  { key: 'tanggal', icon: 'i-lucide-calendar' },
]

function summaryFn(list: any[]): CrudSummaryItem[] {
  const poin = list.reduce((t, r) => t + (Number(r.poin) || 0), 0)
  return [
    { label: 'Total Prestasi', value: list.length, tone: 'primary' },
    { label: 'Poin Penghargaan', value: poin, tone: 'green' },
    { label: 'Nasional+', value: list.filter(r => ['Nasional', 'Internasional'].includes(r.tingkat)).length },
    { label: 'Tahfidz', value: list.filter(r => r.kategori === 'Tahfidz').length },
  ]
}

useHead({ title: 'Prestasi Santri — Panel Admin' })
</script>
