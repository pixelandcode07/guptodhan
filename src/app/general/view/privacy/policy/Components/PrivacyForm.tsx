'use client';

import React, { useEffect, useState } from 'react';
import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface PrivacyPolicyData {
  _id?: string;
  status?: string;
  content: string;
}

interface PrivacyFormProps {
  initialData?: PrivacyPolicyData;
}

export default function PrivacyForm({ initialData }: PrivacyFormProps) {
  const [content, setContent] = useState(initialData?.content || '');
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  console.log('Initial Privacy Policy Data Token:', token);

  useEffect(() => {
    if (initialData) {
      setContent(initialData.content || '');
    }
  }, [initialData]);

  const handleUpdate = async () => {
    if (!token) {
      toast.error('You are not authorized. Please log in.');
      return;
    }

    if (!content.trim()) {
      toast.error('Privacy Policy cannot be empty!');
      return;
    }

    setLoading(true);

    try {
      const url = initialData?._id
        ? `/api/v1/privacy-policy/${initialData._id}`
        : '/api/v1/privacy-policy';
      const method = initialData?._id ? 'PATCH' : 'POST';

      const payload = {
        status: initialData?.status || 'active',
        content,
      };

      const res = await axios({
        method,
        url,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.data.success) {
        toast.success('Privacy Policy updated successfully!');
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to update Privacy Policy.'
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <RichTextEditor value={content} onChange={setContent} />
      <div className="flex justify-center items-center py-7">
        <Button onClick={handleUpdate} disabled={loading}>
          {loading ? 'Updating...' : 'Update Privacy Policy'}
        </Button>
      </div>
    </div>
  );
}
