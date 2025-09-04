'use client'


import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import StoreInformation from './StoreInformation'
import StoreSocialLinks from './StoreSocialLinks'
import StoreMetaInfo from './StoreMetaInfo'



export type Inputs = {
    store_name: string
    vendor_name: string
    selectVendor: { label: string, value: string } | null
    store_address: string
    store_phone: string
    store_email: string
    short_description: string
    description: string
    commission: number
    facebook_url: string
    whatsapp_url: string
    instagram_url: string
    linkedin_url: string
    twitter_url: string
    tiktok_url: string
    store_meta_title: string
    store_meta_keywords: string
    store_meta_descrip: string
}


export default function CreateNewStoreFrom() {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<Inputs>()

    // const onSubmit:  = (data) => 

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data)
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className='bg-[#f8f9fb] m-3 md:m-10 p-3 md:p-5 border border-[#e4e7eb] rounded-xs space-y-5 '>
            {/* StoreInformation */}
            <StoreInformation register={register} errors={errors} setValue={setValue} />
            {/* StoreSocialLinks */}
            <StoreSocialLinks register={register} errors={errors} />
            {/* StoreMetaInfo */}
            <StoreMetaInfo register={register} />

            <div className='text-center'>
                <Button variant={'BlueBtn'} type="submit"><Save />Create Vendor</Button>
            </div>
        </form>
    )
}
