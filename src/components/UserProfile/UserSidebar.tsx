'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
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
  LucideWorkflow
} from 'lucide-react'
import api from '@/lib/axios' // আপনার axios instance
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { toast } from 'sonner' // অপশনাল: টোস্ট মেসেজের জন্য

const items = [
  // ... আপনার মেনু আইটেমগুলো (যা ছিল তাই থাকবে)
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
  const user = session?.user

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const [profileData, setProfileData] = useState<{
    name: string
    image?: string
    createdAt?: Date | string
  }>({
    name: user?.name ?? 'Guest User',
    image: user?.image || undefined
  })

  // ... (আপনার useEffect গুলো যেমন ছিল তেমনই থাকবে)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile/me')
        if (response.data?.success && response.data?.data) {
          setProfileData({
            name: response.data.data.name || user?.name || 'Guest User',
            image: response.data.data.profilePicture || user?.image || undefined,
            createdAt: response.data.data.createdAt
          })
        }
      } catch (error) {
        console.error('Error fetching profile for sidebar:', error)
      }
    }
    if (user) {
      fetchProfile()
    }
  }, [user, pathname])

  useEffect(() => {
    const handleProfileUpdate = () => {
      const fetchProfile = async () => {
        try {
          const response = await api.get('/profile/me')
          if (response.data?.success && response.data?.data) {
            setProfileData({
              name: response.data.data.name || user?.name || 'Guest User',
              image: response.data.data.profilePicture || user?.image || undefined,
              createdAt: response.data.data.createdAt
            })
          }
        } catch (error) {
          console.error('Error fetching profile for sidebar:', error)
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
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
    const day = customerDate.getDate().toString().padStart(2, '0')
    const month = months[customerDate.getMonth()]
    const year = customerDate.getFullYear()
    return `${month} ${day} ${year}`
  }

  const customerSince = formatCustomerDate(profileData.createdAt)

  // ✅ নতুন: শক্তপোক্ত লগআউট ফাংশন
  const handleLogout = async () => {
    try {
      // ১. ব্রাউজারের লোকাল ডাটা ক্লিন করা
      localStorage.removeItem('accessToken'); // যদি সেভ করে থাকেন
      localStorage.removeItem('refreshToken');
      localStorage.clear(); // সব ক্লিয়ার করে দেওয়া ভালো
      sessionStorage.clear();

      // ২. ব্যাকএন্ডের কুকি ডিলিট করার জন্য API কল (এটি খুবই গুরুত্বপূর্ণ)
      // আপনার যদি /api/v1/auth/logout রাউট থাকে তবে এটি কল করতে হবে
      try {
         await api.post('/auth/logout'); 
      } catch (err) {
         console.warn("Backend logout failed or not needed", err);
      }

      // ৩. অবশেষে NextAuth সেশন ক্লিন করে রিডাইরেক্ট করা
      await signOut({ callbackUrl: "/", redirect: true });
      
    } catch (error) {
      console.error("Logout Error:", error);
      // এরর হলেও যেন লগআউট হয়
      signOut({ callbackUrl: "/" });
    }
  };

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
      
      {/* ✅ আপডেট করা বাটন */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 hover:bg-red-600 bg-red-600 text-white cursor-pointer w-full transition-colors duration-200"
      >
        <LogOut size={16} />
        Logout
      </button>
    </aside>
  )
}