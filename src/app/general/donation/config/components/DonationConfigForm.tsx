// 'use client'

// import UploadImageBtn from '@/components/ReusableComponents/UploadImageBtn'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
// import { Save } from 'lucide-react'
// import React from 'react'
// import { Controller, SubmitHandler, useForm } from 'react-hook-form'

// export type Inputs = {
//     title: string
//     short_description: string
//     button_text: string
//     button_url: string
// }




// export default function DonationConfigForm() {

//     const {
//         register,
//         handleSubmit,
//         control,
//         // setValue,
//         formState: { errors },
//     } = useForm<Inputs>()

//     // const onSubmit:  = (data) => 

//     const onSubmit: SubmitHandler<Inputs> = (data) => {
//         console.log(data)
//     }
//     return (
//         <div>
//             <form onSubmit={handleSubmit(onSubmit)} className='bg-[#f8f9fb] m-5 md:m-10 p-5 border border-[#e4e7eb] rounded-xs space-y-5 '>
//                 <div >
//                     <h1 className="text-lg font-semibold border-l-2 border-blue-500">
//                         <span className="pl-5">Donation Config Form:</span>
//                     </h1>
//                 </div>
//                 {/* Title */}
//                 <section className='grid grid-cols-1 md:grid-cols-12 gap-6  mb-2'>
//                     <div className='col-span-4 md:col-span-2'>
//                         <Label htmlFor="Title">Title</Label>
//                     </div>
//                     <div className='col-span-6 md:col-span-10'>
//                         <Input
//                             type="text"
//                             placeholder="Donate Anything"
//                             {...register("title")}
//                             className='mb-8 border border-gray-500'
//                         />
//                     </div>
//                 </section>
//                 {/* Category Icon */}
//                 <section className='grid grid-cols-1 md:grid-cols-12 gap-6  mb-2'>
//                     <div className='col-span-4 md:col-span-2'>
//                         <Label htmlFor="name">Category Icon</Label>
//                     </div>
//                     <div className='col-span-6 md:col-span-10'>
//                         {/* <Textarea placeholder='Here will be a Photo upload btn' className='mb-8 border border-gray-500 ' /> */}
//                         <Controller
//                             name="category_image"
//                             control={control}
//                             render={({ field }) => (
//                                 <UploadImageBtn value={field.value} onChange={field.onChange} />
//                             )}
//                         />
//                     </div>
//                 </section>
//                 {/* Short Description */}
//                 <section className='grid grid-cols-1 md:grid-cols-12 gap-6  mb-2'>
//                     <div className='col-span-4 md:col-span-2'>
//                         <Label htmlFor="name">Short Description</Label>
//                     </div>
//                     <div className='col-span-6 md:col-span-10'>
//                         <Textarea
//                             {...register("short_description")}
//                             placeholder='Consider donating items that you no longer use or need but are still in good condition, such as furniture or electronics.'
//                             className='mb-8 border border-gray-500' />
//                     </div>
//                 </section>
//                 {/* Button Text */}
//                 <section className='grid grid-cols-1 md:grid-cols-12 gap-6  mb-2'>
//                     <div className='col-span-4 md:col-span-2'>
//                         <Label htmlFor="name">Button Text</Label>
//                     </div>
//                     <div className='col-span-6 md:col-span-10'>
//                         <Input
//                             type="text"
//                             placeholder="Donate goods"
//                             {...register("button_text")}
//                             className='mb-8 border border-gray-500'
//                         />
//                     </div>
//                 </section>
//                 {/* Button Url */}
//                 <section className='grid grid-cols-1 md:grid-cols-12 gap-6  mb-2'>
//                     <div className='col-span-4 md:col-span-2'>
//                         <Label htmlFor="name">Button Url</Label>
//                     </div>
//                     <div className='col-span-6 md:col-span-10'>
//                         <Input
//                             type="text"
//                             placeholder="#"
//                             {...register("button_url")}
//                             className='mb-8 border border-gray-500'
//                         />
//                     </div>
//                 </section>

//                 <section className='grid grid-cols-1 md:grid-cols-12 gap-6  mb-2'>
//                     <div className='col-span-4 md:col-span-2'>
//                         <Label htmlFor="name"></Label>
//                     </div>
//                     <div className='col-span-6 md:col-span-10'>
//                         <Button variant={'BlueBtn'} type="submit"><Save />Save Info</Button>
//                     </div>
//                 </section>
//             </form>
//         </div>
//     )
// }


'use client'

import React, { useState } from 'react'
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

export type DonationFormInputs = {
  title: string
  image?: File | null
  shortDescription: string
  buttonText: string
  buttonUrl: string
}

export default function DonationConfigForm() {
  const { data: session } = useSession()
  const adminRole = (session?.user as { role?: string })?.role === 'admin'

  const {
    register,
    handleSubmit,
    control,
    reset,
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

  const [previewImage, setPreviewImage] = useState<File | string | null>(null)

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
      if (data.image) formData.append('image', data.image)

      const response = await axios.post('/api/v1/donation-configs', formData)
      toast.success('Donation config saved successfully!')
      reset()
      setPreviewImage(null)
    } catch (error: any) {
      console.error('Error saving config:', error)
      toast.error(error.response?.data?.message || 'Something went wrong!')
    }
  }

  return (
    <div className="m-5 md:m-10 p-5 border border-gray-200 rounded-md bg-[#f8f9fb]">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <Label className="col-span-12 md:col-span-2">Image</Label>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <UploadImageBtn
                value={field.value ?? null}
                onChange={(file) => {
                  field.onChange(file)
                  setPreviewImage(file)
                }}
                onRemove={() => {
                  field.onChange(null)
                  setPreviewImage(null)
                }}
                fieldName="image"
              />
            )}
          />
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
            disabled={isSubmitting || !adminRole}
          >
            <Save /> Save Info
          </Button>
        </div>
      </form>
    </div>
  )
}

