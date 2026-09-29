# Pesantren App — Nuxt 4 + Supabase + Nuxt UI

Aplikasi manajemen pesantren **mobile-first** dengan halaman publik (landing) dan panel
admin lengkap. Dibuat dengan **Nuxt 4**, **Supabase** (opsional), dan **Nuxt UI** —
dengan design system kustom bertema *Islamic Modern* (emerald/teal) serta font
**Plus Jakarta Sans**.

---

## ✨ Fitur

### Halaman Publik (Landing)
| Halaman | Rute | Isi |
|---|---|---|
| Beranda | `/` | Hero slider, statistik, agenda, pengumuman, prestasi, galeri, ekskul, CTA PSB, kontak cepat, pencarian global |
| Profil | `/profil` | Identitas, visi & misi, fasilitas, kontak |
| Agenda | `/agenda` | Jadwal kegiatan + filter kategori |
| Pengumuman | `/pengumuman` | Accordion pengumuman, penanda "penting" |
| Prestasi | `/prestasi` | Capaian santri + filter tingkat |
| Galeri | `/galeri` | Grid album → lightbox foto (tutup via tombol, area gelap, atau Esc) |
| Ekstrakurikuler | `/ekskul` | Daftar ekskul, jadwal, pembina |
| Guru & Ustadz | `/guru` | Direktori pendidik |
| Mata Pelajaran | `/mapel` | Kurikulum per kategori |
| PSB | `/psb` | 4 tab: Informasi, Biaya Pendidikan, Formulir (berkas), Cek Hasil Seleksi |
| Kontak | `/kontak` | Aksi cepat (WA/telepon/email/maps) + formulir pesan |

### Panel Admin (`/admin`) — 6 Kelompok Modul

| Kelompok | Isi |
|---|---|
| **Akademik** | Data Santri, Guru & Ustadz, Mata Pelajaran, Rombel, Kelas Paralel, Jadwal Pelajaran, Kompetensi Dasar (KD), Penilaian KD, **Raport Semester** (cetak), **Kartu Santri QR** (cetak), Absensi |
| **Asrama** | Asrama & Kamar, Penempatan Kamar, Jadwal Piket, Perizinan Digital, Koordinasi Pengasuh |
| **Keuangan** | Tagihan SPP (generate otomatis), Invoice Digital (cetak + kirim WA), Saldo & Top-up via WhatsApp, Riwayat Transaksi, **Laporan Keuangan** (ekspor CSV) |
| **Tahfidz** | Target Hafalan, Setoran Harian, Ujian Munaqosah, **Laporan Progres** (kirim ke wali via WA) |
| **Pembinaan** | Pelanggaran & Poin, Konseling, Prestasi Santri, **Poin Sikap** (terintegrasi raport) |
| **PSB** | Pendaftar, Formulir (field fleksibel), Pengumuman Hasil, Laporan (ekspor CSV), Biaya Pendidikan |

Plus **Konten** (Landing Page, Pemberitahuan, Ekstrakurikuler, Event) dan **Sistem**
(Pengguna, Peran & Akses, Modul, Tema & Identitas).

### Fitur Unggulan

**Raport Semester** — nilai dihitung otomatis dari Penilaian KD, poin sikap diambil dari
modul Pembinaan (`100 − pelanggaran + penghargaan`). Halaman cetak A4 dengan kop pesantren,
tabel nilai, predikat, catatan wali, dan kolom tanda tangan.

**Kartu Santri QR** — pilih santri (bulk), generate QR berisi identitas, cetak A4 (2 kartu/baris).
QR memakai library dinamis sehingga hanya dimuat saat dibutuhkan.

**Keuangan** — tagihan SPP dibuat sekali klik untuk semua santri aktif (melewati yang sudah ada
bulan itu). Invoice bernomor otomatis (`INV/2026/09/0001`), bisa dicetak & dikirim via WhatsApp.
Top-up saldo otomatis tercatat di riwayat transaksi dengan nomor `TRX/...`.

