// Utilitas penomoran otomatis (nomor pendaftaran, kode unik, invoice, transaksi).

export function useNumbering() {
  const KODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

  /** Kode unik acak, mis. A7X9K2. */
  function kodeUnik(len = 6) {
    let out = ''
    for (let i = 0; i < len; i++) {
      out += KODE_CHARS[Math.floor(Math.random() * KODE_CHARS.length)]
    }
    return out
  }

  /** Nomor urut berikutnya dari daftar yang ada, mis. PSB-2026-0007. */
  function nextNumber(prefix: string, existing: string[], pad = 4) {
    const nums = existing
      .map((s) => {
        const m = String(s ?? '').match(/(\d+)\s*$/)
        return m ? Number(m[1]) : 0
      })
      .filter(n => Number.isFinite(n))
    const next = (nums.length ? Math.max(...nums) : 0) + 1
    return `${prefix}${String(next).padStart(pad, '0')}`
  }

  /** Nomor pendaftaran PSB. */
  function nomorPendaftaran(existing: string[], tahun = new Date().getFullYear()) {
    return nextNumber(`PSB-${tahun}-`, existing, 4)
  }

  /** Nomor invoice, mis. INV/2026/09/0001. */
  function nomorInvoice(existing: string[]) {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    return nextNumber(`INV/${y}/${m}/`, existing, 4)
  }

  /** Nomor transaksi, mis. TRX/2026/09/0001. */
  function nomorTransaksi(existing: string[]) {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    return nextNumber(`TRX/${y}/${m}/`, existing, 4)
  }

  return { kodeUnik, nextNumber, nomorPendaftaran, nomorInvoice, nomorTransaksi }
}
