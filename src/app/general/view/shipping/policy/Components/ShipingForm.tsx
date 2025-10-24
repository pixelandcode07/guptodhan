'use client';

import React, { useEffect, useState } from 'react';
import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface ShippingPolicyData {
  _id?: string;
  status?: string;
  content: string;
}

interface ShipingFormProps {
  initialData?: ShippingPolicyData;
}

export default function ShipingForm({ initialData }: ShipingFormProps) {
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
      toast.error('Shipping Policy cannot be empty!');
      return;
    }

    setLoading(true);

    try {
      const url = initialData?._id
        ? `/api/v1/shipping-policy/${initialData._id}`
        : '/api/v1/shipping-policy';
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
        toast.success('Shipping Policy updated successfully!');
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Failed to update Shipping Policy.'
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
          {loading ? 'Updating...' : 'Update Shipping Policy'}
        </Button>
      </div>
    </div>
  );
}
