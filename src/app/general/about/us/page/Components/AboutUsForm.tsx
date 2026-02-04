'use client';

import { useState, useEffect } from 'react';
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
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation'; // router রিফ্রেশের জন্য

type AboutData = {
  _id?: string; // Optional করা হলো কারণ শুরুতে ID নাও থাকতে পারে
  aboutContent: string;
  status: 'active' | 'inactive';
};

type AboutUsFormProps = {
  aboutData: AboutData | null;
};

export default function AboutUsForm({ aboutData }: AboutUsFormProps) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const router = useRouter();

  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (aboutData) {
      setContent(aboutData.aboutContent || '');
      setStatus(aboutData.status || 'active');
    }
  }, [aboutData]);

  const handleCancel = () => {
    if (aboutData) {
      setContent(aboutData.aboutContent);
      setStatus(aboutData.status);
    } else {
      setContent('');
      setStatus('active');
    }
  };

  const handleDone = async () => {
    if (!token) {
        toast.error("Authentication failed. Please log in again.");
        return;
    }

    if (!content) {
        toast.error("Content cannot be empty.");
        return;
    }

    setLoading(true);

    try {
      const payload = {
        aboutContent: content,
        status,
      };

      let res;

      // ✅ LOGIC FIX: যদি ID থাকে তবে PATCH, না থাকলে POST (Create)
      if (aboutData?._id) {
        // Update Existing
        res = await axios.patch(
          `/api/v1/about/content/${aboutData._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        // Create New (First Time)
        res = await axios.post(
          `/api/v1/about/content`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      if (res.data.success) {
        toast.success(aboutData?._id ? 'Updated successfully!' : 'Created successfully!');
        router.refresh(); // পেজ রিফ্রেশ করে নতুন ডাটা আনবে
      } else {
        toast.error(res.data.message || 'Operation failed.');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-5 space-y-6 border rounded-lg bg-gray-50/50">
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
            <SelectTrigger id="status" className='bg-white'>
              <SelectValue placeholder="Select One" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-center items-center w-full pt-4 border-t mt-4">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleDone} disabled={loading} className="min-w-[120px] bg-blue-600 hover:bg-blue-700">
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
            {aboutData?._id ? 'Update' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}