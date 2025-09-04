'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';

export default function TestimonialForm() {
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className=" bg-white pt-5 shadow">
      <SectionTitle text="Testimonial Entry Form" />

      <form className="space-y-6 p-6 pt-2">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Image Upload Box */}
          <div>
            <Label htmlFor="image">
              Customer Image <span className="text-red-500">*</span>
            </Label>
            <div className="mt-2">
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition">
                {!image ? (
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG (max 1MB)</p>
                  </div>
                ) : (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </label>
              <Input
                id="image"
                name="image"
                type="file"
                className="hidden"
                accept="image/*"
                required
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Right side */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2" htmlFor="name">
                  Customer Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter Customer Name"
                  required
                />
              </div>
              <div>
                <Label className="mb-2" htmlFor="designation">
                  Designation
                </Label>
                <Input
                  type="text"
                  id="designation"
                  name="designation"
                  placeholder="Designation"
                />
              </div>
            </div>

            <div>
              <Label className="mb-2" htmlFor="rating">
                Rating <span className="text-red-500">*</span>
              </Label>
              <Select name="rating" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">★</SelectItem>
                  <SelectItem value="2">★★</SelectItem>
                  <SelectItem value="3">★★★</SelectItem>
                  <SelectItem value="4">★★★★</SelectItem>
                  <SelectItem value="5">★★★★★</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2" htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                maxLength={255}
                placeholder="Write Testimonial Here"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <Button type="submit">Save Testimonial</Button>
        </div>
      </form>
    </div>
  );
}
