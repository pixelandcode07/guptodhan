
// import { Inputs } from './CreateNewStoreFrom'
// import { Controller, FieldErrors, UseFormRegister, UseFormSetValue, Control } from 'react-hook-form'
// import { Label } from '@/components/ui/label'
// import { Input } from '@/components/ui/input'
// import { Asterisk } from 'lucide-react'
// import Image from 'next/image'
// import Select from 'react-select';
// import { vendorOptions } from '@/data/data'
// import { Textarea } from '@/components/ui/textarea'
// import NumericInput from 'react-numeric-input';
// import RichTextEditor from '@/components/ReusableComponents/RichTextEditor'

// export default function StoreInformation({ register, errors, setValue, control }: {
//     register: UseFormRegister<Inputs>
//     errors: FieldErrors<Inputs>
//     setValue: UseFormSetValue<Inputs>
//     control: Control<Inputs>
// }) {
//     return (
//         <div className=''>
//             {/* Owner Information: */}
//             <h1 className='border-b border-[#e4e7eb] pb-2 text-lg'>Store Information:</h1>
//             <main className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 mb-10 md:mb-20">
//                 {/* Store Logo */}
//                 <section className="flex flex-col">
//                     <Label htmlFor="storeLogo" className="pb-2">
//                         Store Logo <Asterisk className="text-red-600 h-3 inline" />
//                     </Label>
//                     <Image src="/img/StoreLogo.jpeg" alt="Guptodhan" width={500} height={200} className="rounded-md" />
//                 </section>

//                 {/* Store Banner */}
//                 <section className="flex flex-col">
//                     <Label htmlFor="storeBanner" className="pb-2">
//                         Store Banner <Asterisk className="text-red-600 h-3 inline" />
//                     </Label>
//                     <Image src="/img/StoreBanner.jpeg" alt="Guptodhan" width={500} height={200} className="rounded-md" />
//                 </section>

//                 {/* Store Name */}
//                 <section className="flex flex-col">
//                     <Label htmlFor="store_name" className="pb-2">
//                         Store Name <Asterisk className="text-red-600 h-3 inline" />
//                     </Label>
//                     <Input
//                         type="text"
//                         placeholder="Store Name"
//                         {...register("store_name", { required: "Store Name is required" })}
//                         className="border border-gray-500"
//                     />
//                     {errors.store_name && (
//                         <span className="text-red-600 text-sm mt-1">{errors.store_name.message}</span>
//                     )}
//                 </section>

//                 {/* Select Vendor */}
//                 <section className="flex flex-col">
//                     <Label htmlFor="selectVendor" className="pb-2">
//                         Select Vendor <Asterisk className="text-red-600 h-3 inline" />
//                     </Label>
//                     <Select
//                         classNamePrefix="select"
//                         isClearable
//                         isSearchable
//                         name="vendor"
//                         options={vendorOptions}
//                         onChange={(selectedOptions) => setValue("selectVendor", selectedOptions)}
//                     />
//                 </section>

//                 {/* Store Address */}
//                 <section className="flex flex-col md:col-span-2">
//                     <Label htmlFor="store_address" className="pb-2">
//                         Store Address
//                     </Label>
//                     <Input
//                         type="text"
//                         placeholder="Store Address"
//                         {...register("store_address")}
//                         className="border border-gray-500"
//                     />
//                 </section>

//                 {/* Store Phone */}
//                 <section className="flex flex-col">
//                     <Label htmlFor="store_phone" className="pb-2">
//                         Store Phone
//                     </Label>
//                     <Input
//                         type="text"
//                         placeholder="Store Phone"
//                         {...register("store_phone")}
//                         className="border border-gray-500"
//                     />
//                 </section>

//                 {/* Store Email */}
//                 <section className="flex flex-col">
//                     <Label htmlFor="store_email" className="pb-2">
//                         Store Email <Asterisk className="text-red-600 h-3 inline" />
//                     </Label>
//                     <Input
//                         type="email"
//                         placeholder="Store Email"
//                         {...register("store_email")}
//                         className="border border-gray-500"
//                     />
//                 </section>

