'use client'

import { useEffect, useState } from 'react'

interface Booking {
  id: string
  customer_name: string
  customer_phone: string
  party_size: number
  booking_date: string
  booking_time: string
  dietary_notes: string | null
  special_requests: string | null
  status: string
  booked_via: string
  created_at: string
}

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    loadBookings()
  }, [selectedDate])

  async function loadBookings() {
    const restaurant = JSON.parse(localStorage.getItem('dl_restaurant') || '{}')
    if (!restaurant.id) return

    setLoading(true)
    const res = await fetch(`/api/bookings?restaurant_id=${restaurant.id}&date=${selectedDate}&status=confirmed`)
    const data = await res.json()
    const sorted = (data.bookings || []).sort((a: Booking, b: Booking) =>
      a.booking_time.localeCompare(b.booking_time)
    )
    setBookings(sorted)
    setLoading(false)
  }

  async function updateBookingStatus(id: string, status: string) {
    await fetch('/api/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    })
    loadBookings()
  }

  function formatTime(time: string) {
    const [h, m] = time.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${m} ${ampm}`
  }

  function getDateLabel(date: string) {
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
    if (date === today) return 'Today'
    if (date === tomorrow) return 'Tomorrow'
    return new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  function navigateDate(offset: number) {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + offset)
    setSelectedDate(d.toISOString().split('T')[0])
  }

  const confirmed = bookings.filter(b => b.status === 'confirmed')
  const totalGuests = confirmed.reduce((sum, b) => sum + b.party_size, 0)
  const aiBooked = bookings.filter(b => b.booked_via === 'ai_call').length

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Reservations</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your restaurant bookings</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigateDate(-1)} className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm font-medium min-w-[180px] text-center">
            {getDateLabel(selectedDate)}
            <span className="text-gray-500 ml-2">
              {new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
          </div>
          <button onClick={() => navigateDate(1)} className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <button onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])} className="px-3 py-2 text-xs text-gray-400 border border-gray-700 rounded-lg hover:text-white hover:bg-gray-800 transition">
            Today
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add Booking
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800/50">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Reservations</p>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{confirmed.length}</p>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800/50">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Guests</p>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{totalGuests}</p>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800/50">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">AI Booked</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a3.366 3.366 0 00-.985 2.38V21.75" /></svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-emerald-400 mt-3">{aiBooked}</p>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800/50">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Capacity</p>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{confirmed.length}<span className="text-lg text-gray-600">/10</span></p>
          <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${Math.min(confirmed.length * 10, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800/50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">{getDateLabel(selectedDate)}&apos;s Reservations</h2>
          <span className="text-xs text-gray-500">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm mt-3">Loading reservations...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
            </div>
            <p className="text-gray-500 text-sm">No reservations for this date</p>
            <button onClick={() => setShowAddModal(true)} className="mt-3 text-emerald-400 text-sm hover:text-emerald-300 transition">
              + Add a booking
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-800/50">
            {bookings.map(booking => (
              <div key={booking.id} className="hover:bg-gray-800/20 transition-colors">
                <div
                  className="px-6 py-4 flex items-center gap-4 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                >
                  {/* Time */}
                  <div className="w-20 shrink-0">
                    <span className="text-white font-semibold text-sm">{formatTime(booking.booking_time)}</span>
                  </div>

                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3 w-48 shrink-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      booking.status === 'cancelled' ? 'bg-red-500/10 text-red-400' :
                      booking.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                      'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {booking.customer_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm truncate">{booking.customer_name}</p>
                      <p className="text-gray-500 text-xs">{booking.customer_phone}</p>
                    </div>
                  </div>

                  {/* Party size */}
                  <div className="flex items-center gap-1.5 w-20 shrink-0">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="text-gray-300 text-sm">{booking.party_size}</span>
                  </div>

                  {/* Source badge */}
                  <div className="w-24 shrink-0">
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                      booking.booked_via === 'ai_call'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}>
                      {booking.booked_via === 'ai_call' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                      {booking.booked_via === 'ai_call' ? 'AI Call' : 'Manual'}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="w-24 shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      booking.status === 'confirmed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      booking.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      booking.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex-1 flex justify-end gap-2">
                    {booking.status === 'confirmed' && (
                      <>
                        <button
                          onClick={e => { e.stopPropagation(); updateBookingStatus(booking.id, 'completed') }}
                          className="px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition"
                        >
                          Seated
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); updateBookingStatus(booking.id, 'cancelled') }}
                          className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>

                  {/* Expand chevron */}
                  <svg className={`w-4 h-4 text-gray-600 transition-transform ${expandedId === booking.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>

                {/* Expanded details */}
                {expandedId === booking.id && (
                  <div className="px-6 pb-4 ml-20 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Phone</p>
                      <p className="text-gray-300">{booking.customer_phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Dietary Notes</p>
                      <p className="text-gray-300">{booking.dietary_notes || 'None'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Booked At</p>
                      <p className="text-gray-300">{new Date(booking.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Booking Modal */}
      {showAddModal && <AddBookingModal onClose={() => { setShowAddModal(false); loadBookings() }} date={selectedDate} />}
    </div>
  )
}

function AddBookingModal({ onClose, date }: { onClose: () => void, date: string }) {
  const [form, setForm] = useState({
    customer_name: '', customer_phone: '', party_size: '2',
    booking_time: '19:00', dietary_notes: ''
  })
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const restaurant = JSON.parse(localStorage.getItem('dl_restaurant') || '{}')

    await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant_id: restaurant.id,
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        party_size: parseInt(form.party_size),
        booking_date: date,
        booking_time: form.booking_time,
        dietary_notes: form.dietary_notes || null
      })
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">New Reservation</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">Guest Name</label>
            <input
              type="text" placeholder="e.g. John Smith" required
              value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">Phone Number</label>
            <input
              type="tel" placeholder="07xxx xxxxxx" required
              value={form.customer_phone} onChange={e => setForm({ ...form, customer_phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">Party Size</label>
              <select
                value={form.party_size} onChange={e => setForm({ ...form, party_size: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block font-medium">Time</label>
              <input
                type="time" value={form.booking_time}
                onChange={e => setForm({ ...form, booking_time: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1.5 block font-medium">Dietary Notes</label>
            <input
              type="text" placeholder="e.g. Vegetarian, nut allergy"
              value={form.dietary_notes} onChange={e => setForm({ ...form, dietary_notes: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-gray-800 text-gray-300 text-sm rounded-lg hover:bg-gray-700 transition border border-gray-700">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-500 transition disabled:opacity-50">
              {saving ? 'Saving...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
