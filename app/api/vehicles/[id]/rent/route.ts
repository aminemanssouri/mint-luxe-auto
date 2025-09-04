import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Get customer ID
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!customer) {
      return NextResponse.json({ error: 'Customer profile not found' }, { status: 404 })
    }

    const { 
      rentalType, 
      startDate, 
      endDate, 
      pickupLocation, 
      returnLocation,
      pickupAddress,
      returnAddress,
      dailyRate,
      weeklyRate,
      monthlyRate,
      totalDays,
      baseAmount,
      depositAmount,
      additionalDrivers,
      driverLicenseInfo,
      insuranceOption,
      specialRequests,
      totalAmount
    } = await request.json()

    // Generate reservation number
    const reservationNumber = `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Calculate rental dates
    const startDateTime = new Date(startDate)
    const endDateTime = new Date(endDate)
    const calculatedDays = Math.ceil((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60 * 24))

    // Calculate insurance amount
    let insuranceAmount = 0
    if (insuranceOption === 'comprehensive') {
      insuranceAmount = baseAmount * 0.15
    } else if (insuranceOption === 'premium') {
      insuranceAmount = baseAmount * 0.25
    }

    // Calculate additional driver fee
    const additionalDriverFee = (additionalDrivers?.length || 0) * 50 * calculatedDays

    // Calculate final total
    const finalTotal = baseAmount + insuranceAmount + additionalDriverFee + (depositAmount || 0)

    // Set expiry date (7 days from now)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 7)

    // Create reservation first (proper workflow)
    const { data: reservation, error } = await supabase
      .from('vehicle_reservations')
      .insert({
        reservation_number: reservationNumber,
        customer_id: customer.id,
        vehicle_id: id,
        reservation_type: 'rental',
        reservation_date: new Date().toISOString(),
        expiry_date: expiryDate.toISOString(),
        deposit_amount: finalTotal * 0.25, // 25% deposit
        status: 'active',
        notes: JSON.stringify({
          rentalType,
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
          pickupLocation,
          returnLocation,
          pickupAddress,
          returnAddress,
          dailyRate,
          weeklyRate,
          monthlyRate,
          totalDays: calculatedDays,
          baseAmount,
          insuranceAmount,
          additionalDriverFee,
          totalAmount: finalTotal,
          driverLicenseInfo,
          additionalDrivers,
          insuranceOption,
          specialRequests
        })
      })
      .select()
      .single()

    if (error) {
      console.error('Reservation creation error:', error)
      return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 })
    }

    // Update vehicle status to reserved
    await supabase
      .from('vehicles')
      .update({ inventory_status: 'reserved' })
      .eq('id', id)

    return NextResponse.json({ 
      success: true, 
      reservation,
      message: 'Rental reservation created successfully. Please complete payment within 7 days.',
      depositAmount: finalTotal * 0.25,
      totalAmount: finalTotal
    })

  } catch (error) {
    console.error('Rental API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')

    let query = supabase
      .from('rental_agreements')
      .select(`
        *,
        vehicles(name, brand, year, rental_price_daily, rental_price_weekly, rental_price_monthly),
        customers(first_name, last_name, email, phone)
      `)
      .eq('vehicle_id', id)

    if (customerId) {
      query = query.eq('customer_id', customerId)
    }

    const { data: agreements, error } = await query
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching rental agreements:', error)
      return NextResponse.json({ error: 'Failed to fetch rental agreements' }, { status: 500 })
    }

    return NextResponse.json({ agreements })

  } catch (error) {
    console.error('Rental agreements API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
