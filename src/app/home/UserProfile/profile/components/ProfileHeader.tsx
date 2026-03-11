"use client"

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ProfileHeaderProps {
  userName: string
  userImage: string | null
  userPhone?: string
  onChangeImageClick?: () => void
}

export default function ProfileHeader({ 
  userName, 
  userImage, 
  userPhone,
  onChangeImageClick
}: ProfileHeaderProps) {
  const initials = userName
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('') || 'GU'

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border rounded-md p-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24">
          <AvatarImage src={userImage ?? undefined} alt={userName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-medium">{userName}</h2>
          <div className="text-sm text-gray-500">
            {userPhone && userPhone.trim().length > 0 ? userPhone : 'Add your phone number'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* <button 
          onClick={onRemoveClick}
          className="bg-white text-[#0084CB] border border-[#0084CB] rounded-full px-4 py-2 hover:bg-blue-50"
        >
          Remove
        </button> */}
        <button 
          onClick={onChangeImageClick}
          className="bg-blue-600 text-white rounded-full px-4 py-2 hover:bg-blue-700"
        >
          Change Image
        </button>
      </div>
    </div>
  )
}

