import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  const { data: user, error } = await supabaseAdmin
    .from('dashboard_users')
    .select('*, restaurants(*)')
    .eq('email', email.toLowerCase())
    .single()

  if (!user || error) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  if (user.password_hash !== hashPassword(password)) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  // Set a simple session cookie
  const sessionToken = crypto.randomBytes(32).toString('hex')

  const response = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name },
    restaurant: user.restaurants
  })

  response.cookies.set('dl_session', `${user.id}:${user.restaurant_id}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/'
  })

  return response
}
