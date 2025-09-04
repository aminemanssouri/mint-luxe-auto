import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'USD', vehicleId, mode } = await request.json()

    if (!amount || !vehicleId) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, vehicleId' },
        { status: 400 }
      )
    }

    // Coinbase Commerce charge creation
    const chargeData = {
      name: `Vehicle ${mode === 'deposit' ? 'Deposit' : 'Purchase'}`,
      description: `Payment for vehicle ID: ${vehicleId}`,
      pricing_type: 'fixed_price',
      local_price: {
        amount: amount.toString(),
        currency: currency,
      },
      metadata: {
        vehicleId,
        mode: mode || 'full',
      },
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
