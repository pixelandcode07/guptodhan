"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export const usePromoCodeForm = () => {
  const router = useRouter()
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endingDate, setEndingDate] = useState('')
  const [type, setType] = useState('')
  const [value, setValue] = useState('')
  const [minimumOrderAmount, setMinimumOrderAmount] = useState('')
  const [code, setCode] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setIconFile(null)
    setTitle('')
    setStartDate('')
    setEndingDate('')
    setType('')
    setValue('')
    setMinimumOrderAmount('')
    setCode('')
    setShortDescription('')
  }

  const validateForm = () => {
    if (!title || !startDate || !endingDate || !type || !value || !code) {
      throw new Error('Please fill all required fields.')
    }
    if (!iconFile) {
      throw new Error('Please upload a promo code icon.')
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    
    try {
      setIsSubmitting(true)
      validateForm()

      const formData = new FormData()
      formData.append('promoCodeId', `PC-${Date.now()}`)
      formData.append('title', title)
      formData.append('startDate', startDate)
      formData.append('endingDate', endingDate)
      formData.append('type', type)
      formData.append('shortDescription', shortDescription)
      formData.append('value', value)
      formData.append('minimumOrderAmount', minimumOrderAmount || '0')
      formData.append('code', code)
      formData.append('status', 'active')
      formData.append('icon', iconFile)

      const res = await fetch('/api/v1/promo-code', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData?.message || 'Failed to create promo code')
      }

      toast.success('Promo code created successfully!')
      resetForm()
      router.replace('/general/view/all/promo/codes')
    } catch (e: unknown) {
      const err = e as { message?: string }
      toast.error(err?.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    // Form state
    iconFile,
    setIconFile,
    title,
    setTitle,
    startDate,
    setStartDate,
    endingDate,
    setEndingDate,
    type,
    setType,
    value,
    setValue,
    minimumOrderAmount,
    setMinimumOrderAmount,
    code,
    setCode,
    shortDescription,
    setShortDescription,
    isSubmitting,
    // Actions
    handleSubmit,
  }
}


