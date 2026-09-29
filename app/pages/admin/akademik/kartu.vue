<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-extrabold">Kartu Santri</h1>
        <p class="text-sm text-[var(--ink-muted)]">Kartu identitas santri dengan QR code.</p>
      </div>
      <UButton icon="i-lucide-printer" :disabled="!terpilih.length" @click="cetak">
        Cetak ({{ terpilih.length }})
      </UButton>
    </div>

    <UInput v-model="q" placeholder="Cari nama atau NIS…" icon="i-lucide-search" class="w-full" />

    <div class="flex items-center justify-between">
      <p class="text-xs text-[var(--ink-muted)]">{{ filtered.length }} santri • {{ terpilih.length }} dipilih</p>
      <div class="flex gap-1.5">
        <UButton size="xs" color="neutral" variant="soft" @click="pilihSemua">Pilih semua</UButton>
        <UButton size="xs" color="neutral" variant="soft" :disabled="!terpilih.length" @click="terpilih = []">Kosongkan</UButton>
      </div>
    </div>

    <EmptyState v-if="!filtered.length" icon="i-lucide-id-card" title="Belum ada santri" subtitle="Tambahkan data santri terlebih dahulu." />

    <div v-else class="grid gap-3 sm:grid-cols-2">
      <label
        v-for="s in filtered" :key="s.id"
        class="card-soft flex cursor-pointer items-start gap-3 p-3.5 transition"
        :class="terpilih.includes(String(s.id)) ? 'ring-2 ring-[var(--brand-600)]' : ''"
      >
        <UCheckbox
          :model-value="terpilih.includes(String(s.id))"
          @update:model-value="() => toggle(String(s.id))"
        />
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-bold">{{ s.nama }}</p>
          <p class="text-xs text-[var(--ink-muted)]">{{ s.nis }} • {{ s.rombel }}</p>
          <p class="text-[11px] text-[var(--ink-muted)]">{{ s.kamar || 'Non-mukim' }}</p>
        </div>
        <img v-if="qrMap[String(s.id)]" :src="qrMap[String(s.id)]" alt="QR" class="size-14 shrink-0 rounded-lg border border-[var(--hairline)]">
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from '~/composables/useAdminStore'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const store = useAdminStore('santri')
const { toDataUrl, santriPayload } = useQr()
const toast = useToast()

const q = ref('')
const terpilih = ref<string[]>([])
const qrMap = reactive<Record<string, string>>({})

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  const list = store.rows.value.filter(s => s.status !== 'Tidak Aktif')
  if (!term) return list
  return list.filter(s => `${s.nama} ${s.nis} ${s.rombel}`.toLowerCase().includes(term))
})

function toggle(id: string) {
  const i = terpilih.value.indexOf(id)
  if (i >= 0) terpilih.value.splice(i, 1)
  else terpilih.value.push(id)
}

function pilihSemua() {
  terpilih.value = filtered.value.map(s => String(s.id))
}

function cetak() {
  if (!import.meta.client) return
  const data = store.rows.value.filter(s => terpilih.value.includes(String(s.id)))
  localStorage.setItem('pesantren-cetak-kartu', JSON.stringify(data))
  window.open('/cetak/kartu-santri', '_blank')
}

/** Buat QR untuk daftar yang tampil (dibatasi agar tetap ringan). */
async function generateQr() {
  for (const s of filtered.value.slice(0, 60)) {
    const id = String(s.id)
    if (qrMap[id]) continue
    qrMap[id] = await toDataUrl(santriPayload(s), { width: 160 })
  }
}

watch(filtered, () => { void generateQr() })

useHead({ title: 'Kartu Santri — Panel Admin' })
onMounted(async () => {
  await store.fetchAll()
  await generateQr()
})
</script>
