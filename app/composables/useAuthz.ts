// Peran & hak akses (RBAC) sederhana — CSR only.
// Resource = id modul / section. Aksi: read, create, update, delete.

export type Action = 'read' | 'create' | 'update' | 'delete'

export interface Role {
  id: string
  nama: string
  deskripsi: string
  /** '*' berarti semua resource. */
  resources: string[] | '*'
  actions: Action[]
  isSystem?: boolean
  /**
   * Kapabilitas khusus di luar resource biasa.
   * `modul` = boleh mengaktifkan/menonaktifkan modul (Super Admin).
   */
  caps?: Array<'modul'>
}

export interface AppUser {
  id: string
  nama: string
  username: string
  roleId: string
  /** Kosongkan agar user bisa akses semua rombel; isi untuk membatasi. */
  rombelIds?: string[]
}

export const ALL_ACTIONS: Action[] = ['read', 'create', 'update', 'delete']

export const ROLES_KEY = 'pesantren-roles'

export const DEFAULT_ROLES: Role[] = [
  {
    id: 'superadmin',
    nama: 'Super Admin',
    deskripsi: 'Akses penuh termasuk mengatur modul mana yang aktif di sidebar.',
    resources: '*',
    actions: [...ALL_ACTIONS],
    caps: ['modul'],
    isSystem: true,
  },
  {
    id: 'admin',
    nama: 'Administrator',
    deskripsi: 'Mengoperasikan seluruh modul, tanpa hak mengatur modul yang aktif.',
    resources: '*',
    actions: [...ALL_ACTIONS],
    isSystem: true,
  },
  {
    id: 'pengurus',
    nama: 'Pengurus',
    deskripsi: 'Mengelola seluruh modul akademik, asrama, keuangan, tahfidz, pembinaan & PSB.',
    resources: '*',
    actions: [...ALL_ACTIONS],
    isSystem: true,
  },
  {
    id: 'ustadz',
    nama: 'Ustadz / Guru',
    deskripsi: 'Akademik, tahfidz, pembinaan, dan absensi.',
    resources: [
      'santri', 'rombel', 'kelasParalel', 'mapel', 'jadwal', 'kd', 'penilaian', 'raport', 'absensi',
      'tahfidz', 'targetTahfidz', 'munaqosah',
      'pembinaan', 'konseling', 'prestasi_santri',
      'asrama', 'penempatan', 'piket', 'perizinan', 'pemberitahuan',
    ],
    actions: ['read', 'create', 'update'],
    isSystem: true,
  },
  {
    id: 'musyrif',
    nama: 'Musyrif Asrama',
    deskripsi: 'Mengelola asrama, penempatan kamar, piket, dan perizinan santri.',
    resources: ['santri', 'asrama', 'penempatan', 'piket', 'perizinan', 'pembinaan', 'konseling', 'tahfidz', 'pemberitahuan'],
    actions: ['read', 'create', 'update'],
    isSystem: true,
  },
  {
    id: 'bendahara',
    nama: 'Bendahara',
    deskripsi: 'Mengelola tagihan, invoice, saldo, dan laporan keuangan.',
    resources: ['santri', 'rombel', 'tagihan', 'invoice', 'saldo', 'transaksi', 'biaya', 'pemberitahuan'],
    actions: ['read', 'create', 'update', 'delete'],
    isSystem: true,
  },
  {
    id: 'operator',
    nama: 'Operator',
    deskripsi: 'Mengelola konten landing page dan data dasar.',
    resources: [
      'landing', 'hero', 'profil', 'agenda', 'pengumuman', 'prestasi', 'galeri', 'album', 'foto', 'kontak',
      'psb', 'psbPengumuman', 'biaya', 'santri', 'guru', 'event', 'pemberitahuan',
    ],
    actions: ['read', 'create', 'update'],
    isSystem: true,
  },
]

export function useAuthz() {
  const roles = useState<Role[]>('authz-roles', () => structuredClone(DEFAULT_ROLES))
  const loaded = useState('authz-loaded', () => false)

  function load() {
    if (!import.meta.client || loaded.value) return
    try {
      const raw = localStorage.getItem(ROLES_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Role[]
        // Gabungkan dengan peran sistem terbaru: peran sistem selalu memakai
        // definisi dari kode (agar modul baru otomatis ikut), sementara peran
        // buatan pengguna tetap dipertahankan.
        const custom = parsed.filter(p => !DEFAULT_ROLES.some(d => d.id === p.id))
        roles.value = [...structuredClone(DEFAULT_ROLES), ...custom]
      }
    }
    catch { /* abaikan */ }
    loaded.value = true
  }

  function persist() {
    if (!import.meta.client) return
    try {
      localStorage.setItem(ROLES_KEY, JSON.stringify(roles.value))
    }
    catch { /* abaikan */ }
  }

  function roleOf(user: AppUser | null | undefined): Role | undefined {
    if (!user) return undefined
    return roles.value.find(r => r.id === user.roleId)
  }

  function can(user: AppUser | null | undefined, resource: string, action: Action = 'read'): boolean {
    const role = roleOf(user)
    if (!role) return false
    const allowed = role.resources === '*' || role.resources.includes(resource)
    return allowed && role.actions.includes(action)
  }

  /**
   * Cek kapabilitas khusus (di luar resource).
   * Contoh: bisa(user, 'modul') → hanya Super Admin.
   */
  function bisa(user: AppUser | null | undefined, cap: 'modul'): boolean {
    const role = roleOf(user)
    return Boolean(role?.caps?.includes(cap))
  }

  /** Apakah pengguna adalah Super Admin (punya semua kapabilitas). */
  function isSuperAdmin(user: AppUser | null | undefined): boolean {
    return bisa(user, 'modul')
  }

  function saveRole(role: Role) {
    const idx = roles.value.findIndex(r => r.id === role.id)
    if (idx >= 0) roles.value[idx] = role
    else roles.value.push(role)
    persist()
  }

  function removeRole(id: string) {
    roles.value = roles.value.filter(r => r.id !== id || r.isSystem)
    persist()
  }

  return { roles, loaded, load, roleOf, can, bisa, isSuperAdmin, saveRole, removeRole, allActions: ALL_ACTIONS }
}
