import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/vehicles/[id]
// Returns a full vehicle with related images, features, contacts and specs tables
export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    if (!id) {
      return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 })
    }

    const supabase = await createClient()

    // Base vehicle (attempt to fetch optional columns latitude/longitude/brand/category, with fallback)
    let vehicle: any = null
    let vErr: any = null
    // Primary query with optional columns
    let res = await supabase
      .from('vehicles')
      .select('id, name, brand, category, vehicle_type, price, year, is_featured, location, latitude, longitude, description')
      .eq('id', id)
      .single()
    if (res.error && (res.error.code === '42703' || /column .* (brand|category|latitude|longitude)/i.test(res.error.message || ''))) {
      // Fallback without optional columns if they don't exist
      res = await supabase
        .from('vehicles')
        .select('id, name, vehicle_type, price, year, is_featured, location, description')
        .eq('id', id)
        .single()
    }
    vehicle = res.data
    vErr = res.error

    if (vErr) {
      return NextResponse.json({ ok: false, error: vErr.message }, { status: 404 })
    }

    // Related tables in parallel
    const [imagesRes, featuresRes, contactsRes, carSpecsRes, motorSpecsRes, boatSpecsRes, yachtSpecsRes] = await Promise.all([
      supabase.from('vehicle_images').select('image_url, image_type, display_order, alt_text').eq('vehicle_id', id).order('display_order', { ascending: true }),
      supabase.from('vehicle_features').select('feature_name, feature_category').eq('vehicle_id', id),
      supabase.from('vehicle_contacts').select('contact_name, contact_type, phone, email, response_time').eq('vehicle_id', id),
      supabase.from('car_specs').select('*').eq('vehicle_id', id).maybeSingle(),
      supabase.from('motor_specs').select('*').eq('vehicle_id', id).maybeSingle(),
      supabase.from('boat_specs').select('*').eq('vehicle_id', id).maybeSingle(),
      supabase.from('yacht_specs').select('*').eq('vehicle_id', id).maybeSingle(),
    ])

    const images = imagesRes.data ?? []
    const features = featuresRes.data ?? []
    const contacts = contactsRes.data ?? []
    const car_specs = carSpecsRes.data ?? null
    const motor_specs = motorSpecsRes.data ?? null
    const boat_specs = boatSpecsRes.data ?? null
    const yacht_specs = yachtSpecsRes.data ?? null

    // Build primary image and compact specs string for list parity
    const primaryImage = images[0]?.image_url || '/placeholder.svg?height=300&width=500'

    let specsSummary = ''
    if (vehicle.vehicle_type === 'car' && car_specs) {
      specsSummary = [car_specs.engine, car_specs.horsepower ? `${car_specs.horsepower} HP` : undefined, car_specs.transmission]
        .filter(Boolean)
        .join(' • ')
    } else if (vehicle.vehicle_type === 'motorcycle' && motor_specs) {
      specsSummary = [motor_specs.engine, motor_specs.horsepower ? `${motor_specs.horsepower} HP` : undefined, motor_specs.transmission]
        .filter(Boolean)
        .join(' • ')
    } else if (vehicle.vehicle_type === 'boat' && (boat_specs || yacht_specs)) {
      const s = boat_specs || yacht_specs
      specsSummary = [s.engines || s.engine, s.max_speed_kts ? `${s.max_speed_kts} kts` : s.max_speed_knots ? `${s.max_speed_knots} kts` : undefined]
        .filter(Boolean as any)
        .join(' • ')
    }

    const result = {
      id: vehicle.id,
      name: vehicle.name,
      brand: (vehicle as any).brand ?? (vehicle.name?.split(' ')[0] ?? 'Brand'),
      type: vehicle.vehicle_type,
      price: Number(vehicle.price) || 0,
      year: vehicle.year,
      category: (vehicle as any).category ?? 'Luxury',
      image: primaryImage,
      specs: specsSummary,
      location: vehicle.location ?? 'Unknown',
      latitude: (vehicle as any).latitude ?? null,
      longitude: (vehicle as any).longitude ?? null,
      featured: Boolean(vehicle.is_featured),
      description: vehicle.description,
      images,
      features,
      contacts,
      car_specs,
      motor_specs,
      boat_specs,
      yacht_specs,
    }

    return NextResponse.json({ ok: true, item: result })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 })
  }
}
