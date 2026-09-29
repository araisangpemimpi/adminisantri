export interface Santri {
  id: string
  nis: string
  nama: string
  jk: 'L' | 'P'
  rombel: string
  kamar: string
  wali: string
  hp: string
  asal: string
  tahunMasuk: string
  status: string
}

export interface Guru {
  id: string
  nama: string
  nip: string
  mapel: string
  jabatan: string
  hp: string
  status: string
}

export interface Mapel {
  id: string
  nama: string
  kategori: string
  jam: number
  pengampu: string
  aktif: boolean
}

export interface Rombel {
  id: string
  nama: string
  tingkat: string
  wali: string
  kamar: string
  kapasitas: number
  jenjang: string
  aktif: boolean
}

export interface Absensi {
  id: string
  tanggal: string
  rombel: string
  sesi: string
  hadir: number
  sakit: number
  izin: number
  alpa: number
  pengampu: string
  catatan: string
}

export interface Perizinan {
  id: string
  santri: string
  rombel: string
  jenis: string
  mulai: string
  selesai: string
  alasan: string
  status: string
  penanggungJawab: string
}

export interface Pembayaran {
  id: string
  santri: string
  rombel: string
  jenis: string
  periode: string
  jumlah: number
  tanggal: string
  metode: string
  status: string
  catatan: string
}

export interface Event {
  id: string
  nama: string
  tanggal: string
  lokasi: string
  penanggungJawab: string
  kategori: string
  deskripsi: string
  status: string
  aktif: boolean
}

export interface Ekskul {
  id: string
  nama: string
  deskripsi: string
  pembina: string
  hari: string
  jam: string
  lokasi: string
  ikon: string
  aktif: boolean
}

export type AnyRow = Record<string, any>
