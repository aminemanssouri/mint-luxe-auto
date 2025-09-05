import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

function getStripeInstance() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-08-27.basil',
  })
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripeInstance()
    const { amount, currency = 'usd', vehicleId, mode, vehicleName, usePaymentIntent = false } = await request.json()

    if (!amount || !vehicleId) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, vehicleId' },
        { status: 400 }
      )
    }

    // Try Checkout first, fallback to Payment Intent if business name not set
    if (!usePaymentIntent) {
      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency,
                product_data: {
                  name: vehicleName || `Vehicle ${vehicleId}`,
                  description: mode === 'deposit' ? 'Deposit Payment (25%)' : 'Full Payment',
                },
                unit_amount: Math.round(amount * 100), // Convert to cents
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${request.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${request.nextUrl.origin}/checkout/vehicle/${vehicleId}`,
          metadata: {
            vehicleId,
            mode: mode || 'full',
          },
        })

        return NextResponse.json({
          url: session.url,
          type: 'checkout'
        })
      } catch (checkoutError: any) {
        console.log('Checkout failed, falling back to Payment Intent:', checkoutError.message)
        // Fall through to Payment Intent creation
      }
    }

    // Create Payment Intent as fallback (doesn't require business name)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        vehicleId,
        mode: mode || 'full',
        vehicleName: vehicleName || `Vehicle ${vehicleId}`,
      },
      description: `${mode === 'deposit' ? 'Deposit' : 'Full Payment'} for ${vehicleName || `Vehicle ${vehicleId}`}`,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      type: 'payment_intent'
    })

  } catch (error) {
    console.error('Stripe payment creation failed:', error)
    return NextResponse.json(
      { error: 'Payment creation failed' },
      { status: 500 }
    )
  }
}
