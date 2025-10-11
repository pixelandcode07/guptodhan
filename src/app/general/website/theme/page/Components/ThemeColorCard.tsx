'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ChromePicker } from 'react-color';
import { toast } from 'sonner';

interface ThemeColors {
  primary: string;
  secondary: string;
  tertiary: string;
  title: string;
  paragraph: string;
  border: string;
}

interface Props {
  initialColors: ThemeColors;
  themeId?: string | null;
}

export default function ThemeColorCard({ initialColors, themeId }: Props) {
  const [colors, setColors] = useState<ThemeColors>(initialColors);
  const [activePicker, setActivePicker] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key: keyof ThemeColors, color: string) => {
    setColors(prev => ({ ...prev, [key]: color }));
  };

  const handleCancel = () => {
    setColors(initialColors);
    setActivePicker(null);
    toast.info('Changes canceled.');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast.loading('Saving theme colors...');

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
        ? `http://localhost:3000/api/v1/theme-settings/${themeId}`
        : 'http://localhost:3000/api/v1/theme-settings';
      const method = themeId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Update failed: ${errorText}`);
      }

      const result = await res.json();
      toast.success(
        themeId
          ? 'Theme colors updated successfully! '
          : 'Theme created successfully! '
      );
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update theme colors. Please try again.');
    } finally {
      setIsLoading(false);
      setActivePicker(null);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="w-full bg-white relative">
      <div className="flex w-full p-10 pb-0 text-sm justify-center items-center">
        <div className="grid grid-cols-3 gap-6">
          {Object.entries(colors).map(([key, value]) => (
            <div key={key} className="relative">
              <label className="block mb-2 text-xs font-medium capitalize">
                {key} Color :
              </label>
              <div className="flex items-center gap-1">
                <div
                  className="w-10 h-8 rounded border cursor-pointer"
                  style={{ backgroundColor: value }}
                  onClick={() =>
                    setActivePicker(activePicker === key ? null : key)
                  }
                />
                <input
                  type="text"
                  value={value}
                  className="border border-gray-500 rounded pr-10 pl-2 p-1 w-full"
                  readOnly
                />
              </div>

              {activePicker === key && (
                <div className="absolute z-50 mt-2">
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

      <div className="flex justify-center pb-5 gap-4 mt-6">
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
