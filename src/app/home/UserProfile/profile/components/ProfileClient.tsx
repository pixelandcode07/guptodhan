"use client"

import React from 'react'
import ProfileHeader from './ProfileHeader'
import PersonalInfoForm from './PersonalInfoForm'

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
  const handleSave = (data: { name: string; phone: string }) => {
    console.log('Save profile data:', data)
    // TODO: Implement save functionality
  }

  const handleRemoveImage = () => {
    console.log('Remove profile image')
    // TODO: Implement remove image functionality
  }

  const handleChangeImage = () => {
    console.log('Change profile image')
    // TODO: Implement change image functionality
  }

  return (
    <>
      <ProfileHeader 
        userName={userName}
        userImage={userImage}
        userPhone={userPhone}
        onRemoveClick={handleRemoveImage}
        onChangeImageClick={handleChangeImage}
      />

      <PersonalInfoForm 
        initialName={userName}
        initialPhone={userPhone}
        onSave={handleSave}
      />
    </>
  )
}

