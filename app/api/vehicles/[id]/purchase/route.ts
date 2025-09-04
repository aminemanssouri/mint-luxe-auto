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
      purchasePrice,
      downPayment,
      financingAmount,
      tradeInVehicleId,
      tradeInValue,
      taxes,
      fees,
      totalAmount,
      paymentMethod,
      financingTerms,
      deliveryDate,
      deliveryAddress,
      warrantyInfo,
      specialTerms
    } = await request.json()

    // Generate purchase agreement number
    const agreementNumber = `PUR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Calculate total amount based on schema
    const netPrice = purchasePrice - (tradeInValue || 0)
    const calculatedTaxes = taxes || (netPrice * 0.08) // 8% tax rate
    const calculatedFees = fees || 2500 // Standard processing fees
    const finalTotal = netPrice + calculatedTaxes + calculatedFees

    // Create purchase agreement
    const { data: agreement, error } = await supabase
      .from('purchase_agreements')
      .insert({
        agreement_number: agreementNumber,
        customer_id: customer.id,
        vehicle_id: id,
        purchase_price: purchasePrice,
        down_payment: downPayment,
        financing_amount: financingAmount || 0,
        trade_in_vehicle_id: tradeInVehicleId || null,
        trade_in_value: tradeInValue || 0,
        taxes: calculatedTaxes,
        fees: calculatedFees,
        total_amount: finalTotal,
        payment_method: paymentMethod,
        financing_terms: financingTerms || null,
        delivery_date: deliveryDate || null,
        delivery_address: deliveryAddress || null,
        warranty_info: warrantyInfo || null,
        special_terms: specialTerms || null,
        status: 'draft'
      })
      .select()
      .single()

    if (error) {
      console.error('Purchase agreement creation error:', error)
      return NextResponse.json({ error: 'Failed to create purchase agreement' }, { status: 500 })
    }

    // Update vehicle status to sold (optional)
    await supabase
      .from('vehicles')
      .update({ inventory_status: 'sold' })
      .eq('id', id)

    return NextResponse.json({ 
      success: true, 
      agreement,
      message: 'Purchase agreement created successfully'
    })

  } catch (error) {
    console.error('Purchase API error:', error)
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
      .from('purchase_agreements')
      .select(`
        *,
        vehicles(name, brand, year, purchase_price),
        customers(first_name, last_name, email, phone)
      `)
      .eq('vehicle_id', id)

    if (customerId) {
      query = query.eq('customer_id', customerId)
    }

    const { data: agreements, error } = await query
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching purchase agreements:', error)
      return NextResponse.json({ error: 'Failed to fetch purchase agreements' }, { status: 500 })
    }

    return NextResponse.json({ agreements })

  } catch (error) {
    console.error('Purchase agreements API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
