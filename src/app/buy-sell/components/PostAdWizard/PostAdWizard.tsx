'use client';

import { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { division_wise_locations } from '@/data/division_wise_locations';
import SelectCategory_SubCategory from './SelectCategory_SubCategory';
import SelectLocation from './SelectLocation';
import AddProductInfo from './AddProductInfo';
import { Button } from '@/components/ui/button';
import { Category, SubCategory } from '@/types/category';
import { SelectOption } from '@/types/locationType';
import { ClassifiedAdType } from '@/types/classifiedAdType';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { MoveLeft } from 'lucide-react';
import imageCompression from 'browser-image-compression';

// -------------------- Form Data Type --------------------
// ✅ Omit ব্যবহার করে টাইপ কনফ্লিক্ট সমাধান করা হয়েছে
export type WizardFormData = Omit<
  ClassifiedAdType,
  'division' | 'district' | 'upazila' | 'category' | 'subCategory' | 'brand' | 'productModel' | 'edition'
> & {
  division?: SelectOption | null;
  district?: SelectOption | null;
  upazila?: SelectOption | null;
  category?: Category | null;
  subCategory?: SubCategory | null;
  brand?: SelectOption | string | null;
  productModel?: SelectOption | string | null;
  edition?: SelectOption | string | null;
};

// -------------------- Component --------------------
export default function PostAdWizard() {
  const [activeTab, setActiveTab] = useState<'step1' | 'step2' | 'step3'>('step1');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session } = useSession();
  const token = session?.accessToken;

  // -------------------- react-hook-form --------------------
  const form: UseFormReturn<WizardFormData> = useForm<WizardFormData>({
    defaultValues: {
      division: null,
      district: null,
      upazila: null,
      images: [],
      isNegotiable: false,
      contactDetails: {
        name: '',
        email: '',
        phone: '',
        isPhoneHidden: false,
      },
    },
  });

  const { watch, setValue, handleSubmit, control, register } = form;

  // -------------------- Watchers --------------------
  const selectedDivision = watch('division');
  const selectedDistrict = watch('district');

  // -------------------- Dynamic Options --------------------
  const divisionOptions: SelectOption[] = Object.keys(division_wise_locations).map((d) => ({
    label: d,
    value: d,
  }));

  const districtOptions: SelectOption[] = selectedDivision
    ? Object.keys(division_wise_locations[selectedDivision.value] || {}).map((d) => ({
      label: d,
      value: d,
    }))
    : [];

  const upazilaOptions: SelectOption[] =
    selectedDivision && selectedDistrict
      ? (division_wise_locations[selectedDivision.value][selectedDistrict.value] || []).map(
        (u) => ({ label: u, value: u })
      )
      : [];

  // -------------------- Navigation --------------------
  const handleTabChange = (tab: 'step1' | 'step2' | 'step3') => {
    if (tab === 'step2' && !selectedCategory) {
      toast.error('Please complete category first!');
      return;
    }
    if (tab === 'step3' && (!selectedDivision || !selectedDistrict || !watch('upazila'))) {
      toast.error('Please complete location first!');
      return;
    }
    setActiveTab(tab);
  };

  // ✅ Helper Function for object to string conversion
  const getStringValue = (val: any) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (val.value) return val.value;
    return '';
  };

  // -------------------- Submit Handler --------------------
  const onSubmit = async (data: WizardFormData) => {
    try {
      setIsSubmitting(true);
      toast.loading('Compressing images and submitting... Please wait.', { id: 'submit-ad' });

      const formData = new FormData();

      // -------------------- Append basic fields --------------------
      formData.append('title', data.title || '');
      if (data.category?._id) formData.append('category', data.category._id);
      if (data.subCategory?._id) formData.append('subCategory', data.subCategory._id);
      
      formData.append('division', data.division?.value || '');
      formData.append('district', data.district?.value || '');
      formData.append('upazila', data.upazila?.value || '');
      formData.append('condition', data.condition || '');
      formData.append('authenticity', data.authenticity || '');
      
      // ✅ Using helper function to avoid object to string casting errors
      formData.append('brand', getStringValue(data.brand));
      formData.append('productModel', getStringValue(data.productModel));
      formData.append('edition', getStringValue(data.edition));
      
      formData.append('description', data.description || '');
      formData.append('price', data.price?.toString() || '0');
      formData.append('isNegotiable', data.isNegotiable.toString());

      // -------------------- Image Compression & Append --------------------
      const compressedImages = await Promise.all(
        data.images.map(async (img) => {
          if (img instanceof File) {
            if (img.size > 1024 * 1024) { // > 1MB
              const options = {
                maxSizeMB: 0.8,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
              };
              try {
                return await imageCompression(img, options);
              } catch (error) {
                console.error("Image compression failed:", error);
                return img;
              }
            }
            return img;
          }
          return null;
        })
      );

      compressedImages.forEach((img) => {
        if (img) formData.append('images', img);
      });

      // -------------------- Contact Details --------------------
      formData.append('contactDetails.name', data.contactDetails.name || '');
      if (data.contactDetails.email) formData.append('contactDetails.email', data.contactDetails.email);
      formData.append('contactDetails.phone', data.contactDetails.phone || '');
      formData.append('contactDetails.isPhoneHidden', data.contactDetails.isPhoneHidden.toString());

      // -------------------- POST request --------------------
      await axios.post('/api/v1/classifieds/ads', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Ad Submitted successfully!', { id: 'submit-ad' });
      form.reset();
      setActiveTab('step1');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit ad. Please try again.', { id: 'submit-ad' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-10 md:hidden">Post Your Ad</h1>
      <div className='flex justify-between items-center mb-10 px-10'>
        <h1 className="text-3xl font-bold hidden md:block"> Post Your Ad</h1>
        <Button variant={'BlueBtn'} className='hidden md:block'>
          <Link href="/buy-sell" className='flex justify-center items-center gap-2'>
            <MoveLeft className='w-4 h-4 text-gray-100' /> 
            <span>Back to Buy & Sell</span>
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs value={activeTab} onValueChange={handleTabChange as any} className="space-y-6">
          <div className="flex justify-center items-center">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="step1">Category</TabsTrigger>
              <TabsTrigger value="step2">Location</TabsTrigger>
              <TabsTrigger value="step3">Product Info</TabsTrigger>
            </TabsList>
          </div>

          <SelectCategory_SubCategory
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setValue('category', cat);
              setSelectedSubCategory(null);
              setValue('subCategory', null);
            }}
            onSelectSubCategory={(sub) => {
              setSelectedSubCategory(sub);
              setValue('subCategory', sub);
              setActiveTab('step2');
            }}
          />

          <SelectLocation
            control={control as any}
            register={register as any}
            watch={watch as any}
            divisionOptions={divisionOptions}
            cityOptions={districtOptions}
            areaOptions={upazilaOptions}
            selectedDivision={selectedDivision || null}
            selectedCity={selectedDistrict || null}
            onBack={() => setActiveTab('step1')}
            onNext={() => setActiveTab('step3')}
          />

          <AddProductInfo 
            form={form} 
            onBack={() => setActiveTab('step2')} 
            onSubmit={handleSubmit(onSubmit)} 
            isSubmitting={isSubmitting} 
          />
        </Tabs>
      </form>
    </div>
  );
}