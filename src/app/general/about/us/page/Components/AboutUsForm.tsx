'use client';

import { useState } from 'react';
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

type AboutData = {
  _id: string;
  aboutContent: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type AboutUsFormProps = {
  aboutData: AboutData;
};

export default function AboutUsForm({ aboutData }: AboutUsFormProps) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const [content, setContent] = useState(aboutData.aboutContent);
  const [status, setStatus] = useState(aboutData.status); // 'active' or 'inactive'
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    setContent(aboutData.aboutContent);
    setStatus(aboutData.status);
  };

  const handleDone = async () => {
    if (!aboutData._id) {
      toast.error('Content ID is missing.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        aboutContent: content,
        status, // already 'active' or 'inactive'
      };

      const res = await axios.patch(
        `http://localhost:3000/api/v1/about/content/${aboutData._id}`,
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
        toast.error('Failed to update information.');
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Error updating information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-5 space-y-6">
      {/* Rich Text Editor */}
      <div>
        <p className="text-xs font-semibold mb-2">About Content</p>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      {/* Status Select */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            name="status"
            value={status}
            onValueChange={setStatus}
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

      {/* Buttons */}
      <div className="flex justify-center items-center w-full">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleDone} disabled={loading}>
            {loading ? 'Updating...' : 'Done'}
          </Button>
        </div>
      </div>
    </div>
  );
}
