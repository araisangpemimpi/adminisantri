// Format tanggal & angka ke locale Indonesia.

const HARI = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const BULAN_SINGKAT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

function toDate(value: unknown): Date | null {
  if (!value) return null
  const d = new Date(String(value))
  return Number.isNaN(d.getTime()) ? null : d
}

export function useFormat() {
  function tanggal(value: unknown, opts: { hari?: boolean; tahun?: boolean } = {}) {
    const d = toDate(value)
    if (!d) return '—'
    const parts = [d.getDate(), BULAN[d.getMonth()]]
    if (opts.tahun !== false) parts.push(String(d.getFullYear()))
    const tgl = parts.join(' ')
    return opts.hari === false ? tgl : `${HARI[d.getDay()]}, ${tgl}`
  }

  function tanggalSingkat(value: unknown) {
    const d = toDate(value)
    if (!d) return '—'
    return `${d.getDate()} ${BULAN_SINGKAT[d.getMonth()]} ${d.getFullYear()}`
  }

  function tanggalRelatif(value: unknown) {
    const d = toDate(value)
    if (!d) return '—'
    const diffDays = Math.round((d.getTime() - Date.now()) / 86400000)
    if (diffDays === 0) return 'Hari ini'
    if (diffDays === 1) return 'Besok'
    if (diffDays === -1) return 'Kemarin'
    if (diffDays > 1 && diffDays <= 30) return `${diffDays} hari lagi`
    if (diffDays < -1 && diffDays >= -30) return `${Math.abs(diffDays)} hari lalu`
    return tanggalSingkat(d)
  }

  function waktu(value: unknown) {
    const d = toDate(value)
    if (!d) return '—'
    return `${String(d.getHours()).padStart(2, '0')}.${String(d.getMinutes()).padStart(2, '0')}`
  }

  function rupiah(value: unknown) {
    const n = Number(value)
    if (!Number.isFinite(n)) return 'Rp0'
    return `Rp${n.toLocaleString('id-ID')}`
  }

  function angka(value: unknown) {
    const n = Number(value)
    return Number.isFinite(n) ? n.toLocaleString('id-ID') : '0'
  }

  function inisial(nama?: string) {
    if (!nama) return '?'
    return nama
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase() ?? '')
      .join('')
  }

  return { tanggal, tanggalSingkat, tanggalRelatif, waktu, rupiah, angka, inisial, HARI, BULAN }
}
