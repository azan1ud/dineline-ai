-- DineLine Restaurant Dashboard Schema
-- Run this in Supabase SQL Editor

-- Restaurants table
CREATE TABLE restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  hours JSONB DEFAULT '{
    "monday": {"open": "12:00", "close": "22:00"},
    "tuesday": {"open": "12:00", "close": "22:00"},
    "wednesday": {"open": "12:00", "close": "22:00"},
    "thursday": {"open": "12:00", "close": "22:00"},
    "friday": {"open": "12:00", "close": "23:00"},
    "saturday": {"open": "12:00", "close": "23:00"},
    "sunday": {"open": "12:00", "close": "21:00"}
  }'::jsonb,
  max_capacity INTEGER DEFAULT 65,
  tables_per_slot INTEGER DEFAULT 10,
  slot_duration_minutes INTEGER DEFAULT 30,
  vapi_phone_number TEXT,
  owner_email TEXT,
  owner_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  party_size INTEGER NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  dietary_notes TEXT,
  special_requests TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
  booked_via TEXT DEFAULT 'ai_call' CHECK (booked_via IN ('ai_call', 'manual', 'website')),
  call_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Call logs table
CREATE TABLE call_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  vapi_call_id TEXT,
  caller_phone TEXT,
  duration_seconds INTEGER,
  summary TEXT,
  booking_made BOOLEAN DEFAULT FALSE,
  recording_url TEXT,
  transcript TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dashboard users (restaurant owners)
CREATE TABLE dashboard_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX idx_bookings_restaurant_date ON bookings(restaurant_id, booking_date);
CREATE INDEX idx_bookings_customer_phone ON bookings(customer_phone);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_call_logs_restaurant ON call_logs(restaurant_id);
CREATE INDEX idx_call_logs_created ON call_logs(created_at);

-- Enable Row Level Security
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all for now via service role, we'll tighten later)
CREATE POLICY "Allow all for service role" ON restaurants FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON bookings FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON call_logs FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON dashboard_users FOR ALL USING (true);

-- Insert demo restaurant (Bella's Italian Kitchen)
INSERT INTO restaurants (name, slug, phone, address, city, owner_email, owner_name, vapi_phone_number)
VALUES (
  'Bella''s Italian Kitchen',
  'bellas-italian-kitchen',
  '+44 118 230 0504',
  '42 Kings Road, Chelsea',
  'London',
  'demo@getdineline.com',
  'Demo Owner',
  '+441182300504'
);
