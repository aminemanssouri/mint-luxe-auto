import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/vehicles
// Optional query params:
//   type=car|motorcycle|boat
//   brand=...
//   category=...
//   location=...
//   year=2024
//   search=free text over name/brand/category/location
//   priceMin=number
//   priceMax=number
//   sort=featured|price-asc|price-desc|year-desc|name-asc
//   limit, offset
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const type = searchParams.get('type')
    const brand = searchParams.get('brand')
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const year = searchParams.get('year')
    const search = searchParams.get('search')
    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    const sort = searchParams.get('sort')
    const limit = Number(searchParams.get('limit') ?? '60')
    const offset = Number(searchParams.get('offset') ?? '0')

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase not configured, returning demo data')
      return getDemoVehicles(searchParams)
    }

    const supabase = await createClient()

    // 1) Try query with real brand/category columns
    let vehicles: any[] | null = null
    let totalCount: number | null | undefined = null
    let error: any = null

    const runPrimary = async () => {
      let q = supabase
        .from('vehicles')
        .select('id, name, brand, category, vehicle_type, price, year, is_featured, location, description', { count: 'estimated' })

      // Filters
      if (type && ['car', 'motorcycle', 'boat'].includes(type)) {
        q = q.eq('vehicle_type', type)
      }
      if (brand && brand !== 'all') {
        q = q.eq('brand', brand)
      }
      if (category && category !== 'all') {
        q = q.eq('category', category)
      }
      if (location && location !== 'all') {
        q = q.eq('location', location)
      }
      if (year && year !== 'all') {
        q = q.eq('year', Number(year))
      }
      if (priceMin) {
        q = q.gte('price', Number(priceMin))
      }
      if (priceMax) {
        q = q.lte('price', Number(priceMax))
      }
      if (search) {
        q = q.or(
          `name.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`
        )
      }

      // Sorting
      switch (sort) {
        case 'featured':
          q = q.order('is_featured', { ascending: false })
          break
        case 'price-asc':
          q = q.order('price', { ascending: true })
          break
        case 'price-desc':
          q = q.order('price', { ascending: false })
          break
        case 'year-desc':
          q = q.order('year', { ascending: false })
          break
        case 'name-asc':
          q = q.order('name', { ascending: true })
          break
        default:
          q = q.order('is_featured', { ascending: false }).order('year', { ascending: false })
      }

      // Pagination
      if (Number.isFinite(limit) && Number.isFinite(offset)) {
        q = q.range(offset, offset + limit - 1)
      }

      const res = await q
      vehicles = res.data
      totalCount = res.count
      error = res.error
    }

    const runFallback = async () => {
      let q = supabase
        .from('vehicles')
        .select('id, name, vehicle_type, price, year, is_featured, location, description', { count: 'estimated' })

      // Filters with legacy behavior
      if (type && ['car', 'motorcycle', 'boat'].includes(type)) {
        q = q.eq('vehicle_type', type)
      }
      if (brand && brand !== 'all') {
        q = q.ilike('name', `%${brand}%`)
      }
      if (category && category !== 'all') {
        q = q.ilike('description', `%${category}%`)
      }
      if (location && location !== 'all') {
        q = q.eq('location', location)
      }
      if (year && year !== 'all') {
        q = q.eq('year', Number(year))
      }
      if (priceMin) {
        q = q.gte('price', Number(priceMin))
      }
      if (priceMax) {
        q = q.lte('price', Number(priceMax))
      }
      if (search) {
        q = q.or(
          `name.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%`
        )
      }

      // Sorting (same)
      switch (sort) {
        case 'featured':
          q = q.order('is_featured', { ascending: false })
          break
        case 'price-asc':
          q = q.order('price', { ascending: true })
          break
        case 'price-desc':
          q = q.order('price', { ascending: false })
          break
        case 'year-desc':
          q = q.order('year', { ascending: false })
          break
        case 'name-asc':
          q = q.order('name', { ascending: true })
          break
        default:
          q = q.order('is_featured', { ascending: false }).order('year', { ascending: false })
      }

      if (Number.isFinite(limit) && Number.isFinite(offset)) {
        q = q.range(offset, offset + limit - 1)
      }

      const res = await q
      vehicles = res.data
      totalCount = res.count
      error = res.error
    }

    await runPrimary()
    // If brand/category columns don't exist, Postgres returns code 42703 (undefined_column).
    if (error && (error.code === '42703' || /column .* (brand|category)/i.test(error.message || ''))) {
      await runFallback()
    }

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    const base = vehicles ?? []
    const ids = base.map((v: any) => v.id)

    // If no vehicles, short-circuit
    if (!ids.length) {
      return NextResponse.json({ ok: true, count: 0, items: [] })
    }

    // 2) Fetch only images for primary image to minimize round trips
    const imagesRes = await supabase
      .from('vehicle_images')
      .select('vehicle_id, image_url, image_type, display_order, alt_text')
      .in('vehicle_id', ids)

    const imagesBy = groupBy(imagesRes.data || [], 'vehicle_id')

    // 3) Merge to UI list items (keep specs minimal for performance)
    const items = base.map((v: any) => {
      const gallery = (imagesBy[v.id] || []).slice().sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0))
      const image = (gallery[0] as any)?.image_url || '/placeholder.svg?height=300&width=500'
      // Omit expensive specs merging on list for speed
      const specsSummary = ''

      return {
        id: v.id,
        name: v.name,
        brand: v.brand ?? (typeof v.name === 'string' ? (v.name.split(' ')[0] || 'Unknown') : 'Unknown'),
        type: v.vehicle_type,
        price: Number(v.price) || 0,
        year: v.year,
        category: v.category ?? (typeof v.vehicle_type === 'string' ? (v.vehicle_type.charAt(0).toUpperCase() + v.vehicle_type.slice(1)) : 'Luxury'),
        image,
        specs: specsSummary,
        location: v.location ?? '',
        featured: Boolean(v.is_featured),
      }
    })

    return NextResponse.json({ ok: true, count: items.length, totalCount: totalCount ?? items.length, items })
  } catch (e: any) {
    console.error('Vehicles API error:', e)
    
    // Fallback to demo data on any error
    try {
      console.warn('Falling back to demo data due to error')
      return getDemoVehicles(new URL(request.url).searchParams)
    } catch (fallbackError) {
      console.error('Demo data fallback failed:', fallbackError)
      return NextResponse.json(
        { ok: false, error: 'Service temporarily unavailable' },
        { status: 500 }
      )
    }
  }
}

