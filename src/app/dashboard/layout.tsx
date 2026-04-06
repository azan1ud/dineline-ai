'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [restaurant, setRestaurant] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const r = localStorage.getItem('dl_restaurant')
    const u = localStorage.getItem('dl_user')
    if (!r || !u) {
      router.push('/login')
      return
    }
    setRestaurant(JSON.parse(r))
    setUser(JSON.parse(u))
  }, [router])

  function handleLogout() {
    localStorage.removeItem('dl_restaurant')
    localStorage.removeItem('dl_user')
    document.cookie = 'dl_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/login')
  }

  if (!restaurant) return null

  const links = [
    { href: '/dashboard', label: 'Bookings', icon: '📅' },
    { href: '/dashboard/calls', label: 'Call Log', icon: '📞' },
    { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">
            <span className="font-sans">Dine</span>
            <span className="italic font-serif">Line</span>
          </h1>
          <p className="text-emerald-400 text-sm mt-1 truncate">{restaurant.name}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                pathname === link.href
                  ? 'bg-emerald-600/20 text-emerald-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="text-sm text-gray-400 mb-2 truncate">{user?.email}</div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-400 transition"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