**Tahfidz** — laporan progres menyatukan target + setoran, dikirim ke WhatsApp wali secara
berurutan (dengan jeda agar tidak diblokir browser).

**PSB** — nomor pendaftaran (`PSB-2026-0001`) & kode unik otomatis, unggah berkas syarat,
halaman **Cek Hasil Seleksi** untuk pendaftar (nomor + kode), pengumuman resmi, dan laporan CSV.

### Modul Dinamis (khusus Super Admin)
Menu **Modul** (`/admin/modules`) mengatur kelompok modul mana yang aktif. Hanya **Super Admin**
yang dapat mengaksesnya — menu disembunyikan untuk peran lain dan halaman menampilkan
"Akses terbatas" bila dibuka langsung. Modul nonaktif tetap menyimpan datanya, hanya
disembunyikan dari sidebar (beserta seluruh sub-menunya). Struktur modul ada di
`app/composables/useModules.ts` sebagai `DEFAULT_MODULES`. Modul **Akademik** bersifat wajib.

### Pengguna & Peran Dinamis
- **Pengguna** (`/admin/users`) — CRUD pengguna dengan validasi username unik, status aktif,
  dan penetapan peran. Tersimpan lokal + sinkron Supabase (`app_users`).
- **Peran & Akses** (`/admin/roles`) — CRUD peran dengan pemilihan modul & aksi (lihat/tambah/
  ubah/hapus). Tersimpan lokal; peran sistem selalu mengikuti definisi terbaru di kode sehingga
  modul baru otomatis ikut ter-*update*.

### Kontrol Tampilan Landing Page
Halaman **Tampilan** (`/admin/landing/tampilan`) mengatur bagian mana yang muncul di beranda
beserta urutannya: Hero, Statistik, Agenda, Pengumuman, Prestasi, Galeri, Ekskul, PSB, Kontak.
Hero tidak dapat dimatikan (bagian utama). Konfigurasi ada di `app/composables/useLandingSections.ts`.

### Halaman PSB Bertab
Halaman `/psb` dibagi menjadi 4 tab agar tidak membingungkan pengguna:
1. **Informasi** — alur pendaftaran + syarat berkas.
2. **Biaya Pendidikan** — rincian per jenjang, total estimasi tahun pertama dihitung otomatis,
   plus info keringanan & beasiswa.
3. **Formulir** — formulir pendaftaran (field mengikuti pengaturan admin) + unggah berkas syarat.
   Setelah kirim, nomor pendaftaran & kode unik ditampilkan untuk disimpan.
4. **Cek Hasil Seleksi** — pendaftar memasukkan nomor + kode unik untuk melihat status,
   plus pengumuman resmi per gelombang.

Kemudahan yang disertakan:
- **Klik tab + geser (swipe) + tombol Lanjut/Kembali** — navigasi utama berupa tombol karena di
  mobile lebih jelas daripada sekadar menyadari header tab bisa ditekan.
- **Draf otomatis** — isian formulir disimpan ke `localStorage` sehingga tidak hilang saat
  berpindah tab atau tidak sengaja menutup halaman.
- **Validasi jelas** — daftar field yang belum lengkap ditampilkan sebagai daftar, bukan sekadar toast.
- Data biaya **dikelola dari admin** (`/admin/landing/biaya`), bukan hardcode.

### Kontras Dark Theme
Warna brand pekat (mis. emerald `#0f766e`) gagal kontras bila dipakai sebagai teks di atas latar
gelap — hanya **3.39:1** (butuh ≥ 4.5:1), dan teks di dalam `brand-soft` hanya **1.97:1**.

Solusinya bukan menaikkan saturasi, melainkan **token terang terpisah per palet** (`onDark`):
- `--brand-text` → di light memakai warna primary; di dark memakai varian terang (`#5eead4` untuk
  emerald) sehingga kontrasnya **11.5:1**.
