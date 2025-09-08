import React from 'react'
import { Control, UseFormRegister } from 'react-hook-form'
import { BannerForm } from './BannerStructure'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import ColorPicker from '@/components/ui/color-picker'

export default function ProductImage({ register, control }: {
    register: UseFormRegister<BannerForm>
    control: Control<BannerForm>

}) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-5 p-5">
            {/* Product Image */}
            <div className='lg:col-span-1'>
                <Label className="block text-sm font-medium">Product Image</Label>
                <Input type="file" accept="image/*" {...register("productImage")} />
            </div>
            <div className='lg:col-span-5 space-y-2'>
                {/* Description */}
                <div className='lg:flex lg:gap-5 space-y-2'>
                    <div>
                        <Label className="block text-sm font-medium">Description Color</Label>
                        <ColorPicker control={control} name="descriptionColor" />
                    </div>
                    <div>
                        <Label className="block text-sm font-medium">Description</Label>
                        <Textarea {...register("description")} className='w-full lg:w-[30vw] xl:w-[50vw]' />
                    </div>
                </div>

                {/* Button */}
                <div className='lg:flex lg:justify-start lg:items-center lg:gap-5 space-y-2 '>
                    <div>
                        <Label className="block text-sm font-medium">Button Text Color</Label>
                        <ColorPicker control={control} name="buttonTextColor" />
                    </div>
                    <div>
                        <Label className="block text-sm font-medium">Button Bg Color</Label>
                        <ColorPicker control={control} name="buttonBgColor" />
                    </div>
                    <div className='flex gap-2'>
                        <div className=''>
                            <Label className="block text-sm font-medium">Button Text</Label>
                            <Input {...register("buttonText")} />
                        </div>
                        <div className=''>
                            <Label className="block text-sm font-medium">Button URL</Label>
                            <Input {...register("buttonUrl")} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
