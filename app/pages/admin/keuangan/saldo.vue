<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-extrabold">Saldo & Top-up</h1>
        <p class="text-sm text-[var(--ink-muted)]">Saldo santri untuk kantin & kebutuhan harian.</p>
      </div>
      <UButton icon="i-lucide-plus" @click="openTopup()">Top-up Saldo</UButton>
    </div>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold brand-text">{{ rupiah(totalSaldo) }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Total Saldo</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-green-600 dark:text-green-400">{{ aktifCount }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Santri Bersaldo</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-amber-600 dark:text-amber-400">{{ menipis }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Saldo Menipis</p>
      </div>
      <div class="card-soft p-3.5">
        <p class="tabular text-lg font-extrabold text-rose-600 dark:text-rose-400">{{ habis }}</p>
        <p class="text-[11px] font-semibold text-[var(--ink-muted)]">Saldo Habis</p>
      </div>
    </div>

    <UInput v-model="q" placeholder="Cari santri…" icon="i-lucide-search" class="w-full" />

    <EmptyState v-if="!filtered.length" icon="i-lucide-wallet" title="Belum ada saldo" subtitle="Buat saldo santri lewat top-up." />

    <div v-else class="space-y-2.5">
      <div v-for="s in filtered" :key="s.id" class="card-soft flex items-center gap-3.5 p-3.5">
        <div class="grid size-11 shrink-0 place-items-center rounded-2xl brand-soft text-xs font-extrabold">{{ inisial(s.santri) }}</div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-bold">{{ s.santri }}</p>
          <p class="truncate text-xs text-[var(--ink-muted)]">{{ s.rombel }} • {{ s.nis }}</p>
          <p class="mt-0.5 text-[11px] text-[var(--ink-muted)]">
            <UIcon name="i-lucide-clock" class="mr-0.5 inline size-3" />Terakhir {{ relatif(s.terakhir) }}
          </p>
        </div>
        <div class="shrink-0 text-right">
          <p class="tabular text-sm font-extrabold" :class="saldoColor(s.saldo)">{{ rupiah(s.saldo) }}</p>
          <UBadge size="xs" :color="saldoBadge(s.saldo)" variant="soft" class="mt-0.5">
            {{ (Number(s.saldo) || 0) <= 0 ? 'Habis' : (Number(s.saldo) < 100000 ? 'Menipis' : 'Cukup') }}
          </UBadge>
        </div>
        <div class="flex shrink-0 flex-col gap-1.5">
          <UButton size="xs" icon="i-lucide-plus" aria-label="Top-up" @click="openTopup(s)" />
          <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-message-circle" aria-label="Minta via WA" @click="mintaTopup(s)" />
        </div>
      </div>
    </div>

    <UModal v-model:open="modalOpen" title="Top-up Saldo" scrollable>
      <template #body>
        <form class="space-y-4" @submit.prevent="simpanTopup">
          <UFormField label="Santri" required>
            <USelect v-model="form.santri" :items="santriItems" icon="i-lucide-user" class="w-full" />
          </UFormField>
          <UFormField label="Jumlah Top-up (Rp)" required>
            <UInput v-model="form.jumlah" type="number" icon="i-lucide-banknote" class="w-full" />
          </UFormField>
          <div class="flex flex-wrap gap-1.5">
            <UButton v-for="n in [50000, 100000, 250000, 500000]" :key="n" size="xs" color="neutral" variant="soft" @click="form.jumlah = n">
              {{ rupiah(n) }}
            </UButton>
          </div>
          <UFormField label="Metode">
            <USelect v-model="form.metode" :items="['Transfer', 'Tunai', 'WhatsApp', 'QRIS']" class="w-full" />
          </UFormField>
          <UFormField label="Catatan">
            <UInput v-model="form.catatan" icon="i-lucide-pencil" class="w-full" />
          </UFormField>
          <UAlert v-if="saldoSekarang !== null" color="info" variant="soft">
            <template #description>
              Saldo saat ini <b>{{ rupiah(saldoSekarang) }}</b> →
              setelah top-up <b>{{ rupiah(saldoSekarang + (Number(form.jumlah) || 0)) }}</b>
            </template>
          </UAlert>
          <div class="flex gap-2 pt-1">
            <UButton type="button" color="neutral" variant="soft" class="flex-1" @click="modalOpen = false">Batal</UButton>
            <UButton type="submit" class="flex-[2]" icon="i-lucide-check">Top-up</UButton>
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from '~/composables/useAdminStore'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const store = useAdminStore('saldo')
const santriStore = useAdminStore('santri')
const transaksiStore = useAdminStore('transaksi')
const { settings, load: loadSettings } = useSiteSettings()
const { inisial, rupiah, tanggalRelatif } = useFormat()
const { nomorTransaksi } = useNumbering()
const toast = useToast()

const q = ref('')
const modalOpen = ref(false)
const form = reactive({ santri: '', jumlah: 100000, metode: 'Transfer', catatan: '' })

const santriItems = computed(() => santriStore.rows.value.map(s => s.nama))

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return store.rows.value
  return store.rows.value.filter(s => `${s.santri} ${s.rombel} ${s.nis}`.toLowerCase().includes(term))
})

