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

type AboutUsFormProps = {
  initialContent?: string;
};

export default function AboutUsForm({ initialContent = '' }: AboutUsFormProps) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState('1'); // 1 = Active, 0 = Inactive
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    setContent(initialContent);
    setStatus('1');
  };

  const handleDone = async () => {
    setLoading(true);
    try {
      const payload = {
        content,
        status: status === '1' ? 'active' : 'inactive', // backend-friendly value
      };

      // POST request because PATCH is not allowed
      const res = await axios.post(
        'http://localhost:3000/api/v1/about/content',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.success) {
        alert('Information Updated!');
      } else {
        alert('Failed to update information!');
      }
    } catch (error: any) {
      console.error(error);
      alert('Error updating information!');
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
              <SelectItem value="1">Active</SelectItem>
              <SelectItem value="0">Inactive</SelectItem>
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
