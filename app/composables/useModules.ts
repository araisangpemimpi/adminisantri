// Sumber tunggal struktur menu admin.
// Enam kelompok modul sesuai kebutuhan pesantren, masing-masing berisi sub-menu.

export interface AdminNavItem {
  label: string
  icon: string
  to: string
  /** Resource yang dicek untuk hak akses "read". */
  resource?: string
  /** Keterangan singkat (dipakai di halaman Modul). */
  deskripsi?: string
}

export interface AdminNavGroup {
  /** ID modul (dipakai untuk aktif/nonaktif di halaman Modul). */
  id: string
  title: string
  deskripsi: string
  ikon: string
  items: AdminNavItem[]
  aktif: boolean
  /** Modul inti tidak bisa dimatikan. */
  wajib?: boolean
}

/** Kelompok modul default. Aktif/nonaktif disimpan di localStorage. */
export const DEFAULT_MODULES: AdminNavGroup[] = [
  {
    id: 'akademik',
    title: 'Akademik',
    deskripsi: 'Data santri, kelas paralel, mata pelajaran, jadwal, penilaian KD, raport digital & kartu santri.',
    ikon: 'i-lucide-graduation-cap',
    aktif: true,
    wajib: true,
    items: [
      { label: 'Data Santri', icon: 'i-lucide-users', to: '/admin/akademik/santri', resource: 'santri' },
      { label: 'Guru & Ustadz', icon: 'i-lucide-contact', to: '/admin/akademik/guru', resource: 'guru' },
      { label: 'Mata Pelajaran', icon: 'i-lucide-book-open', to: '/admin/akademik/mapel', resource: 'mapel' },
      { label: 'Rombel', icon: 'i-lucide-door-open', to: '/admin/akademik/rombel', resource: 'rombel' },
      { label: 'Kelas Paralel', icon: 'i-lucide-layers', to: '/admin/akademik/kelas-paralel', resource: 'kelasParalel' },
      { label: 'Jadwal Pelajaran', icon: 'i-lucide-calendar-clock', to: '/admin/akademik/jadwal', resource: 'jadwal' },
      { label: 'Kompetensi Dasar', icon: 'i-lucide-list-checks', to: '/admin/akademik/kd', resource: 'kd' },
      { label: 'Penilaian KD', icon: 'i-lucide-clipboard-list', to: '/admin/akademik/penilaian', resource: 'penilaian' },
      { label: 'Raport Semester', icon: 'i-lucide-file-text', to: '/admin/akademik/raport', resource: 'raport' },
      { label: 'Kartu Santri (QR)', icon: 'i-lucide-id-card', to: '/admin/akademik/kartu', resource: 'santri' },
      { label: 'Absensi', icon: 'i-lucide-clipboard-check', to: '/admin/akademik/absensi', resource: 'absensi' },
    ],
  },
  {
    id: 'asrama',
    title: 'Asrama',
    deskripsi: 'Penempatan kamar, jadwal piket, perizinan digital & koordinasi pengasuh.',
    ikon: 'i-lucide-bed-double',
    aktif: true,
    items: [
      { label: 'Asrama & Kamar', icon: 'i-lucide-bed-double', to: '/admin/asrama/kamar', resource: 'asrama' },
      { label: 'Penempatan Kamar', icon: 'i-lucide-door-closed', to: '/admin/asrama/penempatan', resource: 'penempatan' },
      { label: 'Jadwal Piket', icon: 'i-lucide-broom', to: '/admin/asrama/piket', resource: 'piket' },
      { label: 'Perizinan Digital', icon: 'i-lucide-file-check', to: '/admin/asrama/perizinan', resource: 'perizinan' },
      { label: 'Koordinasi Pengasuh', icon: 'i-lucide-users-round', to: '/admin/asrama/pengasuh', resource: 'asrama' },
    ],
  },
  {
    id: 'keuangan',
    title: 'Keuangan',
    deskripsi: 'Tagihan SPP otomatis, invoice digital, top-up saldo, riwayat transaksi & laporan audit.',
    ikon: 'i-lucide-wallet',
    aktif: true,
    items: [
      { label: 'Tagihan SPP', icon: 'i-lucide-receipt-text', to: '/admin/keuangan/tagihan', resource: 'tagihan' },
      { label: 'Invoice Digital', icon: 'i-lucide-file-invoice', to: '/admin/keuangan/invoice', resource: 'invoice' },
      { label: 'Saldo & Top-up', icon: 'i-lucide-wallet', to: '/admin/keuangan/saldo', resource: 'saldo' },
      { label: 'Riwayat Transaksi', icon: 'i-lucide-arrow-left-right', to: '/admin/keuangan/transaksi', resource: 'transaksi' },
      { label: 'Laporan Keuangan', icon: 'i-lucide-chart-column', to: '/admin/keuangan/laporan', resource: 'transaksi' },
    ],
  },
  {
    id: 'tahfidz',
    title: 'Tahfidz',
    deskripsi: 'Target hafalan, setoran harian, ujian munaqosah & laporan progres ke wali.',
    ikon: 'i-lucide-book-open-check',
    aktif: true,
    items: [
      { label: 'Target Hafalan', icon: 'i-lucide-target', to: '/admin/tahfidz/target', resource: 'targetTahfidz' },
      { label: 'Setoran Harian', icon: 'i-lucide-book-open-check', to: '/admin/tahfidz/setoran', resource: 'tahfidz' },
      { label: 'Ujian Munaqosah', icon: 'i-lucide-graduation-cap', to: '/admin/tahfidz/munaqosah', resource: 'munaqosah' },
      { label: 'Laporan Progres', icon: 'i-lucide-send', to: '/admin/tahfidz/laporan', resource: 'tahfidz' },
    ],
  },
  {
    id: 'pembinaan',
    title: 'Pembinaan',
    deskripsi: 'Pelanggaran, konseling, prestasi santri & poin sikap terintegrasi raport.',
    ikon: 'i-lucide-shield-check',
    aktif: true,
    items: [
      { label: 'Pelanggaran & Poin', icon: 'i-lucide-shield-alert', to: '/admin/pembinaan/pelanggaran', resource: 'pembinaan' },
      { label: 'Konseling', icon: 'i-lucide-heart-handshake', to: '/admin/pembinaan/konseling', resource: 'konseling' },
      { label: 'Prestasi Santri', icon: 'i-lucide-medal', to: '/admin/pembinaan/prestasi', resource: 'prestasi_santri' },
      { label: 'Poin Sikap', icon: 'i-lucide-gauge', to: '/admin/pembinaan/poin', resource: 'pembinaan' },
    ],
  },
  {
    id: 'psb',
    title: 'PSB',
    deskripsi: 'Formulir pendaftaran fleksibel, unggah syarat, nomor & kode unik, pengumuman hasil & laporan.',
    ikon: 'i-lucide-clipboard-list',
    aktif: true,
    items: [
      { label: 'Pendaftar', icon: 'i-lucide-clipboard-list', to: '/admin/psb/pendaftar', resource: 'psb' },
      { label: 'Formulir', icon: 'i-lucide-file-sliders', to: '/admin/psb/formulir', resource: 'psb' },
      { label: 'Pengumuman Hasil', icon: 'i-lucide-megaphone', to: '/admin/psb/pengumuman', resource: 'psbPengumuman' },
      { label: 'Laporan PSB', icon: 'i-lucide-chart-pie', to: '/admin/psb/laporan', resource: 'psb' },
      { label: 'Biaya Pendidikan', icon: 'i-lucide-receipt', to: '/admin/psb/biaya', resource: 'biaya' },
    ],
  },
]

