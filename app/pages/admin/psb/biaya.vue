<template>
  <AdminCrud
    resource="biaya"
    title="Biaya Pendidikan"
    subtitle="Kelola rincian biaya PSB per jenjang"
    icon="i-lucide-receipt"
    title-key="komponen"
    subtitle-key="keterangan"
    badge-key="tipe"
    filter-key="jenjang"
    :fields="fields"
    :meta-keys="metaKeys"
    :summary-fn="summaryFn"
  />
</template>

<script setup lang="ts">
import type { CrudField, CrudSummaryItem } from '~/components/AdminCrud.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { rupiah } = useFormat()

const fields: CrudField[] = [
  { key: 'jenjang', label: 'Jenjang', type: 'select', options: ['Tsanawiyah', 'Aliyah'], required: true },
  { key: 'komponen', label: 'Komponen Biaya', type: 'text', required: true, placeholder: 'Contoh: Syahriah (SPP)' },
  { key: 'jumlah', label: 'Jumlah (Rp)', type: 'number', required: true },
  { key: 'tipe', label: 'Tipe Pembayaran', type: 'select', options: ['Sekali', 'Bulanan', 'Tahunan'] },
  { key: 'keterangan', label: 'Keterangan', type: 'text' },
  { key: 'urutan', label: 'Urutan Tampil', type: 'number' },
  { key: 'aktif', label: 'Tampilkan di halaman PSB', type: 'switch' },
]

const metaKeys = [
  { key: 'jenjang', icon: 'i-lucide-layers' },
  { key: 'urutan', icon: 'i-lucide-list-ordered', prefix: 'Urutan ' },
]

function summaryFn(list: any[]): CrudSummaryItem[] {
  const sum = (tipe: string) => list.filter(b => b.tipe === tipe).reduce((t, b) => t + (Number(b.jumlah) || 0), 0)
  return [
    { label: 'Total Komponen', value: list.length, tone: 'primary' },
    { label: 'Sekali Bayar', value: rupiah(sum('Sekali')), tone: 'green' },
    { label: 'Per Bulan', value: rupiah(sum('Bulanan')), tone: 'amber' },
    { label: 'Per Tahun', value: rupiah(sum('Tahunan')) },
  ]
}

useHead({ title: 'Biaya Pendidikan — Panel Admin' })
</script>
