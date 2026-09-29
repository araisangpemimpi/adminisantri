// Generator QR code (client-side, dipakai untuk kartu santri).
// Library `qrcode` di-import dinamis agar tidak membebani bundle awal.

export function useQr() {
  const cache = new Map<string, string>()

  /** Hasilkan data URL PNG dari teks QR. */
  async function toDataUrl(text: string, opts: { width?: number, margin?: number } = {}) {
    const key = `${text}|${opts.width ?? 256}|${opts.margin ?? 1}`
    const cached = cache.get(key)
    if (cached) return cached

    try {
      const QR = await import('qrcode')
      const url = await QR.toDataURL(text, {
        width: opts.width ?? 256,
        margin: opts.margin ?? 1,
        errorCorrectionLevel: 'M',
        color: { dark: '#0b1f1c', light: '#ffffff' },
      })
      cache.set(key, url)
      return url
    }
    catch {
      return ''
    }
  }

  /** Teks standar untuk kartu santri. */
  function santriPayload(s: { nis?: string, nama?: string, rombel?: string, id?: string }) {
    return JSON.stringify({
      t: 'santri',
      id: s.id ?? '',
      nis: s.nis ?? '',
      nama: s.nama ?? '',
      rombel: s.rombel ?? '',
    })
  }

  return { toDataUrl, santriPayload }
}
