// Registry semua resource (koleksi data) aplikasi.
// Satu sumber kebenaran untuk: label, ikon, tabel Supabase, dan urutan kolom.

export type ResourceKey =
  // Landing / konten
  | 'hero'
  | 'agenda'
  | 'pengumuman'
  | 'prestasi'
  | 'galeri'
  | 'album'
  | 'foto'
  | 'kontak'
  | 'biaya'
  // Akademik
  | 'santri'
  | 'guru'
  | 'mapel'
  | 'rombel'
  | 'kelasParalel'
  | 'jadwal'
  | 'kd'
  | 'penilaian'
  | 'raport'
  // Asrama
  | 'asrama'
  | 'penempatan'
  | 'piket'
  | 'perizinan'
  // Keuangan
  | 'tagihan'
  | 'invoice'
  | 'saldo'
  | 'transaksi'
  // Tahfidz
  | 'targetTahfidz'
  | 'tahfidz'
  | 'munaqosah'
  // Pembinaan
  | 'pembinaan'
  | 'konseling'
  | 'prestasi_santri'
  // PSB
  | 'psb'
  | 'psbPengumuman'
  // Umum
  | 'absensi'
  | 'pemberitahuan'
  | 'ekskul'
  | 'event'
  // Sistem
  | 'users'
  | 'roles'

export interface ResourceMeta {
  key: ResourceKey
  label: string
  labelSingular: string
  icon: string
  /** Nama tabel di Supabase (default = key). */
  table: string
  /** Kolom untuk ordering. */
  orderBy: string
  ascending?: boolean
  /** Resource ini punya manajemen admin. */
  managed: boolean
}

