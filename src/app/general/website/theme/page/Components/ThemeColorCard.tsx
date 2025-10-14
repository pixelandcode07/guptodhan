'use client';

import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { ChromePicker } from 'react-color';
import { toast } from 'sonner';
import axios from 'axios';

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
  initialColors: ThemeColors;
}

export default function ThemeColorCard({ initialColors }: Props) {
  // ✅ fixed mapId
  const mapId = (data: any) => ({
    id: data.id || data._id,
    primary: data.primaryColor || data.primary,
    secondary: data.secondaryColor || data.secondary,
    tertiary: data.tertiaryColor || data.tertiary,
    title: data.titleColor || data.title,
    paragraph: data.paragraphColor || data.paragraph,
    border: data.borderColor || data.border,
  });

  const [colors, setColors] = useState<ThemeColors>(mapId(initialColors));
  const [activePicker, setActivePicker] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const themeId = colors.id;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setActivePicker(null);
      }
    };
    if (activePicker)
      document.addEventListener('mousedown', handleClickOutside);
    else document.removeEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activePicker]);

  const handleChange = (key: keyof ThemeColors, color: string) => {
    setColors(prev => ({ ...prev, [key]: color }));
  };

  const handleCancel = () => {
    setColors(mapId(initialColors));
    setActivePicker(null);
    toast.info('Changes canceled.');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const url = themeId
        ? `/api/v1/theme-settings/${themeId}`
        : `/api/v1/theme-settings`;

      if (themeId) {
        const res = await axios.patch(url, payload);
        if (res.data?.success)
          toast.success('Theme colors updated!', { id: toastId });
      } else {
        const res = await axios.post(url, payload);
        if (res.data?.success) toast.success('Theme created!', { id: toastId });
      }

      // ✅ Always fetch latest theme from backend
      const latest = await axios.get('/api/v1/public/theme-settings');
      setColors(mapId(latest.data.data));
    } catch (error: any) {
      console.error('Update failed:', error);
      toast.error(
        error.response?.data?.message || 'Failed to update theme colors.',
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
      setActivePicker(null);
    }
  };

  return (
    <form
      onSubmit={handleUpdate}
      className="w-full bg-white relative p-4 sm:p-6 md:p-10">
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
                    onClick={() =>
                      setActivePicker(activePicker === key ? null : key)
                    }
                  />
                  <input
                    type="text"
                    value={value}
                    className="border border-gray-500 rounded pr-10 pl-2 p-1 w-full sm:p-2 sm:text-sm"
                    readOnly
                  />
                </div>

                {activePicker === key && (
                  <div ref={pickerRef} className="absolute z-50 mt-2">
                    <ChromePicker
                      color={value}
                      onChange={(c: { hex: string }) =>
                        handleChange(key as keyof ThemeColors, c.hex)
                      }
                    />
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      <div className="flex flex-row justify-center gap-4 mt-6 pb-5">
        <Button
          type="button"
          variant="destructive"
          onClick={handleCancel}
          disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : themeId ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
