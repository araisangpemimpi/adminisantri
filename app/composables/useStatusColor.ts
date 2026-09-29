// Warna badge konsisten per status di seluruh aplikasi.
const STATUS_MAP: Record<string, string> = {
  // Hijau
  aktif: 'success', lunas: 'success', disetujui: 'success', selesai: 'success', hadir: 'success', terverifikasi: 'success',
  // Kuning
  menunggu: 'warning', pending: 'warning', 'belum bayar': 'warning', terjadwal: 'warning', izin: 'warning', 'diproses': 'warning',
  // Merah
  alpa: 'error', ditolak: 'error', 'tidak aktif': 'error', batal: 'error',
  // Biru/Info
  sakit: 'info', baru: 'info', berlangsung: 'info',
}

export function useStatusColor() {
  function color(status?: string) {
    if (!status) return 'neutral'
    return STATUS_MAP[status.toLowerCase()] ?? 'neutral'
  }
  function icon(status?: string) {
    const s = (status ?? '').toLowerCase()
    if (['aktif', 'lunas', 'disetujui', 'selesai', 'hadir'].includes(s)) return 'i-lucide-circle-check'
    if (['menunggu', 'pending', 'belum bayar', 'terjadwal'].includes(s)) return 'i-lucide-clock'
    if (['alpa', 'ditolak', 'tidak aktif', 'batal'].includes(s)) return 'i-lucide-circle-x'
    return 'i-lucide-circle'
  }
  return { color, icon }
}
