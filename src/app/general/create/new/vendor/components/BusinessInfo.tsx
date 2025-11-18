'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Asterisk } from 'lucide-react';
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Inputs } from './CreateVendorForm';
import Select from 'react-select';
import { VendorCategory } from '@/types/VendorCategoryType';

// react-select এর জন্য টাইপ
type CategoryOption = {
  value: string;
  label: string;
};

interface BusinessInfoProps {
  register: UseFormRegister<Inputs>;
  errors: FieldErrors<Inputs>;
  setValue: UseFormSetValue<Inputs>;
  vendorCategories: VendorCategory[];
}

export default function BusinessInfo({
  register,
  errors,
  setValue,
  vendorCategories,
}: BusinessInfoProps) {
  // API থেকে আসা ডাটা → react-select এর ফরম্যাটে কনভার্ট
  const categoryOptions: CategoryOption[] = vendorCategories.map((cat) => ({
    value: cat._id,
    label: cat.name,
  }));

  return (
    <>
      <h1 className="border-b border-[#e4e7eb] pb-2 text-lg">
        Business Information:
      </h1>

      {/* Business Name */}
      <Label htmlFor="business_name">
        Business Name <Asterisk className="text-red-600 h-3 inline" />
      </Label>
      <Input
        {...register('business_name', { required: 'This field is required' })}
        placeholder="Business Name"
        className="mb-8 border border-gray-500"
      />
      {errors.business_name && (
        <span className="text-red-600 text-sm">{errors.business_name.message}</span>
      )}

      {/* Business Category - Dynamic from API */}
      <Label>Business Category</Label>
      <Select
        isMulti
        closeMenuOnSelect={false}
        options={categoryOptions}
        onChange={(selected) => setValue('business_category', selected as any)}
        placeholder="Select business categories..."
        className="mb-8"
        classNamePrefix="react-select"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: '#6b7280',
            '&:hover': { borderColor: '#374151' },
            minHeight: '40px',
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: '#dbeafe',
            color: '#1e40af',
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: '#1e40af',
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: '#1e40af',
            ':hover': {
              backgroundColor: '#bfdbfe',
              color: '#1e3a8a',
            },
          }),
        }}
      />

      {/* Trade License Number */}
      <Label>Trade License Number</Label>
      <Input
        {...register('trade_license_number')}
        placeholder="Trade License Number"
        className="mb-8 border border-gray-500"
      />

      {/* Business Address */}
      <Label>Business Address</Label>
      <Input
        {...register('business_address')}
        placeholder="Business Address"
        className="mb-8 border border-gray-500"
      />
    </>
  );
}