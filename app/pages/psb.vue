<template>
  <div>
    <PageHeader title="Pendaftaran Santri Baru" :subtitle="`Tahun Ajaran ${tahunAjaran}`" icon="i-lucide-clipboard-list" />

    <StepTabs v-model="tab" :tabs="tabs" class="mt-5">
      <!-- ============================ TAB 1: INFORMASI ============================ -->
      <template #informasi>
        <div class="space-y-4 px-4 pt-4">
          <!-- Alur -->
          <div class="card-soft p-4">
            <p class="eyebrow mb-3">Alur Pendaftaran</p>
            <div class="space-y-3.5">
              <div v-for="(s, i) in alur" :key="i" class="flex gap-3">
                <div class="relative flex flex-col items-center">
                  <div class="grid size-7 shrink-0 place-items-center rounded-full brand-soft text-[11px] font-extrabold">{{ i + 1 }}</div>
                  <div v-if="i < alur.length - 1" class="mt-1 w-px flex-1 bg-[var(--hairline)]" />
                </div>
                <div class="pb-1">
                  <p class="text-xs font-bold">{{ s.judul }}</p>
                  <p class="text-[11px] leading-relaxed text-[var(--ink-muted)]">{{ s.detail }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Syarat -->
          <div class="card-soft p-4">
            <p class="eyebrow mb-3">Syarat Pendaftaran</p>
            <ul class="space-y-2.5">
              <li v-for="s in syarat" :key="s.judul" class="flex items-start gap-2.5">
                <UIcon name="i-lucide-check-circle-2" class="mt-0.5 size-4 shrink-0 text-[var(--brand-text)]" />
                <div>
                  <p class="text-xs font-semibold">{{ s.judul }}</p>
                  <p v-if="s.detail" class="text-[11px] text-[var(--ink-muted)]">{{ s.detail }}</p>
                </div>
              </li>
            </ul>
          </div>

          <!-- Catatan penting -->
          <div class="flex gap-3 rounded-2xl bg-amber-50 p-4 dark:bg-amber-500/10">
            <UIcon name="i-lucide-info" class="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p class="text-xs font-bold text-amber-800 dark:text-amber-300">Perlu diketahui</p>
              <p class="mt-0.5 text-[11px] leading-relaxed text-amber-700 dark:text-amber-300/90">
                Berkas asli dibawa saat daftar ulang. Pesantren menyediakan beasiswa bagi santri berprestasi
                dan bantuan bagi keluarga kurang mampu (lihat tab Biaya).
              </p>
            </div>
          </div>

          <!-- Bantuan WA -->
          <a
            :href="waLink('syarat pendaftaran')" target="_blank" rel="noopener"
            class="flex items-center gap-3 rounded-2xl bg-green-50 p-4 dark:bg-green-500/10"
          >
            <div class="grid size-10 place-items-center rounded-xl bg-green-500 text-white">
              <UIcon name="i-lucide-message-circle" class="size-5" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-bold">Ada pertanyaan?</p>
              <p class="text-xs text-[var(--ink-muted)]">Hubungi panitia PSB via WhatsApp</p>
            </div>
            <UIcon name="i-lucide-chevron-right" class="size-4 text-[var(--ink-muted)]" />
          </a>
        </div>
      </template>

      <!-- ============================ TAB 2: BIAYA ============================ -->
      <template #biaya>
        <div class="space-y-4 px-4 pt-4">
          <!-- Pilih jenjang -->
          <div class="flex gap-2">
            <button
              v-for="j in jenjangList" :key="j"
              class="flex-1 rounded-2xl border-2 p-3 text-center transition"
              :class="jenjang === j ? 'border-[var(--brand-600)] brand-soft' : 'border-[var(--hairline)]'"
              @click="jenjang = j"
            >
              <p class="text-sm font-extrabold">{{ j }}</p>
              <p class="text-[10px] text-[var(--ink-muted)]">{{ beasiswaInfo[j] }}</p>
            </button>
          </div>

          <!-- Rincian -->
          <div class="card-soft overflow-hidden">
            <div class="border-b border-[var(--hairline)] px-4 py-3">
              <p class="eyebrow">Rincian Biaya — {{ jenjang }}</p>
            </div>
            <div class="divide-y divide-[var(--hairline)]">
              <div v-for="b in biayaJenjang" :key="b.id" class="flex items-start gap-3 p-4">
                <div class="grid size-9 shrink-0 place-items-center rounded-xl brand-soft">
                  <UIcon :name="iconFor(b.tipe)" class="size-4" />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-2">
                    <p class="text-sm font-bold">{{ b.komponen }}</p>
                    <p class="tabular shrink-0 text-sm font-extrabold">{{ rupiah(b.jumlah) }}</p>
                  </div>
                  <div class="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <UBadge size="xs" color="neutral" variant="soft">{{ b.tipe }}</UBadge>
                    <p class="text-[11px] text-[var(--ink-muted)]">{{ b.keterangan }}</p>
                  </div>
                </div>
              </div>
              <p v-if="!biayaJenjang.length" class="p-6 text-center text-sm text-[var(--ink-muted)]">
                Rincian biaya belum tersedia.
              </p>
            </div>

            <!-- Total -->
            <div v-if="biayaJenjang.length" class="border-t border-[var(--hairline)] brand-gradient-soft p-4">
              <p class="text-[11px] font-bold uppercase tracking-wide text-[var(--ink-muted)]">Total Estimasi Tahun Pertama</p>
              <p class="tabular mt-1 text-2xl font-extrabold text-[var(--brand-text)]">{{ rupiah(totalTahunPertama) }}</p>
              <p class="mt-1 text-[11px] text-[var(--ink-muted)]">
                = biaya sekali bayar + syahriah 12 bulan + biaya tahunan
              </p>
            </div>
          </div>

          <!-- Beasiswa -->
          <div class="card-soft p-4">
            <p class="eyebrow mb-3">Keringanan & Beasiswa</p>
            <ul class="space-y-2.5">
              <li v-for="k in keringanan" :key="k.judul" class="flex items-start gap-2.5">
                <div class="grid size-8 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                  <UIcon :name="k.ikon" class="size-4" />
                </div>
                <div>
                  <p class="text-xs font-semibold">{{ k.judul }}</p>
                  <p class="text-[11px] text-[var(--ink-muted)]">{{ k.detail }}</p>
                </div>
              </li>
            </ul>
          </div>

          <div class="flex gap-3 rounded-2xl bg-[var(--surface-muted)] p-4">
            <UIcon name="i-lucide-wallet" class="mt-0.5 size-4 shrink-0 text-[var(--ink-muted)]" />
            <p class="text-[11px] leading-relaxed text-[var(--ink-muted)]">
              Pembayaran dapat dilakukan tunai di bendahara atau transfer ke rekening pesantren.
              Uang pangkal dapat diangsur hingga 3 kali. Kuitansi digital tersedia setelah pembayaran dikonfirmasi.
            </p>
          </div>

          <a
            :href="waLink('rincian biaya pendidikan')" target="_blank" rel="noopener"
            class="flex items-center gap-3 rounded-2xl bg-green-50 p-4 dark:bg-green-500/10"
          >
            <div class="grid size-10 place-items-center rounded-xl bg-green-500 text-white">
              <UIcon name="i-lucide-message-circle" class="size-5" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-bold">Konsultasi biaya</p>
              <p class="text-xs text-[var(--ink-muted)]">Tanyakan skema angsuran & beasiswa</p>
            </div>
            <UIcon name="i-lucide-chevron-right" class="size-4 text-[var(--ink-muted)]" />
          </a>
        </div>
      </template>

      <!-- ============================ TAB 3: FORMULIR ============================ -->
      <template #daftar>
        <div class="space-y-4 px-4 pt-4">
          <!-- Ringkasan pilihan -->
          <div class="card-soft flex items-center gap-3 p-3.5">
            <div class="grid size-10 shrink-0 place-items-center rounded-xl brand-soft">
              <UIcon name="i-lucide-clipboard-edit" class="size-5" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-bold">Formulir Pendaftaran</p>
              <p class="text-[11px] text-[var(--ink-muted)]">Jenjang {{ form.jenjang }} • {{ tahunAjaran }}</p>
            </div>
            <UButton size="xs" color="neutral" variant="soft" icon="i-lucide-receipt" @click="tab = 1">Lihat Biaya</UButton>
          </div>

          <!-- Info draf -->
          <div v-if="draftRestored" class="flex items-center gap-2.5 rounded-2xl bg-blue-50 p-3 dark:bg-blue-500/10">
            <UIcon name="i-lucide-history" class="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
            <p class="flex-1 text-[11px] text-blue-700 dark:text-blue-300">Draf isian Anda dipulihkan otomatis.</p>
            <UButton size="xs" color="neutral" variant="ghost" @click="resetDraft">Kosongkan</UButton>
          </div>

          <div class="card-soft p-4">
            <form class="space-y-3.5" @submit.prevent="submit">
              <UFormField label="Nama Lengkap" required>
                <UInput v-model="form.nama" placeholder="Nama calon santri" icon="i-lucide-user" class="w-full" />
              </UFormField>
              <div class="grid grid-cols-2 gap-3">
                <UFormField label="Jenis Kelamin">
                  <USelect v-model="form.jk" :items="['L', 'P']" icon="i-lucide-users" class="w-full" />
                </UFormField>
                <UFormField label="Jenjang">
                  <USelect v-model="form.jenjang" :items="jenjangList" class="w-full" />
                </UFormField>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <UFormField label="Tempat Lahir">
                  <UInput v-model="form.tempatLahir" placeholder="Kota" class="w-full" />
                </UFormField>
                <UFormField label="Tanggal Lahir">
                  <UInput v-model="form.tanggalLahir" type="date" class="w-full" />
                </UFormField>
              </div>
              <UFormField label="Asal Sekolah">
                <UInput v-model="form.asalSekolah" placeholder="SD/MI asal" icon="i-lucide-school" class="w-full" />
              </UFormField>
              <UFormField label="Nama Wali">
                <UInput v-model="form.wali" placeholder="Nama orang tua / wali" icon="i-lucide-users" class="w-full" />
              </UFormField>
              <UFormField label="No. WhatsApp Wali" required>
                <UInput v-model="form.hp" placeholder="08xxxxxxxxxx" icon="i-lucide-phone" class="w-full" />
              </UFormField>
              <UFormField label="Alamat Lengkap">
                <UTextarea v-model="form.alamat" placeholder="Alamat domisili" :rows="3" autoresize class="w-full" />
              </UFormField>

              <!-- Berkas syarat -->
              <UFormField v-if="config.wajibBerkas" label="Unggah Berkas Syarat" help="Pilih foto/scan dokumen. Format JPG/PNG.">
                <div class="space-y-2">
                  <div v-for="b in SYARAT_BERKAS" :key="b" class="flex items-center gap-2.5 rounded-2xl bg-[var(--surface-muted)] p-2.5">
                    <UCheckbox :model-value="berkasDipilih.includes(b)" @update:model-value="() => toggleBerkas(b)" />
                    <span class="flex-1 text-xs">{{ b }}</span>
                    <UBadge v-if="berkasDipilih.includes(b)" size="xs" color="success" variant="soft">Siap</UBadge>
                  </div>
                </div>
              </UFormField>

              <UAlert
                v-if="errors.length" color="error" variant="soft" icon="i-lucide-alert-circle"
                title="Lengkapi data berikut"
                :description="errors.join(', ')"
              />

              <UButton type="submit" block size="lg" icon="i-lucide-send" :loading="saving">Kirim Pendaftaran</UButton>
              <p class="text-center text-[10px] text-[var(--ink-muted)]">
                Dengan mengirim, Anda setuju dihubungi panitia melalui WhatsApp.
              </p>
            </form>
          </div>

          <!-- Hasil setelah kirim -->
          <div v-if="hasil" class="card-soft overflow-hidden">
            <div class="brand-gradient pattern-islamic p-5 text-center text-white">
              <UIcon name="i-lucide-check-circle-2" class="mx-auto size-10" />
              <p class="mt-2 text-base font-extrabold">Pendaftaran Terkirim!</p>
              <p class="mt-0.5 text-xs text-white/80">Simpan nomor & kode berikut untuk cek hasil.</p>
            </div>
            <div class="grid grid-cols-2 divide-x divide-[var(--hairline)]">
              <div class="p-4 text-center">
                <p class="text-[10px] font-bold uppercase text-[var(--ink-muted)]">No. Pendaftaran</p>
                <p class="tabular mt-1 text-sm font-extrabold brand-text">{{ hasil.noPendaftaran }}</p>
              </div>
              <div class="p-4 text-center">
                <p class="text-[10px] font-bold uppercase text-[var(--ink-muted)]">Kode Unik</p>
                <p class="tabular mt-1 text-sm font-extrabold brand-text">{{ hasil.kodeUnik }}</p>
              </div>
            </div>
            <div class="flex gap-2 border-t border-[var(--hairline)] p-3">
              <UButton size="sm" color="neutral" variant="soft" class="flex-1" icon="i-lucide-copy" @click="salinHasil">Salin</UButton>
              <UButton size="sm" class="flex-[2]" icon="i-lucide-search" @click="tab = 2">Cek Hasil Seleksi</UButton>
            </div>
          </div>
        </div>
      </template>

      <!-- ============================ TAB 4: CEK HASIL ============================ -->
      <template #hasil>
        <div class="space-y-4 px-4 pt-4">
          <div class="card-soft p-4">
            <p class="eyebrow mb-3">Cek Hasil Seleksi</p>
            <p class="mb-3 text-xs leading-relaxed text-[var(--ink-muted)]">
              Masukkan <b>Nomor Pendaftaran</b> dan <b>Kode Unik</b> yang Anda terima saat mendaftar.
            </p>
            <form class="space-y-3" @submit.prevent="cekHasil">
              <UFormField label="Nomor Pendaftaran">
                <UInput v-model="cek.nomor" placeholder="PSB-2026-0001" icon="i-lucide-hash" class="w-full" />
              </UFormField>
              <UFormField label="Kode Unik">
                <UInput v-model="cek.kode" placeholder="A7X9K2" icon="i-lucide-key-round" class="w-full uppercase" />
              </UFormField>
              <UButton type="submit" block icon="i-lucide-search">Cek Hasil</UButton>
            </form>
          </div>

          <!-- Hasil pencarian -->
          <div v-if="cekHasilData" class="card-soft overflow-hidden">
            <div
              class="p-5 text-center text-white"
              :class="cekHasilData.status === 'Diterima' ? 'bg-green-600' : cekHasilData.status === 'Ditolak' ? 'bg-rose-600' : 'brand-gradient'"
            >
              <UIcon
                :name="cekHasilData.status === 'Diterima' ? 'i-lucide-party-popper' : cekHasilData.status === 'Ditolak' ? 'i-lucide-circle-x' : 'i-lucide-clock'"
                class="mx-auto size-10"
              />
              <p class="mt-2 text-lg font-extrabold">{{ cekHasilData.status }}</p>
              <p class="mt-0.5 text-xs text-white/85">
                {{ cekHasilData.status === 'Diterima' ? 'Selamat! Anda dinyatakan diterima.' : cekHasilData.status === 'Menunggu' ? 'Pendaftaran Anda sedang diproses.' : 'Mohon maaf, Anda belum dapat diterima.' }}
              </p>
            </div>
            <div class="divide-y divide-[var(--hairline)]">
              <div class="flex justify-between p-3.5 text-xs">
                <span class="text-[var(--ink-muted)]">Nama</span>
                <span class="font-bold">{{ cekHasilData.nama }}</span>
              </div>
              <div class="flex justify-between p-3.5 text-xs">
                <span class="text-[var(--ink-muted)]">No. Pendaftaran</span>
                <span class="tabular font-bold">{{ cekHasilData.noPendaftaran }}</span>
              </div>
              <div class="flex justify-between p-3.5 text-xs">
                <span class="text-[var(--ink-muted)]">Jenjang</span>
                <span class="font-bold">{{ cekHasilData.jenjang }}</span>
              </div>
              <div v-if="cekHasilData.nilaiSeleksi" class="flex justify-between p-3.5 text-xs">
                <span class="text-[var(--ink-muted)]">Nilai Seleksi</span>
                <span class="tabular font-bold">{{ cekHasilData.nilaiSeleksi }}</span>
              </div>
            </div>
          </div>

          <!-- Tidak ditemukan -->
          <div v-else-if="cekSudah" class="flex gap-3 rounded-2xl bg-amber-50 p-4 dark:bg-amber-500/10">
            <UIcon name="i-lucide-search-x" class="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p class="text-xs font-bold text-amber-800 dark:text-amber-300">Data tidak ditemukan</p>
              <p class="mt-0.5 text-[11px] text-amber-700 dark:text-amber-300/90">
                Periksa kembali nomor pendaftaran dan kode unik Anda, atau hubungi panitia PSB.
              </p>
            </div>
          </div>

          <!-- Pengumuman resmi -->
          <div v-if="pengumumanAktif.length" class="card-soft p-4">
            <p class="eyebrow mb-3">Pengumuman Resmi</p>
            <div class="space-y-2.5">
              <div v-for="p in pengumumanAktif" :key="p.id" class="rounded-2xl bg-[var(--surface-muted)] p-3.5">
                <div class="flex items-center gap-2">
                  <UBadge size="xs" color="primary" variant="soft">{{ p.gelombang }}</UBadge>
                  <span class="text-[11px] text-[var(--ink-muted)]">{{ tanggalSingkat(p.tanggalPengumuman) }}</span>
                </div>
                <p class="mt-1.5 text-sm font-bold">{{ p.judul }}</p>
                <p class="mt-1 text-xs leading-relaxed text-[var(--ink-muted)]">{{ p.isi }}</p>
              </div>
            </div>
          </div>

          <a
            :href="waLink('hasil seleksi')" target="_blank" rel="noopener"
            class="flex items-center gap-3 rounded-2xl bg-green-50 p-4 dark:bg-green-500/10"
          >
            <div class="grid size-10 place-items-center rounded-xl bg-green-500 text-white">
              <UIcon name="i-lucide-message-circle" class="size-5" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-bold">Butuh bantuan?</p>
              <p class="text-xs text-[var(--ink-muted)]">Hubungi panitia PSB via WhatsApp</p>
            </div>
            <UIcon name="i-lucide-chevron-right" class="size-4 text-[var(--ink-muted)]" />
          </a>
        </div>
      </template>

      <!-- Tombol aksi di tab terakhir -->
      <template #actions>
        <UButton type="button" block size="lg" icon="i-lucide-search" @click="tab = 3">
          Cek Hasil Seleksi
        </UButton>
      </template>
    </StepTabs>
  </div>
</template>

<script setup lang="ts">
import type { FormField } from '~/composables/usePsbForm'

const store = useAdminStore('psb')
const biayaStore = useAdminStore('biaya')
const pengumumanStore = useAdminStore('psbPengumuman')
const santriStore = useAdminStore('santri')
const { config, muat: muatConfig } = usePsbForm()
const { settings, load } = useSiteSettings()
const { rupiah, tanggalSingkat } = useFormat()
const { nomorPendaftaran, kodeUnik } = useNumbering()
const toast = useToast()

const tahunAjaran = `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`
const saving = ref(false)
const errors = ref<string[]>([])
const tab = ref(0)
const visited = reactive<Record<number, boolean>>({ 0: true })

const SYARAT_BERKAS = ['Akta Kelahiran', 'Kartu Keluarga', 'Ijazah/SKL', 'Pas Foto 3x4', 'Surat Sehat', 'Rapor']

const hasil = ref<{ noPendaftaran: string, kodeUnik: string } | null>(null)
const berkasDipilih = ref<string[]>([])

const cek = reactive({ nomor: '', kode: '' })
const cekSudah = ref(false)
const cekHasilData = ref<any | null>(null)

const tabs = computed(() => [
  { key: 'informasi', label: 'Informasi', done: visited[0] },
  { key: 'biaya', label: 'Biaya', done: visited[1] },
  { key: 'daftar', label: 'Formulir', done: !!hasil.value },
  { key: 'hasil', label: 'Cek Hasil', done: false },
])

watch(tab, (t) => {
  visited[t] = true
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
})

/** Field formulir yang aktif sesuai pengaturan admin. */
const fieldAktif = computed(() =>
  config.value.fields.filter(f => f.aktif).map(f => f.kunci),
)

const pengumumanAktif = computed(() =>
  pengumumanStore.rows.value.filter(p => p.aktif && p.status === 'Terbit'),
)

function toggleBerkas(b: string) {
  const i = berkasDipilih.value.indexOf(b)
  if (i >= 0) berkasDipilih.value.splice(i, 1)
  else berkasDipilih.value.push(b)
}

function salinHasil() {
  if (!hasil.value) return
  const teks = `No. Pendaftaran: ${hasil.value.noPendaftaran}\nKode Unik: ${hasil.value.kodeUnik}`
  void navigator.clipboard?.writeText(teks)
  toast.add({ title: 'Disalin ke papan klip', color: 'success' })
}

function cekHasil() {
  cekSudah.value = true
  const nomor = cek.nomor.trim().toUpperCase()
  const kode = cek.kode.trim().toUpperCase()
  const found = store.rows.value.find(p =>
    String(p.noPendaftaran ?? '').toUpperCase() === nomor
    && String(p.kodeUnik ?? '').toUpperCase() === kode,
  )
  cekHasilData.value = found ?? null
  if (found) toast.add({ title: 'Data ditemukan', color: 'success' })
}

const alur = [
  { judul: 'Isi formulir online', detail: 'Lengkapi data calon santri pada tab Formulir.' },
  { judul: 'Verifikasi berkas', detail: 'Panitia menghubungi wali untuk verifikasi dokumen.' },
  { judul: 'Tes seleksi', detail: 'Tes baca Al-Qur’an dan wawancara singkat.' },
  { judul: 'Pengumuman & daftar ulang', detail: 'Hasil seleksi diumumkan via WhatsApp.' },
]

const syarat = [
  { judul: 'Akta kelahiran & kartu keluarga', detail: 'Fotokopi, masing-masing 1 lembar.' },
  { judul: 'Ijazah / SKL sekolah sebelumnya', detail: 'Fotokopi yang dilegalisir.' },
  { judul: 'Pas foto 3x4', detail: 'Berwarna, sebanyak 4 lembar.' },
  { judul: 'Surat keterangan sehat', detail: 'Dari dokter atau puskesmas.' },
  { judul: 'Rapor 2 semester terakhir', detail: 'Untuk calon santri pindahan.' },
]

/* ---------------- Biaya ---------------- */
const jenjangList = ['Tsanawiyah', 'Aliyah']
const jenjang = ref('Tsanawiyah')

const beasiswaInfo: Record<string, string> = {
  Tsanawiyah: 'Beasiswa tersedia',
  Aliyah: 'Beasiswa tersedia',
}

const biayaJenjang = computed(() =>
  biayaStore.rows.value
    .filter(b => b.jenjang === jenjang.value && b.aktif !== false)
    .sort((a, b) => (Number(a.urutan) || 0) - (Number(b.urutan) || 0)),
)

const totalTahunPertama = computed(() => {
  const once = biayaJenjang.value.filter(b => b.tipe === 'Sekali').reduce((t, b) => t + (Number(b.jumlah) || 0), 0)
  const monthly = biayaJenjang.value.find(b => b.tipe === 'Bulanan')
  const yearly = biayaJenjang.value.filter(b => b.tipe === 'Tahunan').reduce((t, b) => t + (Number(b.jumlah) || 0), 0)
  return once + (Number(monthly?.jumlah) || 0) * 12 + yearly
})

function iconFor(tipe: string) {
  if (tipe === 'Bulanan') return 'i-lucide-calendar-days'
  if (tipe === 'Tahunan') return 'i-lucide-repeat'
  return 'i-lucide-circle-dollar-sign'
}

const keringanan = [
  { ikon: 'i-lucide-award', judul: 'Beasiswa Prestasi', detail: 'Diskon hingga 100% uang pangkal untuk hafidz & juara lomba.' },
  { ikon: 'i-lucide-users', judul: 'Diskon Saudara Kandung', detail: 'Potongan syahriah 15% untuk anak kedua dan seterusnya.' },
  { ikon: 'i-lucide-heart-handshake', judul: 'Bantuan Yatim & Dhuafa', detail: 'Keringanan biaya bagi keluarga kurang mampu.' },
  { ikon: 'i-lucide-calendar-check', judul: 'Angsuran Uang Pangkal', detail: 'Dapat diangsur hingga 3 kali tanpa bunga.' },
]

/* ---------------- Formulir + draf otomatis ---------------- */
const DRAFT_KEY = 'pesantren-psb-draft'
const draftRestored = ref(false)

const empty = () => ({
  nama: '', jk: 'L', jenjang: 'Tsanawiyah', tempatLahir: '', tanggalLahir: '',
  asalSekolah: '', wali: '', hp: '', alamat: '',
})
const form = reactive(empty())

function saveDraft() {
  if (!import.meta.client) return
  const hasData = Object.entries(form).some(([k, v]) => k !== 'jk' && k !== 'jenjang' && String(v).trim())
  try {
    if (hasData) localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
    else localStorage.removeItem(DRAFT_KEY)
  }
  catch { /* abaikan */ }
}

function restoreDraft() {
  if (!import.meta.client) return
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return
    Object.assign(form, JSON.parse(raw))
    draftRestored.value = true
  }
  catch { /* abaikan */ }
}

