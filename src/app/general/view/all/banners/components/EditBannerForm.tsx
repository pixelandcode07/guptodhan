'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import UploadImage from '@/components/ReusableComponents/UploadImage';
import { BannerPosition, TextPosition } from '@/app/general/add/new/banner/Components/types';
import TopRow from '@/app/general/add/new/banner/Components/TopRow';
import DetailsFields from '@/app/general/add/new/banner/Components/DetailsFields';
import ButtonRow from '@/app/general/add/new/banner/Components/ButtonRow';

interface EditBannerFormProps {
  initialData: {
    _id: string;
    bannerTitle: string;
    subTitle?: string;
    bannerDescription?: string;
    buttonText?: string;
    bannerLink?: string;
    buttonLink?: string;
    bannerPosition?: string;
    textPosition?: string;
    bannerImage?: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditBannerForm({ initialData, onSuccess, onCancel }: EditBannerFormProps) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get authentication data from session
  type SessionWithToken = { accessToken?: string; user?: { role?: string } };
  const sessionWithToken = session as SessionWithToken | null;
  const token = sessionWithToken?.accessToken;
  const userRole = sessionWithToken?.user?.role;
  
  const [image, setImage] = useState<File | null>(null);
  const [bannerPosition, setBannerPosition] = useState<BannerPosition | ''>('');
  const [textPosition, setTextPosition] = useState<TextPosition | ''>('');
  const [subTitle, setSubTitle] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [bannerLink, setBannerLink] = useState('');
  const [buttonLink, setButtonLink] = useState('');

  // Populate form with initial data
  useEffect(() => {
    setSubTitle(initialData.subTitle || '');
    setTitle(initialData.bannerTitle || '');
    setDescription(initialData.bannerDescription || '');
    setButtonText(initialData.buttonText || '');
    setBannerLink(initialData.bannerLink || '');
    setButtonLink(initialData.buttonLink || '');
    
    // Map backend position values to frontend values
    const positionMapping: Record<string, BannerPosition> = {
      'top-homepage': 'Top (Homepage)',
      'left-homepage': 'Left (Homepage)',
      'right-homepage': 'Right (Homepage)',
      'middle-homepage': 'Middle (Homepage)',
      'bottom-homepage': 'Bottom (Homepage)',
      'top-shoppage': 'Top (ShopPage)',
    };
    
    setBannerPosition(positionMapping[initialData.bannerPosition || ''] || '');
    setTextPosition(initialData.textPosition === 'left' ? 'Left' : 'Right');
  }, [initialData]);

  // Map frontend values to backend values
  const mapBannerPosition = (position: BannerPosition): string => {
    const mapping: Record<BannerPosition, string> = {
      'Top (Homepage)': 'top-homepage',
      'Left (Homepage)': 'left-homepage',
      'Right (Homepage)': 'right-homepage',
      'Middle (Homepage)': 'middle-homepage',
      'Bottom (Homepage)': 'bottom-homepage',
      'Top (ShopPage)': 'top-shoppage',
    };
    return mapping[position] || 'top-homepage';
  };

  const mapTextPosition = (position: TextPosition): string => {
    return position === 'Left' ? 'left' : 'right';
  };

  // URL validation function
  const isValidUrl = (url: string): boolean => {
    if (!url.trim()) return true; // Empty URLs are allowed
    try {
      new URL(url.trim());
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    if (!token) {
      toast.error('Authentication required');
      return;
    }

    if (!title.trim()) {
      toast.error('Banner Title is required');
      return;
    }

    if (!bannerPosition) {
      toast.error('Banner Position is required');
      return;
    }

    if (!textPosition) {
      toast.error('Text Position is required');
      return;
    }

    // Validate URLs if they are filled
    if (bannerLink.trim() && !isValidUrl(bannerLink)) {
      toast.error('Please enter a valid banner URL (e.g., https://example.com)');
      return;
    }

    if (buttonLink.trim() && !isValidUrl(buttonLink)) {
      toast.error('Please enter a valid button URL (e.g., https://example.com)');
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      if (image) formData.append('bannerImage', image);
      formData.append('bannerPosition', mapBannerPosition(bannerPosition));
      formData.append('textPosition', mapTextPosition(textPosition));
      formData.append('subTitle', subTitle.trim());
      formData.append('bannerTitle', title.trim());
      formData.append('bannerDescription', description.trim());
      formData.append('buttonText', buttonText.trim());
      if (bannerLink.trim()) formData.append('bannerLink', bannerLink.trim());
      if (buttonLink.trim()) formData.append('buttonLink', buttonLink.trim());

      const response = await axios.patch(`/api/v1/ecommerce-banners/${initialData._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
          'x-user-role': userRole || '',
        },
      });

      if (response.data.success) {
        toast.success('Banner updated successfully!');
        onSuccess();
      } else {
        toast.error('Failed to update banner');
      }
    } catch (error: unknown) {
      console.error('Error updating banner:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update banner';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <UploadImage
            name="bannerImage"
            label="Banner Image *"
            preview={initialData?.bannerImage}
            onChange={(name, file) => setImage(file)}
          />
          <p className="text-[11px] text-gray-500 mt-2">Please upload jpg, jpeg, png file of 500px × 262px</p>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <TopRow
            bannerPosition={bannerPosition}
            setBannerPosition={setBannerPosition}
            textPosition={textPosition}
            setTextPosition={setTextPosition}
            bannerLink={bannerLink}
            setBannerLink={setBannerLink}
            isValidUrl={isValidUrl}
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
            isValidUrl={isValidUrl}
          />
        </div>
      </div>

      <div className="flex justify-center pb-5 gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? 'Updating Banner...' : 'Update Banner'}
        </Button>
      </div>
    </div>
  );
}
