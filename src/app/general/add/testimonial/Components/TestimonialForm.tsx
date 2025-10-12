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
import SectionTitle from '@/components/ui/SectionTitle';
import UploadImage from '@/components/ReusableComponents/UploadImage';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

export default function TestimonialForm() {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Image change handler
  const handleImageChange = (_name: string, file: File | null) => {
    setImage(file);
  };

  // ✅ Submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image) {
      toast.error('Please upload a customer image.');
      return;
    }

    try {
      setLoading(true);

      const form = e.currentTarget;
      const formData = new FormData(form);

      // 🧩 Append extra fields
      formData.append('customerImage', image);
      formData.append('reviewID', crypto.randomUUID());
      formData.append('productID', '67000abc1234567890abcd12'); // replace dynamically if needed

      // ✅ Send to backend
      const res = await fetch('/api/v1/testimonial', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (!res.ok)
        throw new Error(result.message || 'Failed to save testimonial');

      toast.success('Testimonial added successfully!');
      router.push('/general/view/testimonials');
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white pt-5 shadow">
      <SectionTitle text="Testimonial Entry Form" />
      <div className="flex justify-end">
        <button>
          <Link href="/general/add/testimonial">Add new Testimonial</Link>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-6 pt-2">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Image Upload */}
          <div>
            <Label htmlFor="customerImage">
              Customer Image <span className="text-red-500">*</span>
            </Label>
            <div className="mt-2">
              <UploadImage name="customerImage" onChange={handleImageChange} />
            </div>
          </div>

          {/* Right Side */}
          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">
                  Customer Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="customerName"
                  name="customerName"
                  placeholder="Enter Customer Name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="customerProfession">Designation</Label>
                <Input
                  type="text"
                  id="customerProfession"
                  name="customerProfession"
                  placeholder="Enter Profession"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="rating">
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
              <Label htmlFor="description">
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

        <div className="text-center">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Testimonial'}
          </Button>
        </div>
      </form>
    </div>
  );
}