function resetDraft() {
  Object.assign(form, empty())
  draftRestored.value = false
  if (import.meta.client) localStorage.removeItem(DRAFT_KEY)
}

watch(form, saveDraft, { deep: true })

async function submit() {
  errors.value = []
  // Validasi mengikuti field wajib yang aktif di pengaturan.
  for (const f of config.value.fields.filter(x => x.aktif && x.wajib)) {
    const v = String((form as any)[f.kunci] ?? '').trim()
    if (!v) errors.value.push(f.label)
  }
  if (config.value.wajibBerkas && berkasDipilih.value.length < 2) {
    errors.value.push('Minimal 2 berkas syarat')
  }
  if (errors.value.length) {
    toast.add({ title: 'Lengkapi data wajib terlebih dahulu', color: 'error' })
    return
  }

  saving.value = true
  try {
    const no = config.value.nomorOtomatis
      ? nomorPendaftaran(store.rows.value.map(x => String(x.noPendaftaran ?? '')))
      : ''
    const kode = kodeUnik()

    await store.create({
      ...form,
      noPendaftaran: no,
      kodeUnik: kode,
      gelombang: config.value.gelombang,
      berkas: [...berkasDipilih.value],
      nilaiSeleksi: 0,
      status: 'Menunggu',
      catatan: '',
      created_at: new Date().toISOString(),
    })

    hasil.value = { noPendaftaran: no, kodeUnik: kode }
    cek.nomor = no
    cek.kode = kode
    toast.add({ title: 'Pendaftaran terkirim!', description: 'Simpan nomor & kode untuk cek hasil.', color: 'success' })
    resetDraft()
    berkasDipilih.value = []
    Object.assign(form, empty())
  }
  finally {
    saving.value = false
  }
}

function waLink(konteks: string) {
  const text = `Assalamualaikum, saya ingin bertanya tentang ${konteks} PSB ${tahunAjaran}.`
  return `https://wa.me/${settings.value.wa}?text=${encodeURIComponent(text)}`
}

useHead({ title: 'Pendaftaran Santri Baru' })
onMounted(() => {
  load()
  muatConfig()
  store.fetchAll()
  biayaStore.fetchAll()
  pengumumanStore.fetchAll()
  santriStore.fetchAll()
  restoreDraft()
})
</script>
