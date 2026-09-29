<template>
  <AdminCrud
    resource="rombel"
    title="Rombel"
    subtitle="Kelola rombongan belajar & asrama"
    icon="i-lucide-door-open"
    title-key="nama"
    subtitle-key="wali"
    badge-key="jenjang"
    filter-key="jenjang"
    :fields="fields"
    :meta-keys="metaKeys"
    :summary-fn="summaryFn"
  />
</template>

<script setup lang="ts">
import type { CrudField, CrudSummaryItem } from '~/components/AdminCrud.vue'
import { useAdminStore } from '~/composables/useAdminStore'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const fields: CrudField[] = [
  { key: 'nama', label: 'Nama Rombel', type: 'text', required: true, placeholder: 'Contoh: 7A' },
  { key: 'tingkat', label: 'Tingkat', type: 'select', options: ['7', '8', '9', '10', '11', '12'] },
  { key: 'jenjang', label: 'Jenjang', type: 'select', options: ['Tsanawiyah', 'Aliyah'] },
  { key: 'wali', label: 'Wali Kelas', type: 'text' },
  { key: 'kamar', label: 'Asrama', type: 'text' },
  { key: 'kapasitas', label: 'Kapasitas', type: 'number' },
  { key: 'aktif', label: 'Aktif', type: 'switch' },
]

const metaKeys = [
  { key: 'tingkat', icon: 'i-lucide-layers', prefix: 'Tingkat ' },
  { key: 'kamar', icon: 'i-lucide-bed-double' },
  { key: 'kapasitas', icon: 'i-lucide-users', prefix: 'Kapasitas ' },
]

function summaryFn(list: any[]): CrudSummaryItem[] {
  const santri = useAdminStore('santri').rows.value
  const totalKapasitas = list.reduce((sum, r) => sum + (Number(r.kapasitas) || 0), 0)
  return [
    { label: 'Total Rombel', value: list.length, tone: 'primary' },
    { label: 'Total Santri', value: santri.length },
    { label: 'Kapasitas', value: totalKapasitas },
    { label: 'Terisi', value: `${totalKapasitas ? Math.round((santri.length / totalKapasitas) * 100) : 0}%`, tone: 'green' },
  ]
}

useHead({ title: 'Rombel — Panel Admin' })

onMounted(() => useAdminStore('santri').fetchAll())
</script>
