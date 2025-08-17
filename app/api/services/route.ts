import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const revalidate = 60

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("category_id")
    const featured = searchParams.get("featured") === "true"

    let q = supabase
      .from("services")
      .select("id,name,description,base_price,is_featured,is_active,category_id")
      .eq("is_active", true)

    if (categoryId) q = q.eq("category_id", categoryId)
    if (featured) q = q.eq("is_featured", true)

    const { data, error } = await q.order("is_featured", { ascending: false }).order("name")
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true, items: data })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "unexpected" }, { status: 500 })
  }
}
