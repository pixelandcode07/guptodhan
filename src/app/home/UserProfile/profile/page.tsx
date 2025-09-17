"use client"

import React from 'react'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/ReusableComponents/PageHeader'
import BreadcrumbNav from '@/components/ReusableComponents/BreadcrumbNav'

export default function ProfilePage() {
  const { data: session } = useSession()
  const user = session?.user
  const userName = user?.name ?? 'Guest User'
  const initials = userName
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('') || 'GU'

  return (
    <div className="bg-white rounded-md p-6">
      {/* <PageHeader title="Profile" buttonLabel="Edit Profile" onButtonClick={() => {}} />  <BreadcrumbNav /> */}
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>

      {/* Header section with avatar, name, phone and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border rounded-md p-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={user?.image ?? undefined} alt={userName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-medium">{userName}</h2>
            <div className="text-sm text-gray-500">+8801700 000000</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button className="bg-white text-[#0084CB] border border-[#0084CB] rounded-full">Remove</Button>
          <Button className="bg-blue-600 text-white rounded-full">Change Image</Button>
        </div>
      </div>

      {/* Personal information form */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Personal information</h3>
        <div className="mt-4 grid gap-4 max-w-xl">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Full name<span className="text-red-500">*</span></label>
            <Input placeholder="Full name" defaultValue={userName} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Phone number<span className="text-red-500">*</span></label>
            <Input placeholder="+880 1XXXXXXXXX" defaultValue="+880 1777777777" />
          </div>
          <div className="pt-2">
            <Button className="w-48 bg-blue-600 text-white">Save changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
