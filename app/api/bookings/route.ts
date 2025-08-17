import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    const user = authData.user
    if (!user) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 })

    const body = await req.json()
    const basePriceNum = Number(body.base_price) || 0
    const locationFeeNum = Number(body.location_fee) || 0
    const totalPrice = basePriceNum + locationFeeNum

    const insert = {
      customer_id: user.id,
      service_id: body.service_id,
      vehicle_id: body.vehicle_id ?? null,
      service_location_id: body.service_location_id ?? null,
      preferred_date: body.preferred_date ?? null,
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
      .select('id, customer_id, service_id, vehicle_id, service_location_id, preferred_date, time_slot_id, base_price, location_fee, total_price, service_address, status, payment_status, created_at, updated_at')
      .single()
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })

    return NextResponse.json({ ok: true, booking: data })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'unexpected' }, { status: 500 })
  }
}