export const RESOURCES: Record<ResourceKey, ResourceMeta> = {
  // --- Landing ---
  hero: { key: 'hero', label: 'Hero Slider', labelSingular: 'Slide', icon: 'i-lucide-images', table: 'hero_slides', orderBy: 'urutan', ascending: true, managed: true },
  agenda: { key: 'agenda', label: 'Agenda', labelSingular: 'Agenda', icon: 'i-lucide-calendar-days', table: 'agendas', orderBy: 'tanggal', ascending: true, managed: true },
  pengumuman: { key: 'pengumuman', label: 'Pengumuman', labelSingular: 'Pengumuman', icon: 'i-lucide-megaphone', table: 'announcements', orderBy: 'tanggal', ascending: false, managed: true },
  prestasi: { key: 'prestasi', label: 'Prestasi', labelSingular: 'Prestasi', icon: 'i-lucide-trophy', table: 'prestasi', orderBy: 'tahun', ascending: false, managed: true },
  galeri: { key: 'galeri', label: 'Galeri', labelSingular: 'Foto', icon: 'i-lucide-image', table: 'galeri', orderBy: 'created_at', ascending: false, managed: true },
  album: { key: 'album', label: 'Album', labelSingular: 'Album', icon: 'i-lucide-folder', table: 'galeri_albums', orderBy: 'tanggal', ascending: false, managed: true },
  foto: { key: 'foto', label: 'Foto Album', labelSingular: 'Foto', icon: 'i-lucide-images', table: 'galeri_photos', orderBy: 'created_at', ascending: true, managed: true },
  kontak: { key: 'kontak', label: 'Kontak', labelSingular: 'Pesan', icon: 'i-lucide-phone', table: 'contacts', orderBy: 'created_at', ascending: false, managed: true },
  biaya: { key: 'biaya', label: 'Biaya Pendidikan', labelSingular: 'Komponen Biaya', icon: 'i-lucide-receipt', table: 'biaya_pendidikan', orderBy: 'urutan', ascending: true, managed: true },

  // --- Akademik ---
  santri: { key: 'santri', label: 'Data Santri', labelSingular: 'Santri', icon: 'i-lucide-users', table: 'santri', orderBy: 'nama', ascending: true, managed: true },
  guru: { key: 'guru', label: 'Guru / Ustadz', labelSingular: 'Guru', icon: 'i-lucide-contact', table: 'teachers', orderBy: 'nama', ascending: true, managed: true },
  mapel: { key: 'mapel', label: 'Mata Pelajaran', labelSingular: 'Mapel', icon: 'i-lucide-book-open', table: 'mapel', orderBy: 'nama', ascending: true, managed: true },
  rombel: { key: 'rombel', label: 'Rombel', labelSingular: 'Rombel', icon: 'i-lucide-door-open', table: 'rombel', orderBy: 'nama', ascending: true, managed: true },
  kelasParalel: { key: 'kelasParalel', label: 'Kelas Paralel', labelSingular: 'Kelas Paralel', icon: 'i-lucide-layers', table: 'kelas_paralel', orderBy: 'nama', ascending: true, managed: true },
  jadwal: { key: 'jadwal', label: 'Jadwal Pelajaran', labelSingular: 'Jadwal', icon: 'i-lucide-calendar-clock', table: 'jadwal', orderBy: 'jam_mulai', ascending: true, managed: true },
  kd: { key: 'kd', label: 'Kompetensi Dasar', labelSingular: 'KD', icon: 'i-lucide-list-checks', table: 'kompetensi_dasar', orderBy: 'kode', ascending: true, managed: true },
  penilaian: { key: 'penilaian', label: 'Penilaian KD', labelSingular: 'Nilai', icon: 'i-lucide-clipboard-list', table: 'penilaian', orderBy: 'tanggal', ascending: false, managed: true },
  raport: { key: 'raport', label: 'Raport Semester', labelSingular: 'Raport', icon: 'i-lucide-file-text', table: 'raport', orderBy: 'created_at', ascending: false, managed: true },

  // --- Asrama ---
  asrama: { key: 'asrama', label: 'Asrama & Kamar', labelSingular: 'Kamar', icon: 'i-lucide-bed-double', table: 'asrama', orderBy: 'nama', ascending: true, managed: true },
  penempatan: { key: 'penempatan', label: 'Penempatan Kamar', labelSingular: 'Penempatan', icon: 'i-lucide-door-closed', table: 'penempatan_kamar', orderBy: 'created_at', ascending: false, managed: true },
  piket: { key: 'piket', label: 'Jadwal Piket', labelSingular: 'Piket', icon: 'i-lucide-broom', table: 'jadwal_piket', orderBy: 'hari', ascending: true, managed: true },
  perizinan: { key: 'perizinan', label: 'Perizinan Digital', labelSingular: 'Izin', icon: 'i-lucide-file-check', table: 'perizinan', orderBy: 'mulai', ascending: false, managed: true },

  // --- Keuangan ---
  tagihan: { key: 'tagihan', label: 'Tagihan SPP', labelSingular: 'Tagihan', icon: 'i-lucide-receipt-text', table: 'tagihan', orderBy: 'jatuh_tempo', ascending: false, managed: true },
  invoice: { key: 'invoice', label: 'Invoice Digital', labelSingular: 'Invoice', icon: 'i-lucide-file-invoice', table: 'invoice', orderBy: 'created_at', ascending: false, managed: true },
  saldo: { key: 'saldo', label: 'Saldo Santri', labelSingular: 'Saldo', icon: 'i-lucide-wallet', table: 'saldo_santri', orderBy: 'santri', ascending: true, managed: true },
  transaksi: { key: 'transaksi', label: 'Riwayat Transaksi', labelSingular: 'Transaksi', icon: 'i-lucide-arrow-left-right', table: 'transaksi', orderBy: 'tanggal', ascending: false, managed: true },

  // --- Tahfidz ---
  targetTahfidz: { key: 'targetTahfidz', label: 'Target Hafalan', labelSingular: 'Target', icon: 'i-lucide-target', table: 'target_tahfidz', orderBy: 'santri', ascending: true, managed: true },
  tahfidz: { key: 'tahfidz', label: 'Setoran Harian', labelSingular: 'Setoran', icon: 'i-lucide-book-open-check', table: 'tahfidz', orderBy: 'tanggal', ascending: false, managed: true },
  munaqosah: { key: 'munaqosah', label: 'Ujian Munaqosah', labelSingular: 'Munaqosah', icon: 'i-lucide-graduation-cap', table: 'munaqosah', orderBy: 'tanggal', ascending: false, managed: true },

  // --- Pembinaan ---
  pembinaan: { key: 'pembinaan', label: 'Pelanggaran & Poin', labelSingular: 'Pelanggaran', icon: 'i-lucide-shield-alert', table: 'pembinaan', orderBy: 'tanggal', ascending: false, managed: true },
  konseling: { key: 'konseling', label: 'Konseling', labelSingular: 'Sesi', icon: 'i-lucide-heart-handshake', table: 'konseling', orderBy: 'tanggal', ascending: false, managed: true },
  prestasi_santri: { key: 'prestasi_santri', label: 'Prestasi Santri', labelSingular: 'Prestasi', icon: 'i-lucide-medal', table: 'prestasi_santri', orderBy: 'tanggal', ascending: false, managed: true },

  // --- PSB ---
  psb: { key: 'psb', label: 'Pendaftar PSB', labelSingular: 'Pendaftar', icon: 'i-lucide-clipboard-list', table: 'psb_leads', orderBy: 'created_at', ascending: false, managed: true },
  psbPengumuman: { key: 'psbPengumuman', label: 'Pengumuman Hasil', labelSingular: 'Pengumuman', icon: 'i-lucide-megaphone', table: 'psb_pengumuman', orderBy: 'created_at', ascending: false, managed: true },

  // --- Umum ---
  absensi: { key: 'absensi', label: 'Absensi', labelSingular: 'Absensi', icon: 'i-lucide-clipboard-check', table: 'absensi', orderBy: 'tanggal', ascending: false, managed: true },
  pemberitahuan: { key: 'pemberitahuan', label: 'Pemberitahuan', labelSingular: 'Pemberitahuan', icon: 'i-lucide-bell-ring', table: 'pemberitahuan', orderBy: 'tanggal', ascending: false, managed: true },
  ekskul: { key: 'ekskul', label: 'Ekstrakurikuler', labelSingular: 'Ekskul', icon: 'i-lucide-medal', table: 'ekstrakurikuler', orderBy: 'nama', ascending: true, managed: true },
  event: { key: 'event', label: 'Event', labelSingular: 'Event', icon: 'i-lucide-party-popper', table: 'events', orderBy: 'tanggal', ascending: true, managed: true },

  // --- Sistem ---
  users: { key: 'users', label: 'Pengguna', labelSingular: 'Pengguna', icon: 'i-lucide-user-cog', table: 'app_users', orderBy: 'nama', ascending: true, managed: true },
  roles: { key: 'roles', label: 'Peran & Akses', labelSingular: 'Peran', icon: 'i-lucide-shield-check', table: 'app_roles', orderBy: 'nama', ascending: true, managed: true },
}

export function resourceMeta(key: ResourceKey): ResourceMeta {
  return RESOURCES[key]
}

export const ALL_RESOURCES = Object.values(RESOURCES)
