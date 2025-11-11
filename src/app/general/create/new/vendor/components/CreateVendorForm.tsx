'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Save } from 'lucide-react';
import BusinessInfo from './BusinessInfo';
import OwnerInfo from './OwnerInfo';
import Attachment from './Attachment';
import { Button } from '@/components/ui/button';
import { VendorCategory } from '@/types/VendorCategoryType';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export type Inputs = {
  business_name: string;
  trade_license_number: string;
  business_address: string;
  owner_name: string;
  owner_number: string;
  owner_email: string;
  owner_email_password: string;
  business_category: { value: string; label: string }[];
};

interface CreateVendorFormProps {
  vendorCategories: VendorCategory[];
}

export default function CreateVendorForm({ vendorCategories }: CreateVendorFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      business_category: [],
    },
  });

  const [ownerNidFile, setOwnerNidFile] = useState<File | null>(null);
  const [tradeLicenseFile, setTradeLicenseFile] = useState<File | null>(null);

  const handleFileChange = (name: string, file: File | null) => {
    if (name === 'ownerNid') setOwnerNidFile(file);
    if (name === 'tradeLicense') setTradeLicenseFile(file);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!ownerNidFile) return toast.error('Owner NID is required');
    if (!tradeLicenseFile) return toast.error('Trade License is required');

    const formData = new FormData();

    // === USER FIELDS (for User model) ===
    formData.append('name', data.owner_name);
    formData.append('email', data.owner_email);
    formData.append('password', data.owner_email_password);
    formData.append('phoneNumber', data.owner_number);
    formData.append('address', data.business_address);

    // === VENDOR FIELDS (for Vendor model) ===
    formData.append('businessName', data.business_name);
    formData.append('businessAddress', data.business_address);
    formData.append('tradeLicenseNumber', data.trade_license_number);
    formData.append('ownerName', data.owner_name);

    // === CATEGORY ===
    const categoryIds = data.business_category.map(c => c.value);
    formData.append('businessCategory', JSON.stringify(categoryIds));

    // === FILES ===
    formData.append('ownerNid', ownerNidFile);
    formData.append('tradeLicense', tradeLicenseFile);
    // console.log("Response", formData)
    // console.log("Response", data)
    try {
    await axios.post('/api/v1/auth/register-vendor', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Vendor created successfully!');
      // console.log("Response", data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create vendor');
    }
  };


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[#f8f9fb] m-5 md:m-10 p-5 border border-[#e4e7eb] rounded-xs space-y-5"
    >
      {/* Business Info */}
      <BusinessInfo
        register={register}
        errors={errors}
        setValue={setValue}
        vendorCategories={vendorCategories}
      />

      {/* Owner Info */}
      <OwnerInfo register={register} errors={errors} />

      {/* Attachments */}
      <Attachment onFileChange={handleFileChange} />

      {/* Submit */}
      <div className="text-center">
        <Button
          variant="BlueBtn"
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          <Save />
          {isSubmitting ? 'Creating...' : 'Create Vendor'}
        </Button>
      </div>
    </form>
  );
}