- Tangga skala Nuxt UI (`--ui-color-primary-300…500`) juga dinaikkan di dark mode agar teks primary,
  ikon, dan focus ring tetap terbaca — sementara `600+` tetap dipakai sebagai **latar** tombol solid.
- `--ink-muted` dinaikkan menjadi `#a7bab6` (**8.4:1** di atas permukaan gelap).

Semua 7 palet kini lolos WCAG AA untuk teks. Permukaan dark juga sedikit dinaikkan (`#101f1d`)
agar tidak "hitam legam" dan kartu lebih mudah dibedakan.

### Galeri Berbasis Album
- **Album berisi banyak foto** — satu album memuat banyak foto, ditampilkan sebagai grid album di halaman publik.
- **Unggah massal (bulk)** — pilih beberapa foto sekaligus atau tarik & lepas (drag & drop); foto dikompres otomatis di klien (maks 1600px, kualitas 82%) agar hemat kuota.
- Unggahan otomatis ke **Supabase Storage** (bucket `galeri`) bila terkonfigurasi; jika tidak, foto disimpan lokal sebagai data URL sehingga tetap jalan offline.
- Kelola per foto: ubah judul, sembunyikan/tampilkan, hapus.
- Lightbox publik: navigasi antar foto, thumbnail, tombol Sebelumnya/Berikutnya, dan dapat ditutup lewat tombol, area gelap, maupun tombol `Esc`.

---

## 🎨 Design System (bukan tampilan generic Nuxt UI)

- **Font Plus Jakarta Sans** — dipasang sebagai `--font-sans` (variabel yang dipakai
  Nuxt UI) sekaligus di `html`/`body`, sehingga tidak lagi tertimpa oleh gaya bawaan
  Nuxt UI. X-height-nya besar dan counternya terbuka sehingga sangat mudah dibaca,
  sementara rentang bobot 200–800 memberi kesan modern. Font di-self-host otomatis
  lewat Nuxt Fonts (tidak bergantung pada Google Fonts saat runtime).
- **Palet brand dinamis** via CSS variable `--brand-*` yang di-bridge ke Nuxt UI
  (`--ui-primary`, `--ui-color-primary-*`) — jadi semua komponen `color="primary"`
  ikut berubah saat tema diganti.
- **Pola geometri islami** halus (`.pattern-islamic`) pada header, hero, dan CTA.
- **Kartu rounded lembut** (`.card-soft`), aksen garis tepi (`.card-accent`),
  gradien brand, dan animasi masuk (`.rise-in`).
- **Shell mobile** (`.mobile-shell`) berlebar maks `440px` yang menyerupai aplikasi
  native di layar besar, dengan `safe-area-inset` untuk perangkat berponi.

### Theme Switcher
Tersedia di header publik, menu "Lainnya", panel admin, dan halaman **Tema & Identitas**:
- Mode **Terang / Gelap**
- **7 palet warna** brand (Emerald, Teal, Hijau, Toska, Nila, Emas, Merah)
- Pengaturan identitas: nama, tagline, logo, visi, misi, kontak, maps

---

## 🔐 Akun Demo

| Peran | Username | Password | Catatan |
|---|---|---|---|
| **Super Admin** | `superadmin` | `superadmin123` | Akses penuh **+ mengatur modul** yang aktif di sidebar |
| Administrator | `admin` | `admin123` | Mengoperasikan semua modul (tanpa kelola modul) |
| Pengurus | `pengurus` | `pengurus123` | Modul akademik, asrama, keuangan, tahfidz, pembinaan, PSB |
| Ustadz / Guru | `ustadz` | `ustadz123` | Akademik, tahfidz, pembinaan, absensi |
| Musyrif Asrama | — | — | Asrama, penempatan kamar, piket, perizinan |
| Bendahara | `bendahara` | `bendahara123` | Tagihan, invoice, saldo, laporan keuangan |
| Operator | — | — | Konten landing page & data dasar |

Hak akses tiap peran diatur di **Peran & Akses**. Pengguna baru otomatis memakai
password `username123`.

