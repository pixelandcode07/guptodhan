'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AddFactPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    const payload = {
      factTitle: formData.get('factTitle'),
      factCount: Number(formData.get('factCount')),
      shortDescription: formData.get('shortDescription'),
      status: formData.get('status'),
    };

    try {
      const res = await axios.post(
        'http://localhost:3000/api/v1/about/facts',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        console.log('Fact created successfully!');
        router.push('/general/view/facts/add');
      } else {
        console.error('Failed to create fact');
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-neutral-900 shadow-md rounded-2xl p-6">
      <h4 className="text-xl font-semibold mb-4">Create Fact</h4>

      <form action={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fact Title */}
          <div className="space-y-2">
            <Label htmlFor="factTitle">
              Fact Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="factTitle"
              name="factTitle"
              type="text"
              placeholder="Products For Sale"
              required
            />
          </div>

          {/* Fact Count */}
          <div className="space-y-2">
            <Label htmlFor="factCount">Fact Count</Label>
            <Input
              id="factCount"
              name="factCount"
              type="number"
              placeholder="15"
            />
          </div>
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <Label htmlFor="shortDescription">Short Description</Label>
          <Textarea
            id="shortDescription"
            name="shortDescription"
            rows={3}
            maxLength={250}
            placeholder="Short Description"
          />
        </div>

        {/* Status */}
        <div className="w-40 space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status">
            <SelectTrigger id="status">
              <SelectValue placeholder="Select One" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
}
