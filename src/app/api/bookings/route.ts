import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/bookings?restaurant_id=xxx&date=2026-04-06
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const restaurantId = searchParams.get('restaurant_id')
  const date = searchParams.get('date')
  const status = searchParams.get('status')

  if (!restaurantId) {
    return NextResponse.json({ error: 'restaurant_id required' }, { status: 400 })
  }

  let query = supabaseAdmin
    .from('bookings')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('booking_date', { ascending: true })
    .order('booking_time', { ascending: true })

  if (date) query = query.eq('booking_date', date)
  if (status) query = query.eq('status', status)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ bookings: data })
}

// POST /api/bookings — manual booking from dashboard
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { restaurant_id, customer_name, customer_phone, party_size, booking_date, booking_time, dietary_notes, special_requests } = body

  // Rate limit: max 3 bookings per phone per day
  const { count } = await supabaseAdmin
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', restaurant_id)
    .eq('customer_phone', customer_phone)
    .eq('booking_date', booking_date)
    .eq('status', 'confirmed')

  if ((count ?? 0) >= 3) {
    return NextResponse.json({ error: 'Maximum bookings per day reached for this number' }, { status: 429 })
  }

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .insert({
      restaurant_id,
      customer_name,
      customer_phone,
      party_size,
      booking_date,
      booking_time,
      dietary_notes,
      special_requests,
      booked_via: 'manual'
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ booking: data })
}

// PATCH /api/bookings — update booking status
export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, status } = body

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ booking: data })
}
