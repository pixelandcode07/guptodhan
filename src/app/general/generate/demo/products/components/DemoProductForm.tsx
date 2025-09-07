'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'
import { demoProductOpt } from '@/data/data';
import { Upload } from 'lucide-react';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Select from 'react-select';

export type Inputs = {
    product_type: { label: string, value: string } | null
    product_no: number
}

export default function DemoProductForm() {

    const {
        register,
        handleSubmit,
        setValue,
        // formState: { errors },
    } = useForm<Inputs>()


    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data)
    }




    return (
        <form onSubmit={handleSubmit(onSubmit)} className='bg-[#f8f9fb] my-5 md:m-10 p-2 md:p-5 space-y-5 '>
            <main className='lg:flex gap-5 space-y-10'>
                <section className="flex flex-col">
                    <Label htmlFor="payment_method" className="pb-2">
                        Demo Products Type
                    </Label>
                    <Select
                        classNamePrefix="select one"
                        isClearable
                        isSearchable
                        options={demoProductOpt}
                        onChange={(selectedOption) => setValue("product_type", selectedOption)}
                    />
                </section>

                <section className="flex flex-col">
                    <Label htmlFor="product_no" className="pb-2">No of Demo Products to be Generated</Label>
                    <Input
                        type='number'
                        {...register("product_no")} placeholder="1" />
                </section>
            </main>
            <div className='text-center'>
                <Button variant={'BlueBtn'} type="submit"><Upload />Generates Demo Products</Button>
            </div>
        </form>
    )
}
