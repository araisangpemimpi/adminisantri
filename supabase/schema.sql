-- =====================================================================
--  Pesantren App — Skema Supabase (opsional)
--  Aplikasi berjalan offline-first tanpa Supabase. Jalankan skrip ini
--  bila ingin menyinkronkan data ke Supabase.
--  Catatan: kolom memakai camelCase agar cocok dengan payload aplikasi.
-- =====================================================================

-- ---------- Konten landing ----------
create table if not exists hero_slides (
  id            text primary key default gen_random_uuid()::text,
  judul         text,
  deskripsi     text,
  gambar        text,
  badge         text,
  link          text,
  urutan        int default 0,
  aktif         boolean default true,
  created_at    timestamptz default now()
);

create table if not exists agendas (
  id            text primary key default gen_random_uuid()::text,
  judul         text,
  tanggal       date,
  jam           text,
  lokasi        text,
  kategori      text,
  created_at    timestamptz default now()
);

create table if not exists announcements (
  id            text primary key default gen_random_uuid()::text,
  judul         text,
  isi           text,
  tanggal       date,
  kategori      text,
  penting       boolean default false,
  created_at    timestamptz default now()
);

create table if not exists prestasi (
  id            text primary key default gen_random_uuid()::text,
  judul         text,
  nama          text,
  tingkat       text,
  kategori      text,
  tahun         text,
  gambar        text,
  deskripsi     text,
  aktif         boolean default true,
  created_at    timestamptz default now()
);

create table if not exists galeri (
  id            text primary key default gen_random_uuid()::text,
  judul         text,
  gambar        text,
  kategori      text,
  deskripsi     text,
  tanggal       date,
  created_at    timestamptz default now()
);

-- Album galeri (induk) dan foto di dalamnya (anak).
create table if not exists galeri_albums (
  id            text primary key default gen_random_uuid()::text,
  nama          text,
  deskripsi     text,
  kategori      text,
  tanggal       date,
  sampul        text,
  aktif         boolean default true,
  created_at    timestamptz default now()
);

create table if not exists galeri_photos (
  id            text primary key default gen_random_uuid()::text,
  "albumId"     text references galeri_albums(id) on delete cascade,
  album         text,
  judul         text,
  gambar        text,
  kategori      text,
  deskripsi     text,
  tanggal       date,
  tampil        boolean default true,
  created_at    timestamptz default now()
);

create table if not exists contacts (
  id            text primary key default gen_random_uuid()::text,
  nama          text,
  email         text,
  hp            text,
  pesan         text,
  status        text default 'Baru',
  created_at    timestamptz default now()
);

-- ---------- Data induk ----------
create table if not exists santri (
  id            text primary key default gen_random_uuid()::text,
  nis           text,
  nama          text,
  jk            text,
  rombel        text,
  kamar         text,
  wali          text,
  hp            text,
  asal          text,
  "tahunMasuk"  text,
  status        text default 'Aktif',
  created_at    timestamptz default now()
);

create table if not exists teachers (
  id            text primary key default gen_random_uuid()::text,
  nama          text,
  nip           text,
  mapel         text,
  jabatan       text,
  hp            text,
  status        text default 'Aktif',
  created_at    timestamptz default now()
);

create table if not exists mapel (
  id            text primary key default gen_random_uuid()::text,
  nama          text,
  kategori      text,
  jam           int default 0,
  pengampu      text,
  aktif         boolean default true,
  created_at    timestamptz default now()
);

create table if not exists rombel (
  id            text primary key default gen_random_uuid()::text,
  nama          text,
  tingkat       text,
  jenjang       text,
  wali          text,
  kamar         text,
  kapasitas     int default 0,
  aktif         boolean default true,
  created_at    timestamptz default now()
);

create table if not exists ekstrakurikuler (
  id            text primary key default gen_random_uuid()::text,
  nama          text,
  deskripsi     text,
  pembina       text,
  hari          text,
  jam           text,
  lokasi        text,
  ikon          text,
  aktif         boolean default true,
  created_at    timestamptz default now()
);

create table if not exists events (
  id                text primary key default gen_random_uuid()::text,
  nama              text,
  tanggal           date,
  lokasi            text,
  "penanggungJawab" text,
  kategori          text,
  deskripsi         text,
  status            text default 'Terjadwal',
  aktif             boolean default true,
  created_at        timestamptz default now()
);

