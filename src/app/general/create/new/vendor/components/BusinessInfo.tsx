// 'use client';

// import { useEffect, useState } from 'react';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Asterisk, Loader2 } from 'lucide-react';
// import {
//   FieldErrors,
//   UseFormRegister,
//   UseFormSetValue,
// } from 'react-hook-form';
// import { Inputs } from './CreateVendorForm';
// import { useSession } from 'next-auth/react';
// import axios, { AxiosError } from 'axios';

// type CategoryOption = { label: string; value: string };

// export default function BusinessInfo({
//   register,
//   errors,
//   setValue,
// }: {
//   register: UseFormRegister<Inputs>;
//   errors: FieldErrors<Inputs>;
//   setValue: UseFormSetValue<Inputs>;
// }) {
//   const { data: session } = useSession();
//   const token = session?.accessToken as string | undefined;

//   const [categories, setCategories] = useState<CategoryOption[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selected, setSelected] = useState<string[]>([]);

//   /* -------------------------------------------------
//    *  Direct axios call – no external helper
//    * ------------------------------------------------- */
//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       try {
//         const baseUrl = process.env.NEXTAUTH_URL || window.location.origin;

//         const headers: Record<string, string> = {
//           'Cache-Control': 'no-store',
//         };
//         if (token) {
//           headers.Authorization = `Bearer ${token}`;
//         }

//         const { data } = await axios.get<
//           { success: boolean; data: { _id: string; name: string }[] }
//         >(`${baseUrl}/api/v1/vendor-category`, { headers });

//         if (data.success && Array.isArray(data.data)) {
//           const opts = data.data.map((c) => ({
//             label: c.name,
//             value: c._id,
//           }));
//           setCategories(opts);
//         } else {
//           console.warn('Invalid response', data);
//           setCategories([]);
//         }
//       } catch (err) {
//         const e = err as AxiosError<{ message?: string }>;
//         console.error(
//           'Failed to fetch vendor categories:',
//           e.response?.status,
//           e.response?.data?.message ?? e.message
//         );
//         setCategories([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [token]);

//   /* -------------------------------------------------
//    *  Sync selected IDs → RHF
//    * ------------------------------------------------- */
//   useEffect(() => {
//     const selectedOpts = categories.filter((c) => selected.includes(c.value));
//     setValue('business_category', selectedOpts);
//   }, [selected, categories, setValue]);

//   const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const vals = Array.from(e.target.selectedOptions, (o) => o.value);
//     setSelected(vals);
//   };

//   return (
//     <>
//       <h1 className="border-b border-[#e4e7eb] pb-2 text-lg">
//         Business Information:
//       </h1>

//       {/* ---------- Business Name ---------- */}
//       <Label htmlFor="business_name">
//         Business Name <Asterisk className="text-red-600 h-3 inline" />
//       </Label>
//       <Input
//         {...register('business_name', { required: 'This field is required' })}
//         placeholder="Business Name"
//         className="mb-8 border border-gray-500"
//       />
//       {errors.business_name && (
//         <span className="text-red-600 text-sm">
//           {errors.business_name.message}
//         </span>
//       )}

//       {/* ---------- Business Category ---------- */}
//       <Label>Business Category</Label>
//       {loading ? (
//         <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
//           <Loader2 className="h-4 w-4 animate-spin" />
//           Loading categories...
//         </div>
//       ) : categories.length === 0 ? (
//         <p className="text-sm text-gray-500 mb-8">No categories available</p>
//       ) : (
//         <div className="mb-8">
//           <select
//             multiple
//             value={selected}
//             onChange={handleSelect}
//             className="w-full p-3 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 text-sm"
//             size={5}
//           >
//             {categories.map((cat) => (
//               <option key={cat.value} value={cat.value}>
//                 {cat.label}
//               </option>
//             ))}
//           </select>
//           <p className="text-xs text-gray-500 mt-1">
//             Hold **Ctrl** (or **Cmd** on Mac) to select multiple
//           </p>
//         </div>
//       )}

//       {/* ---------- Trade License ---------- */}
//       <Label>Trade License Number</Label>
//       <Input
//         {...register('trade_license_number')}
//         placeholder="Trade License Number"
//         className="mb-8 border border-gray-500"
//       />

//       {/* ---------- Business Address ---------- */}
//       <Label>Business Address</Label>
//       <Input
//         {...register('business_address')}
//         placeholder="Business Address"
//         className="mb-8 border border-gray-500"
//       />
//     </>
//   );
// }


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