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
  const [stats, setStats] = useState({ today: 0, upcoming: 0, totalGuests: 0 })
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    loadBookings()
  }, [selectedDate])

  async function loadBookings() {
    const restaurant = JSON.parse(localStorage.getItem('dl_restaurant') || '{}')
    if (!restaurant.id) return

    setLoading(true)
    const res = await fetch(`/api/bookings?restaurant_id=${restaurant.id}&date=${selectedDate}`)
    const data = await res.json()
    setBookings(data.bookings || [])

    // Stats
    const confirmed = (data.bookings || []).filter((b: Booking) => b.status === 'confirmed')
    setStats({
      today: confirmed.length,
      upcoming: confirmed.length,
      totalGuests: confirmed.reduce((sum: number, b: Booking) => sum + b.party_size, 0)
    })
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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings</h1>
          <p className="text-gray-400 text-sm mt-1">{getDateLabel(selectedDate)}</p>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition"
          >
            + Add Booking
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <p className="text-gray-400 text-sm">Bookings</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.today}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <p className="text-gray-400 text-sm">Total Guests</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.totalGuests}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <p className="text-gray-400 text-sm">AI Booked</p>
          <p className="text-3xl font-bold text-emerald-400 mt-1">
            {bookings.filter(b => b.booked_via === 'ai_call').length}
          </p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-4 text-sm font-medium text-gray-400">Time</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Guest</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Party</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Phone</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Notes</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Source</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">
                  No bookings for this date
                </td>
              </tr>
            ) : (
              bookings.map(booking => (
                <tr key={booking.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="p-4 text-white font-medium">{formatTime(booking.booking_time)}</td>
                  <td className="p-4 text-white">{booking.customer_name}</td>
                  <td className="p-4 text-white">{booking.party_size}</td>
                  <td className="p-4 text-gray-400 text-sm">{booking.customer_phone}</td>
                  <td className="p-4 text-gray-400 text-sm">{booking.dietary_notes || '-'}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      booking.booked_via === 'ai_call'
                        ? 'bg-emerald-900/50 text-emerald-400'
                        : 'bg-gray-700 text-gray-300'
                    }`}>
                      {booking.booked_via === 'ai_call' ? 'AI Call' : 'Manual'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      booking.status === 'confirmed' ? 'bg-blue-900/50 text-blue-400' :
                      booking.status === 'cancelled' ? 'bg-red-900/50 text-red-400' :
                      booking.status === 'completed' ? 'bg-green-900/50 text-green-400' :
                      'bg-yellow-900/50 text-yellow-400'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {booking.status === 'confirmed' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          className="text-xs text-emerald-400 hover:text-emerald-300"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800">
        <h2 className="text-xl font-bold text-white mb-4">Add Booking</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text" placeholder="Guest name" required
            value={form.customer_name} onChange={e => setForm({ ...form, customer_name: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="tel" placeholder="Phone number" required
            value={form.customer_phone} onChange={e => setForm({ ...form, customer_phone: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Party size</label>
              <select
                value={form.party_size} onChange={e => setForm({ ...form, party_size: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Time</label>
              <input
                type="time" value={form.booking_time}
                onChange={e => setForm({ ...form, booking_time: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <input
            type="text" placeholder="Dietary notes (optional)"
            value={form.dietary_notes} onChange={e => setForm({ ...form, dietary_notes: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-500 transition disabled:opacity-50">
              {saving ? 'Saving...' : 'Add Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
