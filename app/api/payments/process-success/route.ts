import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

function getStripeInstance() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil',
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id' },
        { status: 400 }
      )
    }

    const stripe = getStripeInstance()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Check if this is a reservation payment
    const mode = session.metadata?.mode
    let paymentType = "purchase"

    if (mode === 'reservation_deposit') {
      paymentType = "reservation"
      
      // Create the reservation in the database
      const supabase = await createClient()
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return NextResponse.json(
          { error: 'User not authenticated' },
          { status: 401 }
        )
      }

      // Get customer ID
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!customer) {
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 404 }
        )
      }

      // Extract reservation details from metadata
      const vehicleId = session.metadata?.vehicleId
      const startDate = session.metadata?.startDate
      const endDate = session.metadata?.endDate
      const totalDays = parseInt(session.metadata?.totalDays || '0')
      const dailyRate = parseFloat(session.metadata?.dailyRate || '0')
      const totalAmount = parseFloat(session.metadata?.totalAmount || '0')

      if (!vehicleId || !startDate || !endDate) {
        return NextResponse.json(
          { error: 'Missing reservation details' },
          { status: 400 }
        )
      }

      // Generate reservation number
      const reservationNumber = `RES-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

      // Set expiry date (7 days from now)
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + 7)

      // Create reservation
      const { data: reservation, error } = await supabase
        .from('vehicle_reservations')
        .insert({
          reservation_number: reservationNumber,
          customer_id: customer.id,
          vehicle_id: vehicleId,
          reservation_type: 'rental',
          reservation_date: new Date().toISOString(),
          expiry_date: expiryDate.toISOString(),
          deposit_amount: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
          status: 'active',
          payment_status: 'paid',
          payment_method: 'stripe',
          payment_reference: sessionId,
          notes: JSON.stringify({
            rentalType: 'daily',
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            totalDays,
            dailyRate,
            totalAmount,
            pickupLocation: 'showroom',
            returnLocation: 'showroom',
            insuranceOption: 'basic'
          })
        })
        .select()
        .single()

      if (error) {
        console.error('Reservation creation error:', error)
        return NextResponse.json(
          { error: 'Failed to create reservation' },
          { status: 500 }
        )
      }

      // Update vehicle status to reserved
      await supabase
        .from('vehicles')
        .update({ inventory_status: 'reserved' })
        .eq('id', vehicleId)
    }

    return NextResponse.json({
      success: true,
      paymentType,
      sessionId,
      amount: session.amount_total ? session.amount_total / 100 : 0
    })

  } catch (error) {
    console.error('Payment processing error:', error)
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    )
  }
}
