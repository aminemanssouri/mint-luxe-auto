import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'USD', vehicleId, mode, reservationDetails } = await request.json()

    if (!amount || !vehicleId) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, vehicleId' },
        { status: 400 }
      )
    }

    // Determine charge name and description based on mode
    let chargeName = 'Vehicle Purchase'
    let description = `Payment for vehicle ID: ${vehicleId}`
    
    if (mode === 'deposit') {
      chargeName = 'Vehicle Deposit'
      description = `Deposit payment for vehicle ID: ${vehicleId}`
    } else if (mode === 'reservation_deposit') {
      chargeName = 'Reservation Deposit'
      description = `Reservation deposit for vehicle ID: ${vehicleId}`
    }

    // Coinbase Commerce charge creation
    const metadata: any = {
      vehicleId,
      mode: mode || 'full',
    }
    
    // Add reservation details to metadata if it's a reservation
    if (mode === 'reservation_deposit' && reservationDetails) {
      metadata.reservationType = 'rental'
      metadata.startDate = reservationDetails.startDate
      metadata.endDate = reservationDetails.endDate
      metadata.totalDays = reservationDetails.totalDays.toString()
      metadata.dailyRate = reservationDetails.dailyRate.toString()
      metadata.totalAmount = reservationDetails.totalAmount.toString()
    }

    const chargeData = {
      name: chargeName,
      description,
      pricing_type: 'fixed_price',
      local_price: {
        amount: amount.toString(),
        currency: currency,
      },
      metadata,
    }

    const response = await fetch('https://api.commerce.coinbase.com/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': process.env.COINBASE_API_KEY!,
        'X-CC-Version': '2018-03-22',
      },
      body: JSON.stringify(chargeData),
    })

    if (!response.ok) {
      throw new Error(`Coinbase API error: ${response.statusText}`)
    }

    const charge = await response.json()

    return NextResponse.json({
      chargeId: charge.data.id,
      hostedUrl: charge.data.hosted_url,
      charge: charge.data,
    })
  } catch (error) {
    console.error('Coinbase charge creation failed:', error)
    return NextResponse.json(
      { error: 'Coinbase charge creation failed' },
      { status: 500 }
    )
  }
}
