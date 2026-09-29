// Lapisan CRUD generik (CSR only).
// Urutan baca: Supabase (bila terkonfigurasi) -> cache localStorage -> seed bawaan.
// Tulis: selalu update state + cache lokal, lalu best-effort ke Supabase.

import { RESOURCES, type ResourceKey } from './useResources'

const CACHE_VERSION = 'v1'

function lsKey(resource: ResourceKey) {
  return `pesantren-${CACHE_VERSION}-${resource}`
}

export function uid(prefix = '') {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
}

function today(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0, 10)
}

const SANTRI_NAMES = [
  'Ahmad Fauzan', 'Muhammad Rizki', 'Abdullah Hakim', 'Yusuf Maulana', 'Zaid Alfarizi',
  'Siti Aisyah', 'Nur Hidayah', 'Fatimah Azzahra', 'Khadijah Salma', 'Maryam Zahira',
  'Umar Faruq', 'Ali Zainal', 'Hasan Basri', 'Bilal Pratama', 'Salman Aditya',
  'Halimah Nisa', 'Raihanah Putri', 'Sumayyah Dwi', 'Asma Nabila', 'Zahra Amelia',
]

function seedSantri() {
  return SANTRI_NAMES.map((nama, i) => ({
    id: `snt${String(i + 1).padStart(3, '0')}`,
    nis: `2026${String(i + 1).padStart(3, '0')}`,
    nama,
    jk: i < 5 || (i >= 10 && i < 15) ? 'L' : 'P',
    rombel: i < 8 ? '7A' : i < 14 ? '8A' : '9A',
    kamar: `Asrama ${i % 3 === 0 ? 'Abu Bakar' : i % 3 === 1 ? 'Umar' : 'Utsman'}-${(i % 5) + 1}`,
    wali: `Bapak ${nama.split(' ')[0]}`,
    hp: `0812${String(10000000 + i).slice(0, 8)}`,
    asal: ['Bantul', 'Sleman', 'Yogyakarta', 'Magelang', 'Klaten'][i % 5],
    tahunMasuk: '2026',
    status: 'Aktif',
  }))
}

