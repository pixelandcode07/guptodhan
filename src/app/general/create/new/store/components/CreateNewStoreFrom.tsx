'use client'


import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import StoreInformation from './StoreInformation'



export type Inputs = {
    store_name: string
    vendor_name: string
    store_address: string
    store_phone: string
    store_email: string
    short_description: string
}


export default function CreateNewStoreFrom() {

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
        <form onSubmit={handleSubmit(onSubmit)} className='bg-[#f8f9fb] m-5 md:m-10 p-5 border border-[#e4e7eb] rounded-xs space-y-5 '>
            {/* StoreInformation */}
            <StoreInformation register={register} errors={errors} />




            <div className='text-center'>
                <Button variant={'BlueBtn'} type="submit"><Save />Create Vendor</Button>
            </div>
        </form>
    )
}