//                 {/* Short Description */}
//                 <section className="flex flex-col md:col-span-2">
//                     <Label htmlFor="short_description" className="pb-2">
//                         Short Description
//                     </Label>
//                     <Textarea
//                         {...register("short_description")}
//                         placeholder="Short Description"
//                     />
//                 </section>

//                 {/* Description */}
//                 <section className="flex flex-col md:col-span-2">
//                     <Label htmlFor="description" className="pb-2">
//                         Description
//                     </Label>
//                     <Controller
//                         name="description"
//                         control={control}
//                         render={({ field }) => (
//                             <RichTextEditor value={field.value} onChange={field.onChange} />
//                         )}
//                     />
//                 </section>

//                 {/* Store Commission */}
//                 <section className="flex flex-col md:col-span-2">
//                     <Label htmlFor="commission" className="pb-2">
//                         Store Commission (Percentage)
//                     </Label>
//                     {/* min={0} max={100} value={50} */}
//                     <NumericInput
//                         min={0}
//                         max={100}
//                         step={1}
//                         mobile
//                         className="w-full border border-gray-500 rounded-md p-2"
//                         style={{
//                             input: { width: "100%", boxSizing: "border-box" },
//                         }}
//                         placeholder="Enter commission %"
//                         onChange={(valueAsNumber) => setValue("commission", valueAsNumber ?? 0)}
//                     />
//                 </section>
//             </main>

//         </div>
//     )
// }

'use client';

import { Controller, FieldErrors, UseFormRegister, Control } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Asterisk, Loader2 } from 'lucide-react';
import Select from 'react-select';
import { Textarea } from '@/components/ui/textarea';
import NumericInput from 'react-numeric-input';
import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Inputs } from '@/types/Inputs';
import { fetchVendors } from '@/lib/MultiVendorApis/fetchVendors';
import UploadImageBtn from '@/components/ReusableComponents/UploadImageBtn';

