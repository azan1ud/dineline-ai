import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendBookingConfirmation, sendBookingCancellation } from '@/lib/sms'

// This endpoint handles Vapi tool calls from Riley
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { message } = body

  console.log('Vapi webhook received:', JSON.stringify(body).slice(0, 500))

  // Vapi sends assistant-request at call start — inject today's date into the system prompt
  if (message?.type === 'assistant-request') {
    const today = new Date().toLocaleDateString('en-GB', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      timeZone: 'Europe/London'
    })
    return NextResponse.json({
      assistant: {
        firstMessage: `Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, thank you for calling Bella's Italian Kitchen! This is Riley, how can I help you today?`,
        model: {
          messages: [
            {
              role: 'system',
              content: `IMPORTANT: Today's date is ${today}. Use this to correctly interpret relative dates like "today", "tomorrow", "next Friday", etc.\n\n` + (message.assistant?.model?.messages?.[0]?.content || '')
            }
          ]
        }
      }
    })
  }

  // NEW FORMAT: Vapi Tools send "tool-calls" (not "function-call")
  if (message?.type === 'tool-calls') {
    const toolCallList = message.toolCallList || []
    const results = []

    for (const toolCall of toolCallList) {
      const functionName = toolCall.function?.name
      const params = typeof toolCall.function?.arguments === 'string'
        ? JSON.parse(toolCall.function.arguments)
        : toolCall.function?.arguments

      let result = "I'm having trouble processing that request."

      if (functionName === 'checkAvailability') {
        result = await handleCheckAvailability(params)
      } else if (functionName === 'createBooking') {
        result = await handleCreateBooking(params)
      } else if (functionName === 'lookupCustomer') {
        result = await handleLookupCustomer(params)
      } else if (functionName === 'cancelBooking') {
        result = await handleCancelBooking(params)
      }

      results.push({ toolCallId: toolCall.id, result })
    }

    return NextResponse.json({ results })
  }

  // OLD FORMAT: Vapi Functions send "function-call"
  if (message?.type === 'function-call') {
    const functionName = message.functionCall?.name
    const params = message.functionCall?.parameters
    let result = "I'm having trouble processing that request."

    if (functionName === 'checkAvailability') {
      result = await handleCheckAvailability(params)
    } else if (functionName === 'createBooking') {
      result = await handleCreateBooking(params)
    } else if (functionName === 'lookupCustomer') {
      result = await handleLookupCustomer(params)
    } else if (functionName === 'cancelBooking') {
      result = await handleCancelBooking(params)
    }

    return NextResponse.json({ result })
  }

  // Vapi end-of-call report — log the call
  if (message?.type === 'end-of-call-report') {
    return handleEndOfCallReport(message)
  }

  // Some Vapi versions send end-of-call at top level (not nested in message)
  if (body?.type === 'end-of-call-report') {
    return handleEndOfCallReport(body)
  }

  // Catch-all: log unknown webhook types for debugging
  console.log('Vapi unhandled webhook type:', message?.type || body?.type || 'unknown')

  return NextResponse.json({ result: 'ok' })
}

async function handleCheckAvailability(params: any): Promise<string> {
  const { date, time, party_size, restaurant_id } = params

  const { data: restaurant } = await supabaseAdmin
    .from('restaurants')
    .select('tables_per_slot, hours')
    .eq('id', restaurant_id)
    .single()

  if (!restaurant) {
    return "I'm sorry, I'm having trouble checking availability right now. Let me take your number and have the manager call you back."
  }

  const { count } = await supabaseAdmin
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', restaurant_id)
    .eq('booking_date', date)
    .eq('booking_time', time)
    .eq('status', 'confirmed')

  const available = (count ?? 0) < restaurant.tables_per_slot

  if (available) {
    return `Yes, we have availability on ${date} at ${time} for ${party_size} guests.`
  }

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
      return `Sorry, ${time} is fully booked. The nearest available time is ${slot}. Would that work for you?`
    }
  }

  return `I'm sorry, we're fully booked on ${date}. Would you like to try a different date?`
}

async function handleCreateBooking(params: any): Promise<string> {
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
    return "I'm sorry, there was a problem making that reservation. Let me take your number and have the manager call you back to confirm."
  }

  // Send confirmation SMS
  if (customer_phone) {
    const { data: restaurant } = await supabaseAdmin
      .from('restaurants')
      .select('name')
      .eq('id', restaurant_id)
      .single()
    sendBookingConfirmation(customer_phone, customer_name, date, time, parseInt(party_size), restaurant?.name || 'the restaurant')
  }

  return `Your reservation has been confirmed. ${customer_name}, party of ${party_size}, on ${date} at ${time}. We look forward to seeing you!`
}

async function handleLookupCustomer(params: any): Promise<string> {
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
    return "I don't have any upcoming reservations under this phone number."
  }

  const booking = bookings[0]
  return `I found a reservation under ${booking.customer_name} for ${booking.party_size} guests on ${booking.booking_date} at ${booking.booking_time}. Would you like to modify or cancel this booking?`
}

async function handleCancelBooking(params: any): Promise<string> {
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
    return "I couldn't find a matching reservation to cancel. Could you double-check the date?"
  }

  return `Your reservation on ${date} has been cancelled. We hope to see you another time!`
}

async function handleEndOfCallReport(message: any) {
  console.log('End-of-call report received:', JSON.stringify(message).slice(0, 1000))

  const call = message.call || {}
  const summary = message.summary || message.analysis?.summary || ''
  const recordingUrl = message.recordingUrl || message.artifact?.recordingUrl || ''
  const transcript = message.transcript || message.artifact?.transcript || ''

  // Try to find restaurant by the phone number that was called
  const phoneNumber = call.phoneNumber?.number || call.phoneNumberId || ''
  let restaurantId = null

  if (phoneNumber) {
    const cleanNumber = phoneNumber.replace(/[\s\-()]/g, '')
    const { data } = await supabaseAdmin
      .from('restaurants')
      .select('id')
      .or(`vapi_phone_number.eq.${cleanNumber},phone.eq.${cleanNumber}`)
      .single()
    restaurantId = data?.id
  }

  // Fallback: use the only restaurant we have (demo)
  if (!restaurantId) {
    const { data } = await supabaseAdmin
      .from('restaurants')
      .select('id')
      .limit(1)
      .single()
    restaurantId = data?.id
  }

  const { error } = await supabaseAdmin.from('call_logs').insert({
    restaurant_id: restaurantId,
    vapi_call_id: call.id || null,
    caller_phone: call.customer?.number || null,
    duration_seconds: call.duration ? Math.round(call.duration) : null,
    summary: typeof summary === 'string' ? summary : JSON.stringify(summary),
    recording_url: typeof recordingUrl === 'string' ? recordingUrl : null,
    transcript: typeof transcript === 'string' ? transcript : JSON.stringify(transcript),
    booking_made: typeof summary === 'string' && (summary.toLowerCase().includes('booking') || summary.toLowerCase().includes('reservation'))
  })

  if (error) {
    console.error('Failed to insert call log:', error)
  }

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
