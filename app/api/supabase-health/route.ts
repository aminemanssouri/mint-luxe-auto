import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    // Make a lightweight call to validate credentials and cookie handling
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      return NextResponse.json(
        { ok: false, message: 'Supabase auth error', error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, hasSession: Boolean(data.session) })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: 'Supabase client initialization failed', error: e?.message || String(e) },
      { status: 500 }
    )
  }
}
