import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const revalidate = 300

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("service_locations")
      .select("id,name,location_type,address,city,state,zip_code,country,additional_cost,is_active")
      .eq("is_active", true)
      .order("name")

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, items: data })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "unexpected" }, { status: 500 })
  }
}
