"use client"

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import ProfileHeader from './ProfileHeader'
import PersonalInfoForm from './PersonalInfoForm'
import { useProfile } from '../hooks/useProfile'

interface ProfileClientProps {
  userName: string
  userImage: string | null
  userPhone?: string
}

export default function ProfileClient({ 
  userName, 
  userImage, 
  userPhone = '+8801700 000000' 
}: ProfileClientProps) {
  const { profile, saving, updateProfile, updateProfilePicture } = useProfile()
  const [currentImage, setCurrentImage] = useState(userImage)
  const [currentData, setCurrentData] = useState({
    name: userName,
    phone: userPhone,
    address: ''
  })

  useEffect(() => {
    if (profile) {
      setCurrentData({
        name: profile.name || userName,
        phone: profile.phoneNumber || userPhone || '+8801700 000000',
        address: profile.address || ''
      })
      if (profile.profilePicture) {
        setCurrentImage(profile.profilePicture)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  const handleSave = async (data: { name: string; phoneNumber: string; address?: string }) => {
    await updateProfile(data)
  }

  const handleRemoveImage = () => {
    toast.error('Remove image functionality not implemented yet')
  }

  const handleChangeImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        await updateProfilePicture(file)
      }
    }
    input.click()
  }

  return (
    <>
      <ProfileHeader 
        userName={currentData.name}
        userImage={currentImage}
        userPhone={currentData.phone}
        onRemoveClick={handleRemoveImage}
        onChangeImageClick={handleChangeImage}
      />

      <PersonalInfoForm 
        initialName={currentData.name}
        initialPhone={currentData.phone}
        initialAddress={currentData.address}
        onSave={handleSave}
        isLoading={saving}
      />
    </>
  )
}