const SEEDS: Record<ResourceKey, any[]> = {
  hero: [
    { id: 'h1', judul: 'Pendaftaran Santri Baru 2026/2027 Dibuka', deskripsi: 'Gelombang 1 — bebas biaya pendaftaran & diskon uang pangkal 30%.', gambar: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=1000&q=80', badge: 'PSB', link: '/psb', urutan: 1, aktif: true },
    { id: 'h2', judul: 'Wisuda Tahfidz 30 Juz Angkatan XII', deskripsi: '32 santri diwisuda hafal 30 juz di Masjid Jami’ Al-Hikmah.', gambar: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=1000&q=80', badge: 'Prestasi', link: '/prestasi', urutan: 2, aktif: true },
    { id: 'h3', judul: 'Kajian Kitab Kuning Bersama Kiai', deskripsi: 'Kajian rutin ba’da Subuh, terbuka untuk santri dan masyarakat.', gambar: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1000&q=80', badge: 'Agenda', link: '/agenda', urutan: 3, aktif: true },
  ],
  agenda: [
    { id: 'ag1', judul: 'Kajian Kitab Fathul Mu’in', tanggal: today(1), jam: '05.30', lokasi: 'Masjid Jami’ Al-Hikmah', kategori: 'Kajian' },
    { id: 'ag2', judul: 'Lomba Musabaqah Tilawatil Qur’an', tanggal: today(4), jam: '08.00', lokasi: 'Aula Utama', kategori: 'Lomba' },
    { id: 'ag3', judul: 'Rapat Wali Santri Semester Ganjil', tanggal: today(9), jam: '09.00', lokasi: 'Aula Utama', kategori: 'Rapat' },
    { id: 'ag4', judul: 'Peringatan Maulid Nabi ﷺ', tanggal: today(15), jam: '19.30', lokasi: 'Lapangan Pesantren', kategori: 'Acara' },
  ],
  pengumuman: [
    { id: 'pg1', judul: 'Jadwal Ujian Tengah Semester Ganjil', isi: 'Ujian dilaksanakan 12–17 Oktober 2026. Santri wajib membawa kartu ujian yang dapat diunduh dari menu pembayaran setelah administrasi lunak.', tanggal: today(-2), penting: true, kategori: 'Akademik' },
    { id: 'pg2', judul: 'Libur Haul Pendiri Pesantren', isi: 'Kegiatan belajar diliburkan selama dua hari, santri mukim tetap berada di asrama dengan kegiatan mandiri.', tanggal: today(-6), penting: false, kategori: 'Umum' },
    { id: 'pg3', judul: 'Pembayaran Syahriah Bulan Ini', isi: 'Batas akhir pembayaran syahriah tanggal 10 setiap bulan melalui bendahara atau transfer bank pesantren.', tanggal: today(-9), penting: true, kategori: 'Keuangan' },
  ],
  prestasi: [
    { id: 'pr1', judul: 'Juara 1 MTQ Tingkat Provinsi', nama: 'Ahmad Fauzi', tingkat: 'Provinsi', tahun: '2026', kategori: 'Tahfidz & Qira’at', deskripsi: 'Meraih juara pertama cabang tilawah remaja tingkat Provinsi DIY.', gambar: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80', aktif: true },
    { id: 'pr2', judul: 'Juara 2 Olimpiade Sains Nasional', nama: 'Nur Hidayah', tingkat: 'Nasional', tahun: '2026', kategori: 'Akademik', deskripsi: 'Medali perak bidang Biologi pada OSN tingkat nasional.', gambar: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80', aktif: true },
    { id: 'pr3', judul: 'Juara 3 Turnamen Futsal Santri', nama: 'Tim Futsal Al-Hikmah', tingkat: 'Kabupaten', tahun: '2026', kategori: 'Olahraga', deskripsi: 'Juara ketiga pada turnamen futsal antar pesantren se-Kabupaten Bantul.', gambar: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80', aktif: true },
    { id: 'pr4', judul: 'Hafidz 30 Juz Termuda', nama: 'Zahra Amelia', tingkat: 'Pesantren', tahun: '2025', kategori: 'Tahfidz & Qira’at', deskripsi: 'Menuntaskan hafalan 30 juz pada usia 13 tahun.', gambar: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80', aktif: true },
  ],
  galeri: [
    { id: 'gl1', judul: 'Wisuda Tahfidz Angkatan XII', kategori: 'Wisuda', deskripsi: 'Prosesi wisuda santri penghafal Al-Qur’an.', gambar: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=1000&q=80', tanggal: today(-20) },
    { id: 'gl2', judul: 'Kegiatan Belajar Kitab Kuning', kategori: 'Belajar', deskripsi: 'Halaqah kitab kuning bersama para kiai.', gambar: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1000&q=80', tanggal: today(-35) },
    { id: 'gl3', judul: 'Shalat Berjamaah di Masjid', kategori: 'Ibadah', deskripsi: 'Suasana shalat berjamaah di Masjid Jami’ Al-Hikmah.', gambar: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=1000&q=80', tanggal: today(-48) },
    { id: 'gl4', judul: 'Kegiatan Olahraga Santri', kategori: 'Olahraga', deskripsi: 'Turnamen futsal antar kamar asrama.', gambar: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1000&q=80', tanggal: today(-60) },
    { id: 'gl5', judul: 'Perpustakaan & Literasi', kategori: 'Belajar', deskripsi: 'Ruang baca dan koleksi kitab pesantren.', gambar: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&q=80', tanggal: today(-75) },
    { id: 'gl6', judul: 'Suasana Pondok di Pagi Hari', kategori: 'Pesantren', deskripsi: 'Aktivitas santri memulai hari.', gambar: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1000&q=80', tanggal: today(-90) },
  ],
  album: [
    { id: 'al1', nama: 'Wisuda Tahfidz Angkatan XII', deskripsi: 'Rangkaian prosesi wisuda 32 santri penghafal 30 juz.', kategori: 'Wisuda', tanggal: today(-20), aktif: true, sampul: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=1000&q=80' },
    { id: 'al2', nama: 'Kegiatan Belajar & Halaqah', deskripsi: 'Suasana kajian kitab kuning dan halaqah harian santri.', kategori: 'Belajar', tanggal: today(-35), aktif: true, sampul: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1000&q=80' },
    { id: 'al3', nama: 'Ibadah & Kegiatan Masjid', deskripsi: 'Shalat berjamaah, khataman, dan kegiatan masjid.', kategori: 'Ibadah', tanggal: today(-48), aktif: true, sampul: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=1000&q=80' },
    { id: 'al4', nama: 'Olahraga & Turnamen Santri', deskripsi: 'Futsal, panahan, dan turnamen antar kamar.', kategori: 'Olahraga', tanggal: today(-60), aktif: true, sampul: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1000&q=80' },
  ],
  foto: [
    { id: 'ft1', albumId: 'al1', album: 'Wisuda Tahfidz Angkatan XII', judul: 'Prosesi Wisuda', gambar: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=1000&q=80', kategori: 'Wisuda', deskripsi: 'Santri menerima syahadah hafalan.', tanggal: today(-20), tampil: true },
    { id: 'ft2', albumId: 'al1', album: 'Wisuda Tahfidz Angkatan XII', judul: 'Foto Bersama Wisudawan', gambar: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1000&q=80', kategori: 'Wisuda', deskripsi: 'Kebersamaan santri dan para ustadz.', tanggal: today(-20), tampil: true },
    { id: 'ft3', albumId: 'al1', album: 'Wisuda Tahfidz Angkatan XII', judul: 'Penyerahan Syahadah', gambar: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&q=80', kategori: 'Wisuda', deskripsi: 'Momen penyerahan syahadah oleh pengasuh.', tanggal: today(-20), tampil: true },
    { id: 'ft4', albumId: 'al2', album: 'Kegiatan Belajar & Halaqah', judul: 'Halaqah Kitab Kuning', gambar: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1000&q=80', kategori: 'Belajar', deskripsi: 'Kajian kitab bersama kiai.', tanggal: today(-35), tampil: true },
    { id: 'ft5', albumId: 'al2', album: 'Kegiatan Belajar & Halaqah', judul: 'Belajar Kelompok', gambar: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&q=80', kategori: 'Belajar', deskripsi: 'Santri berdiskusi kelompok.', tanggal: today(-36), tampil: true },
    { id: 'ft6', albumId: 'al3', album: 'Ibadah & Kegiatan Masjid', judul: 'Shalat Berjamaah', gambar: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=1000&q=80', kategori: 'Ibadah', deskripsi: 'Shalat berjamaah di Masjid Jami’.', tanggal: today(-48), tampil: true },
    { id: 'ft7', albumId: 'al3', album: 'Ibadah & Kegiatan Masjid', judul: 'Khataman Al-Qur’an', gambar: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1000&q=80', kategori: 'Ibadah', deskripsi: 'Khataman bersama santri.', tanggal: today(-50), tampil: true },
    { id: 'ft8', albumId: 'al4', album: 'Olahraga & Turnamen Santri', judul: 'Turnamen Futsal', gambar: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1000&q=80', kategori: 'Olahraga', deskripsi: 'Final futsal antar kamar asrama.', tanggal: today(-60), tampil: true },
  ],
  kontak: [
    { id: 'kt1', nama: 'Bapak Slamet', email: 'slamet@example.com', hp: '081234567890', pesan: 'Mohon informasi biaya dan syarat pendaftaran santri baru.', status: 'Baru', created_at: new Date().toISOString() },
  ],
  psb: [
    { id: 'psb1', noPendaftaran: 'PSB-2026-0001', kodeUnik: 'A7X9K2', nama: 'Muhammad Alif', jk: 'L', tempatLahir: 'Bantul', tanggalLahir: '2012-04-11', asalSekolah: 'SD Negeri 1 Bantul', wali: 'Bapak Sumarno', hp: '081298765432', alamat: 'Jl. Melati No. 5, Bantul', jenjang: 'Tsanawiyah', gelombang: 'Gelombang 1', berkas: ['Akta Kelahiran', 'Kartu Keluarga', 'Foto 3x4'], nilaiSeleksi: 0, status: 'Menunggu', catatan: '', created_at: new Date().toISOString() },
  ],
  biaya: [
    // --- Tsanawiyah ---
    { id: 'by1', jenjang: 'Tsanawiyah', komponen: 'Pendaftaran', jumlah: 150000, tipe: 'Sekali', keterangan: 'Biaya formulir & seleksi', urutan: 1, aktif: true },
    { id: 'by2', jenjang: 'Tsanawiyah', komponen: 'Uang Pangkal', jumlah: 2500000, tipe: 'Sekali', keterangan: 'Dapat diangsur 3x', urutan: 2, aktif: true },
    { id: 'by3', jenjang: 'Tsanawiyah', komponen: 'Syahriah (SPP)', jumlah: 450000, tipe: 'Bulanan', keterangan: 'Makan 3x & asrama', urutan: 3, aktif: true },
    { id: 'by4', jenjang: 'Tsanawiyah', komponen: 'Seragam & Kitab', jumlah: 850000, tipe: 'Tahunan', keterangan: '4 setel seragam + kitab', urutan: 4, aktif: true },
    { id: 'by5', jenjang: 'Tsanawiyah', komponen: 'Kesehatan & Kegiatan', jumlah: 300000, tipe: 'Tahunan', keterangan: 'Asuransi & kegiatan santri', urutan: 5, aktif: true },
    // --- Aliyah ---
    { id: 'by6', jenjang: 'Aliyah', komponen: 'Pendaftaran', jumlah: 175000, tipe: 'Sekali', keterangan: 'Biaya formulir & seleksi', urutan: 1, aktif: true },
    { id: 'by7', jenjang: 'Aliyah', komponen: 'Uang Pangkal', jumlah: 3000000, tipe: 'Sekali', keterangan: 'Dapat diangsur 3x', urutan: 2, aktif: true },
    { id: 'by8', jenjang: 'Aliyah', komponen: 'Syahriah (SPP)', jumlah: 550000, tipe: 'Bulanan', keterangan: 'Makan 3x & asrama', urutan: 3, aktif: true },
    { id: 'by9', jenjang: 'Aliyah', komponen: 'Seragam & Kitab', jumlah: 950000, tipe: 'Tahunan', keterangan: '4 setel seragam + kitab', urutan: 4, aktif: true },
    { id: 'by10', jenjang: 'Aliyah', komponen: 'Kesehatan & Kegiatan', jumlah: 350000, tipe: 'Tahunan', keterangan: 'Asuransi & kegiatan santri', urutan: 5, aktif: true },
  ],

  santri: seedSantri(),
  guru: [
    { id: 'gu1', nama: 'KH. Abdullah Hafidz, Lc.', nip: '', mapel: 'Fiqih & Kitab Kuning', jabatan: 'Pengasuh', hp: '0812-1111-2222', status: 'Aktif' },
    { id: 'gu2', nama: 'Ustadz Fauzan Hakim, S.Pd.I.', nip: '19850101 201001 1 001', mapel: 'Tafsir & Tahfidz', jabatan: 'Wakil Pengasuh', hp: '0812-3333-4444', status: 'Aktif' },
    { id: 'gu3', nama: 'Ustadzah Siti Aminah, S.Ag.', nip: '', mapel: 'Bahasa Arab', jabatan: 'Wali Kelas 7A', hp: '', status: 'Aktif' },
    { id: 'gu4', nama: 'Ustadz Rizki Ramadhan, M.Pd.', nip: '', mapel: 'Matematika', jabatan: 'Kepala Madrasah', hp: '', status: 'Aktif' },
    { id: 'gu5', nama: 'Ustadzah Nur Laila, S.S.', nip: '', mapel: 'Bahasa Inggris', jabatan: 'Pembina Ekskul', hp: '', status: 'Aktif' },
  ],
  mapel: [
    { id: 'mp1', nama: 'Al-Qur’an & Tahfidz', kategori: 'Diniyah', jam: 8, pengampu: 'Ustadz Fauzan Hakim, S.Pd.I.', aktif: true },
    { id: 'mp2', nama: 'Kitab Kuning (Fiqih)', kategori: 'Diniyah', jam: 6, pengampu: 'KH. Abdullah Hafidz, Lc.', aktif: true },
    { id: 'mp3', nama: 'Bahasa Arab', kategori: 'Bahasa', jam: 4, pengampu: 'Ustadzah Siti Aminah, S.Ag.', aktif: true },
    { id: 'mp4', nama: 'Bahasa Inggris', kategori: 'Bahasa', jam: 4, pengampu: 'Ustadzah Nur Laila, S.S.', aktif: true },
    { id: 'mp5', nama: 'Matematika', kategori: 'Umum', jam: 4, pengampu: 'Ustadz Rizki Ramadhan, M.Pd.', aktif: true },
    { id: 'mp6', nama: 'Bahasa Indonesia', kategori: 'Umum', jam: 4, pengampu: '', aktif: true },
    { id: 'mp7', nama: 'IPA Terpadu', kategori: 'Umum', jam: 4, pengampu: '', aktif: true },
  ],
  rombel: [
    { id: 'rb1', nama: '7A', tingkat: '7', wali: 'Ustadzah Siti Aminah, S.Ag.', kamar: 'Asrama Abu Bakar', kapasitas: 25, jenjang: 'Tsanawiyah', aktif: true },
    { id: 'rb2', nama: '8A', tingkat: '8', wali: 'Ustadz Rizki Ramadhan, M.Pd.', kamar: 'Asrama Umar', kapasitas: 25, jenjang: 'Tsanawiyah', aktif: true },
    { id: 'rb3', nama: '9A', tingkat: '9', wali: '', kamar: 'Asrama Utsman', kapasitas: 25, jenjang: 'Tsanawiyah', aktif: true },
    { id: 'rb4', nama: '10A', tingkat: '10', wali: '', kamar: 'Asrama Ali', kapasitas: 30, jenjang: 'Aliyah', aktif: true },
  ],
  ekskul: [
    { id: 'ek1', nama: 'Pramuka', deskripsi: 'Latihan kepemimpinan dan kemandirian santri.', pembina: 'Ustadzah Nur Laila, S.S.', hari: 'Jumat', jam: '15.30–17.00', lokasi: 'Lapangan Pesantren', ikon: 'i-lucide-tent', aktif: true },
    { id: 'ek2', nama: 'Kaligrafi', deskripsi: 'Seni menulis khat Arab (naskhi, tsuluts, diwani).', pembina: 'KH. Abdullah Hafidz, Lc.', hari: 'Sabtu', jam: '08.00–10.00', lokasi: 'Ruang Seni', ikon: 'i-lucide-pen-tool', aktif: true },
    { id: 'ek3', nama: 'Robotik & Coding', deskripsi: 'Belajar dasar pemrograman dan robotika.', pembina: '', hari: 'Selasa', jam: '14.00–15.30', lokasi: 'Lab Komputer', ikon: 'i-lucide-cpu', aktif: true },
    { id: 'ek4', nama: 'Futsal', deskripsi: 'Tim futsal santri untuk turnamen antar pesantren.', pembina: '', hari: 'Rabu', jam: '16.00–17.30', lokasi: 'Lapangan Futsal', ikon: 'i-lucide-trophy', aktif: true },
    { id: 'ek5', nama: 'Tahfidz Intensif', deskripsi: 'Program percepatan hafalan bagi santri berprestasi.', pembina: 'Ustadz Fauzan Hakim, S.Pd.I.', hari: 'Senin–Kamis', jam: '04.30–06.00', lokasi: 'Masjid Jami’', ikon: 'i-lucide-book-open', aktif: true },
  ],
  event: [
    { id: 'ev1', nama: 'Peringatan Maulid Nabi ﷺ', tanggal: today(15), lokasi: 'Lapangan Pesantren', penanggungJawab: 'Panitia Santri', kategori: 'Keagamaan', deskripsi: 'Ceramah, shalawat bersama, dan lomba islami.', status: 'Terjadwal', aktif: true },
    { id: 'ev2', nama: 'Wisuda Tahfidz Angkatan XII', tanggal: today(-20), lokasi: 'Aula Utama', penanggungJawab: 'Ustadz Fauzan Hakim, S.Pd.I.', kategori: 'Akademik', deskripsi: 'Prosesi wisuda 32 santri penghafal 30 juz.', status: 'Selesai', aktif: true },
    { id: 'ev3', nama: 'Haul Pendiri Pesantren', tanggal: today(40), lokasi: 'Masjid Jami’ Al-Hikmah', penanggungJawab: 'Pengurus Pondok', kategori: 'Keagamaan', deskripsi: 'Khataman, tahlil, dan doa bersama.', status: 'Terjadwal', aktif: true },
  ],

  absensi: [
    { id: 'ab1', tanggal: today(0), rombel: '7A', sesi: 'Subuh', hadir: 7, sakit: 1, izin: 0, alpa: 0, pengampu: 'Ustadz Fauzan Hakim, S.Pd.I.', catatan: '' },
    { id: 'ab2', tanggal: today(0), rombel: '8A', sesi: 'Subuh', hadir: 6, sakit: 0, izin: 0, alpa: 0, pengampu: 'Ustadz Rizki Ramadhan, M.Pd.', catatan: '' },
    { id: 'ab3', tanggal: today(-1), rombel: '7A', sesi: 'Dzuhur', hadir: 8, sakit: 0, izin: 0, alpa: 0, pengampu: 'Ustadzah Siti Aminah, S.Ag.', catatan: '' },
  ],
  perizinan: [
    { id: 'iz1', santri: 'Ahmad Fauzan', rombel: '7A', jenis: 'Pulang', mulai: today(0), selesai: today(2), alasan: 'Acara keluarga di rumah.', status: 'Disetujui', penanggungJawab: 'Ustadz Fauzan Hakim, S.Pd.I.' },
    { id: 'iz2', santri: 'Nur Hidayah', rombel: '8A', jenis: 'Sakit', mulai: today(-1), selesai: today(1), alasan: 'Demam, dirawat di klinik pesantren.', status: 'Disetujui', penanggungJawab: 'Ustadzah Siti Aminah, S.Ag.' },
    { id: 'iz3', santri: 'Yusuf Maulana', rombel: '7A', jenis: 'Keluar', mulai: today(1), selesai: today(1), alasan: 'Mengurus dokumen di kelurahan.', status: 'Menunggu', penanggungJawab: '' },
  ],
  pembayaran: [
    { id: 'pb1', santri: 'Ahmad Fauzan', rombel: '7A', jenis: 'Syahriah', periode: 'September 2026', jumlah: 450000, tanggal: today(-3), metode: 'Transfer', status: 'Lunas', catatan: '' },
    { id: 'pb2', santri: 'Siti Aisyah', rombel: '7A', jenis: 'Syahriah', periode: 'September 2026', jumlah: 450000, tanggal: today(-1), metode: 'Tunai', status: 'Lunas', catatan: '' },
    { id: 'pb3', santri: 'Muhammad Rizki', rombel: '8A', jenis: 'Syahriah', periode: 'September 2026', jumlah: 450000, tanggal: '', metode: 'Transfer', status: 'Belum Bayar', catatan: 'Menunggu konfirmasi wali.' },
    { id: 'pb4', santri: 'Abdullah Hakim', rombel: '7A', jenis: 'Uang Pangkal', periode: '2026/2027', jumlah: 2500000, tanggal: today(-30), metode: 'Transfer', status: 'Lunas', catatan: '' },
    { id: 'pb5', santri: 'Fatimah Azzahra', rombel: '9A', jenis: 'Syahriah', periode: 'September 2026', jumlah: 450000, tanggal: '', metode: 'Tunai', status: 'Belum Bayar', catatan: '' },
  ],

  // Modul operasional
  pemberitahuan: [
    { id: 'pm1', judul: 'Libur Haul Pendiri Pesantren', isi: 'Kegiatan belajar diliburkan 2 hari, santri mukim tetap di asrama dengan kegiatan mandiri.', kategori: 'Libur', prioritas: 'Tinggi', sasaran: 'Semua', tanggal: today(-2), aktif: true },
    { id: 'pm2', judul: 'Batas Akhir Syahriah Bulan Ini', isi: 'Pembayaran syahriah paling lambat tanggal 10. Mohon perhatian wali santri.', kategori: 'Keuangan', prioritas: 'Tinggi', sasaran: 'Wali Santri', tanggal: today(-5), aktif: true },
    { id: 'pm3', judul: 'Jadwal Ujian Tahfidz', isi: 'Ujian tahfidz dilaksanakan pekan depan. Santri wajib menyetorkan hafalan.', kategori: 'Akademik', prioritas: 'Normal', sasaran: 'Santri', tanggal: today(-8), aktif: true },
  ],
  tahfidz: [
    { id: 'th1', santri: 'Ahmad Fauzan', rombel: '7A', juz: 'Juz 1', surah: 'Al-Baqarah 1-20', ayat: 20, jenis: 'Setoran Baru', nilai: 'Mumtaz', pengampu: 'Ustadz Fauzan Hakim, S.Pd.I.', tanggal: today(0), catatan: '' },
    { id: 'th2', santri: 'Nur Hidayah', rombel: '8A', juz: 'Juz 2', surah: 'Al-Baqarah 142-160', ayat: 19, jenis: 'Murojaah', nilai: 'Jayyid Jiddan', pengampu: 'Ustadz Fauzan Hakim, S.Pd.I.', tanggal: today(-1), catatan: 'Perlu perbaikan tajwid.' },
    { id: 'th3', santri: 'Yusuf Maulana', rombel: '7A', juz: 'Juz 1', surah: 'Al-Fatihah & Al-Baqarah 1-10', ayat: 17, jenis: 'Setoran Baru', nilai: 'Jayyid', pengampu: 'Ustadzah Siti Aminah, S.Ag.', tanggal: today(-2), catatan: '' },
    { id: 'th4', santri: 'Zahra Amelia', rombel: '9A', juz: 'Juz 30', surah: 'An-Naba - An-Nas', ayat: 40, jenis: 'Setoran Baru', nilai: 'Mumtaz', pengampu: 'Ustadz Fauzan Hakim, S.Pd.I.', tanggal: today(-3), catatan: 'Selesai juz 30.' },
  ],
  asrama: [
    { id: 'as1', nama: 'Asrama Abu Bakar', gedung: 'Gedung A', kapasitas: 25, terisi: 18, musyrif: 'Ustadz Rizki Ramadhan, M.Pd.', jenis: 'Putra', kamar: 6, fasilitas: 'Kamar mandi dalam, lemari, kipas', aktif: true },
    { id: 'as2', nama: 'Asrama Umar', gedung: 'Gedung A', kapasitas: 25, terisi: 22, musyrif: 'Ustadz Fauzan Hakim, S.Pd.I.', jenis: 'Putra', kamar: 6, fasilitas: 'Kamar mandi dalam, lemari', aktif: true },
    { id: 'as3', nama: 'Asrama Utsman', gedung: 'Gedung B', kapasitas: 25, terisi: 15, musyrif: 'Ustadzah Siti Aminah, S.Ag.', jenis: 'Putri', kamar: 6, fasilitas: 'Kamar mandi dalam, lemari, kipas', aktif: true },
    { id: 'as4', nama: 'Asrama Ali', gedung: 'Gedung B', kapasitas: 30, terisi: 12, musyrif: '', jenis: 'Putra', kamar: 8, fasilitas: 'Lemari, kipas', aktif: true },
  ],
  pembinaan: [
    { id: 'pn1', santri: 'Rizky Pratama', rombel: '7A', jenis: 'Terlambat Shalat Berjamaah', kategori: 'Ringan', poin: 5, tindakan: 'Teguran lisan', status: 'Selesai', pembina: 'Ustadz Rizki Ramadhan, M.Pd.', tanggal: today(-4), catatan: 'Sudah membuat pernyataan.' },
    { id: 'pn2', santri: 'Budi Santoso', rombel: '8A', jenis: 'Tidak Mengikuti Kegiatan Wajib', kategori: 'Sedang', poin: 10, tindakan: 'Membuat surat pernyataan', status: 'Dalam Pembinaan', pembina: 'Ustadz Fauzan Hakim, S.Pd.I.', tanggal: today(-7), catatan: 'Dipantau 2 pekan.' },
    { id: 'pn3', santri: 'Dewi Lestari', rombel: '7A', jenis: 'Terlambat Masuk Asrama', kategori: 'Ringan', poin: 5, tindakan: 'Teguran & piket asrama', status: 'Selesai', pembina: 'Ustadzah Siti Aminah, S.Ag.', tanggal: today(-11), catatan: '' },
  ],

  // ----- Akademik: kelas paralel, jadwal, KD, penilaian, raport -----
  kelasParalel: [
    { id: 'kp1', nama: '7A-1', rombel: '7A', tingkat: '7', ruang: 'Gedung A-1', wali: 'Ustadzah Siti Aminah, S.Ag.', jumlah: 12, kapasitas: 15, program: 'Reguler', aktif: true },
    { id: 'kp2', nama: '7A-2', rombel: '7A', tingkat: '7', ruang: 'Gedung A-2', wali: '', jumlah: 13, kapasitas: 15, program: 'Tahfidz', aktif: true },
    { id: 'kp3', nama: '8A-1', rombel: '8A', tingkat: '8', ruang: 'Gedung B-1', wali: 'Ustadz Rizki Ramadhan, M.Pd.', jumlah: 14, kapasitas: 15, program: 'Reguler', aktif: true },
  ],
  jadwal: [
    { id: 'jd1', hari: 'Senin', jam_mulai: '07:00', jam_selesai: '08:30', rombel: '7A', mapel: 'Al-Qur’an & Tahfidz', guru: 'Ustadz Fauzan Hakim, S.Pd.I.', ruang: 'Ruang 7A', aktif: true },
    { id: 'jd2', hari: 'Senin', jam_mulai: '08:30', jam_selesai: '10:00', rombel: '7A', mapel: 'Bahasa Arab', guru: 'Ustadzah Siti Aminah, S.Ag.', ruang: 'Ruang 7A', aktif: true },
    { id: 'jd3', hari: 'Senin', jam_mulai: '10:15', jam_selesai: '11:45', rombel: '7A', mapel: 'Matematika', guru: 'Ustadz Rizki Ramadhan, M.Pd.', ruang: 'Ruang 7A', aktif: true },
    { id: 'jd4', hari: 'Selasa', jam_mulai: '07:00', jam_selesai: '08:30', rombel: '7A', mapel: 'Kitab Kuning (Fiqih)', guru: 'KH. Abdullah Hafidz, Lc.', ruang: 'Aula', aktif: true },
    { id: 'jd5', hari: 'Selasa', jam_mulai: '08:30', jam_selesai: '10:00', rombel: '8A', mapel: 'Bahasa Inggris', guru: 'Ustadzah Nur Laila, S.S.', ruang: 'Ruang 8A', aktif: true },
  ],
  kd: [
    { id: 'kd1', kode: 'KD-3.1', mapel: 'Al-Qur’an & Tahfidz', kelas: '7', semester: 'Ganjil', deskripsi: 'Membaca Al-Qur’an dengan tajwid yang benar', kkm: 75, aktif: true },
    { id: 'kd2', kode: 'KD-3.2', mapel: 'Al-Qur’an & Tahfidz', kelas: '7', semester: 'Ganjil', deskripsi: 'Menghafal juz 30 dengan lancar', kkm: 75, aktif: true },
    { id: 'kd3', kode: 'KD-3.1', mapel: 'Bahasa Arab', kelas: '7', semester: 'Ganjil', deskripsi: 'Menguasai kosakata dasar & percakapan harian', kkm: 70, aktif: true },
    { id: 'kd4', kode: 'KD-3.1', mapel: 'Matematika', kelas: '7', semester: 'Ganjil', deskripsi: 'Operasi bilangan bulat dan pecahan', kkm: 70, aktif: true },
    { id: 'kd5', kode: 'KD-4.1', mapel: 'Matematika', kelas: '7', semester: 'Ganjil', deskripsi: 'Menyelesaikan masalah bilangan bulat', kkm: 70, aktif: true },
  ],
  penilaian: [
    { id: 'pn1', santri: 'Ahmad Fauzan', nis: '2026001', rombel: '7A', mapel: 'Al-Qur’an & Tahfidz', kd: 'KD-3.1', jenis: 'Harian', nilai: 88, tanggal: today(-5), semester: 'Ganjil', guru: 'Ustadz Fauzan Hakim, S.Pd.I.' },
    { id: 'pn2', santri: 'Ahmad Fauzan', nis: '2026001', rombel: '7A', mapel: 'Al-Qur’an & Tahfidz', kd: 'KD-3.2', jenis: 'Praktik', nilai: 92, tanggal: today(-3), semester: 'Ganjil', guru: 'Ustadz Fauzan Hakim, S.Pd.I.' },
    { id: 'pn3', santri: 'Ahmad Fauzan', nis: '2026001', rombel: '7A', mapel: 'Bahasa Arab', kd: 'KD-3.1', jenis: 'Harian', nilai: 80, tanggal: today(-4), semester: 'Ganjil', guru: 'Ustadzah Siti Aminah, S.Ag.' },
    { id: 'pn4', santri: 'Siti Aisyah', nis: '2026002', rombel: '7A', mapel: 'Al-Qur’an & Tahfidz', kd: 'KD-3.1', jenis: 'Harian', nilai: 95, tanggal: today(-5), semester: 'Ganjil', guru: 'Ustadz Fauzan Hakim, S.Pd.I.' },
    { id: 'pn5', santri: 'Siti Aisyah', nis: '2026002', rombel: '7A', mapel: 'Matematika', kd: 'KD-3.1', jenis: 'Harian', nilai: 78, tanggal: today(-4), semester: 'Ganjil', guru: 'Ustadz Rizki Ramadhan, M.Pd.' },
    { id: 'pn6', santri: 'Muhammad Rizki', nis: '2026003', rombel: '8A', mapel: 'Matematika', kd: 'KD-3.1', jenis: 'Harian', nilai: 85, tanggal: today(-4), semester: 'Ganjil', guru: 'Ustadz Rizki Ramadhan, M.Pd.' },
  ],
  raport: [
    { id: 'rp1', santri: 'Ahmad Fauzan', nis: '2026001', rombel: '7A', semester: 'Ganjil', tahun: '2026/2027', wali: 'Ustadzah Siti Aminah, S.Ag.', rata: 86.7, poinSikap: 95, peringkat: 2, status: 'Final', catatan: 'Santri tekun dan berakhlak baik.', tanggal: today(-1) },
    { id: 'rp2', santri: 'Siti Aisyah', nis: '2026002', rombel: '7A', semester: 'Ganjil', tahun: '2026/2027', wali: 'Ustadzah Siti Aminah, S.Ag.', rata: 86.5, poinSikap: 98, peringkat: 1, status: 'Final', catatan: 'Sangat aktif dalam kegiatan.', tanggal: today(-1) },
    { id: 'rp3', santri: 'Muhammad Rizki', nis: '2026003', rombel: '8A', semester: 'Ganjil', tahun: '2026/2027', wali: 'Ustadz Rizki Ramadhan, M.Pd.', rata: 85, poinSikap: 90, peringkat: 3, status: 'Draf', catatan: '', tanggal: today(-1) },
  ],

  // ----- Asrama: penempatan, piket -----
  penempatan: [
    { id: 'pk1', santri: 'Ahmad Fauzan', nis: '2026001', asrama: 'Asrama Abu Bakar', kamar: 'A-01', bed: '1', musyrif: 'Ustadz Rizki Ramadhan, M.Pd.', tanggal: today(-90), status: 'Aktif' },
    { id: 'pk2', santri: 'Muhammad Rizki', nis: '2026003', asrama: 'Asrama Umar', kamar: 'U-03', bed: '2', musyrif: 'Ustadz Fauzan Hakim, S.Pd.I.', tanggal: today(-90), status: 'Aktif' },
    { id: 'pk3', santri: 'Siti Aisyah', nis: '2026002', asrama: 'Asrama Utsman', kamar: 'T-02', bed: '1', musyrif: 'Ustadzah Siti Aminah, S.Ag.', tanggal: today(-90), status: 'Aktif' },
  ],
  piket: [
    { id: 'pj1', hari: 'Senin', asrama: 'Asrama Abu Bakar', kamar: 'A-01', petugas: 'Ahmad Fauzan, Umar Faruq', tugas: 'Sapu & pel ruang utama', pengawas: 'Ustadz Rizki Ramadhan, M.Pd.', aktif: true },
    { id: 'pj2', hari: 'Selasa', asrama: 'Asrama Abu Bakar', kamar: 'A-02', petugas: 'Ali Zainal, Hasan Basri', tugas: 'Bersihkan kamar mandi', pengawas: '', aktif: true },
    { id: 'pj3', hari: 'Rabu', asrama: 'Asrama Umar', kamar: 'U-03', petugas: 'Muhammad Rizki, Bilal Pratama', tugas: 'Piket dapur & sampah', pengawas: 'Ustadz Fauzan Hakim, S.Pd.I.', aktif: true },
  ],

  // ----- Keuangan -----
  tagihan: [
    { id: 'tg1', santri: 'Ahmad Fauzan', nis: '2026001', rombel: '7A', jenis: 'SPP', periode: 'September 2026', jumlah: 450000, jatuh_tempo: today(5), status: 'Belum Bayar', tahun: '2026/2027' },
    { id: 'tg2', santri: 'Siti Aisyah', nis: '2026002', rombel: '7A', jenis: 'SPP', periode: 'September 2026', jumlah: 450000, jatuh_tempo: today(5), status: 'Lunas', tahun: '2026/2027' },
    { id: 'tg3', santri: 'Muhammad Rizki', nis: '2026003', rombel: '8A', jenis: 'SPP', periode: 'September 2026', jumlah: 450000, jatuh_tempo: today(-3), status: 'Terlambat', tahun: '2026/2027' },
    { id: 'tg4', santri: 'Ahmad Fauzan', nis: '2026001', rombel: '7A', jenis: 'Uang Pangkal', periode: '2026/2027', jumlah: 2500000, jatuh_tempo: today(-40), status: 'Lunas', tahun: '2026/2027' },
  ],
  invoice: [
    { id: 'iv1', nomor: 'INV/2026/09/0001', santri: 'Siti Aisyah', nis: '2026002', rombel: '7A', jenis: 'SPP', periode: 'September 2026', jumlah: 450000, metode: 'Transfer', status: 'Lunas', tanggal: today(-5), jatuh_tempo: today(5), catatan: '' },
    { id: 'iv2', nomor: 'INV/2026/09/0002', santri: 'Ahmad Fauzan', nis: '2026001', rombel: '7A', jenis: 'SPP', periode: 'September 2026', jumlah: 450000, metode: 'Transfer', status: 'Terkirim', tanggal: today(-2), jatuh_tempo: today(5), catatan: 'Menunggu pembayaran.' },
    { id: 'iv3', nomor: 'INV/2026/09/0003', santri: 'Muhammad Rizki', nis: '2026003', rombel: '8A', jenis: 'SPP', periode: 'September 2026', jumlah: 450000, metode: 'Tunai', status: 'Jatuh Tempo', tanggal: today(-10), jatuh_tempo: today(-3), catatan: 'Sudah diingatkan 2x.' },
  ],
  saldo: [
    { id: 'sd1', santri: 'Ahmad Fauzan', nis: '2026001', rombel: '7A', saldo: 250000, terakhir: today(-7), catatan: 'Top-up via WhatsApp' },
    { id: 'sd2', santri: 'Siti Aisyah', nis: '2026002', rombel: '7A', saldo: 500000, terakhir: today(-3), catatan: '' },
    { id: 'sd3', santri: 'Muhammad Rizki', nis: '2026003', rombel: '8A', saldo: 50000, terakhir: today(-12), catatan: 'Saldo menipis' },
  ],
  transaksi: [
    { id: 'tx1', nomor: 'TRX/2026/09/0001', santri: 'Siti Aisyah', nis: '2026002', jenis: 'Top-up Saldo', arah: 'Masuk', jumlah: 500000, metode: 'Transfer', referensi: 'INV/2026/09/0001', tanggal: today(-5), petugas: 'Bendahara Pondok', catatan: '' },
    { id: 'tx2', nomor: 'TRX/2026/09/0002', santri: 'Ahmad Fauzan', nis: '2026001', jenis: 'Top-up Saldo', arah: 'Masuk', jumlah: 250000, metode: 'WhatsApp', referensi: '', tanggal: today(-7), petugas: 'Bendahara Pondok', catatan: 'Top-up via WA' },
    { id: 'tx3', nomor: 'TRX/2026/09/0003', santri: 'Ahmad Fauzan', nis: '2026001', jenis: 'Belanja Kantin', arah: 'Keluar', jumlah: 25000, metode: 'Saldo', referensi: '', tanggal: today(-6), petugas: 'Kantin', catatan: '' },
    { id: 'tx4', nomor: 'TRX/2026/09/0004', santri: 'Muhammad Rizki', nis: '2026003', jenis: 'Pembayaran SPP', arah: 'Masuk', jumlah: 450000, metode: 'Tunai', referensi: 'INV/2026/09/0003', tanggal: today(-2), petugas: 'Bendahara Pondok', catatan: '' },
  ],

  // ----- Tahfidz: target & munaqosah -----
  targetTahfidz: [
    { id: 'tt1', santri: 'Ahmad Fauzan', nis: '2026001', rombel: '7A', targetJuz: 5, capaianJuz: 2, targetSurah: 'Juz 1-5', pembimbing: 'Ustadz Fauzan Hakim, S.Pd.I.', periode: '2026/2027', deadline: today(120), status: 'Berjalan', catatan: '' },
    { id: 'tt2', santri: 'Siti Aisyah', nis: '2026002', rombel: '7A', targetJuz: 5, capaianJuz: 3, targetSurah: 'Juz 1-5', pembimbing: 'Ustadz Fauzan Hakim, S.Pd.I.', periode: '2026/2027', deadline: today(120), status: 'Berjalan', catatan: 'Progres tercepat di kelas.' },
    { id: 'tt3', santri: 'Zahra Amelia', nis: '2026010', rombel: '9A', targetJuz: 30, capaianJuz: 30, targetSurah: 'Juz 1-30', pembimbing: 'Ustadz Fauzan Hakim, S.Pd.I.', periode: '2025/2026', deadline: today(-30), status: 'Tercapai', catatan: 'Selesai 30 juz.' },
  ],
  munaqosah: [
    { id: 'mq1', santri: 'Zahra Amelia', nis: '2026010', rombel: '9A', juz: 'Juz 1-30', penguji: 'KH. Abdullah Hafidz, Lc.', nilai: 92, predikat: 'Mumtaz', status: 'Lulus', tanggal: today(-25), catatan: 'Hafalan lancar & tajwid baik.' },
    { id: 'mq2', santri: 'Siti Aisyah', nis: '2026002', rombel: '7A', juz: 'Juz 1-3', penguji: 'Ustadz Fauzan Hakim, S.Pd.I.', nilai: 85, predikat: 'Jayyid Jiddan', status: 'Lulus', tanggal: today(-10), catatan: '' },
    { id: 'mq3', santri: 'Ahmad Fauzan', nis: '2026001', rombel: '7A', juz: 'Juz 1-2', penguji: 'Ustadz Fauzan Hakim, S.Pd.I.', nilai: 68, predikat: 'Maqbul', status: 'Mengulang', tanggal: today(-8), catatan: 'Perlu perbaikan pada juz 2.' },
  ],

  // ----- Pembinaan: konseling & prestasi santri -----
  konseling: [
    { id: 'ks1', santri: 'Budi Santoso', nis: '2026003', rombel: '8A', jenis: 'Akademik', konselor: 'Ustadz Rizki Ramadhan, M.Pd.', tanggal: today(-6), ringkasan: 'Kesulitan mengikuti pelajaran Matematika.', tindakLanjut: 'Bimbingan tambahan 2x seminggu', status: 'Berlangsung', rahasia: true },
    { id: 'ks2', santri: 'Dewi Lestari', nis: '2026004', rombel: '7A', jenis: 'Pribadi', konselor: 'Ustadzah Siti Aminah, S.Ag.', tanggal: today(-12), ringkasan: 'Adaptasi dengan lingkungan asrama.', tindakLanjut: 'Pendampingan teman sebaya', status: 'Selesai', rahasia: true },
    { id: 'ks3', santri: 'Rizky Pratama', nis: '2026005', rombel: '7A', jenis: 'Kedisiplinan', konselor: 'Ustadz Fauzan Hakim, S.Pd.I.', tanggal: today(-3), ringkasan: 'Sering terlambat shalat berjamaah.', tindakLanjut: 'Pembinaan rutin ba’da Subuh', status: 'Berlangsung', rahasia: false },
  ],
  prestasi_santri: [
    { id: 'ps1', santri: 'Zahra Amelia', nis: '2026010', rombel: '9A', judul: 'Hafidz 30 Juz', kategori: 'Tahfidz', tingkat: 'Pesantren', poin: 50, tahun: '2025', pemberi: 'Pengasuh Pesantren', tanggal: today(-30), keterangan: 'Menuntaskan 30 juz di usia 13 tahun.' },
    { id: 'ps2', santri: 'Nur Hidayah', nis: '2026006', rombel: '8A', judul: 'Juara 2 Olimpiade Sains Nasional', kategori: 'Akademik', tingkat: 'Nasional', poin: 80, tahun: '2026', pemberi: 'Kemendikbud', tanggal: today(-60), keterangan: 'Medali perak bidang Biologi.' },
    { id: 'ps3', santri: 'Ahmad Fauzi', nis: '2026007', rombel: '7A', judul: 'Juara 1 MTQ Provinsi', kategori: 'Tahfidz', tingkat: 'Provinsi', poin: 40, tahun: '2026', pemberi: 'Pemda DIY', tanggal: today(-45), keterangan: 'Cabang tilawah remaja.' },
  ],

  // ----- PSB: pengumuman hasil -----
  psbPengumuman: [
    { id: 'pp1', judul: 'Pengumuman Hasil Seleksi Gelombang 1', gelombang: 'Gelombang 1', tahun: '2026/2027', isi: 'Hasil seleksi PSB Gelombang 1 telah diumumkan. Silakan cek nomor pendaftaran Anda.', tanggalPengumuman: today(3), status: 'Terbit', jumlahLulus: 45, jumlahTidakLulus: 12, aktif: true },
    { id: 'pp2', judul: 'Pengumuman Hasil Seleksi Gelombang 2', gelombang: 'Gelombang 2', tahun: '2026/2027', isi: 'Menunggu proses seleksi selesai.', tanggalPengumuman: today(20), status: 'Draf', jumlahLulus: 0, jumlahTidakLulus: 0, aktif: false },
  ],

  users: [
    { id: 'u-superadmin', nama: 'Super Admin', username: 'superadmin', roleId: 'superadmin' },
    { id: 'u-admin', nama: 'Admin Pesantren', username: 'admin', roleId: 'admin' },
    { id: 'u-pengurus', nama: 'Pengurus Pondok', username: 'pengurus', roleId: 'pengurus' },
    { id: 'u-ustadz', nama: 'Ustadz Fauzan', username: 'ustadz', roleId: 'ustadz' },
    { id: 'u-bendahara', nama: 'Bendahara Pondok', username: 'bendahara', roleId: 'bendahara' },
  ],
  roles: [],
}

export function readCache(resource: ResourceKey): any[] | null {
  if (!import.meta.client) return null
  try {
    const raw = localStorage.getItem(lsKey(resource))
    return raw ? JSON.parse(raw) : null
  }
  catch {
    return null
  }
}

function writeCache(resource: ResourceKey, rows: any[]) {
  if (!import.meta.client) return
  try {
    localStorage.setItem(lsKey(resource), JSON.stringify(rows))
  }
  catch { /* abaikan */ }
}

export function useAdminStore(resource: ResourceKey) {
  const meta = RESOURCES[resource]
  const rows = useState<any[]>(`cms-${resource}`, () => [])
  const loading = useState(`cms-${resource}-loading`, () => false)
  const initialized = useState(`cms-${resource}-init`, () => false)

  async function fetchAll(force = false) {
    if (initialized.value && !force) return
    loading.value = true
    try {
      const sb = await getSupabase()
      if (sb) {
        const { data, error } = await sb
          .from(meta.table)
          .select('*')
          .order(meta.orderBy, { ascending: meta.ascending ?? true })
          .limit(500)
        if (!error && data?.length) {
          rows.value = data
          writeCache(resource, data)
          initialized.value = true
          return
        }
      }
      const cached = readCache(resource)
      rows.value = cached ?? structuredClone(SEEDS[resource] ?? [])
    }
    finally {
      loading.value = false
      initialized.value = true
    }
  }

  async function create(payload: Record<string, any>) {
    const local = { id: uid(), created_at: new Date().toISOString(), ...payload }
    const sb = await getSupabase()
    if (sb) {
      try {
        const { data, error } = await sb.from(meta.table).insert(payload).select().single()
        if (!error && data) {
          rows.value = [data, ...rows.value]
          writeCache(resource, rows.value)
          return data
        }
      }
      catch { /* fallback lokal */ }
    }
    rows.value = [local, ...rows.value]
    writeCache(resource, rows.value)
    return local
  }

  async function createMany(payloads: Array<Record<string, any>>) {
    if (!payloads.length) return []
    const locals = payloads.map(p => ({ id: uid(), created_at: new Date().toISOString(), ...p }))
    const sb = await getSupabase()
    if (sb) {
      try {
        const { data, error } = await sb.from(meta.table).insert(payloads).select()
        if (!error && data?.length) {
          rows.value = [...data, ...rows.value]
          writeCache(resource, rows.value)
          return data
        }
      }
      catch { /* fallback lokal */ }
    }
    rows.value = [...locals, ...rows.value]
    writeCache(resource, rows.value)
    return locals
  }

  async function update(id: string, patch: Record<string, any>) {
    rows.value = rows.value.map(r => (String(r.id) === String(id) ? { ...r, ...patch } : r))
    writeCache(resource, rows.value)
    const sb = await getSupabase()
    if (sb) {
      try {
        await sb.from(meta.table).update(patch).eq('id', id)
      }
      catch { /* abaikan */ }
    }
  }

  async function remove(id: string) {
    rows.value = rows.value.filter(r => String(r.id) !== String(id))
    writeCache(resource, rows.value)
    const sb = await getSupabase()
    if (sb) {
      try {
        await sb.from(meta.table).delete().eq('id', id)
      }
      catch { /* abaikan */ }
    }
  }

  return {
    meta,
    rows,
    loading,
    initialized,
    fetchAll,
    create,
    createMany,
    update,
    remove,
    getById: (id: string) => rows.value.find(r => String(r.id) === String(id)),
    uid,
  }
}

/** Ringkasan statistik dashboard. */
export function useDashboardStats() {
  const santri = useState<any[]>('cms-santri', () => [])
  const guru = useState<any[]>('cms-guru', () => [])
  const rombel = useState<any[]>('cms-rombel', () => [])
  const pembayaran = useState<any[]>('cms-pembayaran', () => [])
  const perizinan = useState<any[]>('cms-perizinan', () => [])
  const agenda = useState<any[]>('cms-agenda', () => [])
  const psb = useState<any[]>('cms-psb', () => [])

  const stats = computed(() => {
    const lunas = pembayaran.value.filter(p => p.status === 'Lunas')
    const belum = pembayaran.value.filter(p => p.status !== 'Lunas')
    const masuk = lunas.reduce((sum, p) => sum + (Number(p.jumlah) || 0), 0)
    const target = pembayaran.value.reduce((sum, p) => sum + (Number(p.jumlah) || 0), 0)
    return {
      santri: santri.value.length,
      guru: guru.value.length,
      rombel: rombel.value.length,
      santriMukim: santri.value.filter(s => s.kamar).length,
      izinAktif: perizinan.value.filter(p => p.status === 'Disetujui').length,
      izinMenunggu: perizinan.value.filter(p => p.status === 'Menunggu').length,
      agenda: agenda.value.length,
      psbBaru: psb.value.filter(p => p.status === 'Menunggu').length,
      lunas: lunas.length,
      belum: belum.length,
      pemasukan: masuk,
      target,
      persen: target ? Math.round((masuk / target) * 100) : 0,
    }
  })

  async function loadAll() {
    const keys: ResourceKey[] = ['santri', 'guru', 'rombel', 'pembayaran', 'perizinan', 'agenda', 'psb']
    await Promise.all(keys.map(k => useAdminStore(k).fetchAll()))
  }

  return { stats, loadAll }
}
