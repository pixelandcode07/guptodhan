'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, User, ShoppingBag, RotateCcw, Star, MapPin, KeyRound, LogOut, Calendar } from 'lucide-react'

const items = [
  { title: 'Dashboard', url: '/home/UserProfile', icon: LayoutDashboard },
  { title: 'Profile', url: '/home/UserProfile/profile', icon: User },
  { title: 'My Order', url: '/home/UserProfile/orders', icon: ShoppingBag },
  { title: 'My Return', url: '/home/UserProfile/returns', icon: RotateCcw },
  { title: 'My Review', url: '/home/UserProfile/reviews', icon: Star },
  { title: 'Saved Address', url: '/home/UserProfile/addresses', icon: MapPin },
  { title: 'Change Password', url: '/home/UserProfile/change-password', icon: KeyRound },
  { title: 'Logout', url: '/logout', icon: LogOut },
]

export default function UserSidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const user = session?.user

  return (
    <aside className="bg-white border rounded-md">
      <div className="flex flex-col items-center gap-2 p-4 border-b">
        <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {user?.image ? (
            <Image src={user.image} alt={user?.name ?? 'Avatar'} width={64} height={64} />
          ) : (
            <User className="h-8 w-8 text-gray-400" />
          )}
        </div>
        <div className="text-sm font-medium">{user?.name ?? 'Guest User'}</div>
        <div className="text-xs text-black flex items-center gap-1"><Calendar className="h-3 w-3" /> Customer since March 05 2025</div>
      </div>
      <nav className="py-2">
        <ul className="text-sm text-gray-500">
          {items.map(item => {
            const active = pathname === item.url
            return (
              <li key={item.title}>
                <Link
                  href={item.url}
                  className={`flex items-center gap-2 px-4 py-2 hover:bg-blue-50 ${active ? 'bg-blue-50 text-blue-600' : ''}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}


