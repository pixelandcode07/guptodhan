'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save } from 'lucide-react'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export type Inputs = {
    title: string
    short_description: string
    button_text: string
    button_url: string
}




export default function DonationConfigForm() {

    const {
        register,
        handleSubmit,
        // setValue,
        formState: { errors },
    } = useForm<Inputs>()

    // const onSubmit:  = (data) => 

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data)
    }
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className='bg-[#f8f9fb] m-5 md:m-10 p-5 border border-[#e4e7eb] rounded-xs space-y-5 '>
                <div >
                    <h1 className="text-lg font-semibold border-l-2 border-blue-500">
                        <span className="pl-5">Donation Config Form:</span>
                    </h1>
                </div>
                {/* Title */}
                <section className='grid grid-cols-1 md:grid-cols-12 gap-6  mb-2'>
                    <div className='col-span-4 md:col-span-2'>
                        <Label htmlFor="Title">Title</Label>
                    </div>
                    <div className='col-span-6 md:col-span-10'>
                        <Input
                            type="text"
                            placeholder="Donate Anything"
                            {...register("title")}
                            className='mb-8 border border-gray-500'
                        />
                    </div>
                </section>
                {/* Category Icon */}
                <section className='grid grid-cols-1 md:grid-cols-12 gap-6  mb-2'>
                    <div className='col-span-4 md:col-span-2'>
                        <Label htmlFor="name">Category Icon</Label>
                    </div>
                    <div className='col-span-6 md:col-span-10'>
                        <Textarea placeholder='Here will be a Photo upload btn' className='mb-8 border border-gray-500 ' />
                    </div>
                </section>
                {/* Short Description */}
                <section className='grid grid-cols-1 md:grid-cols-12 gap-6  mb-2'>
                    <div className='col-span-4 md:col-span-2'>
                        <Label htmlFor="name">Short Description</Label>
                    </div>
                    <div className='col-span-6 md:col-span-10'>
                        <Textarea
                            {...register("short_description")}
                            placeholder='Consider donating items that you no longer use or need but are still in good condition, such as furniture or electronics.'
                            className='mb-8 border border-gray-500' />
                    </div>
                </section>
                {/* Button Text */}
                <section className='grid grid-cols-1 md:grid-cols-12 gap-6  mb-2'>
                    <div className='col-span-4 md:col-span-2'>
                        <Label htmlFor="name">Button Text</Label>
                    </div>
                    <div className='col-span-6 md:col-span-10'>
                        <Input
                            type="text"
                            placeholder="Donate goods"
                            {...register("button_text")}
                            className='mb-8 border border-gray-500'
                        />
                    </div>
                </section>
                {/* Button Url */}
                <section className='grid grid-cols-1 md:grid-cols-12 gap-6  mb-2'>
                    <div className='col-span-4 md:col-span-2'>
                        <Label htmlFor="name">Button Url</Label>
                    </div>
                    <div className='col-span-6 md:col-span-10'>
                        <Input
                            type="text"
                            placeholder="#"
                            {...register("button_url")}
                            className='mb-8 border border-gray-500'
                        />
                    </div>
                </section>

                <section className='grid grid-cols-1 md:grid-cols-12 gap-6  mb-2'>
                    <div className='col-span-4 md:col-span-2'>
                        <Label htmlFor="name"></Label>
                    </div>
                    <div className='col-span-6 md:col-span-10'>
                        <Button variant={'BlueBtn'} type="submit"><Save />Save Info</Button>
                    </div>
                </section>
            </form>
        </div>
    )
}
