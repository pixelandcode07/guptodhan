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

    const adminRole = (session?.user as any)?.role;
    if (!adminRole || adminRole !== 'admin') {
      toast.error('Only admins can update Privacy Policy!');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        '/api/v1/shipping-policy',
        {
          status: initialData?.status || 'active',
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-User-Role': adminRole,
            'X-User-Id': (session?.user as any)?.id || '',
          },
        }
      );

      if (res.data.success) {
        toast.success('Shipping Policy updated successfully!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update Shipping Policy.');
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
