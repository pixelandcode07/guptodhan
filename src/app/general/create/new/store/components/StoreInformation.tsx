
import { Inputs } from './CreateNewStoreFrom'
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Asterisk } from 'lucide-react'
import Image from 'next/image'
import Select from 'react-select';
import { vendorOptions } from '@/data/data'
import { Textarea } from '@/components/ui/textarea'
import NumericInput from 'react-numeric-input';

export default function StoreInformation({ register, errors, setValue }: {
    register: UseFormRegister<Inputs>
    errors: FieldErrors<Inputs>
    setValue: UseFormSetValue<Inputs>
}) {
    return (
        <div className=''>
            {/* Owner Information: */}
            <h1 className='border-b border-[#e4e7eb] pb-2 text-lg'>Store Information:</h1>
            <main className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 mb-10 md:mb-20">
                {/* Store Logo */}
                <section className="flex flex-col">
                    <Label htmlFor="storeLogo" className="pb-2">
                        Store Logo <Asterisk className="text-red-600 h-3 inline" />
                    </Label>
                    <Image src="/img/StoreLogo.jpeg" alt="Guptodhan" width={500} height={200} className="rounded-md" />
                </section>

                {/* Store Banner */}
                <section className="flex flex-col">
                    <Label htmlFor="storeBanner" className="pb-2">
                        Store Banner <Asterisk className="text-red-600 h-3 inline" />
                    </Label>
                    <Image src="/img/StoreBanner.jpeg" alt="Guptodhan" width={500} height={200} className="rounded-md" />
                </section>

                {/* Store Name */}
                <section className="flex flex-col">
                    <Label htmlFor="store_name" className="pb-2">
                        Store Name <Asterisk className="text-red-600 h-3 inline" />
                    </Label>
                    <Input
                        type="text"
                        placeholder="Store Name"
                        {...register("store_name", { required: "Store Name is required" })}
                        className="border border-gray-500"
                    />
                    {errors.store_name && (
                        <span className="text-red-600 text-sm mt-1">{errors.store_name.message}</span>
                    )}
                </section>

                {/* Select Vendor */}
                <section className="flex flex-col">
                    <Label htmlFor="selectVendor" className="pb-2">
                        Select Vendor <Asterisk className="text-red-600 h-3 inline" />
                    </Label>
                    <Select
                        classNamePrefix="select"
                        isClearable
                        isSearchable
                        name="vendor"
                        options={vendorOptions}
                        onChange={(selectedOptions) => setValue("selectVendor", selectedOptions)}
                    />
                </section>

                {/* Store Address */}
                <section className="flex flex-col md:col-span-2">
                    <Label htmlFor="store_address" className="pb-2">
                        Store Address
                    </Label>
                    <Input
                        type="text"
                        placeholder="Store Address"
                        {...register("store_address")}
                        className="border border-gray-500"
                    />
                </section>

                {/* Store Phone */}
                <section className="flex flex-col">
                    <Label htmlFor="store_phone" className="pb-2">
                        Store Phone
                    </Label>
                    <Input
                        type="text"
                        placeholder="Store Phone"
                        {...register("store_phone")}
                        className="border border-gray-500"
                    />
                </section>

                {/* Store Email */}
                <section className="flex flex-col">
                    <Label htmlFor="store_email" className="pb-2">
                        Store Email <Asterisk className="text-red-600 h-3 inline" />
                    </Label>
                    <Input
                        type="email"
                        placeholder="Store Email"
                        {...register("store_email")}
                        className="border border-gray-500"
                    />
                </section>

                {/* Short Description */}
                <section className="flex flex-col md:col-span-2">
                    <Label htmlFor="short_description" className="pb-2">
                        Short Description
                    </Label>
                    <Textarea
                        {...register("short_description")}
                        placeholder="Short Description"
                    />
                </section>

                {/* Description */}
                <section className="flex flex-col md:col-span-2">
                    <Label htmlFor="description" className="pb-2">
                        Description
                    </Label>
                    <Textarea
                        {...register("description")}
                        placeholder="Here will place a RICH TEXT EDITOR"
                    />
                </section>

                {/* Store Commission */}
                <section className="flex flex-col md:col-span-2">
                    <Label htmlFor="commission" className="pb-2">
                        Store Commission (Percentage)
                    </Label>
                    {/* min={0} max={100} value={50} */}
                    <NumericInput
                        min={0}
                        max={100}
                        step={1}
                        mobile
                        className="w-full border border-gray-500 rounded-md p-2"
                        style={{
                            input: { width: "100%", boxSizing: "border-box" },
                        }}
<<<<<<< HEAD
                        placeholder="Enter commission %"   // 👈 works because NumericInput passes unknown props to input
=======
                        placeholder="Enter commission %"
>>>>>>> 9944fcc4b908d3e4e63317bcad4cba2074fb780e
                        onChange={(valueAsNumber) => setValue("commission", valueAsNumber ?? 0)}
                    />
                </section>
            </main>

        </div>
    )
}
