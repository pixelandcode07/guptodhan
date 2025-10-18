'use client';

import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import { toast } from 'sonner';
import axios from 'axios';
import { useSession } from 'next-auth/react'; // ✅ ধাপ ১: useSession ইম্পোর্ট করুন
import { Loader2 } from 'lucide-react';

interface ThemeColors {
  primary: string;
  secondary: string;
  tertiary: string;
  title: string;
  paragraph: string;
  border: string;
  id?: string;
  updatedAt?: string;
}

interface Props {
  initialColors: any; // ইনিশিয়াল ডেটা null হতে পারে, তাই any রাখা হলো
}

export default function ThemeColorCard({ initialColors }: Props) {
  const { data: session } = useSession(); // ✅ ধাপ ২: সেশন থেকে ডেটা নিন
  const token = (session as any)?.accessToken; // ✅ সেশন থেকে টোকেন বের করুন

  const mapId = (data: any) => ({
    id: data?._id || undefined,
    primary: data?.primaryColor || '#000000',
    secondary: data?.secondaryColor || '#FFFFFF',
    tertiary: data?.tertiaryColor || '#F0F0F0',
    title: data?.titleColor || '#333333',
    paragraph: data?.paragraphColor || '#666666',
    border: data?.borderColor || '#DDDDDD',
  });

  const [colors, setColors] = useState<ThemeColors>(mapId(initialColors));
  const [activePicker, setActivePicker] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setActivePicker(null);
      }
    };
    if (activePicker) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activePicker]);

  const handleChange = (key: keyof ThemeColors, color: string) => {
    setColors(prev => ({ ...prev, [key]: color }));
  };

  const handleCancel = () => {
    setColors(mapId(initialColors));
    toast.info('Changes canceled.');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
        toast.error("Authentication failed. Please log in as an admin.");
        return;
    }
    setIsLoading(true);
    const toastId = toast.loading('Saving theme colors...');

    try {
      const payload = {
        primaryColor: colors.primary,
        secondaryColor: colors.secondary,
        tertiaryColor: colors.tertiary,
        titleColor: colors.title,
        paragraphColor: colors.paragraph,
        borderColor: colors.border,
      };

      const url = colors.id
        ? `/api/v1/theme-settings/${colors.id}`
        : `/api/v1/theme-settings`;
      
      const method = colors.id ? 'PATCH' : 'POST';

      const res = await axios({
        method,
        url,
        data: payload,
        headers: {
          'Authorization': `Bearer ${token}` // ✅ ধাপ ৩: API কলে টোকেন পাঠান
        }
      });
      
      if (res.data?.success) {
        toast.success(colors.id ? 'Theme colors updated!' : 'Theme created!', { id: toastId });
        setColors(mapId(res.data.data)); // রেসপন্স থেকে state আপডেট করা
      }

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update theme.', { id: toastId });
    } finally {
      setIsLoading(false);
      setActivePicker(null);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="w-full bg-white relative p-4 sm:p-6 md:p-10">
      <div className="flex w-full justify-center items-center">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {Object.entries(colors)
            .filter(([key]) => !['id', 'updatedAt'].includes(key))
            .map(([key, value]) => (
              <div key={key} className="relative w-full">
                <label className="block mb-2 text-xs sm:text-sm font-medium capitalize">
                  {key} Color :
                </label>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className="w-10 h-8 sm:w-12 sm:h-10 rounded border cursor-pointer"
                    style={{ backgroundColor: value }}
                    onClick={() => setActivePicker(activePicker === key ? null : key)}
                  />
                  <input
                    type="text"
                    value={value}
                    className="border border-gray-500 rounded px-2 py-1 w-full sm:p-2 sm:text-sm"
                    readOnly
                  />
                </div>
                {activePicker === key && (
                  <div ref={pickerRef} className="absolute z-50 mt-2">
                    <ChromePicker
                      color={value}
                      onChange={(c: ColorResult) => handleChange(key as keyof ThemeColors, c.hex)}
                    />
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
      <div className="flex flex-row justify-center gap-4 mt-8 pb-5">
        <Button type="button" variant="destructive" onClick={handleCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
          {isLoading ? 'Saving...' : (colors.id ? 'Update' : 'Create')}
        </Button>
      </div>
    </form>
  );
}