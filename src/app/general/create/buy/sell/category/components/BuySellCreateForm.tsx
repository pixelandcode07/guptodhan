'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Asterisk, Save } from 'lucide-react'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export type Inputs = {
    category_name: string
}




export default function BuySellCreateForm() {

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
                <h1 className='border-b border-[#e4e7eb] pb-2 text-lg'>BuySell Category Create Form:</h1>
                {/* Name */}
                <section className='md:flex md:gap-10 lg:gap-40'>
                    <span>
                        <Label htmlFor="name">Name<Asterisk className='text-red-600 h-3' /></Label>
                    </span>
                    <span className='w-full'>
                        <Input
                            type="text"
                            placeholder="Category Name"
                            {...register("category_name", { required: "This field is required" })}
                            className='mb-8 border border-gray-500'
                        />
                        {errors.category_name && (
                            <span className="text-red-600">{errors.category_name.message}</span>
                        )}
                    </span>
                </section>
                {/* Category Icon */}
                <section className='md:flex md:gap-10 lg:gap-40'>
                    <span>
                        <Label htmlFor="name">Category Icon</Label>
                    </span>
                    <Textarea placeholder='Here will be a Photo upload btn' />
                </section>

                <div className='text-start md:ml-60'>
                    <Button variant={'BlueBtn'} type="submit"><Save />Save Category</Button>
                </div>
            </form>
        </div>
    )
}
