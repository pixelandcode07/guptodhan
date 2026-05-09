import { Controller, FieldErrors, UseFormRegister, Control } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Asterisk, Loader2 } from 'lucide-react';
import Select from 'react-select';
import { Textarea } from '@/components/ui/textarea';
import NumericInput from 'react-numeric-input';
import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';
import { useEffect, useState } from 'react';
import { Inputs } from '@/types/Inputs';
import { fetchPublicVendors } from '@/lib/MultiVendorApis/fetchVendors';
import UploadImageBtn from '@/components/ReusableComponents/UploadImageBtn';

export default function StoreInformation({
    register,
    errors,
    control,
    isEditMode = false,
    vendorId, // ✅ নতুন প্রপস হিসেবে রিসিভ করা হলো
}: {
    register: UseFormRegister<Inputs>;
    errors: FieldErrors<Inputs>;
    control: Control<Inputs>;
    isEditMode?: boolean;
    vendorId?: string; // ✅ টাইপ ডিফাইন করা হলো
}) {
    const [vendorOptions, setVendorOptions] = useState<{ label: string; value: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadVendors = async () => {
            setLoading(true);
            const vendors = await fetchPublicVendors();
            const options = vendors
                .filter((v) => v.status === 'approved')
                .map((v) => ({
                    label: v.businessName,
                    value: v._id,
                }));
            setVendorOptions(options);
            setLoading(false);
        };

        loadVendors();
    }, []);

    return (
        <div>
            <h1 className="border-b border-[#e4e7eb] pb-2 text-lg">Store Information:</h1>
            <main className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 mb-10 md:mb-20">

                {/* LOGO */}
                <section className="flex flex-col">
                    <Label className="pb-2 flex items-center gap-1 font-semibold text-gray-700">
                        Store Logo 
                        {!isEditMode && <Asterisk className="text-red-600 h-3" />}
                    </Label>
                    <Controller
                        name="logo"
                        control={control}
                        rules={{ required: isEditMode ? false : 'Logo is required' }}
                        render={({ field }) => (
                            <UploadImageBtn
                                value={field.value ?? null}
                                onChange={field.onChange}
                                fieldName="logo"
                            />
                        )}
                    />
                    {errors.logo && <span className="text-red-600 text-sm mt-1">{errors.logo.message}</span>}
                </section>

                {/* BANNER */}
                <section className="flex flex-col">
                    <Label className="pb-2 flex items-center gap-1 font-semibold text-gray-700">
                        Store Banner 
                        {!isEditMode && <Asterisk className="text-red-600 h-3" />}
                    </Label>
                    <Controller
                        name="banner"
                        control={control}
                        rules={{ required: isEditMode ? false : 'Banner is required' }}
                        render={({ field }) => (
                            <UploadImageBtn
                                value={field.value ?? null}
                                onChange={field.onChange}
                                fieldName="banner"
                            />
                        )}
                    />
                    {errors.banner && <span className="text-red-600 text-sm mt-1">{errors.banner.message}</span>}
                </section>

                {/* STORE NAME */}
                <section className="flex flex-col">
                    <Label className="pb-2 flex items-center gap-1 font-semibold text-gray-700">
                        Store Name <Asterisk className="text-red-600 h-3" />
                    </Label>
                    <Input
                        type="text"
                        placeholder="e.g. My Super Store"
                        {...register('store_name', { required: 'Store Name is required' })}
                        className="border border-gray-300 focus-visible:ring-blue-500"
                    />
                    {errors.store_name && <span className="text-red-600 text-sm mt-1">{errors.store_name.message}</span>}
                </section>

                {/* SELECT VENDOR */}
                <section className="flex flex-col">
                    <Label className="pb-2 flex items-center gap-1 font-semibold text-gray-700">
                        Select Vendor <Asterisk className="text-red-600 h-3" />
                    </Label>
                    {loading ? (
                        <div className="flex items-center justify-center h-10 border border-gray-300 rounded-md bg-gray-50">
                            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                        </div>
                    ) : vendorOptions.length === 0 && !vendorId ? (
                        <p className="text-sm text-red-500 bg-red-50 p-2 rounded">No approved vendors found</p>
                    ) : (
                        <Controller
                            name="selectVendor"
                            control={control}
                            rules={{ required: 'Please select a vendor' }}
                            render={({ field }) => (
                                <Select
                                    classNamePrefix="select"
                                    isClearable={!vendorId} // ✅ vendorId থাকলে clear ('X') বাটন অফ থাকবে
                                    isSearchable
                                    options={vendorOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    isDisabled={!!vendorId} // ✅ vendorId থাকলে ফিল্ডটি পুরোপুরি disable থাকবে
                                    placeholder="Search your vendor account..."
                                    noOptionsMessage={() => 'No vendors found'}
                                    styles={{
                                        control: (base, state) => ({ 
                                            ...base, 
                                            borderColor: '#d1d5db', 
                                            backgroundColor: state.isDisabled ? '#f3f4f6' : 'white',
                                            cursor: state.isDisabled ? 'not-allowed' : 'default',
                                            '&:hover': { borderColor: '#3b82f6' } 
                                        })
                                    }}
                                />
                            )}
                        />
                    )}
                    {errors.selectVendor && <span className="text-red-600 text-sm mt-1">{errors.selectVendor.message}</span>}
                </section>

                {/* EMAIL */}
                <section className="flex flex-col">
                    <Label className="pb-2 flex items-center gap-1 font-semibold text-gray-700">
                        Store Email <Asterisk className="text-red-600 h-3" />
                    </Label>
                    <Input
                        type="email"
                        placeholder="store@example.com"
                        {...register('store_email', {
                            required: 'Store Email is required',
                            pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email address' },
                        })}
                        className="border border-gray-300 focus-visible:ring-blue-500"
                    />
                    {errors.store_email && <span className="text-red-600 text-sm mt-1">{errors.store_email.message}</span>}
                </section>

                {/* PHONE */}
                <section className="flex flex-col">
                    <Label className="pb-2 flex items-center gap-1 font-semibold text-gray-700">
                        Store Phone <Asterisk className="text-red-600 h-3" />
                    </Label>
                    <Input
                        type="text"
                        placeholder="e.g. +8801XXXXXXXXX"
                        {...register('store_phone', {
                            required: 'Store Phone is required',
                            pattern: { value: /^\+?[0-9]{10,15}$/, message: 'Invalid phone format' },
                        })}
                        className="border border-gray-300 focus-visible:ring-blue-500"
                    />
                    {errors.store_phone && <span className="text-red-600 text-sm mt-1">{errors.store_phone.message}</span>}
                </section>

                {/* ADDRESS */}
                <section className="flex flex-col md:col-span-2">
                    <Label className="pb-2 flex items-center gap-1 font-semibold text-gray-700">
                        Store Address <Asterisk className="text-red-600 h-3" />
                    </Label>
                    <Input 
                        type="text" 
                        placeholder="Full physical address of the store" 
                        {...register('store_address', { required: 'Store Address is required' })} 
                        className="border border-gray-300 focus-visible:ring-blue-500" 
                    />
                    {errors.store_address && <span className="text-red-600 text-sm mt-1">{errors.store_address.message}</span>}
                </section>

                {/* SHORT DESCRIPTION */}
                <section className="flex flex-col md:col-span-2">
                    <Label className="pb-2 flex items-center gap-1 font-semibold text-gray-700">
                        Short Description <Asterisk className="text-red-600 h-3" />
                    </Label>
                    <Textarea 
                        {...register('short_description', { required: 'Short Description is required' })} 
                        placeholder="A brief summary about what your store sells..." 
                        className="border border-gray-300 focus-visible:ring-blue-500"
                    />
                    {errors.short_description && <span className="text-red-600 text-sm mt-1">{errors.short_description.message}</span>}
                </section>

                {/* FULL DESCRIPTION */}
                <section className="flex flex-col md:col-span-2">
                    <Label className="pb-2 flex items-center gap-1 font-semibold text-gray-700">
                        Full Description <Asterisk className="text-red-600 h-3" />
                    </Label>
                    <Controller
                        name="description"
                        control={control}
                        rules={{ required: 'Full description is required' }}
                        render={({ field }) => <RichTextEditor value={field.value || ''} onChange={field.onChange} />}
                    />
                    {errors.description && <span className="text-red-600 text-sm mt-1">{errors.description.message}</span>}
                </section>

                {/* COMMISSION (OPTIONAL) */}
                <section className="flex flex-col md:col-span-2">
                    <Label className="pb-2 flex items-center font-semibold text-gray-700">
                        Commission (%) <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span>
                    </Label>
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
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder="Enter % (default 0)"
                            />
                        )}
                    />
                </section>
            </main>
        </div>
    );
}