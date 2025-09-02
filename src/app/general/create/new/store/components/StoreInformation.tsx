import React, { useState } from 'react'
import { Inputs } from './CreateNewStoreFrom'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Asterisk } from 'lucide-react'
import Image from 'next/image'
import Select from 'react-select';
import { colourOptions } from '@/data/data'
import { Textarea } from '@/components/ui/textarea'

export default function StoreInformation({ register, errors }: {
    register: UseFormRegister<Inputs>
    errors: FieldErrors<Inputs>
}) {
    return (
        <div>
            {/* Owner Information: */}
            <h1 className='border-b border-[#e4e7eb] pb-2 text-lg'>Store Information:</h1>
            <main className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
                <section>
                    {/* Store Logo */}
                    <Label htmlFor="name" className='pb-2'>Store Logo<Asterisk className='text-red-600 h-3 ' /></Label>
                    <Image src="/img/StoreLogo.jpeg" alt="Guptodhan" width={500} height={200} />
                </section>
                <section>
                    {/* Store Banner */}
                    <Label htmlFor="name" className='pb-2'>Store Banner<Asterisk className='text-red-600 h-3 ' /></Label>
                    <Image src="/img/StoreBanner.jpeg" alt="Guptodhan" width={500} height={200} />
                </section>
                <section>
                    {/* Store Name */}
                    <Label htmlFor="name" className='pb-2'>Store Name<Asterisk className='text-red-600 h-3 ' /></Label>
                    <Input
                        type="text"
                        placeholder="Store Name"
                        {...register("store_name", { required: "Store Name is required" })}
                        className='mb-8 border border-gray-500'
                    />
                    {errors.store_name && (
                        <span className="text-red-600">{errors.store_name.message}</span>
                    )}
                </section>
                <section>
                    {/* Select Vendor */}
                    <Label htmlFor="name" className='pb-2'>Select Vendor<Asterisk className='text-red-600 h-3 ' /></Label>
                    <Select
                        classNamePrefix="select"
                        isClearable
                        isSearchable
                        name="color"
                        options={colourOptions}
                    />
                </section>
                <section className='col-span-2'>
                    {/* store_address */}
                    <Label htmlFor="name" className='pb-2'>Store Address</Label>
                    <Input
                        type="text"
                        placeholder="Store Address"
                        {...register("store_address")}
                        className='mb-8 border border-gray-500'
                    />
                </section>
                <section>
                    {/* Store Phone */}
                    <Label htmlFor="name" className='pb-2'>Store Phone</Label>
                    <Input
                        type="text"
                        placeholder="Store Phone"
                        {...register("store_phone")}
                        className='mb-8 border border-gray-500'
                    />
                </section>
                <section>
                    {/* Store Email */}
                    <Label htmlFor="name" className='pb-2'>Store Email<Asterisk className='text-red-600 h-3 ' /></Label>
                    <Input
                        type="email"
                        placeholder="Store Email"
                        {...register("store_email")}
                        className='mb-8 border border-gray-500'
                    />
                </section>
                <section className='col-span-2'>
                    {/* Short Description */}
                    <Label htmlFor="name" className='pb-2'>Short Description</Label>
                    <Textarea
                        {...register("short_description")}
                        placeholder="Short Description" />
                </section>
            </main>
        </div>
    )
}
