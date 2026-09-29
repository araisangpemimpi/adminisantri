// Kontrol bagian mana saja dari landing page yang ingin ditampilkan.
// Diatur dari /admin/landing/tampilan.

export interface LandingSection {
  id: string
  nama: string
  deskripsi: string
  ikon: string
  /** Urutan tampil di halaman depan. */
  urutan: number
  aktif: boolean
  /** Bagian inti tidak boleh dimatikan (mis. hero). */
  wajib?: boolean
}

export const DEFAULT_SECTIONS: LandingSection[] = [
  { id: 'hero', nama: 'Hero Slider', deskripsi: 'Slide gambar utama di paling atas', ikon: 'i-lucide-images', urutan: 1, aktif: true, wajib: true },
  { id: 'stats', nama: 'Statistik Pesantren', deskripsi: 'Jumlah santri, guru, rombel, ekskul', ikon: 'i-lucide-bar-chart-3', urutan: 2, aktif: true },
  { id: 'agenda', nama: 'Agenda Terdekat', deskripsi: 'Daftar kegiatan yang akan datang', ikon: 'i-lucide-calendar-days', urutan: 3, aktif: true },
  { id: 'pengumuman', nama: 'Pengumuman', deskripsi: 'Kabar & informasi terbaru', ikon: 'i-lucide-megaphone', urutan: 4, aktif: true },
  { id: 'prestasi', nama: 'Prestasi', deskripsi: 'Capaian santri (carousel)', ikon: 'i-lucide-trophy', urutan: 5, aktif: true },
  { id: 'galeri', nama: 'Galeri', deskripsi: 'Pratinjau album dokumentasi', ikon: 'i-lucide-image', urutan: 6, aktif: true },
  { id: 'ekskul', nama: 'Ekstrakurikuler', deskripsi: 'Daftar kegiatan pengembangan diri', ikon: 'i-lucide-medal', urutan: 7, aktif: true },
  { id: 'psb', nama: 'Ajakan PSB', deskripsi: 'Banner pendaftaran santri baru', ikon: 'i-lucide-clipboard-list', urutan: 8, aktif: true },
  { id: 'kontak', nama: 'Kontak Cepat', deskripsi: 'Tombol WhatsApp & telepon', ikon: 'i-lucide-phone', urutan: 9, aktif: true },
]

const SECTIONS_KEY = 'pesantren-landing-sections'

export function useLandingSections() {
  const sections = useState<LandingSection[]>('landing-sections', () => structuredClone(DEFAULT_SECTIONS))
  const loaded = useState('landing-sections-loaded', () => false)

  const aktif = computed(() =>
    sections.value
      .filter(s => s.aktif)
      .sort((a, b) => a.urutan - b.urutan)
      .map(s => s.id),
  )

  function isOn(id: string) {
    return aktif.value.includes(id)
  }

  function load() {
    if (!import.meta.client || loaded.value) return
    try {
      const raw = localStorage.getItem(SECTIONS_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as LandingSection[]
        const map = new Map(parsed.map(s => [s.id, s]))
        sections.value = DEFAULT_SECTIONS.map(d => ({ ...d, ...(map.get(d.id) ?? {}) }))
      }
    }
    catch { /* abaikan */ }
    loaded.value = true
  }

  function persist() {
    if (!import.meta.client) return
    try {
      localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections.value))
    }
    catch { /* abaikan */ }
  }

  function toggle(id: string, on?: boolean) {
    const s = sections.value.find(x => x.id === id)
    if (!s || (s.wajib && on === false)) return
    s.aktif = on ?? !s.aktif
    persist()
  }

  function move(id: string, arah: -1 | 1) {
    const urut = [...sections.value].sort((a, b) => a.urutan - b.urutan)
    const i = urut.findIndex(s => s.id === id)
    const j = i + arah
    if (i < 0 || j < 0 || j >= urut.length) return
    const a = urut[i]!, b = urut[j]!
    const tmp = a.urutan
    a.urutan = b.urutan
    b.urutan = tmp
    persist()
  }

  function reset() {
    sections.value = structuredClone(DEFAULT_SECTIONS)
    persist()
  }

  return { sections, aktif, isOn, load, toggle, move, reset }
}
