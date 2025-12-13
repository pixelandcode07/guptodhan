'use client';

import React, { useEffect, useState } from 'react';
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
import { Upload, Loader2 } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

export default function TestimonialsEditForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [rating, setRating] = useState('5');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  // ✅ Fetch existing testimonial data
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/v1/testimonial`);
        const testimonials = res.data.data;
        const testimonial = testimonials.find((item: any) => item._id === id);

        if (!testimonial) {
          toast.error('Testimonial not found!');
          router.push('/general/view/testimonials');
          return;
        }

        setPreview(testimonial.customerImage);
        setName(testimonial.customerName);
        setDesignation(testimonial.customerProfession || '');
        setRating(String(testimonial.rating));
        setDescription(testimonial.description);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load testimonial data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  // ✅ Image Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Submit handler (PATCH)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return toast.error('Invalid ID!');

    try {
      setBtnLoading(true);

      let imageUrl = preview;

      // Optional: যদি নতুন ছবি upload করতে চাও Cloudinary তে, এখানে করতে পারো
      // এখন শুধু পুরানো preview রাখছে

      const payload = {
        customerName: name,
        customerProfession: designation,
        rating: Number(rating),
        description,
        customerImage: imageUrl,
        status: 'approved',
      };

      const res = await axios.patch(`/api/v1/testimonial/${id}`, payload);

      if (res.data?.success) {
        toast.success('Testimonial updated successfully!');
        router.push('/general/view/testimonials');
      } else {
        toast.error('Failed to update testimonial.');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    } finally {
      setBtnLoading(false);
    }
  };

  // ✅ Loading UI
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-600 mt-3">Loading testimonial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white pt-5 shadow rounded-lg">
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
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <Button type="submit" disabled={btnLoading} className="w-[220px]">
            {btnLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
              </>
            ) : (
              'Update Testimonial'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
