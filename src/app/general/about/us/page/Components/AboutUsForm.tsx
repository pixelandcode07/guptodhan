'use client';

import { useState, useEffect } from 'react'; // ✅ useEffect ইম্পোর্ট করুন
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react'; // লোডিং আইকনের জন্য

type AboutData = {
  _id: string;
  aboutContent: string;
  status: 'active' | 'inactive';
};

type AboutUsFormProps = {
  aboutData: AboutData | null; // ✅ null হওয়ার সম্ভাবনা হ্যান্ডেল করা হয়েছে
};

export default function AboutUsForm({ aboutData }: AboutUsFormProps) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  // ✅ FIX: state-এর প্রাথমিক মান খালি রাখা হয়েছে
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [loading, setLoading] = useState(false);

  // ✅ FIX: useEffect ব্যবহার করে props থেকে state সেট করা হচ্ছে
  useEffect(() => {
    if (aboutData) {
      setContent(aboutData.aboutContent);
      setStatus(aboutData.status);
    }
  }, [aboutData]); // aboutData পরিবর্তন হলে এই ইফেক্টটি আবার রান হবে

  const handleCancel = () => {
    if (aboutData) {
      setContent(aboutData.aboutContent);
      setStatus(aboutData.status);
    }
  };

  const handleDone = async () => {
    if (!aboutData?._id) {
      toast.error('Content ID is missing. Cannot update.');
      return;
    }
    if (!token) {
        toast.error("Authentication failed. Please log in again.");
        return;
    }

    setLoading(true);

    try {
      const payload = {
        aboutContent: content,
        status,
      };

      const res = await axios.patch(
        `/api/v1/about/content/${aboutData._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.success) {
        toast.success('Information updated successfully!');
      } else {
        toast.error(res.data.message || 'Failed to update information.');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error updating information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-5 space-y-6">
      <div>
        <p className="text-sm font-semibold mb-2">About Content</p>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            name="status"
            value={status}
            onValueChange={(value: 'active' | 'inactive') => setStatus(value)}
            required>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select One" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-center items-center w-full pt-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleDone} disabled={loading} className="min-w-[100px]">
            {loading ? <Loader2 className="animate-spin" /> : 'Update'}
          </Button>
        </div>
      </div>
    </div>
  );
}