const totalSaldo = computed(() => store.rows.value.reduce((t, s) => t + (Number(s.saldo) || 0), 0))
const aktifCount = computed(() => store.rows.value.filter(s => (Number(s.saldo) || 0) > 0).length)
const menipis = computed(() => store.rows.value.filter(s => (Number(s.saldo) || 0) > 0 && (Number(s.saldo) || 0) < 100000).length)
const habis = computed(() => store.rows.value.filter(s => (Number(s.saldo) || 0) <= 0).length)

const saldoSekarang = computed(() => {
  const s = store.rows.value.find(x => x.santri === form.santri)
  return s ? Number(s.saldo) || 0 : null
})

function relatif(v: unknown) { return tanggalRelatif(v) }

function saldoColor(v: unknown) {
  const n = Number(v) || 0
  if (n <= 0) return 'text-rose-600 dark:text-rose-400'
  if (n < 100000) return 'text-amber-600 dark:text-amber-400'
  return 'text-green-600 dark:text-green-400'
}
function saldoBadge(v: unknown) {
  const n = Number(v) || 0
  if (n <= 0) return 'error' as const
  if (n < 100000) return 'warning' as const
  return 'success' as const
}

function openTopup(s?: any) {
  Object.assign(form, { santri: s?.santri ?? santriItems.value[0] ?? '', jumlah: 100000, metode: 'Transfer', catatan: '' })
  modalOpen.value = true
}

async function simpanTopup() {
  const jumlah = Number(form.jumlah) || 0
  if (!form.santri || jumlah <= 0) {
    toast.add({ title: 'Santri dan jumlah wajib diisi', color: 'error' })
    return
  }
  const target = store.rows.value.find(x => x.santri === form.santri)
  const saldoBaru = (Number(target?.saldo) || 0) + jumlah
  const s = santriStore.rows.value.find(x => x.nama === form.santri)

  if (target) {
    await store.update(String(target.id), {
      saldo: saldoBaru,
      terakhir: new Date().toISOString().slice(0, 10),
      catatan: form.catatan || `Top-up via ${form.metode}`,
    })
  }
  else {
    await store.create({
      santri: form.santri,
      nis: s?.nis ?? '',
      rombel: s?.rombel ?? '',
      saldo: saldoBaru,
      terakhir: new Date().toISOString().slice(0, 10),
      catatan: form.catatan || `Top-up via ${form.metode}`,
    })
  }

  // Catat di riwayat transaksi.
  await transaksiStore.create({
    nomor: nomorTransaksi(transaksiStore.rows.value.map(t => String(t.nomor ?? ''))),
    santri: form.santri,
    nis: s?.nis ?? '',
    jenis: 'Top-up Saldo',
    arah: 'Masuk',
    jumlah,
    metode: form.metode,
    referensi: '',
    tanggal: new Date().toISOString().slice(0, 10),
    petugas: 'Bendahara Pondok',
    catatan: form.catatan,
  })

  toast.add({ title: 'Top-up berhasil', description: `${form.santri} • ${rupiah(saldoBaru)}`, color: 'success' })
  modalOpen.value = false
}

function mintaTopup(s: any) {
  const target = santriStore.rows.value.find(x => x.nama === s.santri)
  const nomor = String(target?.hp ?? '').replace(/[^0-9]/g, '')
  const wa = nomor.startsWith('0') ? `62${nomor.slice(1)}` : nomor
  const pesan = `Assalamualaikum,\n\nKami informasikan saldo santri berikut:\n\nNama: ${s.santri}\nRombel: ${s.rombel}\nSaldo saat ini: ${rupiah(s.saldo)}\n\nMohon melakukan top-up apabila diperlukan.\n\nTerima kasih.\n${settings.value.siteName}`
  window.open(`https://wa.me/${wa || settings.value.wa}?text=${encodeURIComponent(pesan)}`, '_blank')
}

useHead({ title: 'Saldo & Top-up — Panel Admin' })
onMounted(() => {
  store.fetchAll()
  santriStore.fetchAll()
  transaksiStore.fetchAll()
  loadSettings()
})
</script>