-- ---------- Transaksional ----------
create table if not exists absensi (
  id            text primary key default gen_random_uuid()::text,
  tanggal       date,
  sesi          text,
  rombel        text,
  hadir         int default 0,
  sakit         int default 0,
  izin          int default 0,
  alpa          int default 0,
  pengampu      text,
  catatan       text,
  created_at    timestamptz default now()
);

create table if not exists perizinan (
  id                text primary key default gen_random_uuid()::text,
  santri            text,
  rombel            text,
  jenis             text,
  mulai             date,
  selesai           date,
  alasan            text,
  status            text default 'Menunggu',
  "penanggungJawab" text,
  created_at        timestamptz default now()
);

create table if not exists pembayaran (
  id            text primary key default gen_random_uuid()::text,
  santri        text,
  rombel        text,
  jenis         text,
  periode       text,
  jumlah        numeric default 0,
  tanggal       date,
  metode        text,
  status        text default 'Belum Bayar',
  catatan       text,
  created_at    timestamptz default now()
);

create table if not exists psb_leads (
  id              text primary key default gen_random_uuid()::text,
  "noPendaftaran" text unique,
  "kodeUnik"      text,
  nama            text,
  jk              text,
  jenjang         text,
  gelombang       text,
  "tempatLahir"   text,
  "tanggalLahir"  date,
  "asalSekolah"   text,
  wali            text,
  hp              text,
  alamat          text,
  berkas          text[],
  "nilaiSeleksi"  numeric default 0,
  status          text default 'Menunggu',
  catatan         text,
  created_at      timestamptz default now()
);

-- Rincian biaya pendidikan PSB (ditampilkan di tab Biaya).
create table if not exists biaya_pendidikan (
  id            text primary key default gen_random_uuid()::text,
  jenjang       text not null,
  komponen      text not null,
  jumlah        numeric default 0,
  tipe          text default 'Sekali',
  keterangan    text,
  urutan        int default 0,
  aktif         boolean default true,
  created_at    timestamptz default now()
);

-- ---------- Modul operasional ----------
create table if not exists pemberitahuan (
  id            text primary key default gen_random_uuid()::text,
  judul         text not null,
  isi           text,
  kategori      text,
  prioritas     text default 'Normal',
  sasaran       text default 'Semua',
  tanggal       date,
  aktif         boolean default true,
  created_at    timestamptz default now()
);

create table if not exists tahfidz (
  id            text primary key default gen_random_uuid()::text,
  santri        text not null,
  rombel        text,
  juz           text,
  surah         text,
  ayat          int default 0,
  jenis         text,
  nilai         text,
  pengampu      text,
  tanggal       date,
  catatan       text,
  created_at    timestamptz default now()
);

create table if not exists asrama (
  id            text primary key default gen_random_uuid()::text,
  nama          text not null,
  gedung        text,
  jenis         text,
  kapasitas     int default 0,
  terisi        int default 0,
  kamar         int default 0,
  musyrif       text,
  fasilitas     text,
  aktif         boolean default true,
  created_at    timestamptz default now()
);

create table if not exists pembinaan (
  id            text primary key default gen_random_uuid()::text,
  santri        text not null,
  rombel        text,
  jenis         text not null,
  kategori      text,
  poin          int default 0,
  tindakan      text,
  status        text default 'Dalam Pembinaan',
  pembina       text,
  tanggal       date,
  catatan       text,
  created_at    timestamptz default now()
);

-- ---------- Pengguna & peran (sistem) ----------
create table if not exists app_users (
  id            text primary key,
  nama          text not null,
  username      text unique not null,
  roleid        text,
  "rombelIds"   text[],
  password      text,
  aktif         boolean default true,
  created_at    timestamptz default now()
);

create table if not exists app_roles (
  id            text primary key,
  nama          text not null,
  deskripsi     text,
  resources     text[],
  actions       text[],
  "isSystem"    boolean default false,
  created_at    timestamptz default now()
);

