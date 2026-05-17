import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import ProfileClient from './components/ProfileClient'
import PageHeader from '@/components/ReusableComponents/PageHeader'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  const user = session?.user
  const userName = user?.name ?? 'Guest User'
  const userImage = user?.image ?? null

  return (
    <div className="bg-white rounded-md p-6">
      {/* ✅ Profile Heading এবং Shop Now বাটন */}
      <div className="flex items-center justify-between mb-4">
        <PageHeader title="Profile" />
        
        <Link 
          href="/products" 
          className="flex items-center gap-2 bg-[#0097E9] hover:bg-[#0097E9]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
        >
          <ShoppingBag className="w-4 h-4" />
          Shop Now
        </Link>
      </div>

      <ProfileClient 
        userName={userName} 
        userImage={userImage}
      />
    </div>
  )
}