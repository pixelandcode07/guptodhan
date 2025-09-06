'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { Save } from 'lucide-react'
import BusinessInfo from './BusinessInfo'
import OwnerInfo from './OwnerInfo'
import Attachment from './Attachment'
import { Button } from '@/components/ui/button'
import { ColourOption } from '@/data/data'



export type Inputs = {
    business_name: string
    trade_license_number: string
    business_address: string
    owner_name: string
    owner_number: string
    owner_email: string
    owner_email_password: string
    business_category: ColourOption[]
}

export default function CreateVendorForm() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<Inputs>()



    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data)
    }
    return (
        
        <form onSubmit={handleSubmit(onSubmit)} className='bg-[#f8f9fb] m-5 md:m-10 p-5 border border-[#e4e7eb] rounded-xs space-y-5 '>
            {/* Business Information */}
            <BusinessInfo register={register} errors={errors} setValue={setValue} />

            {/* Owner Information: */}
            <OwnerInfo register={register} errors={errors} />

            {/* Attachments Data */}
            <Attachment />

            <div className='text-center'>
                <Button variant={'BlueBtn'} type="submit"><Save />Create Vendor</Button>
            </div>
        </form>
    )
}
