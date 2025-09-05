import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const {
      appointmentType,
      name,
      email,
      phone,
      date,
      time,
      message
    } = body

    // Validate required fields
    if (!appointmentType || !name || !email || !phone || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create appointment datetime
    const appointmentDateTime = new Date(`${date}T${time}:00`)
    
    // Set consultation fee based on appointment type
    const consultationFee = appointmentType === 'online' ? 30.00 : 50.00

    // Check if customer exists, if not create one
    let customer = null
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', email)
      .single()

    if (existingCustomer) {
      customer = existingCustomer
    } else {
      // Create new customer
      const nameParts = name.trim().split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ') || firstName
      
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          preferred_contact: 'email'
        })
        .select('id')
        .single()

      if (customerError) {
        console.error('Customer creation error:', customerError)
        return NextResponse.json(
          { error: 'Failed to create customer record' },
          { status: 500 }
        )
      }

      customer = newCustomer
    }

    // Create appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        customer_id: customer.id,
        appointment_type: appointmentType,
        appointment_date: date,
        appointment_time: time,
        appointment_datetime: appointmentDateTime.toISOString(),
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        message: message || null,
        consultation_fee: consultationFee,
        status: 'scheduled',
        payment_status: 'pending'
      })
      .select()
      .single()

    if (appointmentError) {
      console.error('Appointment creation error:', appointmentError)
      return NextResponse.json(
        { error: 'Failed to create appointment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      appointment: appointment,
      message: 'Appointment booked successfully'
    })

  } catch (error) {
    console.error('Appointment booking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter required' },
        { status: 400 }
      )
    }

    // Get customer appointments
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_type,
        appointment_date,
        appointment_time,
        appointment_datetime,
        customer_name,
        message,
        status,
        payment_status,
        consultation_fee,
        meeting_link,
        location_address,
        created_at
      `)
      .eq('customer_email', email)
      .order('appointment_datetime', { ascending: false })

    if (error) {
      console.error('Appointments fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch appointments' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      appointments: appointments || []
    })

  } catch (error) {
    console.error('Appointments fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
