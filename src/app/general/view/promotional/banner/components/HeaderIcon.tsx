import ColorPicker from '@/components/ui/color-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { Control, UseFormRegister } from 'react-hook-form'
import { BannerForm } from './BannerStructure'

export default function HeaderIcon({ register, control }: {
    register: UseFormRegister<BannerForm>
    control: Control<BannerForm>

}) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-5 p-5">
            {/* Background Image */}
            <div className='lg:col-span-1'>
                <Label className="block text-sm font-medium mt-2">Background Image</Label>
                <Input type="file" accept="image/*" {...register("backgroundImage")} />
            </div>
            {/* Color picker */}
            {/* <div className=''>
                    <Label className="block text-sm font-medium">Background Color</Label>
                    <ColorPicker control={control} name="backgroundColor" />
                </div> */}
            <div className='lg:col-span-5 space-y-2'>
                {/* Heading */}
                <div className='lg:flex lg:gap-5 space-y-2'>
                    <div>
                        <Label className="block text-sm font-medium">Heading Text Color</Label>
                        <ColorPicker control={control} name="headingColor" />
                    </div>
                    <div className=''>
                        <Label className="block text-sm font-medium mb-2">Heading Text</Label>
                        <Input {...register("headingText")} className='w-full lg:w-[30vw] xl:w-[50vw]' />
                    </div>
                </div>
                {/* Title */}
                <div className='lg:flex lg:gap-5 space-y-2'>
                    <div>
                        <Label className="block text-sm font-medium">Title Color</Label>
                        <ColorPicker control={control} name="titleColor" />
                    </div>
                    <div className=''>
                        <Label className="block text-sm font-medium mb-2">Title Text</Label>
                        <Input {...register("titleText")} className='w-full lg:w-[30vw] xl:w-[50vw]' />
                    </div>
                </div>
            </div>
        </div>
    )
}
