import ColorPicker from '@/components/ui/color-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { UseFormRegister, Control } from 'react-hook-form'
import { BannerForm } from './BannerStructure'
import { Textarea } from '@/components/ui/textarea'
import HeaderIcon from './HeaderIcon'
import ProductImage from './ProductImage'
import BackgroundImage from './BackgroundImage'

export default function BannerCreateForm({ register, control }: {
    register: UseFormRegister<BannerForm>
    control: Control<BannerForm>

}) {
    return (
        <div className='my-5 space-y-5'>
            {/* Header Icon Part */}
            <HeaderIcon register={register} control={control} />


            {/* Product Image */}
            <ProductImage register={register} control={control} />

            {/* Background Image */}
            <BackgroundImage register={register} control={control} />


        </div>

    )
}
