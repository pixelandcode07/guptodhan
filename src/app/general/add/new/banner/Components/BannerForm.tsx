'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import UploadImage from '@/components/ReusableComponents/UploadImage';
import { BannerPosition, TextPosition } from './types';
import TopRow from './TopRow';
import DetailsFields from './DetailsFields';
import ButtonRow from './ButtonRow';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BannerFormProps {
  initialData?: {
    _id?: string;
    bannerTitle?: string;
    subTitle?: string;
    bannerDescription?: string;
    buttonText?: string;
    bannerLink?: string;
    buttonLink?: string;
    bannerPosition?: string;
    textPosition?: string;
    bannerImage?: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function BannerForm({ initialData, onSuccess, onCancel }: BannerFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
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
  const [bannerStatus, setBannerStatus] = useState<'active' | 'inactive'>('active');

  const isEditMode = !!initialData;

  // Populate form with initial data for edit mode
  useEffect(() => {
    if (initialData) {
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
      // Default status to active if not provided
      setBannerStatus(((initialData as any).status === 'inactive') ? 'inactive' : 'active');
    }
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
    return mapping[position];
  };

  const mapTextPosition = (position: TextPosition): string => {
    return position.toLowerCase();
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
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!image) {
        toast.error('Please upload a banner image');
        return;
      }

      if (!bannerPosition) {
        toast.error('Please select a banner position');
        return;
      }

      if (!textPosition) {
        toast.error('Please select a text position');
        return;
      }

      if (!subTitle.trim()) {
        toast.error('Please enter a subtitle');
        return;
      }

      if (!title.trim()) {
        toast.error('Please enter a title');
        return;
      }

      if (!description.trim()) {
        toast.error('Please enter a description');
        return;
      }

      if (!buttonText.trim()) {
        toast.error('Please enter button text');
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

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('bannerImage', image);
      formData.append('bannerPosition', mapBannerPosition(bannerPosition));
      formData.append('textPosition', mapTextPosition(textPosition));
      formData.append('subTitle', subTitle.trim());
      formData.append('bannerTitle', title.trim());
      formData.append('bannerDescription', description.trim());
      formData.append('buttonText', buttonText.trim());
      if (bannerLink.trim()) formData.append('bannerLink', bannerLink.trim());
      if (buttonLink.trim()) formData.append('buttonLink', buttonLink.trim());
      formData.append('status', bannerStatus);

      let response;
      if (isEditMode && initialData?._id) {
        // Update existing banner
        response = await axios.patch(`/api/v1/ecommerce-banners/${initialData._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...(userRole ? { 'x-user-role': userRole } : {}),
          },
        });
      } else {
        // Create new banner
        response = await axios.post('/api/v1/ecommerce-banners', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...(userRole ? { 'x-user-role': userRole } : {}),
          },
        });
      }

      if (response.data.success) {
        const action = isEditMode ? 'updated' : 'created';
        toast.success(`Banner ${action} successfully!`);
        
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/general/view/all/banners');
        }
      } else {
        const action = isEditMode ? 'update' : 'create';
        toast.error(`Failed to ${action} banner`);
      }
    } catch (error: unknown) {
      console.error('Error creating banner:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create banner';
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
          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <div className="mt-2 max-w-xs">
              <Select value={bannerStatus} onValueChange={(v) => setBannerStatus(v as 'active' | 'inactive')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pb-5 gap-3">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? (isEditMode ? 'Updating Banner...' : 'Creating Banner...') : (isEditMode ? 'Update Banner' : 'Save Banner')}
        </Button>
      </div>
    </div>
  );
}


