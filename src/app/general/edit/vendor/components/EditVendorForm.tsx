'use client';

import { Vendor } from '@/types/VendorType';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import axios from 'axios';

const baseUrl = process.env.NEXTAUTH_URL;

const schema = z.object({
    businessName: z.string().min(2),
    ownerName: z.string().min(2),
    ownerEmail: z.string().email(),
    ownerPhone: z.string().min(11),
    tradeLicenseNumber: z.string().min(5),
    businessAddress: z.string().min(5),
    businessCategory: z.array(z.string()).min(1, 'Select at least one category'),
});

type FormData = z.infer<typeof schema>;

interface CategoryOption {
    value: string;
    label: string;
}

interface EditVendorFormProps {
    vendor: Vendor;
    token: string;
}

export default function EditVendorForm({ vendor, token }: EditVendorFormProps) {
    const router = useRouter();
    const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
    const [loading, setLoading] = useState(true);

    const initialCategories = vendor.businessCategory
        ? JSON.parse(vendor.businessCategory as string)
        : [];

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            businessName: vendor.businessName || '',
            ownerName: vendor.ownerName || '',
            ownerEmail: vendor.user?.email || '',
            ownerPhone: vendor.user?.phoneNumber || '',
            tradeLicenseNumber: vendor.tradeLicenseNumber || '',
            businessAddress: vendor.businessAddress || '',
            businessCategory: initialCategories,
        },
    });

    const selectedCategories = watch('businessCategory') || [];

    // Fetch categories with token
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`/api/v1/vendor-category`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success) {
                    const options = res.data.data.map((cat: any) => ({
                        value: cat._id,
                        label: cat.name,
                    }));
                    setCategoryOptions(options);
                }
            } catch (error: any) {
                toast.error('Failed to load categories');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [token]);

    // Submit with token
    const onSubmit = async (data: FormData) => {
        const payload = {
            ...data,
            businessCategory: JSON.stringify(data.businessCategory),
        };

        try {
            toast.loading('Updating vendor...');
            const res = await axios.patch(
                `/api/v1/vendors/update-vendor/${vendor._id}`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!res.data.success) throw new Error(res.data.message);

            toast.dismiss();
            toast.success('Vendor updated successfully!');
            router.push('/general/view/vendor/requests');
        } catch (error: any) {
            toast.dismiss();
            toast.error(error.response?.data?.message || 'Update failed');
        }
    };

    const handleReset = () => {
        reset({
            businessName: vendor.businessName || '',
            ownerName: vendor.ownerName || '',
            ownerEmail: vendor.user?.email || '',
            ownerPhone: vendor.user?.phoneNumber || '',
            tradeLicenseNumber: vendor.tradeLicenseNumber || '',
            businessAddress: vendor.businessAddress || '',
            businessCategory: initialCategories,
        });
        toast.info('Form reset to original data');
    };

    if (loading) return <p className="text-center py-8">Loading categories...</p>;
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
            {/* Business Name */}
            <div>
                <Label className='mb-2'>Business Name</Label>
                <Input {...register('businessName')} placeholder="Enter business name" />
                {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName.message}</p>}
            </div>

            {/* Owner Name */}
            <div>
                <Label className='mb-2'>Owner Name</Label>
                <Input {...register('ownerName')} placeholder="Enter owner name" />
                {errors.ownerName && <p className="text-red-500 text-sm">{errors.ownerName.message}</p>}
            </div>

            {/* Email (Read-only) */}
            <div>
                <Label className='mb-2'>Email</Label>
                <Input {...register('ownerEmail')} disabled />
            </div>

            {/* Phone */}
            <div>
                <Label className='mb-2'>Phone Number</Label>
                <Input {...register('ownerPhone')} placeholder="01xxxxxxxxx" />
                {errors.ownerPhone && <p className="text-red-500 text-sm">{errors.ownerPhone.message}</p>}
            </div>

            {/* Trade License */}
            <div>
                <Label className='mb-2'>Trade License Number</Label>
                <Input {...register('tradeLicenseNumber')} placeholder="Enter license number" />
                {errors.tradeLicenseNumber && <p className="text-red-500 text-sm">{errors.tradeLicenseNumber.message}</p>}
            </div>

            {/* Address */}
            <div>
                <Label className='mb-2'>Business Address</Label>
                <Textarea {...register('businessAddress')} rows={3} placeholder="Enter full address" />
                {errors.businessAddress && <p className="text-red-500 text-sm">{errors.businessAddress.message}</p>}
            </div>

            {/* Business Category */}
            <div>
                <Label className='mb-2'>Business Category</Label>
                <Select
                    isMulti
                    options={categoryOptions}
                    value={categoryOptions.filter((opt) => selectedCategories.includes(opt.value))}
                    onChange={(selected) => {
                        const values = selected.map((opt) => opt.value);
                        setValue('businessCategory', values, { shouldValidate: true });
                    }}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Search and select categories..."
                    noOptionsMessage={() => 'No categories found'}
                    isSearchable
                    isClearable
                />
                {errors.businessCategory && <p className="text-red-500 text-sm">{errors.businessCategory.message}</p>}
            </div>

            {/* Documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                    <Label className='mb-2'>Owner NID</Label>
                    <a href={vendor.ownerNidUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                        View Document
                    </a>
                </div>
                <div>
                    <Label className='mb-2'>Trade License</Label>
                    <a href={vendor.tradeLicenseUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                        View Document
                    </a>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                    Reset to Original
                </Button>
            </div>
        </form>
    );
}