-- ---------- Modul Akademik ----------
create table if not exists kelas_paralel (
  id            text primary key default gen_random_uuid()::text,
  nama          text not null,
  rombel        text,
  tingkat       text,
  program       text,
  ruang         text,
  wali          text,
  jumlah        int default 0,
  kapasitas     int default 0,
  aktif         boolean default true,
  created_at    timestamptz default now()
);

create table if not exists jadwal (
  id            text primary key default gen_random_uuid()::text,
  hari          text,
  jam_mulai     text,
  jam_selesai   text,
  rombel        text,
  mapel         text,
  guru          text,
  ruang         text,
  aktif         boolean default true,
  created_at    timestamptz default now()
);

create table if not exists kompetensi_dasar (
  id            text primary key default gen_random_uuid()::text,
  kode          text not null,
  mapel         text,
  kelas         text,
  semester      text,
  deskripsi     text,
  kkm           int default 75,
  aktif         boolean default true,
  created_at    timestamptz default now()
);

create table if not exists penilaian (
  id            text primary key default gen_random_uuid()::text,
  santri        text not null,
  nis           text,
  rombel        text,
  mapel         text,
  kd            text,
  jenis         text,
  nilai         numeric default 0,
  semester      text,
  guru          text,
  tanggal       date,
  created_at    timestamptz default now()
);

create table if not exists raport (
  id            text primary key default gen_random_uuid()::text,
  santri        text not null,
  nis           text,
  rombel        text,
  semester      text,
  tahun         text,
  wali          text,
  rata          numeric default 0,
  "poinSikap"   int default 100,
  peringkat     int,
  status        text default 'Draf',
  catatan       text,
  tanggal       date,
  created_at    timestamptz default now()
);

-- ---------- Modul Asrama ----------
create table if not exists penempatan_kamar (
  id            text primary key default gen_random_uuid()::text,
  santri        text not null,
  nis           text,
  asrama        text,
  kamar         text,
  bed           text,
  musyrif       text,
  status        text default 'Aktif',
  tanggal       date,
  created_at    timestamptz default now()
);

create table if not exists jadwal_piket (
  id            text primary key default gen_random_uuid()::text,
  hari          text,
  asrama        text,
  kamar         text,
  petugas       text,
  tugas         text,
  pengawas      text,
  aktif         boolean default true,
  created_at    timestamptz default now()
);

-- ---------- Modul Keuangan ----------
create table if not exists tagihan (
  id            text primary key default gen_random_uuid()::text,
  santri        text not null,
  nis           text,
  rombel        text,
  jenis         text,
  periode       text,
  jumlah        numeric default 0,
  jatuh_tempo   date,
  status        text default 'Belum Bayar',
  tahun         text,
  created_at    timestamptz default now()
);

create table if not exists invoice (
  id            text primary key default gen_random_uuid()::text,
  nomor         text unique,
  santri        text not null,
  nis           text,
  rombel        text,
  jenis         text,
  periode       text,
  jumlah        numeric default 0,
  metode        text,
  status        text default 'Draf',
  tanggal       date,
  jatuh_tempo   date,
  catatan       text,
  created_at    timestamptz default now()
);

create table if not exists saldo_santri (
  id            text primary key default gen_random_uuid()::text,
  santri        text not null,
  nis           text,
  rombel        text,
  saldo         numeric default 0,
  terakhir      date,
  catatan       text,
  created_at    timestamptz default now()
);

create table if not exists transaksi (
  id            text primary key default gen_random_uuid()::text,
  nomor         text unique,
  santri        text,
  nis           text,
  jenis         text,
  arah          text default 'Masuk',
  jumlah        numeric default 0,
  metode        text,
  referensi     text,
  petugas       text,
  tanggal       date,
  catatan       text,
  created_at    timestamptz default now()
);

-- ---------- Modul Tahfidz ----------
create table if not exists target_tahfidz (
  id            text primary key default gen_random_uuid()::text,
  santri        text not null,
  nis           text,
  rombel        text,
  "targetJuz"   int default 0,
  "capaianJuz"  int default 0,
  "targetSurah" text,
  pembimbing    text,
  periode       text,
  deadline      date,
  status        text default 'Berjalan',
  catatan       text,
  created_at    timestamptz default now()
);

