// Tema aplikasi: mode light/dark + palet warna brand (CSR only).
// Palet mengisi CSS var --brand-* yang dipakai seluruh UI & komponen Nuxt UI.

export interface BrandPalette {
  id: string
  nama: string
  /** Warna utama (latar tombol, gradien). */
  primary: string
  /** Pasangan gelap untuk gradien. */
  dark: string
  /** Warna muda untuk latar lembut (light mode). */
  light: string
  /**
   * Warna TERANG untuk dipakai sebagai TEKS/ikon di atas permukaan gelap
   * (dark mode). Warna `primary`/`dark` yang pekat tidak kontras di atas
   * latar gelap, sehingga tiap palet punya varian terangnya sendiri.
   */
  onDark: string
  /** Latar lembut di dark mode (campuran dibuat dari onDark agar senada). */
  onDarkSoft?: string
}

export const PALETTES: BrandPalette[] = [
  { id: 'emerald', nama: 'Emerald Pesantren', primary: '#0f766e', dark: '#115e59', light: '#ccfbf1', onDark: '#5eead4' },
  { id: 'teal', nama: 'Teal Segar', primary: '#0d9488', dark: '#0f766e', light: '#ccfbf1', onDark: '#5eead4' },
  { id: 'green', nama: 'Hijau Daun', primary: '#16a34a', dark: '#15803d', light: '#dcfce7', onDark: '#86efac' },
  { id: 'cyan', nama: 'Toska Langit', primary: '#0891b2', dark: '#0e7490', light: '#cffafe', onDark: '#67e8f9' },
  { id: 'indigo', nama: 'Nila Malam', primary: '#4f46e5', dark: '#4338ca', light: '#e0e7ff', onDark: '#a5b4fc' },
  { id: 'amber', nama: 'Emas Madu', primary: '#d97706', dark: '#b45309', light: '#fef3c7', onDark: '#fcd34d' },
  { id: 'rose', nama: 'Merah Saga', primary: '#e11d48', dark: '#be123c', light: '#ffe4e6', onDark: '#fda4af' },
]

const SETTINGS_KEY = 'pesantren-settings'

export interface SiteSettings {
  siteName: string
  tagline: string
  nsp: string
  akreditasi: string
  berdiri: string
  visi: string
  misi: string
  telepon: string
  wa: string
  email: string
  alamat: string
  jam: string
  maps: string
  logo: string
  paletteId: string
  mode: 'light' | 'dark'
}

const DEFAULTS: SiteSettings = {
  siteName: 'Pesantren Al-Hikmah',
  tagline: 'Berilmu • Berakhlak • Bermanfaat',
  nsp: '51001',
  akreditasi: 'A',
  berdiri: '1985',
  visi: 'Membentuk generasi islami yang berilmu, berakhlak mulia, dan bermanfaat bagi umat.',
  misi: 'Menyelenggarakan pendidikan tahfidz dan kitab kuning; membina akhlak dan kemandirian santri; mengembangkan keterampilan yang relevan dengan kebutuhan zaman.',
  telepon: '(0274) 456-789',
  wa: '6281234567890',
  email: 'info@alhikmah.sch.id',
  alamat: 'Jl. Pesantren No. 45, Bantul, Yogyakarta',
  jam: 'Setiap hari 06.00–21.00 WIB',
  maps: 'https://maps.google.com/?q=Bantul+Yogyakarta',
  logo: '',
  paletteId: 'emerald',
  mode: 'light',
}

export function useSiteSettings() {
  const settings = useState<SiteSettings>('site-settings', () => ({ ...DEFAULTS }))

  const palette = computed<BrandPalette>(
    () => PALETTES.find(p => p.id === settings.value.paletteId) || PALETTES[0]!,
  )

  function applyToDom() {
    if (!import.meta.client) return
    const root = document.documentElement
    root.classList.toggle('dark', settings.value.mode === 'dark')
    root.style.colorScheme = settings.value.mode
    root.style.setProperty('--brand-500', palette.value.primary)
    root.style.setProperty('--brand-600', palette.value.primary)
    root.style.setProperty('--brand-700', palette.value.dark)
    root.style.setProperty('--brand-100', palette.value.light)
    // Varian terang untuk teks/ikon di atas permukaan gelap (dark mode).
    root.style.setProperty('--brand-on', palette.value.onDark)
    // Teks brand: di light pakai primary, di dark pakai varian terang.
    root.style.setProperty('--brand-text', settings.value.mode === 'dark' ? palette.value.onDark : palette.value.primary)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', settings.value.mode === 'dark' ? palette.value.dark : palette.value.primary)
  }

  function load() {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem(SETTINGS_KEY)
      if (raw) settings.value = { ...DEFAULTS, ...JSON.parse(raw) }
    }
    catch { /* abaikan */ }
    applyToDom()
    void refreshFromSupabase()
  }

  async function refreshFromSupabase() {
    if (!import.meta.client) return
    const sb = await getSupabase()
    if (!sb) return
    try {
      const { data } = await sb.from('site_settings').select('*').eq('id', 1).maybeSingle()
      if (!data) return
      const map: Array<[keyof SiteSettings, string]> = [
        ['siteName', 'site_name'], ['tagline', 'tagline'], ['visi', 'visi'], ['misi', 'misi'],
        ['telepon', 'telepon'], ['email', 'email'], ['alamat', 'alamat'], ['jam', 'jam'],
        ['wa', 'wa'], ['maps', 'maps'], ['akreditasi', 'akreditasi'], ['berdiri', 'berdiri'],
        ['nsp', 'nsp'], ['logo', 'logo_url'], ['paletteId', 'palette_id'],
      ]
      for (const [key, col] of map) {
        const value = data[col]
        if (value) (settings.value as any)[key] = value
      }
      if (data.mode === 'dark' || data.mode === 'light') settings.value.mode = data.mode
      persist()
      applyToDom()
    }
    catch { /* tetap pakai lokal */ }
  }

  function persist() {
    if (!import.meta.client) return
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings.value))
    }
    catch { /* abaikan */ }
  }

  function setPalette(id: string) {
    settings.value.paletteId = id
    persist()
    applyToDom()
  }

  function setMode(mode: 'light' | 'dark') {
    settings.value.mode = mode
    persist()
    applyToDom()
  }

  function toggleMode() {
    setMode(settings.value.mode === 'dark' ? 'light' : 'dark')
  }

  function update(patch: Partial<SiteSettings>) {
    settings.value = { ...settings.value, ...patch }
    persist()
    applyToDom()
  }

  return { settings, palette, palettes: PALETTES, load, applyToDom, setPalette, setMode, toggleMode, update, persist }
}