### Super Admin vs Administrator
Perbedaan kuncinya ada pada **kapabilitas khusus** `modul`:

| | Super Admin | Administrator |
|---|---|---|
| Operasikan seluruh modul | ✅ | ✅ |
| Menu **Modul** di sidebar | ✅ | ❌ (tidak tampil) |
| Aktif/nonaktifkan modul | ✅ | ❌ (halaman menolak akses) |
| Kelola pengguna & peran | ✅ | ✅ |

Kapabilitas dapat diberikan/dicabut per peran di **Peran & Akses → Kapabilitas Khusus**.
Pengamanan berlapis: menu disembunyikan, halaman menampilkan "Akses terbatas",
dan fungsi `setActive` di composable menolak perubahan bila tidak berhak.

---

## 🚀 Menjalankan

```bash
npm install
npm run dev        # http://localhost:3000
```

Tanpa konfigurasi apa pun, aplikasi langsung berjalan dengan **data contoh (seed)** dan
menyimpan perubahan di `localStorage` — cocok untuk demo dan offline.

### Build produksi (PWA)
```bash
npm run build      # menghasilkan .output/public (SPA + service worker)
npm run preview
```

---

## 🗄️ Supabase (Opsional)

Aplikasi bersifat **offline-first**: Supabase hanya dipakai bila dikonfigurasi.
Urutan baca data: **Supabase → cache localStorage → seed bawaan**.

1. Salin `.env.example` menjadi `.env` dan isi:
   ```env
   NUXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
2. Jalankan `supabase/schema.sql` di SQL Editor Supabase (membuat tabel + RLS).
   Skrip ini **idempoten** — aman dijalankan berulang kali tanpa menambah data ganda
   (`create table if not exists`, `on conflict do nothing`, dan `drop policy if exists`).
3. Muat ulang aplikasi — data akan tersinkron otomatis.

---

## 📁 Struktur

```
app/
├── assets/css/main.css        # Design system (token, pola, kartu, bridge Nuxt UI)
├── components/
│   ├── AdminCrud.vue          # CRUD generik untuk semua modul admin
│   ├── AppHeader.vue          # Header publik + pencarian global
│   ├── BottomNav.vue          # Navigasi bawah bergaya native
│   ├── StatCard.vue, EmptyState.vue, SectionTitle.vue, PageHeader.vue
│   ├── LandingHero.vue, LandingStats.vue
│   └── ThemeSwitcher.vue, PwaInstaller.vue, AdminNav.vue
├── composables/
│   ├── useAdminStore.ts       # CRUD generik + seed data (satu store per resource)
│   ├── useResources.ts        # Registry semua resource (tabel, ikon, ordering)
│   ├── useAuth.ts             # Sesi & login (demo, lokal, Supabase Auth)
│   ├── useAuthz.ts            # Peran & hak akses (RBAC)
│   ├── useSiteSettings.ts     # Tema, palet warna, identitas
│   ├── useSupabase.ts         # Klien Supabase opsional
│   ├── useFormat.ts           # Format tanggal/angka Indonesia
│   └── useStatusColor.ts      # Warna badge per status
├── layouts/                   # default (publik), admin, blank
├── middleware/admin.ts        # Proteksi rute admin
├── pages/                     # Halaman publik + pages/admin/*
└── types/                     # Model & tipe database
supabase/schema.sql            # Skema tabel + RLS
```

---

## 🧩 Menambah Modul Baru

1. Tambahkan resource di `app/composables/useResources.ts` (+ seed di `useAdminStore.ts`).
2. Buat halaman `app/pages/admin/<modul>.vue` yang memakai `<AdminCrud>`:

```vue
<template>
  <AdminCrud
    resource="santri"
    title="Santri"
    icon="i-lucide-users"
    title-key="nama"
    subtitle-key="nis"
    badge-key="status"
    :fields="fields"
    :meta-keys="metaKeys"
  />
</template>
```

3. Tambahkan item navigasi di `app/layouts/admin.vue`.
