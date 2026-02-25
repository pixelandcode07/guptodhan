'use client';

import { Controller, UseFormReturn } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Creatable from 'react-select/creatable';
import { OnChangeValue } from 'react-select'; 
import FiveUploadImageBtn from '@/components/ReusableComponents/FiveUploadImageBtn';
import { Loader2 } from 'lucide-react';

// ✅ আর কোনো এক্সটার্নাল ইমপোর্ট লাগবে না। সরাসরি any ব্যবহার করে টাইপ এরর বন্ধ করা হলো।
type AddProductInfoProps = {
  form: UseFormReturn<any>; 
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
};

export default function AddProductInfo({ form, onBack, onSubmit, isSubmitting }: AddProductInfoProps) {
  const { control, register, watch, setValue } = form;

  const variants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const handleSelectChange = (
    fieldName: 'brand' | 'productModel' | 'edition',
    value: OnChangeValue<any, false>
  ) => {
    setValue(fieldName, value ? value : null);
  };

  const images = watch('images') || [];

  const handleFormSubmit = () => {
    const selectedImages = images.filter((img: any) => img !== null);
    if (!selectedImages.length) {
      alert('Please upload at least one image');
      return;
    }
    onSubmit();
  };

  return (
    <TabsContent value="step3">
      <AnimatePresence mode="wait">
        <motion.div
          key="product-step"
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 md:px-10">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Condition */}
              <div>
                <Label>Condition</Label>
                <Controller
                  name="condition"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-2 mt-2">
                      <div className='flex gap-24'>
                        <div className='flex items-center gap-2'>
                          <RadioGroupItem value="new" id="new" />
                          <Label htmlFor="new">New</Label>
                        </div>
                        <div className='flex items-center gap-2'>
                          <RadioGroupItem value="used" id="used" />
                          <Label htmlFor="used">Used</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              {/* Authenticity */}
              <div>
                <Label>Authenticity</Label>
                <Controller
                  name="authenticity"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-2 mt-2">
                      <div className='flex gap-16'>
                        <div className='flex items-center gap-2'>
                          <RadioGroupItem value="original" id="original" />
                          <Label htmlFor="original">Original</Label>
                        </div>
                        <div className='flex items-center gap-2'>
                          <RadioGroupItem value="refurbished" id="refurbished" />
                          <Label htmlFor="refurbished">Refurbished</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              {/* Brand */}
              <div>
                <Label className='mb-2'>Brand</Label>
                <Controller
                  name="brand"
                  control={control}
                  render={({ field }) => (
                    <Creatable
                      {...field}
                      isClearable
                      onChange={(val) => handleSelectChange('brand', val)}
                      placeholder="Select or create brand"
                      value={field.value as any}
                    />
                  )}
                />
              </div>

              {/* Model */}
              <div>
                <Label className='mb-2'>Model</Label>
                <Controller
                  name="productModel"
                  control={control}
                  render={({ field }) => (
                    <Creatable
                      {...field}
                      isClearable
                      onChange={(val) => handleSelectChange('productModel', val)}
                      placeholder="Select or create model"
                      value={field.value as any}
                    />
                  )}
                />
              </div>

              {/* Edition */}
              <div>
                <Label className='mb-2'>Edition</Label>
                <Controller
                  name="edition"
                  control={control}
                  render={({ field }) => (
                    <Creatable
                      {...field}
                      isClearable
                      onChange={(val) => handleSelectChange('edition', val)}
                      placeholder="Select or create edition"
                      value={field.value as any}
                    />
                  )}
                />
              </div>

              {/* Title */}
              <div>
                <Label className='mb-2'>Title</Label>
                <Input {...register('title', { required: true })} />
              </div>

              {/* Description */}
              <div>
                <Label className='mb-2'>Description</Label>
                <Textarea {...register('description', { required: true })} />
              </div>

              {/* Price */}
              <div>
                <Label className='mb-2'>Price</Label>
                <Input type="number" {...register('price', { required: true })} />
              </div>

              {/* Negotiable */}
              <div>
                <Controller
                  name="isNegotiable"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                      <span>Price Negotiable</span>
                    </label>
                  )}
                />
              </div>
            </div>

            {/* Right Column: Images + Contact */}
            <div className="space-y-6">
              {/* Images */}
              <div>
                <Label>Photos (up to 5)</Label>
                <div className="flex gap-3 flex-wrap">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <Controller
                      key={index}
                      name={`images.${index}` as any}
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

              {/* Contact */}
              <div className="space-y-4">
                <div>
                  <Label className='mb-2'>Your Name</Label>
                  <Input {...register('contactDetails.name', { required: true })} />
                </div>
                <div>
                  <Label className='mb-2'>Email</Label>
                  <Input type="email" {...register('contactDetails.email')} />
                </div>
                <div>
                  <Label className='mb-2'>Phone Number</Label>
                  <Input {...register('contactDetails.phone', { required: true })} />
                </div>
                <div>
                  <Controller
                    name="contactDetails.isPhoneHidden"
                    control={control}
                    render={({ field }) => (
                      <label className="flex items-center gap-2 mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                        <span>Hide Phone Number</span>
                      </label>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between my-10 px-5 md:px-10">
            <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
              Back
            </Button>
            
            <Button type="button" onClick={handleFormSubmit} disabled={isSubmitting} className="min-w-[150px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Compressing & Saving...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </TabsContent>
  );
}