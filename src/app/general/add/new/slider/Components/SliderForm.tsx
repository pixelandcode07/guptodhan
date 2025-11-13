'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import UploadImage from '@/components/ReusableComponents/UploadImage';
import TopRow from './parts/TopRow';
import DetailsFields from './parts/DetailsFields';
import ButtonRow from './parts/ButtonRow';
import { useRouter } from 'next/navigation';

export type TextPosition = 'Left' | 'Right';

export default function SliderForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Get authentication data from session
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      

      // Basic validations
      if (!image) throw new Error('Please upload an image.');
      if (!textPosition) throw new Error('Please select text position.');
      if (!sliderLink) throw new Error('Please provide slider link.');
      if (!subTitle) throw new Error('Please provide sub title.');
      if (!title) throw new Error('Please provide slider title.');
      if (!description) throw new Error('Please provide slider description.');
      if (!buttonText) throw new Error('Please provide button text.');
      if (!buttonLink) throw new Error('Please provide button link.');

      // URL validation function
      const isValidUrl = (url: string): boolean => {
        if (!url.trim()) return false;
        try {
          new URL(url.trim());
          return true;
        } catch {
          return false;
        }
      };

      // URL validations
      if (!isValidUrl(sliderLink)) {
        throw new Error('Please enter a valid slider URL (e.g., https://example.com)');
      }
      if (!isValidUrl(buttonLink)) {
        throw new Error('Please enter a valid button URL (e.g., https://example.com)');
      }

      // 1) Upload image
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
      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}));
        throw new Error(err?.message || 'Image upload failed');
      }
      const uploadData = await uploadRes.json();
      const imageUrl: string = uploadData.url;
      if (!imageUrl) throw new Error('Image URL not returned by uploader');

      // 2) Build API payload to match server validation
      const payload = {
        sliderId: `SL-${Date.now()}`,
        image: imageUrl,
        textPosition,
        sliderLink,
        subTitleWithColor: subTitle,
        bannerTitleWithColor: title,
        bannerDescriptionWithColor: description,
        buttonWithColor: buttonText,
        buttonLink,
        status: 'active' as const,
      };

      // 3) Create slider
      const res = await fetch('/api/v1/slider-form', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          ...(userRole ? { 'x-user-role': userRole } : {}),
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || 'Failed to create slider');
      }

      // 4) Redirect to list view
      toast.success('Slider created successfully!');
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
        <div className="lg:col-span-1">
          <UploadImage 
            name="sliderImage"
            label="Slider Image"
            onChange={(name, file) => setImage(file)}
          />
          <p className="text-[11px] text-gray-500 mt-2">Please upload jpg, jpeg, png file of 1000px × 500px</p>
        </div>
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
        </div>
      </div>

      <div className="flex justify-center pb-5">
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Slider'}
        </Button>
      </div>
    </div>
  );
}


