'use client';

import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

interface TermsFormProps {
  initialContent: string;
  termId?: string; // optional for new term
  categoryId?: string; // optional for create
}

export default function TermsForm({ initialContent, termId, categoryId }: TermsFormProps) {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Content cannot be empty.');
      return;
    }

    try {
      setLoading(true);

      let data;
      if (termId) {
        // Update existing term
        const res = await axios.patch(
          `http://localhost:3000/api/v1/terms-condition/${termId}`,
          { description: content },
          { headers: { 'Content-Type': 'application/json' } }
        );
        data = res.data;
      } else {
        // Create new term
        if (!categoryId) {
          toast.error('Category is required to create a new term.');
          return;
        }

        const res = await axios.post(
          `http://localhost:3000/api/v1/terms-condition`,
          { description: content, category: categoryId, termsId: 'auto-generated-id' },
          { headers: { 'Content-Type': 'application/json' } }
        );
        data = res.data;
      }

      if (data.success) {
        toast.success(termId ? 'Term updated successfully!' : 'Term created successfully!');
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
          {loading ? (termId ? 'Updating...' : 'Creating...') : termId ? 'Update Terms' : 'Create Terms'}
        </Button>
      </div>
    </>
  );
}
