import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/time-slots?date=YYYY-MM-DD
// Optional: ?onlyAvailable=true (default true)
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const onlyAvailable = searchParams.get("onlyAvailable") !== "false"

    let query = supabase
      .from("time_slots")
      .select("id,start_time,end_time,day_of_week,specific_date,is_available")
      .order("start_time", { ascending: true })

    if (onlyAvailable) {
      query = query.eq("is_available", true)
    }

    if (date) {
      // Filter slots for the exact specific_date OR matching day_of_week
      const dayOfWeek = new Date(date + "T00:00:00").getDay() // 0 (Sun) - 6 (Sat)
      // Supabase JS: use .or with comma-separated filters
      query = query.or(`specific_date.eq.${date},day_of_week.eq.${dayOfWeek}`)
    }

    const { data, error } = await query
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true, items: data ?? [] })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unexpected error" }, { status: 500 })
  }
}
