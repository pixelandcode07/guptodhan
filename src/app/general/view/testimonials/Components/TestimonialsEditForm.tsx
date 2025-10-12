'use client';

import React, { useState } from 'react';
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

export default function TestimonialsEditForm() {
  // Dummy existing data (তুমি চাইলে props বা API data দিয়ে replace করতে পারো)
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(
    'https://via.placeholder.com/200x200.png?text=Existing+Image'
  );
  const [name, setName] = useState('John Doe');
  const [designation, setDesignation] = useState('Software Engineer');
  const [rating, setRating] = useState('4');
  const [description, setDescription] = useState(
    'Great service and friendly support team!'
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) formData.append('image', image);
    formData.append('name', name);
    formData.append('designation', designation);
    formData.append('rating', rating);
    formData.append('description', description);

    const data = Object.fromEntries(formData.entries());
    console.log('Updated Testimonial Data:', data);
    alert('Testimonial Updated!');
  };

  return (
    <div className="bg-white pt-5 shadow">
      <SectionTitle text="Edit Testimonial" />

      <form onSubmit={handleSubmit} className="space-y-6 p-6 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Image Upload */}
          <div>
            <Label htmlFor="image">
              Customer Image <span className="text-red-500">*</span>
            </Label>
            <div className="mt-2">
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition">
                {!preview ? (
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-gray-500">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG (max 1MB)</p>
                  </div>
                ) : (
                  <img
                    src={preview}
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
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2" htmlFor="name">
                  Customer Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="mb-2" htmlFor="designation">
                  Designation
                </Label>
                <Input
                  id="designation"
                  name="designation"
                  type="text"
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label className="mb-2" htmlFor="rating">
                Rating <span className="text-red-500">*</span>
              </Label>
              <Select
                value={rating}
                onValueChange={setRating}
                name="rating"
                required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent className="text-yellow-200">
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
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <Button type="submit">Update Testimonial</Button>
        </div>
      </form>
    </div>
  );
}
