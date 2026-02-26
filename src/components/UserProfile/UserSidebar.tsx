'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  RotateCcw,
  Star,
  MapPin,
  KeyRound,
  LogOut,
  Calendar,
  Headset,
  HeartHandshake,
  Gift,
  Hand,
  LucideWorkflow,
} from 'lucide-react'
import api from '@/lib/axios'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { toast } from 'sonner'
import { logoutAction } from '@/lib/actions/auth.actions'

const items = [
  { title: 'Dashboard', url: '/home/UserProfile', icon: LayoutDashboard },
  { title: 'Profile', url: '/home/UserProfile/profile', icon: User },
  { title: 'My Order', url: '/home/UserProfile/orders', icon: ShoppingBag },
  { title: 'My Return', url: '/home/UserProfile/returns', icon: RotateCcw },
  { title: 'My Review', url: '/home/UserProfile/reviews', icon: Star },
  { title: 'My Services', url: '/home/UserProfile/services', icon: LucideWorkflow },
  { title: 'Donation Stats', url: '/home/UserProfile/donation-dashboard', icon: HeartHandshake },
  { title: 'My Campaigns', url: '/home/UserProfile/my-campaigns', icon: Gift },
  { title: 'My Requests', url: '/home/UserProfile/my-claims', icon: Hand },
  { title: 'Support Tickets', url: '/home/UserProfile/support-tickets', icon: Headset },
  { title: 'Saved Address', url: '/home/UserProfile/addresses', icon: MapPin },
  { title: 'Change Password', url: '/home/UserProfile/change-password', icon: KeyRound },
]

