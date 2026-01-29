'use client';

import { useState, useEffect, Suspense } from 'react';
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
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Loadding from '../Components/Loadding'; // Using your new Skeleton

function EditFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('_id');

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
        // Load categories and FAQs in parallel
        const [catRes, faqRes] = await Promise.all([
            axios.get(categoryApi),
            axios.get(faqApi)
        ]);

        setCategories(catRes.data?.data || []);

        const allFaqs = faqRes.data?.data || [];
        const singleFaq = allFaqs.find((item: any) => item._id === id);

        if (singleFaq) {
          setQuestion(singleFaq.question || '');
          setAnswer(singleFaq.answer || '');
          // Handle population vs string ID
          const catId = typeof singleFaq.category === 'object' ? singleFaq.category._id : singleFaq.category;
          setCategory(catId || '');
        } else {
          toast.error('FAQ not found');
          router.push('/general/view/all/faqs');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Failed to load FAQ data');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id, router]);

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
        router.refresh();
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
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        <div className="p-6 border-b bg-gray-50/50">
            <h4 className="text-xl font-bold text-gray-800">Edit FAQ</h4>
        </div>
        
        <div className="p-6 md:p-8">
            <form onSubmit={handleUpdate} className="space-y-6">
                
                {/* Category */}
                <div className="grid gap-2">
                    <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                    <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger className="w-full bg-gray-50/50 h-11">
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
                                <SelectItem disabled value="no-cat">No categories found</SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* Question */}
                <div className="grid gap-2">
                    <Label htmlFor="question">Question <span className="text-red-500">*</span></Label>
                    <Input
                        id="question"
                        type="text"
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        className="w-full bg-gray-50/50 h-11"
                        required
                    />
                </div>

                {/* Answer */}
                <div className="grid gap-2">
                    <Label htmlFor="answer">Answer <span className="text-red-500">*</span></Label>
                    <Textarea
                        id="answer"
                        rows={6}
                        value={answer}
                        onChange={e => setAnswer(e.target.value)}
                        className="w-full bg-gray-50/50 resize-none"
                        required
                    />
                </div>

                {/* Submit Button */}
                <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={loading} className="w-full sm:w-auto min-w-[150px]">
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Updating...</> : 'Update FAQ'}
                    </Button>
                </div>
            </form>
        </div>
    </div>
  );
}

// Wrapper for Suspense
export default function FAQEditPage() {
    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Button variant="ghost" asChild>
                        <Link href="/general/view/all/faqs" className="flex items-center gap-2 text-gray-600">
                            <ArrowLeft className="w-4 h-4" /> Back to List
                        </Link>
                    </Button>
                </div>
                <Suspense fallback={<Loadding />}>
                    <EditFormContent />
                </Suspense>
            </div>
        </div>
    );
}