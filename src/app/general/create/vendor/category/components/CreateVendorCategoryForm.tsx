"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { useForm, SubmitHandler } from "react-hook-form"
// import { custom } from 'zod';

type Inputs = {
    example: string
    exampleRequired: string
}

export default function CreateVendorCategoryForm() {
    const {
        register,
        handleSubmit,
        // watch,
        formState: { errors },
    } = useForm<Inputs>()

    // const onSubmit:  = (data) => 

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data)
    }


    return (
        <div className='bg-[#f8f9fb] m-5 md:m-10 p-5 border border-[#e4e7eb] rounded-xs'>
             <h1 className="text-lg font-semibold border-l-2 border-blue-500 pl-5">
                    Vendor Category Create Form
                </h1>
            <div className='md:flex  gap-2 md:gap-35 pt-5 '>
                <h3 className='flex text-md'>Name<span className='text-red-800 font-semibold text-lg'> *</span></h3>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        type="text"
                        placeholder="Category Name"
                        {...register("example", { required: "This field is required" })}
                        className='mb-8 w-[60vw] border border-gray-500'
                    />
                    {errors.example && (
                        <span className="text-red-600">{errors.example.message}</span>
                    )}
                    {/* <Input type="submit" placeholder='Category' />  */}
                    <Button variant={'BlueBtn'} type="submit">Save Category</Button>
                </form>
            </div>
        </div>
    )
}


