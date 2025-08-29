import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    const user = authData.user
    if (!user) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })

    const body = await req.json()
    const basePriceNum = Number(body.base_price)
    const locationFeeNum = Number(body.location_fee) || 0
    if (!Number.isFinite(basePriceNum)) {
      return NextResponse.json({ ok: false, error: "base_price is required" }, { status: 400 })
    }
    if (!body.preferred_date) {
      return NextResponse.json({ ok: false, error: "preferred_date is required" }, { status: 400 })
    }
    const totalPrice = basePriceNum + locationFeeNum

    // Find or create the customer row mapped to this auth user
    let customerId: string | null = null
    {
      const { data: customer, error: customerErr } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single()
      if (customerErr && customerErr.code !== 'PGRST116') {
        // Unexpected error (not "No rows returned")
        return NextResponse.json({ ok: false, error: customerErr.message }, { status: 400 })
      }
      if (customer?.id) {
        customerId = customer.id
      } else {
        // Auto-create a minimal customer profile so FK passes
        const minimal = {
          user_id: user.id,
          first_name: (body.first_name ?? user.user_metadata?.first_name ?? 'Guest') || 'Guest',
          last_name: (body.last_name ?? user.user_metadata?.last_name ?? 'User') || 'User',
          email: body.email ?? user.email ?? 'unknown@example.com',
          // Schema requires phone NOT NULL; provide a safe fallback
          phone: (body.phone ?? user.user_metadata?.phone ?? '0000000000') || '0000000000',
        }
        const { data: created, error: createErr } = await supabase
          .from('customers')
          .insert(minimal)
          .select('id')
          .single()
        if (createErr) return NextResponse.json({ ok: false, error: createErr.message }, { status: 400 })
        customerId = created?.id ?? null
      }
    }

    // Generate a booking_number to satisfy NOT NULL + UNIQUE constraint
    const bookingNumber = `BK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

    const insert = {
      booking_number: bookingNumber,
      customer_id: customerId,
      service_id: body.service_id,
      vehicle_id: body.vehicle_id ?? null,
      service_location_id: body.service_location_id ?? null,
      preferred_date: body.preferred_date,
      time_slot_id: body.time_slot_id ?? null,
      base_price: basePriceNum,
      location_fee: locationFeeNum,
      total_price: totalPrice,
      service_address: body.service_address ?? null,
      status: body.status ?? 'pending',
      payment_status: body.payment_status ?? 'pending',
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert(insert)
      .select('id, booking_number, customer_id, service_id, vehicle_id, service_location_id, preferred_date, time_slot_id, base_price, location_fee, total_price, service_address, status, payment_status, created_at, updated_at')
      .single()
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })

    return NextResponse.json({ ok: true, booking: data })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'unexpected' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    const user = authData.user
    if (!user) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id, booking_number, customer_id, service_id, vehicle_id, service_location_id, preferred_date, time_slot_id,
        base_price, location_fee, total_price, service_address, status, payment_status, created_at, updated_at
      `)
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })

    return NextResponse.json({ ok: true, bookings: data ?? [] })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'unexpected' }, { status: 500 })
  }
}