// helpers
function groupBy<T extends Record<string, any>>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = String(item[key])
    ;(acc[k] ||= []).push(item)
    return acc
  }, {} as Record<string, T[]>)
}

function indexBy<T extends Record<string, any>>(arr: T[], key: keyof T): Record<string, T> {
  return arr.reduce((acc, item) => {
    acc[String(item[key])] = item
    return acc
  }, {} as Record<string, T>)
}

// Demo data function for when Supabase is not configured
function getDemoVehicles(searchParams: URLSearchParams) {
  const demoVehicles = [
    {
      id: 'demo-1',
      name: 'Lamborghini Huracán',
      brand: 'Lamborghini',
      vehicle_type: 'car',
      price: 250000,
      year: 2024,
      category: 'Supercar',
      location: 'Casablanca',
      description: 'Luxury supercar with V10 engine',
      is_featured: true
    },
    {
      id: 'demo-2',
      name: 'Ferrari 488 GTB',
      brand: 'Ferrari',
      vehicle_type: 'car',
      price: 280000,
      year: 2023,
      category: 'Supercar',
      location: 'Marrakech',
      description: 'Italian excellence in automotive engineering',
      is_featured: false
    },
    {
      id: 'demo-3',
      name: 'Porsche 911 Turbo S',
      brand: 'Porsche',
      vehicle_type: 'car',
      price: 220000,
      year: 2024,
      category: 'Sports Car',
      location: 'Rabat',
      description: 'German precision and performance',
      is_featured: true
    },
    {
      id: 'demo-4',
      name: 'Ducati Panigale V4',
      brand: 'Ducati',
      vehicle_type: 'motorcycle',
      price: 35000,
      year: 2024,
      category: 'Superbike',
      location: 'Casablanca',
      description: 'High-performance Italian motorcycle',
      is_featured: false
    },
    {
      id: 'demo-5',
      name: 'Azimut 60 Yacht',
      brand: 'Azimut',
      vehicle_type: 'boat',
      price: 1500000,
      year: 2023,
      category: 'Luxury Yacht',
      location: 'Agadir',
      description: 'Luxury yacht for ultimate comfort',
      is_featured: true
    }
  ]

  // Apply basic filtering
  let filtered = demoVehicles
  const type = searchParams.get('type')
  const search = searchParams.get('search')
  const brand = searchParams.get('brand')

  if (type && type !== 'all') {
    filtered = filtered.filter(v => v.vehicle_type === type)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(v => 
      v.name.toLowerCase().includes(searchLower) ||
      v.brand.toLowerCase().includes(searchLower) ||
      v.description.toLowerCase().includes(searchLower)
    )
  }

  if (brand && brand !== 'all') {
    filtered = filtered.filter(v => v.brand === brand)
  }

  // Transform to expected format
  const items = filtered.map(v => ({
    id: v.id,
    name: v.name,
    brand: v.brand,
    type: v.vehicle_type,
    price: v.price,
    year: v.year,
    category: v.category,
    image: '/placeholder.svg?height=300&width=500',
    specs: '',
    location: v.location,
    featured: v.is_featured
  }))

  return NextResponse.json({
    ok: true,
    count: items.length,
    totalCount: items.length,
    items
  })
}
