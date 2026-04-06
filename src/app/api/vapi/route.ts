import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// This endpoint handles Vapi tool calls from Riley
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { message } = body

  // Vapi sends tool calls in this format
  if (message?.type === 'function-call') {
    const functionName = message.functionCall?.name
    const params = message.functionCall?.parameters

    if (functionName === 'checkAvailability') {
      return handleCheckAvailability(params)
    }
    if (functionName === 'createBooking') {
      return handleCreateBooking(params)
    }
    if (functionName === 'lookupCustomer') {
      return handleLookupCustomer(params)
    }
    if (functionName === 'cancelBooking') {
      return handleCancelBooking(params)
    }
  }

  // Vapi end-of-call report — log the call
  if (message?.type === 'end-of-call-report') {
    return handleEndOfCallReport(message)
  }

  return NextResponse.json({ result: 'ok' })
}

async function handleCheckAvailability(params: any) {
  const { date, time, party_size, restaurant_id } = params

  // Get restaurant capacity
  const { data: restaurant } = await supabaseAdmin
    .from('restaurants')
    .select('tables_per_slot, hours')
    .eq('id', restaurant_id)
    .single()

  if (!restaurant) {
    return NextResponse.json({
      result: "I'm sorry, I'm having trouble checking availability right now. Let me take your number and have the manager call you back."
    })
  }

  // Count existing bookings for that slot
  const { count } = await supabaseAdmin
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', restaurant_id)
    .eq('booking_date', date)
    .eq('booking_time', time)
    .eq('status', 'confirmed')

  const available = (count ?? 0) < restaurant.tables_per_slot

  if (available) {
    return NextResponse.json({
      result: `Yes, we have availability on ${date} at ${time} for ${party_size} guests.`
    })
  }

  // Find next available slot
  const slots = generateSlots(restaurant.hours, date)
  for (const slot of slots) {
    const { count: slotCount } = await supabaseAdmin
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('restaurant_id', restaurant_id)
      .eq('booking_date', date)
      .eq('booking_time', slot)
      .eq('status', 'confirmed')

    if ((slotCount ?? 0) < restaurant.tables_per_slot) {
      return NextResponse.json({
        result: `Sorry, ${time} is fully booked. The nearest available time is ${slot}. Would that work for you?`
      })
    }
  }

  return NextResponse.json({
    result: `I'm sorry, we're fully booked on ${date}. Would you like to try a different date?`
  })
}

async function handleCreateBooking(params: any) {
  const { customer_name, customer_phone, party_size, date, time, dietary_notes, restaurant_id } = params

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .insert({
      restaurant_id,
      customer_name,
      customer_phone,
      party_size: parseInt(party_size),
      booking_date: date,
      booking_time: time,
      dietary_notes: dietary_notes || null,
      booked_via: 'ai_call'
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({
      result: "I'm sorry, there was a problem making that reservation. Let me take your number and have the manager call you back to confirm."
    })
  }

  return NextResponse.json({
    result: `Your reservation has been confirmed. ${customer_name}, party of ${party_size}, on ${date} at ${time}. We look forward to seeing you!`
  })
}

async function handleLookupCustomer(params: any) {
  const { phone, restaurant_id } = params

  const { data: bookings } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .eq('restaurant_id', restaurant_id)
    .eq('customer_phone', phone)
    .eq('status', 'confirmed')
    .gte('booking_date', new Date().toISOString().split('T')[0])
    .order('booking_date', { ascending: true })

  if (!bookings || bookings.length === 0) {
    return NextResponse.json({
      result: "I don't have any upcoming reservations under this phone number."
    })
  }

  const booking = bookings[0]
  return NextResponse.json({
    result: `I found a reservation under ${booking.customer_name} for ${booking.party_size} guests on ${booking.booking_date} at ${booking.booking_time}. Would you like to modify or cancel this booking?`
  })
}

async function handleCancelBooking(params: any) {
  const { phone, date, restaurant_id } = params

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('restaurant_id', restaurant_id)
    .eq('customer_phone', phone)
    .eq('booking_date', date)
    .eq('status', 'confirmed')
    .select()

  if (!data || data.length === 0) {
    return NextResponse.json({
      result: "I couldn't find a matching reservation to cancel. Could you double-check the date?"
    })
  }

  return NextResponse.json({
    result: `Your reservation on ${date} has been cancelled. We hope to see you another time!`
  })
}

async function handleEndOfCallReport(message: any) {
  const { call, summary, recordingUrl, transcript } = message

  // Try to find restaurant by the phone number that was called
  const phoneNumber = call?.phoneNumber?.number
  let restaurantId = null

  if (phoneNumber) {
    const { data } = await supabaseAdmin
      .from('restaurants')
      .select('id')
      .eq('vapi_phone_number', phoneNumber.replace(/\s/g, ''))
      .single()
    restaurantId = data?.id
  }

  await supabaseAdmin.from('call_logs').insert({
    restaurant_id: restaurantId,
    vapi_call_id: call?.id,
    caller_phone: call?.customer?.number,
    duration_seconds: call?.duration,
    summary,
    recording_url: recordingUrl,
    transcript: typeof transcript === 'string' ? transcript : JSON.stringify(transcript),
    booking_made: summary?.toLowerCase().includes('booking') || summary?.toLowerCase().includes('reservation')
  })

  return NextResponse.json({ result: 'logged' })
}

function generateSlots(hours: any, date: string): string[] {
  const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const dayHours = hours?.[dayName]
  if (!dayHours) return []

  const slots: string[] = []
  const [openH, openM] = dayHours.open.split(':').map(Number)
  const [closeH, closeM] = dayHours.close.split(':').map(Number)

  let current = openH * 60 + openM
  const lastBooking = (closeH * 60 + closeM) - 90 // 1.5 hours before close

  while (current <= lastBooking) {
    const h = Math.floor(current / 60).toString().padStart(2, '0')
    const m = (current % 60).toString().padStart(2, '0')
    slots.push(`${h}:${m}`)
    current += 30
  }

  return slots
}
