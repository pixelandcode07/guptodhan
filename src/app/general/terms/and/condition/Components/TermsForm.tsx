'use client';

import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';

// props-এর জন্য টাইপ ডিফাইন করা হয়েছে
interface TermsFormProps {
  initialData: {
    _id?: string;
    content: string;
  } | null;
}

export default function TermsForm({ initialData }: TermsFormProps) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken; // সেশন থেকে টোকেন নেওয়া হচ্ছে

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // useEffect এখন props থেকে state সেট করবে
  useEffect(() => {
    if (initialData) {
      setContent(initialData.content || '');
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Content cannot be empty.');
      return;
    }
    if (!token) {
        toast.error("Authentication failed. Please log in as an admin.");
        return;
    }

    setLoading(true);
    try {
      // ✅ POST API ব্যবহার করে ডেটা তৈরি বা আপডেট করা হচ্ছে
      const res = await axios.post(
        `/api/v1/terms-condition`,
        { content },
        { headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          } 
        }
      );
      
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
      <RichTextEditor value={content} onChange={setContent} />
      <div className="flex justify-center items-center py-7">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
          {loading ? 'Updating...' : 'Update Terms'}
        </Button>
      </div>
    </>
  );
}