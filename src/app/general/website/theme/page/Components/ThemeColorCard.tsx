'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ChromePicker } from 'react-color';

interface ThemeColors {
  primary: string;
  secondary: string;
  tertiary: string;
  title: string;
  paragraph: string;
  border: string;
}

export default function ThemeColorCard() {
  const defaultColors: ThemeColors = {
    primary: '#00005e',
    secondary: '#3d85c6',
    tertiary: '#ba2a2a',
    title: '#222831',
    paragraph: '#252a34',
    border: '#eeeeee',
  };

  const [colors, setColors] = useState<ThemeColors>(defaultColors);
  const [activePicker, setActivePicker] = useState<string | null>(null);

  const handleChange = (key: keyof ThemeColors, color: string) => {
    setColors(prev => ({ ...prev, [key]: color }));
  };

  const handleCancel = () => {
    setColors(defaultColors);
    setActivePicker(null);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated colors:', colors);
    alert('Colors updated!');
    setActivePicker(null);
  };

  return (
    <form onSubmit={handleUpdate} className="w-full bg-white relative">
      {/* Grid for color pickers */}
      <div className="flex w-full p-10 pb-0 text-sm justify-center items-center">
        <div className="grid grid-cols-3 gap-6">
          {Object.entries(colors).map(([key, value]) => (
            <div key={key} className="relative">
              <label className="block mb-2 text-xs font-medium capitalize">
                {key} Color :
              </label>
              <div className="flex items-center gap-1">
                {/* Clickable color box */}
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

              {/* Color picker dropdown */}
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

      {/* Buttons */}
      <div className="flex justify-center pb-5 gap-4 mt-6">
        <Button type="button" variant="destructive" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit">Update</Button>
      </div>
    </form>
  );
}
