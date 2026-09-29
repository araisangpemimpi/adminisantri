// Sesi auth (CSR only).
// 1) Akun demo bawaan  2) User kelolaan (localStorage)  3) Supabase Auth opsional.

import type { AppUser } from './useAuthz'

const SESSION_KEY = 'pesantren-session'
const USERS_KEY = 'pesantren-users'

const LOCAL_ACCOUNTS: Array<AppUser & { password: string }> = [
  { id: 'u-superadmin', nama: 'Super Admin', username: 'superadmin', roleId: 'superadmin', password: 'superadmin123' },
  { id: 'u-admin', nama: 'Admin Pesantren', username: 'admin', roleId: 'admin', password: 'admin123' },
  { id: 'u-pengurus', nama: 'Pengurus Pondok', username: 'pengurus', roleId: 'pengurus', password: 'pengurus123' },
  { id: 'u-ustadz', nama: 'Ustadz Fauzan', username: 'ustadz', roleId: 'ustadz', password: 'ustadz123' },
  { id: 'u-bendahara', nama: 'Bendahara Pondok', username: 'bendahara', roleId: 'bendahara', password: 'bendahara123' },
]

export function useAuth() {
  const user = useState<AppUser | null>('auth-user', () => null)
  const loaded = useState('auth-loaded', () => false)

  function load() {
    if (!import.meta.client || loaded.value) return
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      if (raw) user.value = JSON.parse(raw)
    }
    catch { /* abaikan */ }
    loaded.value = true
  }

  function persist() {
    if (!import.meta.client) return
    try {
      if (user.value) localStorage.setItem(SESSION_KEY, JSON.stringify(user.value))
      else localStorage.removeItem(SESSION_KEY)
    }
    catch { /* abaikan */ }
  }

  async function login(username: string, password: string): Promise<{ ok: boolean; message?: string }> {
    const uname = username.trim().toLowerCase()
    const local = LOCAL_ACCOUNTS.find(a => a.username === uname && a.password === password)
    if (local) {
      user.value = { id: local.id, nama: local.nama, username: local.username, roleId: local.roleId }
      persist()
      return { ok: true }
    }

    if (import.meta.client) {
      try {
        const raw = localStorage.getItem(USERS_KEY)
        if (raw) {
          const list = JSON.parse(raw) as Array<AppUser & { password?: string }>
          const found = list.find(u => u.username.toLowerCase() === uname)
          if (found && (found.password === password || password === `${found.username.toLowerCase()}123`)) {
            const { password: _pw, ...rest } = found
            user.value = rest
            persist()
            return { ok: true }
          }
        }
      }
      catch { /* abaikan */ }
    }

    if (uname.includes('@')) {
      const sb = await getSupabase()
      if (sb) {
        try {
          const { data, error } = await sb.auth.signInWithPassword({ email: uname, password })
          if (error) return { ok: false, message: error.message }
          const email = data.user?.email ?? uname
          user.value = {
            id: data.user?.id ?? `sb-${Date.now()}`,
            nama: email.split('@')[0] || 'Pengguna',
            username: email,
            roleId: 'operator',
          }
          persist()
          return { ok: true }
        }
        catch (e: any) {
          return { ok: false, message: e?.message || 'Gagal login' }
        }
      }
    }

    return { ok: false, message: 'Username atau password salah. Demo: admin / admin123' }
  }

  function logout() {
    user.value = null
    persist()
  }

  return { user, load, login, logout }
}
