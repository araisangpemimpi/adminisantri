<template>
  <AdminCrud
    resource="transaksi"
    title="Riwayat Transaksi"
    subtitle="Seluruh mutasi keuangan santri"
    icon="i-lucide-arrow-left-right"
    title-key="nomor"
    subtitle-key="jenis"
    badge-key="arah"
    filter-key="jenis"
    :fields="fields"
    :meta-keys="metaKeys"
    :summary-fn="summaryFn"
    :badge-color="badgeColor"
  />
</template>

<script setup lang="ts">
import type { CrudField, CrudSummaryItem } from '~/components/AdminCrud.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { rupiah } = useFormat()

const fields: CrudField[] = [
  { key: 'nomor', label: 'Nomor Transaksi', type: 'text', placeholder: 'Otomatis bila kosong' },
  { key: 'santri', label: 'Nama Santri', type: 'text', required: true },
  { key: 'nis', label: 'NIS', type: 'text' },
  { key: 'jenis', label: 'Jenis Transaksi', type: 'select', options: ['Top-up Saldo', 'Pembayaran SPP', 'Uang Pangkal', 'Belanja Kantin', 'Pengembalian', 'Lainnya'] },
  { key: 'arah', label: 'Arah', type: 'select', options: ['Masuk', 'Keluar'] },
  { key: 'jumlah', label: 'Jumlah (Rp)', type: 'number', required: true },
  { key: 'metode', label: 'Metode', type: 'select', options: ['Transfer', 'Tunai', 'QRIS', 'WhatsApp', 'Saldo'] },
  { key: 'referensi', label: 'No. Referensi / Invoice', type: 'text' },
  { key: 'petugas', label: 'Petugas', type: 'text' },
  { key: 'tanggal', label: 'Tanggal', type: 'date' },
  { key: 'catatan', label: 'Catatan', type: 'textarea' },
]

const metaKeys = [
  { key: 'metode', icon: 'i-lucide-credit-card' },
  { key: 'referensi', icon: 'i-lucide-link' },
  { key: 'petugas', icon: 'i-lucide-user' },
]

function badgeColor(row: any) {
  return row.arah === 'Masuk' ? 'success' : 'warning'
}

function summaryFn(list: any[]): CrudSummaryItem[] {
  const masuk = list.filter(t => t.arah === 'Masuk').reduce((a, t) => a + (Number(t.jumlah) || 0), 0)
  const keluar = list.filter(t => t.arah === 'Keluar').reduce((a, t) => a + (Number(t.jumlah) || 0), 0)
  return [
    { label: 'Total Transaksi', value: list.length, tone: 'primary' },
    { label: 'Masuk', value: rupiah(masuk), tone: 'green' },
    { label: 'Keluar', value: rupiah(keluar), tone: 'amber' },
    { label: 'Selisih', value: rupiah(masuk - keluar), tone: 'primary' },
  ]
}

useHead({ title: 'Riwayat Transaksi — Panel Admin' })
</script>
