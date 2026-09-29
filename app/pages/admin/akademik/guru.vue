<template>
  <AdminCrud
    resource="guru"
    title="Guru & Ustadz"
    subtitle="Kelola data pendidik dan pengasuh"
    icon="i-lucide-contact"
    title-key="nama"
    subtitle-key="jabatan"
    badge-key="status"
    initials-key="nama"
    filter-key="status"
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
  { key: 'nama', label: 'Nama Lengkap & Gelar', type: 'text', required: true },
  { key: 'nip', label: 'NIP / NUPTK', type: 'text' },
  { key: 'jabatan', label: 'Jabatan', type: 'text', placeholder: 'Contoh: Wali Kelas 7A' },
  { key: 'mapel', label: 'Mata Pelajaran', type: 'text' },
  { key: 'hp', label: 'No. HP', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Tidak Aktif'] },
]

const metaKeys = [
  { key: 'mapel', icon: 'i-lucide-book-open' },
  { key: 'nip', icon: 'i-lucide-id-card' },
  { key: 'hp', icon: 'i-lucide-phone' },
]

function summaryFn(list: any[]): CrudSummaryItem[] {
  return [
    { label: 'Total Guru', value: list.length, tone: 'primary' },
    { label: 'Aktif', value: list.filter(g => g.status === 'Aktif').length, tone: 'green' },
    { label: 'Punya NIP', value: list.filter(g => g.nip).length },
    { label: 'Non-aktif', value: list.filter(g => g.status === 'Tidak Aktif').length, tone: 'rose' },
  ]
}

function badgeColor(row: any) { return color(row.status) }

useHead({ title: 'Guru & Ustadz — Panel Admin' })
</script>
