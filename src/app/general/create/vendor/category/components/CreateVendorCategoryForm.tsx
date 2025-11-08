'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import FancyLoadingPage from '@/app/general/loading';

// Zod Schema
const createVendorCategoryValidationSchema = z.object({
  name: z.string().min(1, { message: 'Vendor category name is required.' }),
  slug: z.string().min(1, { message: 'Slug is required.' }),
});

type FormData = z.infer<typeof createVendorCategoryValidationSchema>;

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export default function CreateVendorCategoryForm() {
  const { data: session, status } = useSession();
  const token = session?.accessToken;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createVendorCategoryValidationSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  if (status === 'loading') {
    return <FancyLoadingPage />
  }

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  if (session.user.role !== 'admin') {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg m-5 md:m-10">
        <p className="font-semibold">Access Denied</p>
        <p>You must be an admin to create vendor categories.</p>
      </div>
    );
  }

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        status: 'active' as const,
      };

      const response = await axios.post<ApiResponse>('/api/v1/vendor-category', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response.data.message || 'Vendor category created successfully!');
      reset();
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.message ||
          error.message ||
          'Failed to create category';
        toast.error(message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f9fb] m-5 md:m-10 p-5 border border-[#e4e7eb] rounded-lg">
      <h1 className="text-lg font-semibold border-l-4 border-blue-500 pl-4 mb-6">
        Vendor Category Create Form
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="text-md font-medium w-full md:w-48 flex items-center gap-1">
            Name <span className="text-red-800 font-bold text-lg">*</span>
          </label>
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter category name"
              {...register('name')}
              className="w-full border-gray-400 focus:border-blue-500"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
        </div>

        {/* Slug Field */}
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <label className="text-md font-medium w-full md:w-48 flex items-center gap-1">
            Slug <span className="text-red-800 font-bold text-lg">*</span>
          </label>
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter slug (e.g. electronics)"
              {...register('slug')}
              className="w-full border-gray-400 focus:border-blue-500"
              disabled={isLoading}
            />
            {errors.slug && (
              <p className="text-red-600 text-sm mt-1">{errors.slug.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="BlueBtn"
            disabled={isLoading}
            className="min-w-32"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-xs mr-2"></span>
                Saving...
              </>
            ) : (
              'Save Category'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}