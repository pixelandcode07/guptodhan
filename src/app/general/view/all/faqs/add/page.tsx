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
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function FAQCreateForm() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const faqApi = '/api/v1/faq';

  // Load Categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await axios.get(`/api/v1/faq-category`);
        const data = res.data.data;
        setCategories(data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !question || !answer) {
      return toast.error('Please fill all required fields');
    }

    setLoading(true);

    try {
      const payload = {
        faqID: `FAQ-${Date.now()}`,
        category,
        question,
        answer,
        isActive: true,
      };

      const res = await axios.post(faqApi, payload);

      if (res.data?.success) {
        toast.success('FAQ created successfully!');
        router.push('/general/view/all/faqs');
        router.refresh(); // Refresh server components
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
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-6">
                <Button variant="ghost" asChild>
                    <Link href="/general/view/all/faqs" className="flex items-center gap-2 text-gray-600">
                        <ArrowLeft className="w-4 h-4" /> Back to List
                    </Link>
                </Button>
            </div>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                <div className="p-6 border-b bg-gray-50/50">
                    <h4 className="text-xl font-bold text-gray-800">Create New FAQ</h4>
                </div>
                
                <div className="p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Category */}
                        <div className="grid gap-2">
                            <Label htmlFor="category_id">Category <span className="text-red-500">*</span></Label>
                            <Select value={category} onValueChange={setCategory} required>
                                <SelectTrigger className="w-full bg-gray-50/50 h-11">
                                    <SelectValue placeholder={loadingCategories ? "Loading..." : "Select Category"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories && categories.length > 0 ? (
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
                                placeholder="Enter the question here"
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
                                placeholder="Provide the detailed answer..."
                                value={answer}
                                onChange={e => setAnswer(e.target.value)}
                                className="w-full bg-gray-50/50 resize-none"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex justify-end">
                            <Button type="submit" disabled={loading} className="w-full sm:w-auto min-w-[150px]">
                                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : 'Create FAQ'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
}