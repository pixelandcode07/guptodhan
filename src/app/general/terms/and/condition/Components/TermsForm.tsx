'use client';

import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

interface TermItem {
  _id?: string;
  termsId?: string;
  category?: string;
  description: string;
}

interface TermsFormProps {
  initialData: TermItem[] | null;
}

export default function TermsForm({ initialData }: TermsFormProps) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setDescription(initialData[0].description || '');
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error('Description cannot be empty.');
      return;
    }

    if (!token) {
      toast.error('Authentication failed. Please log in as an admin.');
      return;
    }

    setLoading(true);

    try {
      let res;

      // ✅ যদি _id থাকে, তাহলে update (PATCH)
      if (initialData && initialData[0]?._id) {
        res = await axios.patch(
          `/api/v1/terms-condition/${initialData[0]._id}`,
          {
            termsId: initialData[0].termsId || 'auto-generated-id',
            category: initialData[0].category,
            description,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // ✅ না থাকলে নতুন create (POST)
        res = await axios.post(
          `/api/v1/terms-condition`,
          {
            termsId: 'auto-generated-id',
            category: '64f0b3a1234567890abcdef0', // চাইলে dynamic পাঠাতে পারো
            description,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (res.data.success) {
        toast.success('Terms & Conditions updated successfully!');
      } else {
        toast.error('Operation failed.');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <RichTextEditor value={description} onChange={setDescription} />
      <div className="flex justify-center items-center py-7">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
          {loading ? 'Updating...' : 'Update Terms'}
        </Button>
      </div>
    </>
  );
}
