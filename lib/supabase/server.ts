import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables missing on server:', {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey
    })
    // Return a mock client for development/demo purposes
    return {
      auth: {
        signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signIn: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: null }, unsubscribe: () => {} })
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
      })
    } as any
  }

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        // Note: This will only work in Route Handlers and Server Actions
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        // Clearing cookie by setting empty value
        cookieStore.set({ name, value: '', ...options })
      },
    },
  })
}