export default function UserSidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const user = session?.user

  const [profileData, setProfileData] = useState<{
    name: string
    image?: string
    createdAt?: Date | string
  }>({
    name: user?.name ?? 'Guest User',
    image: user?.image || undefined,
  })

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile/me')
        if (response.data?.success && response.data?.data) {
          setProfileData({
            name: response.data.data.name || user?.name || 'Guest User',
            image: response.data.data.profilePicture || user?.image || undefined,
            createdAt: response.data.data.createdAt,
          })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    if (user) {
      fetchProfile()
    }
  }, [user])

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      const fetchProfile = async () => {
        try {
          const response = await api.get('/profile/me')
          if (response.data?.success && response.data?.data) {
            setProfileData({
              name: response.data.data.name || user?.name || 'Guest User',
              image: response.data.data.profilePicture || user?.image || undefined,
              createdAt: response.data.data.createdAt,
            })
          }
        } catch (error) {
          console.error('Error fetching profile:', error)
        }
      }

      if (user) {
        fetchProfile()
      }
    }

    window.addEventListener('profileUpdated', handleProfileUpdate)
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate)
    }
  }, [user])

  const displayName = profileData.name || user?.name || 'Guest User'
  const displayImage = profileData.image || user?.image

  const formatCustomerDate = (date: Date | string | undefined) => {
    if (!date) return 'Recent'
    const customerDate = new Date(date)
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ]
    const day = customerDate.getDate().toString().padStart(2, '0')
    const month = months[customerDate.getMonth()]
    const year = customerDate.getFullYear()
    return `${month} ${day} ${year}`
  }

  const customerSince = formatCustomerDate(profileData.createdAt)

  // ✅ COMPLETE SOLVED LOGOUT FUNCTION
  const handleLogout = async () => {
    if (isLoggingOut) return // Prevent double-click

    setIsLoggingOut(true)
    const toastId = toast.loading('Logging out...')

    try {
      console.log('🚀 Logout process started')

      // ========================================
      // STEP 1: Clear Browser Storage
      // ========================================
      console.log('🧹 Step 1: Clearing browser storage...')
      localStorage.clear()
      sessionStorage.clear()

      // ========================================
      // STEP 2: Clear IndexedDB (যদি থাকে)
      // ========================================
      console.log('🧹 Step 2: Clearing IndexedDB...')
      try {
        const databases = await indexedDB.databases()
        for (const db of databases) {
          if (db.name) {
            indexedDB.deleteDatabase(db.name)
          }
        }
      } catch (indexedDBError) {
        console.warn('⚠️ IndexedDB clear skipped:', indexedDBError)
      }

      // ========================================
      // STEP 3: Clear API cache/axios cache
      // ========================================
      console.log('🧹 Step 3: Clearing API cache...')
      if (api.defaults.headers.common['Authorization']) {
        delete api.defaults.headers.common['Authorization']
      }

      // ========================================
      // STEP 4: Call Server Action (auth.actions.ts)
      // ========================================
      console.log('🧹 Step 4: Clearing server-side data...')
      const userId = user?.id || (session?.user as any)?.id
      const logoutResult = await logoutAction(userId)

      if (!logoutResult.success) {
        console.warn('⚠️ Server logout result:', logoutResult.message)
      } else {
        console.log('✅ Server logout successful:', logoutResult.message)
      }

      // ========================================
      // STEP 5: Clear NextAuth Session
      // ========================================
      console.log('🧹 Step 5: Clearing NextAuth session...')
      await signOut({
        redirect: false,
        callbackUrl: '/',
      })

      // ========================================
      // STEP 6: Clear all cookies via JavaScript (Double check)
      // ========================================
      console.log('🧹 Step 6: Double-checking cookies...')
      const cookieList = [
        'accessToken',
        'refreshToken',
        'next-auth.session-token',
        'next-auth.csrf-token',
        '__Secure-next-auth.session-token',
        '__Host-next-auth.csrf-token',
      ]

      for (const cookieName of cookieList) {
        // Method 1: Standard way
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;`
        // Method 2: Secure way
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; path=/; SameSite=Lax;`
        // Method 3: All domains
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
      }

      // ========================================
      // STEP 7: Unregister Service Workers (PWA)
      // ========================================
      console.log('🧹 Step 7: Unregistering service workers...')
      try {
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations()
          for (const registration of registrations) {
            await registration.unregister()
          }
        }
      } catch (swError) {
        console.warn('⚠️ Service worker unregister skipped:', swError)
      }

      toast.dismiss(toastId)
      toast.success('✅ Logged out successfully')
      console.log('✅ All logout steps completed')

      // ========================================
      // STEP 8: Hard Redirect (Browser refresh)
      // ========================================
      console.log('🔄 Step 8: Redirecting to login...')
      
      // Hard redirect যাতে ব্রাউজার সম্পূর্ণভাবে রিফ্রেশ হয়
      setTimeout(() => {
        window.location.href = '/'
      }, 500)

    } catch (error: any) {
      console.error('❌ Logout error:', error)
      
      toast.dismiss(toastId)
      toast.error('Logout encountered an issue, clearing local data...')

      // Error হলেও সবকিছু clear করার চেষ্টা করুন
      try {
        localStorage.clear()
        sessionStorage.clear()
      } catch (e) {
        console.error('Clear storage error:', e)
      }

      // Force logout anyway
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)

    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <aside className="bg-transparent">
      <div className="flex flex-col items-center gap-2 p-4 border-b">
        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {session && (
            <Avatar className="h-full w-full">
              <AvatarImage
                src={displayImage && displayImage !== 'undefined' ? displayImage : undefined}
              />
              <AvatarFallback className="bg-white text-[#000066] font-medium">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        <div className="text-sm font-medium">{displayName}</div>
        <div className="text-xs text-black flex items-center gap-1">
          <Calendar className="h-3 w-3" /> Customer since {customerSince}
        </div>
      </div>

      <nav className="py-2">
        <ul className="text-sm text-gray-500">
          {items.map((item) => {
            const active = pathname === item.url
            return (
              <li key={item.title}>
                <Link
                  href={item.url}
                  className={`flex items-center gap-2 px-4 py-2 hover:bg-blue-50 transition-colors ${
                    active ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* ✅ Complete Logout Button */}
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`flex items-center justify-center gap-2 px-4 py-2 w-full rounded-md transition-all duration-200 mt-4 ${
          isLoggingOut
            ? 'bg-gray-400 text-white cursor-not-allowed opacity-50'
            : 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
        }`}
      >
        <LogOut size={16} />
        {isLoggingOut ? 'Logging out...' : 'Logout'}
      </button>
    </aside>
  )
}