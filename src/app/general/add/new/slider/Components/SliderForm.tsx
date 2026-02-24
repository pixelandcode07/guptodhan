// src/app/general/add/new/slider/Components/SliderForm.tsx - FIXED VERSION
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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

// Proper type definition with optional properties
interface SliderFormData {
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
}

interface SliderFormProps {
  initialData?: SliderFormData;
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
  
  const isEditMode = useMemo(
    () => !!initialData?._id,
    [initialData?._id]
  );

  useEffect(() => {
    if (!initialData) return;
    
    setTextPosition((initialData.textPosition as TextPosition) || '');
    setSliderLink(initialData.sliderLink || '');
    setSubTitle(initialData.subTitleWithColor || '');
    setTitle(initialData.bannerTitleWithColor || '');
    setDescription(initialData.bannerDescriptionWithColor || '');
    setButtonText(initialData.buttonWithColor || '');
    setButtonLink(initialData.buttonLink || '');
    setAppRedirectType((initialData.appRedirectType as AppRedirectType) || 'None');
    setAppRedirectValue(initialData.appRedirectId || '');
  }, [initialData]);

  const handleImageChange = useCallback((name: string, file: File | null) => {
    if (file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 1) {
        toast.error('Image size is greater than 1MB. Please upload an image under 1MB.');
        return; 
      }
      setImage(file);
    } else {
      setImage(null);
    }
  }, []);

  const isValidUrl = useCallback((url: string): boolean => {
    if (!url || !url.trim()) return true; 
    try { 
      new URL(url.trim()); 
      return true; 
    } catch { 
      return false; 
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);

      // Validation Checks
      if (!image && !isEditMode && !initialData?.image) {
        throw new Error('Please upload an image.');
      }
      if (!textPosition) {
        throw new Error('Please select text position.');
      }
      if (!subTitle) {
        throw new Error('Please provide sub title.');
      }
      if (!title) {
        throw new Error('Please provide slider title.');
      }
      if (!description) {
        throw new Error('Please provide slider description.');
      }
      
      if (appRedirectType !== 'None' && !appRedirectValue.trim()) {
        throw new Error('Please select a target for Mobile App Navigation.');
      }

      // URL Validation
      if (sliderLink && !isValidUrl(sliderLink)) {
        throw new Error('Invalid slider URL');
      }
      if (buttonLink && !isValidUrl(buttonLink)) {
        throw new Error('Invalid button URL');
      }

      let imageUrl = initialData?.image || ''; 

      // Upload Image if changed
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
        ? `/api/v1/slider-form/${initialData?._id}` 
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
      
      // ✅ Throw entire backend response if failed so we can parse it below
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || 'Failed to save slider');
      }

      toast.success(`Slider ${isEditMode ? 'updated' : 'created'} successfully!`);
      router.push('/general/view/all/sliders');

    } catch (error: any) {
      console.error(error);
      
      let errorMessage = 'Something went wrong. Please try again.';
      const rawMessage = error?.message;

      if (rawMessage) {
        try {
          // If the message is a stringified JSON array from Zod
          const parsedMessage = rawMessage.startsWith('[') 
            ? JSON.parse(rawMessage) 
            : rawMessage;

          if (Array.isArray(parsedMessage) && parsedMessage.length > 0) {
            // Extract the actual human readable message from the first Zod error object
            errorMessage = parsedMessage[0].message || 'A required field is missing.';
          } else {
            // If it's a normal string error (like our custom throw Error)
            errorMessage = typeof rawMessage === 'string' ? rawMessage : 'An error occurred.';
          }
        } catch (parseError) {
          // Fallback if parsing fails
          errorMessage = typeof rawMessage === 'string' ? rawMessage : errorMessage;
        }
      }

      // Display the clean, readable error
      toast.error(errorMessage);

    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    isEditMode,
    initialData,
    image,
    textPosition,
    subTitle,
    title,
    description,
    appRedirectType,
    appRedirectValue,
    sliderLink,
    buttonLink,
    isValidUrl,
    token,
    userRole,
    router,
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image Upload */}
        <div className="lg:col-span-1">
          <UploadImage 
            name="sliderImage"
            label={<span>Slider Image <span className="text-red-500">*</span></span> as any} 
            preview={initialData?.image} 
            onChange={handleImageChange}
          />
          {/* ✅ Image size guidelines */}
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-[12px] text-gray-700 font-semibold mb-2">📐 Image Size Guidelines:</p>
            <div className="space-y-1.5">
              <div className="text-[11px] text-gray-600">
                <span className="font-semibold">Large Banner (Desktop):</span>
                <br />
                <span className="text-blue-600">1226px × 632px</span>
              </div>
              <div className="text-[11px] text-gray-600">
                <span className="font-semibold">Small Banner (Sidebar):</span>
                <br />
                <span className="text-blue-600">2250px × 1125px</span>
              </div>
              <div className="text-[11px] mt-2">
                 Max Size: <span className="text-red-600 font-bold">1 MB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
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

      {/* Submit Button */}
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