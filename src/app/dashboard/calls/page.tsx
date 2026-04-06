'use client'

import { useEffect, useState } from 'react'

interface CallLog {
  id: string
  caller_phone: string
  duration_seconds: number
  summary: string
  booking_made: boolean
  recording_url: string | null
  created_at: string
}

export default function CallsPage() {
  const [calls, setCalls] = useState<CallLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCalls()
  }, [])

  async function loadCalls() {
    const restaurant = JSON.parse(localStorage.getItem('dl_restaurant') || '{}')
    if (!restaurant.id) return

    const res = await fetch(`/api/calls?restaurant_id=${restaurant.id}`)
    const data = await res.json()
    setCalls(data.calls || [])
    setLoading(false)
  }

  function formatDuration(seconds: number) {
    if (!seconds) return '-'
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('en-GB', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Call Log</h1>
        <p className="text-gray-400 text-sm mt-1">All incoming calls handled by your AI assistant</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <p className="text-gray-400 text-sm">Total Calls</p>
          <p className="text-3xl font-bold text-white mt-1">{calls.length}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <p className="text-gray-400 text-sm">Bookings Made</p>
          <p className="text-3xl font-bold text-emerald-400 mt-1">
            {calls.filter(c => c.booking_made).length}
          </p>
        </div>
        <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
          <p className="text-gray-400 text-sm">Conversion Rate</p>
          <p className="text-3xl font-bold text-white mt-1">
            {calls.length > 0 ? Math.round((calls.filter(c => c.booking_made).length / calls.length) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Calls Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-4 text-sm font-medium text-gray-400">Date</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Caller</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Duration</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Summary</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Booking</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : calls.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No calls yet. Calls will appear here once your AI starts answering.
                </td>
              </tr>
            ) : (
              calls.map(call => (
                <tr key={call.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="p-4 text-white text-sm">{formatDate(call.created_at)}</td>
                  <td className="p-4 text-white">{call.caller_phone || 'Unknown'}</td>
                  <td className="p-4 text-gray-400">{formatDuration(call.duration_seconds)}</td>
                  <td className="p-4 text-gray-400 text-sm max-w-xs truncate">{call.summary || '-'}</td>
                  <td className="p-4">
                    {call.booking_made ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-900/50 text-emerald-400">Yes</span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-400">No</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
