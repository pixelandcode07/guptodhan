'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import axios from 'axios';

export default function FAQCreateForm() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const categoriesApi = '/api/v1/faq-category';
  const faqApi = '/api/v1/faq';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(categoriesApi);
        const data = res.data.data || res.data;
        setCategories(data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !question || !answer) {
      return toast.error('Please fill all required fields');
    }

    setLoading(true);

    try {
      const payload = {
        faqID: `FAQ-${Date.now()}`,
        category, // ✅ Backend expects category _id
        question,
        answer,
        isActive: true,
      };

      const res = await axios.post(faqApi, payload);

      if (res.data?.success) {
        toast.success('FAQ created successfully!');
        setCategory('');
        setQuestion('');
        setAnswer('');
        router.push('/general/view/all/faqs');
      } else {
        toast.error(res.data?.message || 'Failed to create FAQ');
      }
    } catch (error: any) {
      console.error('FAQ create error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-white shadow rounded p-6">
      <h4 className="text-xl font-semibold mb-6">FAQ Create Form</h4>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Label htmlFor="category_id" className="w-full sm:w-1/5">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select
            value={category}
            onValueChange={setCategory}
            required
            className="w-full sm:w-4/5">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select One" />
            </SelectTrigger>
            <SelectContent>
              {categories.length > 0 ? (
                categories.map(cat => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name || cat.categoryName} {/* Backend name */}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled value="">
                  No categories found
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Question */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Label htmlFor="question" className="w-full sm:w-1/5">
            Question <span className="text-red-500">*</span>
          </Label>
          <Input
            id="question"
            type="text"
            placeholder="Question"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            className="w-full sm:w-4/5"
            required
          />
        </div>

        {/* Answer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-start gap-2">
          <Label htmlFor="answer" className="w-full sm:w-1/5">
            Answer <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="answer"
            rows={10}
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            className="w-full sm:w-4/5"
            required
          />
        </div>

        {/* Submit */}
        <div className="flex justify-start">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Create FAQ'}
          </Button>
        </div>
      </form>
    </div>
  );
}
