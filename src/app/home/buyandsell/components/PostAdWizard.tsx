'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import Creatable from 'react-select/creatable';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { division_wise_locations } from '@/data/division_wise_locations';
// import { brandOptions, modelOptions } from '@/data/data';
import { ChevronRight } from 'lucide-react';
import FiveUploadImageBtn from '@/components/ReusableComponents/FiveUploadImageBtn';
import { useSession } from 'next-auth/react';

type FormData = {
  category?: string;
  subcategory?: string;
  division?: { label: string; value: string } | null;
  city?: { label: string; value: string } | null;
  area?: { label: string; value: string } | null;
  details?: string;
  condition?: string;
  authenticity?: string;
  brand?: { value: string; label: string } | null;
  model?: { value: string; label: string } | null;
  edition?: { value: string; label: string } | null;
  title?: string;
  description?: string;
  price?: number;
  name?: string;
  email?: string;
  phone?: string;
  photos?: File[];
};

export default function PostAdWizard() {
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('step1');
  const [previews, setPreviews] = useState<string[]>([]);

  const { data: session } = useSession();
  // const token = (session?.user as { accessToken?: string; role?: string })?.accessToken;
  const token = session?.accessToken;
  console.log("🚀 ~ file: PostAdWizard.tsx ~ line 56 ~ token", token)
  const userRole = (session?.user as { role?: string })?.role


  const { control, register, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: { division: null, city: null, area: null, photos: [] },
  });

  const selectedDivision = watch('division');
  const selectedCity = watch('city');
  const photos = watch('photos') as (File | null | undefined)[];
  // const previews = photos?.filter((file): file is File => !!file).map((file) => URL.createObjectURL(file));



  useEffect(() => {
    // Create object URLs for valid files
    const urls = photos?.filter((file): file is File => !!file).map((file) => URL.createObjectURL(file)) || [];
    setPreviews(urls);

    // Cleanup function to revoke URLs when component unmounts or photos change
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [photos]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/v1/public/classifieds-categories');
        setCategories(res.data.data || []);
      } catch {
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const loadSubcategories = async (id: string) => {
    try {
      const res = await axios.get(`/api/v1/public/classifieds-categories/${id}/subcategories`);
      setSubCategories(res.data.data || []);
    } catch {
      toast.error('Failed to load subcategories');
    }
  };

  const cityOptions = selectedDivision
    ? Object.keys(division_wise_locations[selectedDivision.value]).map((c) => ({ label: c, value: c }))
    : [];

  const areaOptions = selectedDivision && selectedCity
    ? division_wise_locations[selectedDivision.value][selectedCity.value].map((a) => ({ label: a, value: a }))
    : [];

  // const onSubmit = async (data: FormData) => {
  //   if (!data.category || !data.subcategory) {
  //     toast.error('Please select category & subcategory!');
  //     setActiveTab('step1');
  //     return;
  //   }
  //   if (!data.division || !data.city || !data.area) {
  //     toast.error('Please select location!');
  //     setActiveTab('step2');
  //     return;
  //   }

  //   try {
  //     const formData = new FormData();

  //     // Images
  //     if (data.photos?.length) {
  //       data.photos.forEach((file) => formData.append('images', file));
  //     }

  //     // Map fields
  //     formData.append('title', data.title || '');
  //     formData.append('description', data.description || '');
  //     formData.append('price', data.price?.toString() || '0');
  //     formData.append('condition', data.condition || '');
  //     formData.append('authenticity', data.authenticity || '');
  //     formData.append('category', data.category || '');
  //     formData.append('subCategory', data.subcategory || '');
  //     formData.append('division', data.division?.value || '');
  //     formData.append('district', data.city?.value || '');
  //     formData.append('upazila', data.area?.value || '');
  //     if (data.brand?.value) formData.append('brand', data.brand.value);
  //     if (data.model?.value) formData.append('productModel', data.model.value);
  //     if (data.edition?.value) formData.append('edition', data.edition.value);

  //     // Contact Details
  //     formData.append('contactDetails.name', data.name || '');
  //     formData.append('contactDetails.email', data.email || '');
  //     formData.append('contactDetails.phone', data.phone || '');
  //     formData.append('contactDetails.isPhoneHidden', 'false');

  //     const token = localStorage.getItem('accessToken'); // Your auth token
  //     await axios.post('/api/v1/classifieds/ads', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     toast.success('Product posted successfully!');
  //   } catch (err: any) {
  //     console.error(err);
  //     toast.error(err?.response?.data?.message || 'Failed to submit product!');
  //   }
  // };

  // const onSubmit = async (data: FormData) => {
  //   if (!data.category || !data.subcategory) {
  //     toast.error('Please select category & subcategory!');
  //     setActiveTab('step1');
  //     return;
  //   }
  //   if (!data.division || !data.city || !data.area) {
  //     toast.error('Please select location!');
  //     setActiveTab('step2');
  //     return;
  //   }

  //   try {
  //     const formData = new FormData();

  //     // Images
  //     if (data.photos?.length) {
  //       data.photos.forEach((file) => {
  //         if (file instanceof File) formData.append('images', file);
  //       });
  //     }

  //     // Map fields
  //     formData.append('title', data.title || '');
  //     formData.append('description', data.description || '');
  //     formData.append('price', data.price?.toString() || '0');
  //     formData.append('condition', data.condition || '');
  //     formData.append('authenticity', data.authenticity || '');
  //     formData.append('category', data.category || '');
  //     formData.append('subCategory', data.subcategory || '');
  //     formData.append('division', data.division?.value || '');
  //     formData.append('district', data.city?.value || '');
  //     formData.append('upazila', data.area?.value || '');
  //     if (data.brand?.value) formData.append('brand', data.brand.value);
  //     if (data.model?.value) formData.append('productModel', data.model.value);
  //     if (data.edition?.value) formData.append('edition', data.edition.value);

  //     // Flattened contact fields
  //     formData.append('contactName', data.name || '');
  //     formData.append('contactEmail', data.email || '');
  //     formData.append('contactPhone', data.phone || '');
  //     formData.append('contactIsPhoneHidden', 'false');

  //     // Authorization header using session token
  //     await axios.post('/api/v1/classifieds/ads', formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     toast.success('Product posted successfully!');
  //     // Optionally reset form or redirect
  //   } catch (err: any) {
  //     console.error(err);
  //     toast.error(err?.response?.data?.message || 'Failed to submit product!');
  //   }
  // };


  const onSubmit = async (data: FormData) => {
    console.log("🧾 Final Form Data:", data);
    if (!data.category || !data.subcategory) {
      toast.error('Please select category & subcategory!');
      setActiveTab('step1');
      return;
    }
    if (!data.division || !data.city || !data.area) {
      toast.error('Please select location!');
      setActiveTab('step2');
      return;
    }

    try {
      const formData = new FormData();

      // Images
      if (data.photos?.length) {
        data.photos.forEach((file) => {
          if (file instanceof File) formData.append('images', file);
        });
      }

      // Map fields
      formData.append('title', data.title || '');
      formData.append('description', data.description || '');
      formData.append('price', data.price?.toString() || '0');
      formData.append('condition', (data.condition || '').toLowerCase());
      formData.append('authenticity', data.authenticity || '');
      formData.append('category', data.category || '');
      formData.append('subCategory', data.subcategory || '');
      formData.append('division', data.division?.value || '');
      formData.append('district', data.city?.value || '');
      formData.append('upazila', data.area?.value || '');
      if (data.brand?.value) formData.append('brand', data.brand.value);
      if (data.model?.value) formData.append('productModel', data.model.value);
      if (data.edition?.value) formData.append('edition', data.edition.value);

      // ✅ Match backend expected format
      formData.append('contactDetails.name', data.name || '');
      formData.append('contactDetails.email', data.email || '');
      formData.append('contactDetails.phone', data.phone || '');
      formData.append('contactDetails.isPhoneHidden', 'false');
      // const baseUrl = process.env.NEXTAUTH_URL;
      await axios.post(`/api/v1/classifieds/ads`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Product posted successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to submit product!');
    }
  };



  const variants = { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -50 } };

  const handleTabChange = (tab: string) => {
    if (tab === 'step2' && (!watch('category') || !watch('subcategory'))) {
      toast.error('Please complete category first!');
      return;
    }
    if (tab === 'step3' && (!watch('division') || !watch('city') || !watch('area'))) {
      toast.error('Please complete location first!');
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Post Your Ad</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <div className="flex justify-center items-center">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="step1">Category</TabsTrigger>
              <TabsTrigger value="step2">Location</TabsTrigger>
              <TabsTrigger value="step3">Product Details</TabsTrigger>
            </TabsList>
          </div>

          {/* STEP 1: Categories */}
          <TabsContent value="step1">
            <AnimatePresence mode="wait">
              <motion.div key="category-step" variants={variants} initial="initial" animate="animate" exit="exit">
                <div className="flex gap-6">
                  <div className="w-1/3 border-r pr-4">
                    <h3 className="font-semibold mb-2">Main Categories</h3>
                    <ul>
                      {categories.map((cat) => (
                        <li
                          key={cat._id}
                          className={`cursor-pointer flex items-center gap-2 p-2 rounded hover:bg-gray-100 ${selectedCategory?._id === cat._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                            }`}
                          onClick={() => {
                            if (cat._id?.length === 24) {
                              setSelectedCategory(cat);
                              setValue('category', cat._id);
                              loadSubcategories(cat._id);
                            } else {
                              toast.error('Invalid category ID');
                              console.warn('Invalid category ID:', cat._id);
                            }
                          }}
                        >
                          {cat.icon && <Image src={cat.icon} alt={cat.name} width={24} height={24} className="rounded" />}
                          <span>{cat.name}</span>
                          <ChevronRight className="ml-auto" />
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex-1 pl-4">
                    {selectedCategory && (
                      <>
                        <h3 className="font-semibold mb-2">Subcategories of {selectedCategory.name}</h3>
                        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {subCategories.map((sub) => (
                            <li
                              key={sub._id}
                              className={`p-2 border rounded flex items-center gap-2 cursor-pointer hover:bg-gray-100 ${watch('subcategory') === sub._id ? 'bg-green-50 border-green-500' : ''
                                }`}
                              onClick={() => {
                                if (sub._id?.length === 24) {
                                  setValue('subcategory', sub._id);
                                  setActiveTab('step2');
                                } else {
                                  toast.error('Invalid subcategory ID');
                                  console.warn('Invalid subcategory ID:', sub._id);
                                }
                              }}

                            >
                              {sub.icon && <Image src={sub.icon} alt={sub.name} width={20} height={20} className="rounded" />}
                              <span>{sub.name}</span>
                              <ChevronRight className="ml-auto" />
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* STEP 2: Location */}
          <TabsContent value="step2">
            <AnimatePresence mode="wait">
              <motion.div key="location-step" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="mb-2">Division</Label>
                    <Controller
                      name="division"
                      control={control}
                      render={({ field }) => <Select {...field} options={Object.keys(division_wise_locations).map((d) => ({ label: d, value: d }))} />}
                    />
                  </div>
                  <div>
                    <Label className="mb-2">City</Label>
                    <Controller name="city" control={control} render={({ field }) => <Select {...field} options={cityOptions} isDisabled={!selectedDivision} />} />
                  </div>
                  <div>
                    <Label className="mb-2">Area</Label>
                    <Controller name="area" control={control} render={({ field }) => <Select {...field} options={areaOptions} isDisabled={!selectedCity} />} />
                  </div>
                </div>

                <div>
                  <Label className="mb-2">Details</Label>
                  <Textarea {...register('details')} placeholder="Write your address..." />
                </div>

                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('step1')}>
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      if (selectedDivision && selectedCity && watch('area')) setActiveTab('step3');
                      else toast.error('Please fill location');
                    }}
                  >
                    Next
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* STEP 3: Product Details */}
          <TabsContent value="step3">
            <AnimatePresence mode="wait">
              <motion.div key="product-step" variants={variants} initial="initial" animate="animate" exit="exit" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <Label>Condition</Label>
                      <Controller
                        name="condition"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-2 mt-2">
                            <RadioGroupItem value="new" id="new" /><Label htmlFor="new">New</Label>
                            <RadioGroupItem value="used" id="used" /><Label htmlFor="used">Used</Label>
                          </RadioGroup>
                        )}
                      />
                    </div>

                    <div>
                      <Label>Authenticity</Label>
                      <Controller
                        name="authenticity"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-2 mt-2">
                            <RadioGroupItem value="original" id="original" /><Label htmlFor="original">Original</Label>
                            <RadioGroupItem value="refurbished" id="refurbished" /><Label htmlFor="refurbished">Refurbished</Label>
                          </RadioGroup>
                        )}
                      />
                    </div>

                    <div>
                      <Label>Brand</Label>
                      <Controller name="brand" control={control} render={({ field }) => <Creatable {...field} isClearable onChange={field.onChange} placeholder="Select or create brand" />} />
                    </div>

                    <div>
                      <Label>Model</Label>
                      <Controller name="model" control={control} render={({ field }) => <Creatable {...field} isClearable onChange={field.onChange} placeholder="Select or create model" />} />
                    </div>

                    <div>
                      <Label>Edition</Label>
                      <Controller name="edition" control={control} render={({ field }) => <Creatable {...field} isClearable onChange={field.onChange} placeholder="Select or create edition" />} />
                    </div>

                    <div>
                      <Label>Title</Label>
                      <Input {...register('title', { required: true })} />
                    </div>

                    <div>
                      <Label>Description</Label>
                      <Textarea {...register('description', { required: true })} />
                    </div>

                    <div>
                      <Label>Price</Label>
                      <Input type="number" {...register('price', { required: true })} />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <Label>Photos (up to 5)</Label>
                      <div className="flex gap-3 flex-wrap">
                        {[0, 1, 2, 3, 4].map((index) => (
                          <Controller
                            key={index}
                            name={`photos.${index}`}
                            control={control}
                            render={({ field }) => (
                              <FiveUploadImageBtn
                                value={field.value || null}
                                onChange={(file) => field.onChange(file)}
                                onRemove={() => field.onChange(null)}
                              />
                            )}
                          />
                        ))}
                      </div>
                    </div>


                    <div className="space-y-4">
                      <div>
                        <Label>Your Name</Label>
                        <Input {...register('name', { required: true })} />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input type="email" {...register('email', { required: true })} />
                      </div>
                      <div>
                        <Label>Phone Number</Label>
                        <Input {...register('phone', { required: true })} />
                      </div>
                    </div>
                  </div>
                </div>
                {/* </div> */}

                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={() => setActiveTab('step2')}>
                    Back
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </form>
    </div >
  );
}
