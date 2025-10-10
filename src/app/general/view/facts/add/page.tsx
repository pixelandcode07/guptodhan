/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { toast } from 'sonner';
import SectionTitle from '@/components/ui/SectionTitle';

export default function AddFactPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'active' | 'inactive'>('active'); // ✅ default active

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      factTitle: formData.get('factTitle'),
      factCount: Number(formData.get('factCount')),
      shortDescription: formData.get('shortDescription'),
      status: status, // ✅ always use selected state
    };

    console.log('🚀 Sending payload:', payload);

    try {
      const res = await axios.post('/api/v1/about/facts', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success(' Fact created successfully!');
        router.push('/general/view/facts');
      } else {
        toast.error(' Failed to create fact');
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(' Something went wrong while saving');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto bg-white dark:bg-neutral-900 shadow-md rounded-2xl pt-6">
      <SectionTitle text="Create Fact" />

      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        {/* Fact Title + Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="space-y-2">
            <Label htmlFor="factCount">Fact Count</Label>
            <Input
              id="factCount"
              name="factCount"
              type="number"
              placeholder="15"
              required
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

        {/* Status Select */}
        <div className="w-40 space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={status}
            onValueChange={val => setStatus(val as 'active' | 'inactive')}>
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
