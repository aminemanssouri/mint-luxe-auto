import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET /api/vehicle-availability?vehicle_id=...&from=YYYY-MM-DD&to=YYYY-MM-DD
// Returns a list of ISO date strings when the vehicle is reserved (based on bookings.preferred_date)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get("vehicle_id")
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    if (!vehicleId) {
      return NextResponse.json({ ok: false, error: "vehicle_id is required" }, { status: 400 })
    }

    const supabase = await createClient()

    let query = supabase
      .from("bookings")
      .select("preferred_date,status")
      .eq("vehicle_id", vehicleId)

    if (from && to) {
      query = query.gte("preferred_date", from).lte("preferred_date", to)
    }

    const { data, error } = await query
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })

    const reservedDates = (data || [])
      .filter((b) => b.preferred_date && b.status !== "cancelled")
      .map((b) => b.preferred_date)

    return NextResponse.json({ ok: true, reservedDates })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "unexpected" }, { status: 500 })
  }
}
