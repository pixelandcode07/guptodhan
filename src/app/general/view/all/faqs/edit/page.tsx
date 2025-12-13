'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
import Loadding from '../Components/Loadding';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export default function FAQEditForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('_id'); // ✅ URL থেকে ID নিচ্ছে

  const [categories, setCategories] = useState<any[]>([]);
  const [category, setCategory] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const faqApi = `/api/v1/faq`;
  const categoryApi = `/api/v1/faq-category`;

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        // 🔹 Load all categories
        const catRes = await axios.get(categoryApi);
        setCategories(catRes.data?.data || []);

        // 🔹 Get all FAQs then filter by ID
        const faqRes = await axios.get(faqApi);
        const allFaqs = faqRes.data?.data || [];
        const singleFaq = allFaqs.find((item: any) => item._id === id);

        if (singleFaq) {
          setQuestion(singleFaq.question || '');
          setAnswer(singleFaq.answer || '');
          setCategory(singleFaq.category?._id || singleFaq.category || '');
        } else {
          toast.error('FAQ not found');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to load FAQ data');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id]);

  // ✅ Update FAQ
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !question || !answer)
      return toast.error('All fields are required');

    setLoading(true);
    try {
      const payload = { category, question, answer };

      const res = await axios.patch(`${faqApi}/${id}`, payload);

      if (res.data?.success) {
        toast.success('FAQ updated successfully!');
        router.push('/general/view/all/faqs');
      } else {
        toast.error(res.data?.message || 'Update failed');
      }
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <Loadding />;
  }

  return (
    <div className="card bg-white shadow rounded p-6">
      <h4 className="text-xl font-semibold mb-6">Edit FAQ</h4>
      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Category */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Label htmlFor="category" className="w-full sm:w-1/5">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select
            value={category}
            onValueChange={setCategory}
            required
            className="w-full sm:w-4/5">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.length > 0 ? (
                categories.map(cat => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name || cat.categoryName}
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
            placeholder="Enter question"
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
            rows={8}
            placeholder="Write the answer..."
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            className="w-full sm:w-4/5"
            required
          />
        </div>

        {/* Submit */}
        <div className="flex justify-start">
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update FAQ'}
          </Button>
        </div>
      </form>
    </div>
  );
}
