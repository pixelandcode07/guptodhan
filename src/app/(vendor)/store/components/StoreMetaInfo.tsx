import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Inputs } from '@/types/Inputs'
import React from 'react'
// import { Inputs } from './CreateNewStoreFrom'
import { UseFormRegister } from 'react-hook-form'

export default function StoreMetaInfo({ register }: { register: UseFormRegister<Inputs> }) {
    return (
        <div className='mt-10 space-y-5'>

            <h1 className='border-b border-[#e4e7eb] pb-2 text-lg'>Store Meta Information:</h1>
            {/* Store Meta Title */}
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
            {/* Store Meta Keywords */}
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

            {/* Store Meta Description */}
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



// 'use client';

// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Inputs } from '@/types/Inputs';
// import React from 'react';
// import { UseFormRegister, Controller, Control } from 'react-hook-form';
// import CreatableSelect from 'react-select/creatable';

// export default function StoreMetaInfo({
//     register,
//     control,
// }: {
//     register: UseFormRegister<Inputs>;
//     control: Control<Inputs>;
// }) {
//     return (
//         <div className="mt-10 space-y-5">
//             <h1 className="border-b border-[#e4e7eb] pb-2 text-lg">
//                 Store Meta Information:
//             </h1>

//             {/* Store Meta Title */}
//             <section className="flex flex-col">
//                 <Label htmlFor="store_meta_title" className="pb-2">
//                     Store Meta Title
//                 </Label>

//                 <Controller
//                     name="store_meta_title"
//                     control={control}
//                     render={({ field }) => (
//                         <CreatableSelect
//                             // {...field}
//                             isMulti
//                             placeholder="Type and press enter to create title"
//                             isClearable
//                             value={
//                                 Array.isArray(field.value)
//                                     ? field.value.map((item) => ({
//                                         label: item,
//                                         value: item,
//                                     }))
//                                     : []
//                             }
//                             onChange={(selected) =>
//                                 field.onChange(selected.map((s) => s.value))
//                             }
//                             className="react-select-container"
//                             classNamePrefix="react-select"
//                         />
//                     )}
//                 />
//             </section>

//             {/* Store Meta Keywords (Multiple tags) */}
//             <section className="flex flex-col">
//                 <Label htmlFor="store_meta_keywords" className="pb-2">
//                     Store Meta Keywords
//                 </Label>

//                 <Controller
//                     name="store_meta_keywords"
//                     control={control}
//                     render={({ field }) => (
//                         <CreatableSelect
//                             isMulti
//                             placeholder="Add keywords and press enter"
//                             value={
//                                 Array.isArray(field.value)
//                                     ? field.value.map((item) => ({
//                                         label: item,
//                                         value: item,
//                                     }))
//                                     : []
//                             }
//                             onChange={(selected) =>
//                                 field.onChange(selected.map((s) => s.value))
//                             }
//                             className="react-select-container"
//                             classNamePrefix="react-select"
//                         />
//                     )}
//                 />
//             </section>

//             {/* Store Meta Description */}
//             <section className="flex flex-col md:col-span-2">
//                 <Label htmlFor="meta_description" className="pb-2">
//                     Store Meta Description
//                 </Label>
//                 <Textarea
//                     {...register('store_meta_description')}
//                     placeholder="Store Meta Description"
//                 />
//             </section>
//         </div>
//     );
// }