const MODULES_KEY = 'pesantren-modules-v2'

export function useModules() {
  const modules = useState<AdminNavGroup[]>('app-modules', () => structuredClone(DEFAULT_MODULES))
  const loaded = useState('app-modules-loaded', () => false)

  function load() {
    if (!import.meta.client || loaded.value) return
    try {
      const raw = localStorage.getItem(MODULES_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Array<{ id: string, aktif: boolean }>
        const map = new Map(parsed.map(m => [m.id, m.aktif]))
        modules.value = DEFAULT_MODULES.map(d => ({ ...d, aktif: map.get(d.id) ?? d.aktif }))
      }
    }
    catch { /* abaikan */ }
    loaded.value = true
  }

  function persist() {
    if (!import.meta.client) return
    try {
      const data = modules.value.map(m => ({ id: m.id, aktif: m.aktif }))
      localStorage.setItem(MODULES_KEY, JSON.stringify(data))
    }
    catch { /* abaikan */ }
  }

  function setActive(id: string, aktif: boolean) {
    const m = modules.value.find(x => x.id === id)
    if (!m || (m.wajib && !aktif)) return
    m.aktif = aktif
    persist()
  }

  /** Hanya Super Admin boleh mengubah daftar modul — dipakai sebagai pengaman. */
  function setActiveJikaBoleh(id: string, aktif: boolean, boleh: boolean) {
    if (!boleh) return false
    setActive(id, aktif)
    return true
  }

  function reset() {
    modules.value = structuredClone(DEFAULT_MODULES)
    persist()
  }

  return { modules, loaded, load, setActive, setActiveJikaBoleh, reset }
}
