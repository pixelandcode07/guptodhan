'use client';

import { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { division_wise_locations } from '@/data/division_wise_locations';
import SelectCategory_SubCategory from './SelectCategory_SubCategory';
import SelectLocation from './SelectLocation';
import AddProductInfo from './AddProductInfo';
import { Button } from '@/components/ui/button';
import { Category, SubCategory } from '@/types/category';
import { SelectOption, LocationDataProps } from '@/types/locationType';
import { ClassifiedAdType } from '@/types/classifiedAdType';

// -------------------- Form Data Type --------------------
type FormData = ClassifiedAdType & {
  division?: SelectOption | null;
  district?: SelectOption | null;
  upazila?: SelectOption | null;
  category?: Category | null;
  subCategory?: SubCategory | null;
};

// -------------------- Component --------------------
export default function PostAdWizard() {
  const [activeTab, setActiveTab] = useState<'step1' | 'step2' | 'step3'>('step1');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);

  // -------------------- react-hook-form --------------------
  const form: UseFormReturn<FormData> = useForm<FormData>({
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
  const selectedUpazila = watch('upazila');


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

  // -------------------- Submit Handler --------------------
  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();

      // Append all fields to FormData
      formData.append('title', data.title);
      formData.append('category', data.category?._id || '');
      if (data.subCategory?._id) formData.append('subCategory', data.subCategory._id);
      formData.append('division', data.division?.value || '');
      formData.append('district', data.district?.value || '');
      formData.append('upazila', data.upazila?.value || '');
      formData.append('condition', data.condition);
      formData.append('authenticity', data.authenticity);
      if (data.brand) formData.append('brand', data.brand);
      if (data.productModel) formData.append('productModel', data.productModel);
      if (data.edition) formData.append('edition', data.edition);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('isNegotiable', data.isNegotiable.toString());

      data.images.forEach((img, i) => {
        formData.append(`images`, img instanceof File ? img : img);
      });

      formData.append('contactDetails[name]', data.contactDetails.name);
      if (data.contactDetails.email) formData.append('contactDetails[email]', data.contactDetails.email);
      formData.append('contactDetails[phone]', data.contactDetails.phone);
      formData.append('contactDetails[isPhoneHidden]', data.contactDetails.isPhoneHidden.toString());

      // POST request
      const res = await fetch('/api/v1/classifieds/ads', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to submit ad');

      toast.success('Ad submitted successfully!');
      form.reset();
      setActiveTab('step1');
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit ad');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Post Your Ad</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          {/* Tab Headers */}
          <div className="flex justify-center items-center">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="step1">Category</TabsTrigger>
              <TabsTrigger value="step2">Location</TabsTrigger>
              <TabsTrigger value="step3">Product Info</TabsTrigger>
            </TabsList>
          </div>

          {/* STEP 1: Category */}
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

          {/* STEP 2: Location */}
          <SelectLocation
            control={control}
            register={register}
            watch={watch}
            divisionOptions={divisionOptions}
            cityOptions={districtOptions}
            areaOptions={upazilaOptions}
            selectedDivision={selectedDivision || null}
            selectedCity={selectedDistrict || null}
            onBack={() => setActiveTab('step1')}
            onNext={() => setActiveTab('step3')}
          />

          {/* STEP 3: Product Info */}
          <AddProductInfo form={form} onBack={() => setActiveTab('step2')} onSubmit={handleSubmit(onSubmit)} />
        </Tabs>
      </form>
    </div>
  );
}
