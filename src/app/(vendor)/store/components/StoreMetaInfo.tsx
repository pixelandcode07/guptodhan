import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Inputs } from '@/types/Inputs'
import React from 'react'
import { Control, UseFormRegister } from 'react-hook-form' // ✅ Control যোগ

export default function StoreMetaInfo({ 
  register,
  control, // ✅ যোগ করুন
}: { 
  register: UseFormRegister<Inputs>;
  control: Control<Inputs>; // ✅ যোগ করুন
}) {
    return (
        <div className='mt-10 space-y-5'>
            <h1 className='border-b border-[#e4e7eb] pb-2 text-lg'>Store Meta Information:</h1>
            
            <section className="flex flex-col">
                <Label htmlFor="store_title" className="pb-2">
                    Store Meta Title
                </Label>
                <Input
                    type="text"
                    placeholder="Store Meta Title"
                    {...register("store_meta_title")}
                    className="border border-gray-500"
                />
            </section>

            <section className="flex flex-col">
                <Label htmlFor="store_keywords" className="pb-2">
                    Store Meta Keywords
                </Label>
                <Input
                    type="text"
                    placeholder="Store Meta Keywords"
                    {...register("store_meta_keywords")}
                    className="border border-gray-500"
                />
            </section>

            <section className="flex flex-col md:col-span-2">
                <Label htmlFor="meta_description" className="pb-2">
                    Store Meta Description
                </Label>
                <Textarea
                    {...register("store_meta_description")}
                    placeholder="Store Meta Description"
                />
            </section>
        </div>
    )
}