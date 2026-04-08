import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const restaurantId = searchParams.get('restaurant_id')

  if (!restaurantId) {
    return NextResponse.json({ error: 'restaurant_id required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('call_logs')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Get actual booking count (AI-created, confirmed) for accurate stats
  const { count: actualBookings } = await supabaseAdmin
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', restaurantId)
    .eq('booked_via', 'ai_call')
    .eq('status', 'confirmed')

  return NextResponse.json({ calls: data, actualBookingsMade: actualBookings || 0 })
}