create table if not exists munaqosah (
  id            text primary key default gen_random_uuid()::text,
  santri        text not null,
  nis           text,
  rombel        text,
  juz           text,
  penguji       text,
  nilai         numeric default 0,
  predikat      text,
  status        text default 'Menunggu',
  tanggal       date,
  catatan       text,
  created_at    timestamptz default now()
);

-- ---------- Modul Pembinaan ----------
create table if not exists konseling (
  id            text primary key default gen_random_uuid()::text,
  santri        text not null,
  nis           text,
  rombel        text,
  jenis         text,
  konselor      text,
  tanggal       date,
  ringkasan     text,
  "tindakLanjut" text,
  status        text default 'Berlangsung',
  rahasia       boolean default true,
  created_at    timestamptz default now()
);

create table if not exists prestasi_santri (
  id            text primary key default gen_random_uuid()::text,
  santri        text not null,
  nis           text,
  rombel        text,
  judul         text not null,
  kategori      text,
  tingkat       text,
  poin          int default 0,
  tahun         text,
  pemberi       text,
  tanggal       date,
  keterangan    text,
  created_at    timestamptz default now()
);

-- ---------- Modul PSB ----------
create table if not exists psb_pengumuman (
  id                  text primary key default gen_random_uuid()::text,
  judul               text not null,
  gelombang           text,
  tahun               text,
  isi                 text,
  "tanggalPengumuman" date,
  status              text default 'Draf',
  "jumlahLulus"       int default 0,
  "jumlahTidakLulus"  int default 0,
  aktif               boolean default false,
  created_at          timestamptz default now()
);

-- ---------- Pengaturan situs (satu baris, id = 1) ----------
create table if not exists site_settings (
  id            int primary key default 1,
  site_name     text,
  tagline       text,
  nsp           text,
  akreditasi    text,
  berdiri       text,
  visi          text,
  misi          text,
  telepon       text,
  wa            text,
  email         text,
  alamat        text,
  jam           text,
  maps          text,
  logo_url      text,
  palette_id    text default 'emerald',
  mode          text default 'light'
);

-- ---------- Storage (untuk unggah foto album) ----------
-- Buat bucket publik bernama "galeri" lalu izinkan akses anonim.
-- Semua pernyataan di bawah idempoten: aman dijalankan berulang kali.
insert into storage.buckets (id, name, public)
values ('galeri', 'galeri', true)
on conflict (id) do update set public = true;

do $$
declare
  p record;
begin
  for p in
    select * from (values
      ('galeri_public_read',  'select'),
      ('galeri_anon_write',   'insert'),
      ('galeri_anon_update',  'update'),
      ('galeri_anon_delete',  'delete')
    ) as v(nama, aksi)
  loop
    execute format('drop policy if exists %I on storage.objects;', p.nama);
    if p.aksi = 'insert' then
      execute format(
        'create policy %I on storage.objects for insert to anon, authenticated with check (bucket_id = ''galeri'');',
        p.nama
      );
    elsif p.aksi = 'select' then
      execute format(
        'create policy %I on storage.objects for select to anon, authenticated using (bucket_id = ''galeri'');',
        p.nama
      );
    else
      execute format(
        'create policy %I on storage.objects for %s to anon, authenticated using (bucket_id = ''galeri'');',
        p.nama, p.aksi
      );
    end if;
  end loop;
end $$;

-- Aktifkan RLS lalu izinkan akses anonim (sesuaikan untuk produksi!).
do $$
declare t text;
begin
  foreach t in array array[
    'hero_slides','agendas','announcements','prestasi','galeri','contacts',
    'galeri_albums','galeri_photos',
    'santri','teachers','mapel','rombel','ekstrakurikuler','events',
    'absensi','perizinan','pembayaran','psb_leads','psb_pengumuman','biaya_pendidikan',
    'pemberitahuan','tahfidz','asrama','pembinaan',
    'kelas_paralel','jadwal','kompetensi_dasar','penilaian','raport',
    'penempatan_kamar','jadwal_piket',
    'tagihan','invoice','saldo_santri','transaksi',
    'target_tahfidz','munaqosah','konseling','prestasi_santri',
    'app_users','app_roles','site_settings'
  ]
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists %I on %I;', t || '_anon_all', t);
    execute format(
      'create policy %I on %I for all to anon, authenticated using (true) with check (true);',
      t || '_anon_all', t
    );
  end loop;
end $$;
