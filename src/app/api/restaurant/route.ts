import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, name, address, city, phone, max_capacity, tables_per_slot, hours } = body

  if (!id) {
    return NextResponse.json({ error: 'restaurant id required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('restaurants')
    .update({ name, address, city, phone, max_capacity, tables_per_slot, hours })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ restaurant: data })
}
