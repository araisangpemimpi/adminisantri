// Konfigurasi formulir PSB (dipakai bersama oleh halaman publik & admin).

export interface FormField {
  id: string
  kunci: string
  label: string
  tipe: string
  ikon: string
  wajib: boolean
  aktif: boolean
  bawaan?: boolean
}

export interface PsbConfig {
  tahun: string
  gelombang: string
  batas: string
  wajibBerkas: boolean
  nomorOtomatis: boolean
  buka: boolean
  fields: FormField[]
}

export const DEFAULT_PSB_FIELDS: FormField[] = [
  { id: 'f-nama', kunci: 'nama', label: 'Nama Lengkap', tipe: 'text', ikon: 'i-lucide-user', wajib: true, aktif: true, bawaan: true },
  { id: 'f-jk', kunci: 'jk', label: 'Jenis Kelamin', tipe: 'select', ikon: 'i-lucide-users', wajib: true, aktif: true, bawaan: true },
  { id: 'f-jenjang', kunci: 'jenjang', label: 'Jenjang', tipe: 'select', ikon: 'i-lucide-layers', wajib: true, aktif: true, bawaan: true },
  { id: 'f-tempat', kunci: 'tempatLahir', label: 'Tempat Lahir', tipe: 'text', ikon: 'i-lucide-map-pin', wajib: false, aktif: true, bawaan: true },
  { id: 'f-tanggal', kunci: 'tanggalLahir', label: 'Tanggal Lahir', tipe: 'date', ikon: 'i-lucide-calendar', wajib: false, aktif: true, bawaan: true },
  { id: 'f-sekolah', kunci: 'asalSekolah', label: 'Asal Sekolah', tipe: 'text', ikon: 'i-lucide-school', wajib: false, aktif: true, bawaan: true },
  { id: 'f-wali', kunci: 'wali', label: 'Nama Wali', tipe: 'text', ikon: 'i-lucide-users', wajib: false, aktif: true, bawaan: true },
  { id: 'f-hp', kunci: 'hp', label: 'No. WhatsApp', tipe: 'text', ikon: 'i-lucide-phone', wajib: true, aktif: true, bawaan: true },
  { id: 'f-alamat', kunci: 'alamat', label: 'Alamat Lengkap', tipe: 'textarea', ikon: 'i-lucide-map-pin', wajib: false, aktif: true, bawaan: true },
]

export const DEFAULT_PSB_CONFIG: PsbConfig = {
  tahun: `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
  gelombang: 'Gelombang 1',
  batas: '',
  wajibBerkas: true,
  nomorOtomatis: true,
  buka: true,
  fields: DEFAULT_PSB_FIELDS,
}

const KEY = 'pesantren-psb-form'

export function usePsbForm() {
  const config = useState<PsbConfig>('psb-form-config', () => structuredClone(DEFAULT_PSB_CONFIG))
  const loaded = useState('psb-form-loaded', () => false)

  function muat() {
    if (!import.meta.client || loaded.value) return
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PsbConfig>
        config.value = { ...structuredClone(DEFAULT_PSB_CONFIG), ...parsed }
      }
    }
    catch { /* abaikan */ }
    loaded.value = true
  }

  function simpan() {
    if (!import.meta.client) return
    try {
      localStorage.setItem(KEY, JSON.stringify(config.value))
    }
    catch { /* abaikan */ }
  }

  function reset() {
    config.value = structuredClone(DEFAULT_PSB_CONFIG)
    simpan()
  }

  return { config, loaded, muat, simpan, reset }
}
