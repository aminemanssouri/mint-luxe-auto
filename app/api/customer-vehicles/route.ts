import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/customer-vehicles
// Query params:
//   customer_id: uuid (optional); when omitted, returns all (respecting RLS)
//   search: string (search make/model/vin/license_plate)
//   year: number
//   limit, offset
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customer_id')
    const search = searchParams.get('search')
    const year = searchParams.get('year')
    const limit = Number(searchParams.get('limit') ?? '100')
    const offset = Number(searchParams.get('offset') ?? '0')

    const supabase = await createClient()

    let query = supabase
      .from('customer_vehicles')
      .select('id, customer_id, make, model, year, vin, license_plate, color, mileage, created_at, updated_at', { count: 'exact' })

    if (customerId) query = query.eq('customer_id', customerId)
    if (year) query = query.eq('year', Number(year))
    if (search) {
      query = query.or(
        `make.ilike.%${search}%,model.ilike.%${search}%,vin.ilike.%${search}%,license_plate.ilike.%${search}%`
      )
    }

    if (Number.isFinite(limit) && Number.isFinite(offset)) {
      query = query.range(offset, offset + limit - 1)
    }

    query = query.order('updated_at', { ascending: false })

    const { data, error } = await query
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

    // Shape items for UI friendliness
    const items = (data ?? []).map((v: any) => ({
      id: v.id,
      customer_id: v.customer_id,
      title: `${v.year ?? ''} ${v.make ?? ''} ${v.model ?? ''}`.trim(),
      make: v.make,
      model: v.model,
      year: v.year,
      vin: v.vin,
      license_plate: v.license_plate,
      color: v.color,
      mileage: v.mileage,
      created_at: v.created_at,
      updated_at: v.updated_at,
    }))

    return NextResponse.json({ ok: true, count: items.length, items })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 })
  }
}
