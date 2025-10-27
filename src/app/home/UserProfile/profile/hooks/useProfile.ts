"use client"

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import api from '@/lib/axios'

interface ProfileData {
  name: string
  phoneNumber?: string
  email?: string
  profilePicture?: string
  address?: string
}

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await api.get('/profile/me')
      
      if (response.data?.success && response.data?.data) {
        setProfile(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  // Update profile data
  const updateProfile = async (data: { name?: string; phoneNumber?: string; address?: string }) => {
    try {
      setSaving(true)
      
      const formData = new FormData()
      if (data.name) formData.append('name', data.name)
      if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber)
      if (data.address) formData.append('address', data.address)

      const response = await api.patch('/profile/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      console.log('Profile update response:', response.data)
      
      if (response.data?.success && response.data?.data) {
        setProfile(response.data.data)
        console.log('Updated profile:', response.data.data)
        toast.success('Profile updated successfully!')
        
        // Dispatch event to update sidebar
        window.dispatchEvent(new Event('profileUpdated'))
        
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
      return false
    } finally {
      setSaving(false)
    }
  }

  // Update profile picture
  const updateProfilePicture = async (file: File) => {
    try {
      setSaving(true)
      
      const formData = new FormData()
      formData.append('profilePicture', file)

      const response = await api.patch('/profile/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data?.success && response.data?.data) {
        setProfile(response.data.data)
        toast.success('Profile picture updated successfully!')
        
        // Dispatch event to update sidebar
        window.dispatchEvent(new Event('profileUpdated'))
        
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating profile picture:', error)
      toast.error('Failed to update profile picture')
      return false
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  return {
    profile,
    loading,
    saving,
    fetchProfile,
    updateProfile,
    updateProfilePicture,
  }
}

