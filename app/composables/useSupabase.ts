// Klien Supabase opsional. Mengembalikan null bila kredensial belum diisi,
// sehingga seluruh aplikasi tetap berjalan offline-first (localStorage + seed).
//
// Penting: klien disimpan sebagai singleton. Membuat klien baru pada setiap
// pemanggilan memicu peringatan "Multiple GoTrueClient instances" dan berisiko
// perilaku tak terduga karena beberapa instance berbagi storage key yang sama.

let client: any = null
let attempted = false

export function supabaseConfigured() {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl as string
  const key = config.public.supabaseAnonKey as string
  return Boolean(url && key && !url.includes('xyzcompany') && url.startsWith('http'))
}

export async function getSupabase() {
  if (client) return client
  if (attempted) return null
  attempted = true

  if (!supabaseConfigured()) return null
  const config = useRuntimeConfig()

  try {
    const { createClient } = await import('@supabase/supabase-js')
    client = createClient(
      config.public.supabaseUrl as string,
      config.public.supabaseAnonKey as string,
      {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
      },
    )
    return client
  }
  catch {
    client = null
    return null
  }
}
