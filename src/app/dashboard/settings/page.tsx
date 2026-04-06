'use client'

import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const [restaurant, setRestaurant] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const r = localStorage.getItem('dl_restaurant')
    if (r) setRestaurant(JSON.parse(r))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const res = await fetch('/api/restaurant', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(restaurant)
    })

    if (res.ok) {
      const data = await res.json()
      localStorage.setItem('dl_restaurant', JSON.stringify(data.restaurant))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  if (!restaurant) return null

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Restaurant Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Configure your restaurant details and AI assistant</p>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl space-y-8">
        {/* Basic Info */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-4">Restaurant Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Restaurant Name</label>
              <input
                type="text" value={restaurant.name || ''}
                onChange={e => setRestaurant({ ...restaurant, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Address</label>
              <input
                type="text" value={restaurant.address || ''}
                onChange={e => setRestaurant({ ...restaurant, address: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">City</label>
                <input
                  type="text" value={restaurant.city || ''}
                  onChange={e => setRestaurant({ ...restaurant, city: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone</label>
                <input
                  type="text" value={restaurant.phone || ''}
                  onChange={e => setRestaurant({ ...restaurant, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Capacity */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-4">Capacity</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Max Capacity (seats)</label>
              <input
                type="number" value={restaurant.max_capacity || 65}
                onChange={e => setRestaurant({ ...restaurant, max_capacity: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tables per time slot</label>
              <input
                type="number" value={restaurant.tables_per_slot || 10}
                onChange={e => setRestaurant({ ...restaurant, tables_per_slot: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-4">Opening Hours</h2>
          <div className="space-y-3">
            {days.map(day => (
              <div key={day} className="grid grid-cols-3 gap-4 items-center">
                <span className="text-gray-300 capitalize text-sm">{day}</span>
                <input
                  type="time"
                  value={restaurant.hours?.[day]?.open || '12:00'}
                  onChange={e => setRestaurant({
                    ...restaurant,
                    hours: { ...restaurant.hours, [day]: { ...restaurant.hours?.[day], open: e.target.value } }
                  })}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="time"
                  value={restaurant.hours?.[day]?.close || '22:00'}
                  onChange={e => setRestaurant({
                    ...restaurant,
                    hours: { ...restaurant.hours, [day]: { ...restaurant.hours?.[day], close: e.target.value } }
                  })}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* AI Phone Number */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-4">AI Phone Number</h2>
          <div className="flex items-center gap-3 p-4 bg-gray-800 rounded-lg">
            <span className="text-2xl">📞</span>
            <div>
              <p className="text-white font-medium">{restaurant.vapi_phone_number || 'Not configured'}</p>
              <p className="text-gray-400 text-sm">Calls to this number are answered by your AI assistant</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit" disabled={saving}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && <span className="text-emerald-400 text-sm">Settings saved!</span>}
        </div>
      </form>
    </div>
  )
}