export default function StoreInformation({
    register,
    errors,
    control,
}: {
    register: UseFormRegister<Inputs>;
    errors: FieldErrors<Inputs>;
    control: Control<Inputs>;
}) {
    const { data: session } = useSession();
    const token = session?.accessToken as string | undefined;
    console.log('Token in StoreInformation:', token);

    const [vendorOptions, setVendorOptions] = useState<{ label: string; value: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadVendors = async () => {
            setLoading(true);
            const vendors = await fetchVendors(token);
            const options = vendors
                .filter((v) => v.status === 'approved') // শুধু approved ভেন্ডর
                .map((v) => ({
                    label: v.businessName,
                    value: v._id,
                }));
            setVendorOptions(options);
            setLoading(false);
        };

        loadVendors();
    }, [token]);
    return (
        <div>
            <h1 className="border-b border-[#e4e7eb] pb-2 text-lg">Store Information:</h1>
            <main className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 mb-10 md:mb-20">

                {/* LOGO */}
                <section className="flex flex-col">
                    <Label className="pb-2">
                        Store Logo <Asterisk className="text-red-600 h-3 inline" />
                    </Label>
                    <Controller
                        name="logo"
                        control={control}
                        rules={{ required: 'Logo is required' }}
                        render={({ field }) => (
                            <UploadImageBtn
                                value={field.value}
                                onChange={field.onChange}
                                onRemove={() => field.onChange(null)}
                                fieldName="logo" // এখানে
                            />
                        )}
                    />
                    {errors.logo && <span className="text-red-600 text-sm mt-1">{errors.logo.message}</span>}
                </section>

                {/* BANNER */}
                <section className="flex flex-col">
                    <Label className="pb-2">
                        Store Banner <Asterisk className="text-red-600 h-3 inline" />
                    </Label>
                    <Controller
                        name="banner"
                        control={control}
                        rules={{ required: 'Banner is required' }}
                        render={({ field }) => (
                            <UploadImageBtn
                                value={field.value}
                                onChange={field.onChange}
                                onRemove={() => field.onChange(null)}
                                fieldName="banner" // এখানে
                            />
                        )}
                    />
                    {errors.banner && <span className="text-red-600 text-sm mt-1">{errors.banner.message}</span>}
                </section>

                {/* STORE NAME */}
                <section className="flex flex-col">
                    <Label className="pb-2">
                        Store Name <Asterisk className="text-red-600 h-3 inline" />
                    </Label>
                    <Input
                        type="text"
                        placeholder="Store Name"
                        {...register('store_name', { required: 'Store Name is required' })}
                        className="border border-gray-500"
                    />
                    {errors.store_name && <span className="text-red-600 text-sm mt-1">{errors.store_name.message}</span>}
                </section>

                {/* SELECT VENDOR - Token + API */}
                <section className="flex flex-col">
                    <Label className="pb-2">
                        Select Vendor <Asterisk className="text-red-600 h-3 inline" />
                    </Label>
                    {loading ? (
                        <div className="flex items-center justify-center h-10 border border-gray-500 rounded-md">
                            <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                    ) : vendorOptions.length === 0 ? (
                        <p className="text-sm text-gray-500">No approved vendors found</p>
                    ) : (
                        <Controller
                            name="selectVendor"
                            control={control}
                            rules={{ required: 'Please select a vendor' }}
                            render={({ field }) => (
                                <Select
                                    classNamePrefix="select"
                                    isClearable
                                    isSearchable
                                    options={vendorOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Search vendor..."
                                    noOptionsMessage={() => 'No vendors found'}
                                />
                            )}
                        />
                    )}
                    {errors.selectVendor && <span className="text-red-600 text-sm mt-1">{errors.selectVendor.message}</span>}
                </section>

                {/* ADDRESS, PHONE, EMAIL, etc. */}
                <section className="flex flex-col md:col-span-2">
                    <Label className="pb-2">Store Address</Label>
                    <Input type="text" placeholder="Store Address" {...register('store_address')} className="border border-gray-500" />
                </section>

                <section className="flex flex-col">
                    <Label className="pb-2">Store Phone</Label>
                    <Input
                        type="text"
                        placeholder="Store Phone"
                        {...register('store_phone', {
                            pattern: { value: /^\+?[0-9]{10,15}$/, message: 'Invalid phone' },
                        })}
                        className="border border-gray-500"
                    />
                    {errors.store_phone && <span className="text-red-600 text-sm mt-1">{errors.store_phone.message}</span>}
                </section>

                <section className="flex flex-col">
                    <Label className="pb-2">
                        Store Email <Asterisk className="text-red-600 h-3 inline" />
                    </Label>
                    <Input
                        type="email"
                        placeholder="Store Email"
                        {...register('store_email', {
                            required: 'Email required',
                            pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email' },
                        })}
                        className="border border-gray-500"
                    />
                    {errors.store_email && <span className="text-red-600 text-sm mt-1">{errors.store_email.message}</span>}
                </section>

                <section className="flex flex-col md:col-span-2">
                    <Label className="pb-2">Short Description</Label>
                    <Textarea {...register('short_description')} placeholder="Short Description" />
                </section>

                <section className="flex flex-col md:col-span-2">
                    <Label className="pb-2">Description</Label>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => <RichTextEditor value={field.value || ''} onChange={field.onChange} />}
                    />
                </section>

                {/* <section className="flex flex-col md:col-span-2">
                    <Label className="pb-2">Commission (%)</Label>
                    <Controller
                        name="commission"
                        control={control}
                        render={({ field }) => (
                            <NumericInput
                                min={0}
                                max={100}
                                step={1}
                                mobile
                                value={field.value ?? 0}
                                onChange={(val) => field.onChange(val ?? 0)}
                                className="w-full border border-gray-500 rounded-md p-2"
                                style={{ input: { width: '100%' } }}
                                placeholder="Enter %"
                            />
                        )}
                    />
                </section> */}
                <section className="flex flex-col md:col-span-2">
                    <Label className="pb-2">Commission (%)</Label>
                    <Controller
                        name="commission"
                        control={control}
                        render={({ field }) => (
                            <NumericInput
                                {...field}
                                min={0}
                                max={100}
                                step={1}
                                value={field.value ?? 0}
                                onChange={(val) => field.onChange(val ?? 0)}
                                className="w-full border border-gray-500 rounded-md p-2"
                                placeholder="Enter %"
                            />
                        )}
                    />
                </section>
            </main>
        </div>
    );
}