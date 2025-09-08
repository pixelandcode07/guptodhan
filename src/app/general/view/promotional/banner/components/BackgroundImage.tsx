import React from 'react'
import { Control, UseFormRegister } from 'react-hook-form'
import { BannerForm } from './BannerStructure'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import ColorPicker from '@/components/ui/color-picker'

export default function BackgroundImage({ register, control }: {
    register: UseFormRegister<BannerForm>
    control: Control<BannerForm>

}) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-5 p-5">
            {/* Header Icon */}
            <div className='lg:col-span-1'>
                <Label className="block text-sm font-medium">Header Icon</Label>
                <Input type="file" accept="image/*" {...register("headerIcon")} />
            </div>
            <div className='lg:col-span-5 space-y-2'>
                <div className='lg:flex lg:gap-5 space-y-2'>
                    <div>
                        <Label className="block text-sm font-medium">Background Color</Label>
                        <ColorPicker control={control} name="headingColor" />
                    </div>
                    <div className=''>
                        <Label className="block text-sm font-medium mb-2">Video URL</Label>
                        <Input {...register("videoUrl")} className='w-full lg:w-[30vw] xl:w-[50vw]' />
                    </div>
                </div>
            </div>
        </div>
    )
}
