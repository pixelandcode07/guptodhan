'use client';

import { useState } from 'react';
import axios from 'axios';
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
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import FileUpload from '@/components/ReusableComponents/FileUpload';

export default function TestimonialForm() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Image change handler
  const handleImageChange = (_name: string, url: string) => {
    setImageUrl(url);
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!imageUrl) {
      toast.error('Please upload a customer image.');
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    setLoading(true);

    try {
      const payload = {
        reviewID: crypto.randomUUID(),
        customerImage: imageUrl,
        customerName: formData.get('customerName'),
        customerProfession: formData.get('customerProfession'),
        rating: Number(formData.get('rating')),
        description: formData.get('description'),
        productID: '67000abc1234567890abcd12',
        status: 'approved',
        // date: new Date().toISOString(), // ⚡ convert Date to ISO string
      };

      const res = await axios.post('/api/v1/testimonial', payload);

      if (res.data?.success) {
        toast.success('Testimonial added successfully!');
        router.push('/general/view/testimonials');
      } else {
        toast.error(res.data?.message || 'Failed to save testimonial');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white pt-5 shadow">
      <SectionTitle text="Testimonial Entry Form" />
      <div className="flex justify-end mb-2">
        <Link
          href="/general/view/testimonials"
          className="text-blue-500 hover:underline">
          backe to Testimonials
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-6 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customer Image */}
          <div>
            <Label htmlFor="customerImage">
              Customer Image <span className="text-red-500">*</span>
            </Label>
            <div className="mt-2">
              <FileUpload
                name="customerImage"
                onUploadComplete={handleImageChange}
                preview={imageUrl || undefined}
              />
            </div>
          </div>

          {/* Other Fields */}
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
