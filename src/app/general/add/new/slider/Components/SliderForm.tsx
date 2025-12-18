'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import UploadImage from '@/components/ReusableComponents/UploadImage';
import TopRow from './parts/TopRow';
import DetailsFields from './parts/DetailsFields';
import ButtonRow from './parts/ButtonRow';
import AppActionRow, { AppRedirectType } from './parts/AppActionRow'; 
import { useRouter } from 'next/navigation';

export type TextPosition = 'Left' | 'Right';

interface SliderFormProps {
  initialData?: {
    _id?: string;
    image?: string;
    textPosition?: string;
    sliderLink?: string;
    subTitleWithColor?: string;
    bannerTitleWithColor?: string;
    bannerDescriptionWithColor?: string;
    buttonWithColor?: string;
    buttonLink?: string;
    status?: string;
    appRedirectType?: string;
    appRedirectId?: string;
  };
}

export default function SliderForm({ initialData }: SliderFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  
  type SessionWithToken = { accessToken?: string; user?: { role?: string } };
  const sessionWithToken = session as SessionWithToken | null;
  const token = sessionWithToken?.accessToken;
  const userRole = sessionWithToken?.user?.role;
  
  const [image, setImage] = useState<File | null>(null);
  const [textPosition, setTextPosition] = useState<TextPosition | ''>('');
  const [sliderLink, setSliderLink] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonLink, setButtonLink] = useState('');
  
  const [appRedirectType, setAppRedirectType] = useState<AppRedirectType>('None');
  const [appRedirectValue, setAppRedirectValue] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!initialData?._id;

  // Load Data on Edit
  useEffect(() => {
    if (initialData) {
      setTextPosition((initialData.textPosition as TextPosition) || '');
      setSliderLink(initialData.sliderLink || '');
      setSubTitle(initialData.subTitleWithColor || '');
      setTitle(initialData.bannerTitleWithColor || '');
      setDescription(initialData.bannerDescriptionWithColor || '');
      setButtonText(initialData.buttonWithColor || '');
      setButtonLink(initialData.buttonLink || '');

      // App Data
      setAppRedirectType((initialData.appRedirectType as AppRedirectType) || 'None');
      setAppRedirectValue(initialData.appRedirectId || '');
    }
  }, [initialData]);

  const handleSave = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);

      if (!image && !isEditMode && !initialData?.image) throw new Error('Please upload an image.');
      if (!textPosition) throw new Error('Please select text position.');
      if (!subTitle) throw new Error('Please provide sub title.');
      if (!title) throw new Error('Please provide slider title.');
      if (!description) throw new Error('Please provide slider description.');
      
      if (appRedirectType !== 'None' && !appRedirectValue.trim()) {
        throw new Error('Please select a target for Mobile App Navigation.');
      }

      // URL Validation
      const isValidUrl = (url: string): boolean => {
        if (!url || !url.trim()) return true; 
        try { new URL(url.trim()); return true; } catch { return false; }
      };

      if (sliderLink && !isValidUrl(sliderLink)) throw new Error('Invalid slider URL');
      if (buttonLink && !isValidUrl(buttonLink)) throw new Error('Invalid button URL');

      // Image Handling
      let imageUrl = initialData?.image || ''; 

      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        
        const uploadRes = await fetch('/api/v1/upload', {
          method: 'POST',
          body: formData,
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...(userRole ? { 'x-user-role': userRole } : {}),
          }
        });
        
        if (!uploadRes.ok) throw new Error('Image upload failed');
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const payload = {
        ...(!isEditMode && { sliderId: `SL-${Date.now()}` }),
        image: imageUrl,
        textPosition,
        sliderLink,
        subTitleWithColor: subTitle,
        bannerTitleWithColor: title,
        bannerDescriptionWithColor: description,
        buttonWithColor: buttonText,
        buttonLink,
        status: initialData?.status || 'active',
        appRedirectType,
        appRedirectId: appRedirectValue || null,
      };

      const url = isEditMode 
        ? `/api/v1/slider-form/${initialData._id}` 
        : '/api/v1/slider-form';
      
      const method = isEditMode ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          ...(userRole ? { 'x-user-role': userRole } : {}),
        },
        body: JSON.stringify(payload),
      });
      
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || 'Failed to save slider');
      }

      toast.success(`Slider ${isEditMode ? 'updated' : 'created'} successfully!`);
      router.push('/general/view/all/sliders');
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1">
          <UploadImage 
            name="sliderImage"
            label="Slider Image"
            preview={initialData?.image} 
            onChange={(name, file) => setImage(file)}
          />
          <p className="text-[11px] text-gray-500 mt-2">
            Please upload jpg, jpeg, png file of 1000px × 500px
          </p>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* 🔥 FIX: TopRow এখন সব প্রপস পাচ্ছে */}
          <TopRow
            textPosition={textPosition}
            setTextPosition={setTextPosition}
            sliderLink={sliderLink}
            setSliderLink={setSliderLink}
          />
          
          <DetailsFields
            subTitle={subTitle}
            setSubTitle={setSubTitle}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
          />
          
          <ButtonRow
            buttonText={buttonText}
            setButtonText={setButtonText}
            buttonLink={buttonLink}
            setButtonLink={setButtonLink}
          />

          <AppActionRow 
            appRedirectType={appRedirectType}
            setAppRedirectType={setAppRedirectType}
            appRedirectValue={appRedirectValue}
            setAppRedirectValue={setAppRedirectValue}
          />
        </div>
      </div>

      <div className="flex justify-center pb-5">
        <Button 
          onClick={handleSave} 
          disabled={isSubmitting}
          className="w-full md:w-auto px-8 py-6 text-base"
        >
          {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Slider' : 'Save Slider')}
        </Button>
      </div>
    </div>
  );
}