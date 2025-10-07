// src/app/(your-path)/FAQEditForm.tsx
'use client';

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
import { useState } from 'react';

type FAQEditFormProps = {
  id: number;
  categoryId: string;
  question: string;
  answer: string;
  onSuccess?: () => void; // callback after successful update
};

export default function FAQEditForm({
  id,
  categoryId,
  question: initialQuestion,
  answer: initialAnswer,
  onSuccess,
}: FAQEditFormProps) {
  const [category, setCategory] = useState(categoryId);
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState(initialAnswer);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('category_id', category);
    formData.append('question', question);
    formData.append('answer', answer);

    try {
      const res = await fetch(`http://localhost:3000/api/v1/faq/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        alert('FAQ updated successfully!');
        onSuccess?.(); // trigger parent callback
      } else {
        alert('Failed to update FAQ.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating FAQ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-white shadow rounded p-6">
      <h4 className="text-xl font-semibold mb-6">Edit FAQ</h4>
      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Category */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Label htmlFor="category_id" className="w-full sm:w-1/5">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select
            value={category}
            onValueChange={setCategory}
            required
            className="w-full sm:w-4/5"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select One" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">Orders & Returns</SelectItem>
              <SelectItem value="5">Payment</SelectItem>
              <SelectItem value="3">Shipping Information</SelectItem>
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

        {/* Submit Button */}
        <div className="flex justify-start">
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update FAQ'}
          </Button>
        </div>
      </form>
    </div>
  );
}
