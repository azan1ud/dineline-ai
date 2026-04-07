'use client'

import { useEffect, useState } from 'react'

interface CallLog {
  id: string
  caller_phone: string
  duration_seconds: number
  summary: string
  booking_made: boolean
  recording_url: string | null
  transcript: string | null
  created_at: string
}

export default function CallsPage() {
  const [calls, setCalls] = useState<CallLog[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

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
    const sec = Math.round(seconds % 60)
    if (min === 0) return `${sec}s`
    return `${min}m ${sec}s`
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('en-GB', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    })
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const bookingsMade = calls.filter(c => c.booking_made).length
  const conversionRate = calls.length > 0 ? Math.round((bookingsMade / calls.length) * 100) : 0
  const avgDuration = calls.length > 0
    ? calls.reduce((sum, c) => sum + (c.duration_seconds || 0), 0) / calls.filter(c => c.duration_seconds).length
    : 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Call Log</h1>
        <p className="text-gray-500 text-sm mt-1">All incoming calls handled by your AI receptionist</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800/50">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Calls</p>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{calls.length}</p>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800/50">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Bookings Made</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-emerald-400 mt-3">{bookingsMade}</p>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800/50">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Conversion</p>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{conversionRate}<span className="text-lg text-gray-600">%</span></p>
          <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${conversionRate}%` }} />
          </div>
        </div>
        <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800/50">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Avg Duration</p>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{avgDuration > 0 ? formatDuration(avgDuration) : '-'}</p>
        </div>
      </div>

      {/* Calls List */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800/50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Recent Calls</h2>
          <span className="text-xs text-gray-500">{calls.length} call{calls.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm mt-3">Loading calls...</p>
          </div>
        ) : calls.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
            </div>
            <p className="text-gray-500 text-sm">No calls yet</p>
            <p className="text-gray-600 text-xs mt-1">Calls will appear here once your AI starts answering</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800/50">
            {calls.map(call => (
              <div key={call.id} className="hover:bg-gray-800/20 transition-colors">
                <div
                  className="px-6 py-4 flex items-center gap-4 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === call.id ? null : call.id)}
                >
                  {/* Status indicator */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    call.booking_made ? 'bg-emerald-500/10' : 'bg-gray-800'
                  }`}>
                    {call.booking_made ? (
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                    )}
                  </div>

                  {/* Caller info */}
                  <div className="w-40 shrink-0">
                    <p className="text-white text-sm font-medium">{call.caller_phone || 'Unknown'}</p>
                    <p className="text-gray-500 text-xs">{timeAgo(call.created_at)}</p>
                  </div>

                  {/* Duration */}
                  <div className="w-20 shrink-0">
                    <span className="text-gray-400 text-sm">{formatDuration(call.duration_seconds)}</span>
                  </div>

                  {/* Summary */}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-400 text-sm truncate">{call.summary || 'No summary available'}</p>
                  </div>

                  {/* Booking badge */}
                  <div className="w-24 shrink-0 text-right">
                    {call.booking_made ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Booked
                      </span>
                    ) : (
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-800 text-gray-500 border border-gray-700">
                        No booking
                      </span>
                    )}
                  </div>

                  {/* Expand */}
                  <svg className={`w-4 h-4 text-gray-600 transition-transform shrink-0 ${expandedId === call.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>

                {/* Expanded details */}
                {expandedId === call.id && (
                  <div className="px-6 pb-5 ml-13">
                    <div className="ml-13 bg-gray-800/30 rounded-lg p-4 space-y-3">
                      <div>
                        <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wider">Call Summary</p>
                        <p className="text-gray-300 text-sm leading-relaxed">{call.summary || 'No summary available'}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-700/50">
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Date & Time</p>
                          <p className="text-gray-300 text-sm">{formatDate(call.created_at)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Duration</p>
                          <p className="text-gray-300 text-sm">{formatDuration(call.duration_seconds)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Result</p>
                          <p className="text-gray-300 text-sm">{call.booking_made ? 'Reservation created' : 'Enquiry only'}</p>
                        </div>
                      </div>
                      {call.recording_url && (
                        <div className="pt-2 border-t border-gray-700/50">
                          <a href={call.recording_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>
                            Listen to recording
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
