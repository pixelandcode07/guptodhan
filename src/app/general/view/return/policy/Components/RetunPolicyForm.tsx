'use client';

import React, { useEffect, useState } from 'react';
import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface ReturnPolicyData {
  _id?: string;
  status?: string;
  content: string;
}

interface ReturnPolicyFormProps {
  initialData?: ReturnPolicyData;
}

export default function ReturnPolicyForm({
  initialData,
}: ReturnPolicyFormProps) {
  const [content, setContent] = useState(initialData?.content || '');
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

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
      toast.error('Return Policy cannot be empty!');
      return;
    }

    const adminRole = (session?.user as any)?.role;
    if (!adminRole || adminRole !== 'admin') {
      toast.error('Only admins can update Privacy Policy!');
      return;
    }

    setLoading(true);

    try {
      const url = initialData?._id
        ? '/api/v1/return-policy'
        : '/api/v1/return-policy';

      const method = initialData?._id ? 'PATCH' : 'POST';

      // const url = initialData?._id
      //   ? `/api/v1/return-policy/${initialData._id}`
      //   : '/api/v1/return-policy';

      // const method = initialData?._id ? 'PATCH' : 'POST';

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
          'X-User-Role': adminRole,
          'X-User-Id': (session?.user as any)?.id || '',
        },
      });

      if (res.data.success) {
        toast.success('Return Policy updated successfully!');
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to update Return Policy.'
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
          {loading ? 'Updating...' : 'Update Return Policy'}
        </Button>
      </div>
    </div>
  );
}
