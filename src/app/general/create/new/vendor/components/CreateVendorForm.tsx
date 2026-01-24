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
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      business_category: [],
    },
  });

  const [ownerNidFile, setOwnerNidFile] = useState<File | null>(null);
  const [tradeLicenseFile, setTradeLicenseFile] = useState<File | null>(null);

  // ✅ 1MB Validation Helper
  const validateFile = (file: File | null) => {
    if (!file) return true;
    
    // 1MB = 1 * 1024 * 1024 bytes
    const maxSize = 1 * 1024 * 1024; 

    if (file.size > maxSize) {
      toast.error(`File is too large! Max size is 1MB.`);
      return false;
    }
    return true;
  };

  const handleFileChange = (name: string, file: File | null) => {
    // ফাইল সিলেক্ট করার সাথেই সাইজ চেক করবে
    if (file && !validateFile(file)) return; 

    if (name === 'ownerNid') setOwnerNidFile(file);
    if (name === 'tradeLicense') setTradeLicenseFile(file);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!ownerNidFile) return toast.error('Owner NID is required');
    if (!tradeLicenseFile) return toast.error('Trade License is required');

    // Final check before submission
    if (!validateFile(ownerNidFile) || !validateFile(tradeLicenseFile)) {
        return;
    }

    const toastId = toast.loading('Creating vendor... Please wait.');

    try {
      const formData = new FormData();

      // === USER FIELDS ===
      formData.append('name', data.owner_name);
      formData.append('email', data.owner_email);
      formData.append('password', data.owner_email_password);
      formData.append('phoneNumber', data.owner_number);
      formData.append('address', data.business_address);

      // === VENDOR FIELDS ===
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

      formData.append('status', 'pending');

      await axios.post('/api/v1/auth/register-vendor', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000, // 60s timeout
      });

      toast.success('Vendor created successfully!', { id: toastId });
      
      setOwnerNidFile(null);
      setTradeLicenseFile(null);
      reset();

    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create vendor';
      
      if (errorMsg.includes('timeout')) {
         toast.error('Request timed out. Use smaller images (Max 1MB).', { id: toastId });
      } else {
         toast.error(errorMsg, { id: toastId });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[#f8f9fb] m-5 md:m-10 p-5 border border-[#e4e7eb] rounded-xs space-y-5"
    >
      <BusinessInfo
        register={register}
        errors={errors}
        setValue={setValue}
        vendorCategories={vendorCategories}
      />

      <OwnerInfo register={register} errors={errors} />

      {/* Attachments Section */}
      <Attachment onFileChange={handleFileChange} />

      <div className="text-center">
        <Button
          variant="default"
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          <Save size={18} />
          {isSubmitting ? 'Creating Vendor...' : 'Create Vendor'}
        </Button>
      </div>
    </form>
  );
}