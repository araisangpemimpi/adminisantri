<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-xl font-extrabold">Formulir Pendaftaran</h1>
      <p class="text-sm text-[var(--ink-muted)]">Atur field yang diminta pada formulir PSB publik.</p>
    </div>

    <UAlert color="info" variant="soft" icon="i-lucide-info">
      <template #description>
        Field bertanda <b>Wajib</b> tidak dapat dihapus. Anda dapat menambah field kustom
        dan menandai field mana yang diminta dari calon pendaftar.
      </template>
    </UAlert>

    <!-- Pengaturan umum -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-settings-2" class="size-4 brand-text" />
          <p class="text-sm font-extrabold">Pengaturan Umum</p>
        </div>
      </template>
      <div class="space-y-3">
        <UFormField label="Tahun Ajaran">
          <UInput v-model="config.tahun" class="w-full" />
        </UFormField>
        <div class="grid grid-cols-2 gap-3">
          <UFormField label="Gelombang Dibuka">
            <USelect v-model="config.gelombang" :items="['Gelombang 1', 'Gelombang 2', 'Gelombang 3']" class="w-full" />
          </UFormField>
          <UFormField label="Batas Pendaftaran">
            <UInput v-model="config.batas" type="date" class="w-full" />
          </UFormField>
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between rounded-2xl bg-[var(--surface-muted)] px-3.5 py-2.5">
            <span class="text-sm font-medium">Wajib unggah berkas syarat</span>
            <USwitch v-model="config.wajibBerkas" />
          </div>
          <div class="flex items-center justify-between rounded-2xl bg-[var(--surface-muted)] px-3.5 py-2.5">
            <span class="text-sm font-medium">Tampilkan nomor pendaftaran otomatis</span>
            <USwitch v-model="config.nomorOtomatis" />
          </div>
          <div class="flex items-center justify-between rounded-2xl bg-[var(--surface-muted)] px-3.5 py-2.5">
            <span class="text-sm font-medium">Formulir dibuka</span>
            <USwitch v-model="config.buka" />
          </div>
        </div>
      </div>
    </UCard>

    <!-- Field -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-list" class="size-4 brand-text" />
            <p class="text-sm font-extrabold">Field Formulir</p>
          </div>
          <UButton size="xs" icon="i-lucide-plus" @click="tambahField">Tambah Field</UButton>
        </div>
      </template>

      <div class="space-y-2.5">
        <div v-for="(f, i) in config.fields" :key="f.id" class="card-soft flex items-center gap-3 p-3.5">
          <div class="grid size-9 shrink-0 place-items-center rounded-xl brand-soft">
            <UIcon :name="f.ikon || 'i-lucide-type'" class="size-4" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <p class="truncate text-sm font-bold">{{ f.label }}</p>
              <UBadge v-if="f.wajib" size="xs" color="error" variant="soft">Wajib</UBadge>
              <UBadge v-if="f.bawaan" size="xs" color="neutral" variant="soft">Bawaan</UBadge>
            </div>
            <p class="truncate text-[11px] text-[var(--ink-muted)]">{{ f.kunci }} • {{ f.tipe }}</p>
          </div>
          <USwitch
            :model-value="f.aktif" :disabled="f.wajib"
            @update:model-value="v => toggleField(f, !!v)"
          />
          <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-chevron-up" aria-label="Naikkan" :disabled="i === 0" @click="move(i, -1)" />
          <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-chevron-down" aria-label="Turunkan" :disabled="i === config.fields.length - 1" @click="move(i, 1)" />
          <UButton v-if="!f.bawaan" size="xs" color="error" variant="soft" icon="i-lucide-trash" aria-label="Hapus" @click="hapusField(i)" />
        </div>
      </div>
    </UCard>

    <div class="flex gap-2">
      <UButton color="neutral" variant="soft" class="flex-1" icon="i-lucide-rotate-ccw" @click="resetConfig">Reset</UButton>
      <UButton class="flex-[2]" icon="i-lucide-save" @click="simpan">Simpan Pengaturan</UButton>
    </div>

    <UModal v-model:open="modalOpen" title="Tambah Field" scrollable>
      <template #body>
        <form class="space-y-4" @submit.prevent="simpanField">
          <UFormField label="Label Field" required>
            <UInput v-model="fieldBaru.label" placeholder="Contoh: Nomor KIP" icon="i-lucide-type" class="w-full" />
          </UFormField>
          <UFormField label="Tipe">
            <USelect v-model="fieldBaru.tipe" :items="['text', 'number', 'date', 'textarea']" class="w-full" />
          </UFormField>
          <UFormField label="Ikon (Lucide)">
            <UInput v-model="fieldBaru.ikon" placeholder="i-lucide-file" class="w-full" />
          </UFormField>
          <div class="flex items-center justify-between rounded-2xl bg-[var(--surface-muted)] px-3.5 py-2.5">
            <span class="text-sm font-medium">Field wajib diisi</span>
            <USwitch v-model="fieldBaru.wajib" />
          </div>
          <div class="flex gap-2 pt-1">
            <UButton type="button" color="neutral" variant="soft" class="flex-1" @click="modalOpen = false">Batal</UButton>
            <UButton type="submit" class="flex-[2]" icon="i-lucide-check">Tambah</UButton>
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { FormField } from '~/composables/usePsbForm'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { config, muat, simpan: simpanConfig, reset: resetStore } = usePsbForm()
const modalOpen = ref(false)
const fieldBaru = reactive({ label: '', tipe: 'text', ikon: 'i-lucide-file', wajib: false })
const toast = useToast()

function simpan() {
  simpanConfig()
  toast.add({ title: 'Pengaturan formulir disimpan', color: 'success' })
}

function resetConfig() {
  if (!confirm('Kembalikan pengaturan formulir ke awal?')) return
  resetStore()
  toast.add({ title: 'Pengaturan direset', color: 'success' })
}

function toggleField(f: FormField, on: boolean) {
  if (f.wajib) return
  f.aktif = on
}

function move(i: number, arah: -1 | 1) {
  const j = i + arah
  if (j < 0 || j >= config.value.fields.length) return
  const tmp = config.value.fields[i]!
  config.value.fields[i] = config.value.fields[j]!
  config.value.fields[j] = tmp
}

function tambahField() {
  Object.assign(fieldBaru, { label: '', tipe: 'text', ikon: 'i-lucide-file', wajib: false })
  modalOpen.value = true
}

function simpanField() {
  if (!fieldBaru.label.trim()) return
  const kunci = fieldBaru.label.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
  config.value.fields.push({
    id: `f-${Date.now().toString(36)}`,
    kunci,
    label: fieldBaru.label,
    tipe: fieldBaru.tipe,
    ikon: fieldBaru.ikon,
    wajib: fieldBaru.wajib,
    aktif: true,
  })
  modalOpen.value = false
}

function hapusField(i: number) {
  const f = config.value.fields[i]
  if (!f || f.bawaan) return
  if (!confirm(`Hapus field “${f.label}”?`)) return
  config.value.fields.splice(i, 1)
}

useHead({ title: 'Formulir PSB — Panel Admin' })
onMounted(() => muat())
</script>
