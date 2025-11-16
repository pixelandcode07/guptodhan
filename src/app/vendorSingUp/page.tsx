'use client';

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import axios from 'axios';
import BusinessInfo from '../general/create/new/vendor/components/BusinessInfo';
import OwnerInfo from '../general/create/new/vendor/components/OwnerInfo';
import Attachment from '../general/create/new/vendor/components/Attachment';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { VendorCategory } from '@/types/VendorCategoryType';

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

export default function VendorSignUp() {
  const [vendorCategories, setVendorCategories] = useState<VendorCategory[]>([]);
  const [ownerNidFile, setOwnerNidFile] = useState<File | null>(null);
  const [tradeLicenseFile, setTradeLicenseFile] = useState<File | null>(null);

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

  // ===========================
  // FETCH VENDOR CATEGORIES
  // ===========================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/v1/vendor-category');
        if (res.data.success && Array.isArray(res.data.data)) {
          const formatted = res.data.data.map((cat: VendorCategory) => ({
            value: cat._id,
            label: cat.name,
          }));
          setVendorCategories(formatted);
        }
      } catch (err) {
        toast.error('Failed to load vendor categories');
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (name: string, file: File | null) => {
    if (name === 'ownerNid') setOwnerNidFile(file);
    if (name === 'tradeLicense') setTradeLicenseFile(file);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!ownerNidFile) return toast.error('Owner NID is required');
    if (!tradeLicenseFile) return toast.error('Trade License is required');

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

    const categoryIds = data.business_category.map((c) => c.value);
    formData.append('businessCategory', JSON.stringify(categoryIds));

    // === FILES ===
    formData.append('ownerNid', ownerNidFile);
    formData.append('tradeLicense', tradeLicenseFile);
    formData.append('status', 'pending');

    try {
      await axios.post('/api/v1/auth/register-vendor', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Vendor registration successful!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to register vendor');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#f8f9fb] m-5 md:m-10 p-5 border border-[#e4e7eb] rounded-xs space-y-5"
      >
        {/* ===== BUSINESS INFO ===== */}
        <BusinessInfo
          register={register}
          errors={errors}
          setValue={setValue}
          vendorCategories={vendorCategories || []} // always array
        />

        {/* ===== OWNER INFO ===== */}
        <OwnerInfo register={register} errors={errors} />

        {/* ===== ATTACHMENTS ===== */}
        <Attachment onFileChange={handleFileChange} />

        {/* ===== SUBMIT BUTTON ===== */}
        <div className="text-center">
          <Button
            variant="BlueBtn"
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Save />
            {isSubmitting ? 'Registering...' : 'Register Vendor'}
          </Button>
        </div>
      </form>
    </div>
  );
}
