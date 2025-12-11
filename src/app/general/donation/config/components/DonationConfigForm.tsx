'use client'

import React, { useEffect, useState } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import UploadImageBtn from '@/components/ReusableComponents/UploadImageBtn'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation' // 🔥 ১. Router ইমপোর্ট করুন

export type DonationFormInputs = {
  title: string
  image?: File | null
  shortDescription: string
  buttonText: string
  buttonUrl: string
}

export default function DonationConfigForm() {
  const { data: session } = useSession()
  const token = (session?.user as { accessToken?: string; role?: string })?.accessToken
  const adminRole = (session?.user as { role?: string })?.role === "admin"
  
  // 🔥 ২. রাউটার হুক ইনিশিয়ালইজ করুন
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DonationFormInputs>({
    defaultValues: {
      title: '',
      image: null,
      shortDescription: '',
      buttonText: '',
      buttonUrl: '',
    },
  })

  const [existingImage, setExistingImage] = useState<string | null>(null)
  const [isImageRemoved, setIsImageRemoved] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  // ডাটা লোড করার সময় টাইমস্ট্যাম্প ব্যবহার করা হয়েছে যাতে ব্রাউজার ক্যাশ না ধরে
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/v1/public/donation-configs?t=${new Date().getTime()}`);
        if (res.data && res.data.data) {
          const data = res.data.data;
          
          setValue('title', data.title || '')
          setValue('shortDescription', data.shortDescription || '')
          setValue('buttonText', data.buttonText || '')
          setValue('buttonUrl', data.buttonUrl || '')
          
          if (data.image) {
            setExistingImage(data.image)
          }
        }
      } catch (error) {
        console.error("Failed to load config", error)
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [setValue])

  const handleRemoveImage = () => {
    setExistingImage(null)
    setValue('image', null)
    setIsImageRemoved(true)
    toast.success('Image removed (Click Save to apply)')
  }

  // 🔥 ৩. সাবমিট ফাংশনে পরিবর্তন (মেইন ফিক্স)
  const onSubmit: SubmitHandler<DonationFormInputs> = async (data) => {
    if (!adminRole) {
      toast.error('Only admins can submit this form.')
      return
    }

    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('shortDescription', data.shortDescription)
      formData.append('buttonText', data.buttonText)
      formData.append('buttonUrl', data.buttonUrl)

      if (data.image) {
        formData.append('image', data.image)
      } else if (isImageRemoved) {
        formData.append('isImageRemoved', 'true')
      }

      // সার্ভারে রিকোয়েস্ট পাঠানো
      const response = await axios.patch('/api/v1/donation-configs', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          "x-user-role": adminRole,
        },
      })

      toast.success('Updated successfully!')

      // 👇👇👇 আসল কাজ এখানে 👇👇👇
      
      const updatedData = response.data.data; // সার্ভার থেকে আসা আপডেটেড ডাটা ধরলাম

      // ১. ইমেজের স্টেট ম্যানুয়ালি আপডেট করে দিচ্ছি (Reload ছাড়াই প্রিভিউ চেঞ্জ হবে)
      if (updatedData.image) {
        setExistingImage(updatedData.image); 
        setValue('image', null); // ইনপুট খালি করে দিচ্ছি
      } else {
        setExistingImage(null);
      }
      
      // ২. টেক্সট ফিল্ডগুলোও আপডেট করে দিচ্ছি (যদি সার্ভার কিছু ফরম্যাট করে থাকে)
      setValue('title', updatedData.title);
      setValue('shortDescription', updatedData.shortDescription);
      setValue('buttonText', updatedData.buttonText);
      setValue('buttonUrl', updatedData.buttonUrl);

      // ৩. Next.js এর সার্ভার ক্যাশ রিফ্রেশ করছি (ব্যাকগ্রাউন্ডে)
      // এটি পেজ রিলোড দেয় না, কিন্তু সার্ভার কম্পোনেন্টগুলোকে রি-ফেচ করায়
      router.refresh(); 

      // ৪. ফ্ল্যাগ রিসেট
      setIsImageRemoved(false);

    } catch (error: any) {
      console.error('Error saving config:', error)
      toast.error(error.response?.data?.message || 'Something went wrong!')
    }
  }

  if (loadingData) {
    return <div className="p-10 text-center text-gray-500">Loading configuration...</div>
  }

  return (
    <div className="m-1 md:m-10 p-4 md:p-5 border border-gray-200 rounded-md bg-[#f8f9fb]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h1 className="text-lg font-semibold border-l-2 border-blue-500 pl-5">
          Donation Config Form
        </h1>

        {/* Title */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <Label className="col-span-12 md:col-span-2">Title</Label>
          <Input
            className="col-span-12 md:col-span-10"
            placeholder="Donate Anything"
            {...register('title', { required: 'Title is required' })}
          />
        </div>
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

        {/* Image Upload */}
        <div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-center'>
          <Label className="col-span-12 md:col-span-2">Image</Label>
          <div className='col-span-10'>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <UploadImageBtn
                  value={field.value || existingImage} 
                  onChange={(file) => {
                    field.onChange(file)
                    setIsImageRemoved(false)
                  }}
                  onRemove={existingImage ? handleRemoveImage : undefined}
                  fieldName="image"
                />
              )}
            />
          </div>
        </div>

        {/* Short Description */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <Label className="col-span-12 md:col-span-2">Short Description</Label>
          <Textarea
            className="col-span-12 md:col-span-10"
            placeholder="Describe what items can be donated..."
            {...register('shortDescription', { required: 'Short description is required' })}
          />
        </div>
        {errors.shortDescription && (
          <p className="text-red-500 text-sm">{errors.shortDescription.message}</p>
        )}

        {/* Button Text */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <Label className="col-span-12 md:col-span-2">Button Text</Label>
          <Input
            className="col-span-12 md:col-span-10"
            placeholder="Donate goods"
            {...register('buttonText', { required: 'Button text is required' })}
          />
        </div>
        {errors.buttonText && <p className="text-red-500 text-sm">{errors.buttonText.message}</p>}

        {/* Button URL */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <Label className="col-span-12 md:col-span-2">Button URL</Label>
          <Input
            className="col-span-12 md:col-span-10"
            placeholder="#"
            {...register('buttonUrl', { required: 'Button URL is required' })}
          />
        </div>
        {errors.buttonUrl && <p className="text-red-500 text-sm">{errors.buttonUrl.message}</p>}

        {/* Submit */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-2" />
          <Button
            className="col-span-12 md:col-span-10 flex items-center gap-2"
            type="submit"
            variant="default" // আপনার বাটন স্টাইল অনুযায়ী (BlueBtn বা default)
            disabled={isSubmitting || !adminRole}
          >
            <Save className="w-4 h-4" /> 
            {isSubmitting ? 'Saving...' : 'Update Info'}
          </Button>
        </div>
      </form>
    </div>
  )
}