'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircleQuestion, MessageCircle } from 'lucide-react';
import { ProductQAAdminReply } from './ProductQAAdminReply';

interface QAItem {
  _id?: string;
  qaId?: string;
  productId?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userImage?: string;
  question?: string;
  createdAt?: string;
  status?: string;
  answer?: {
    answeredByName?: string;
    answeredByEmail?: string;
    answerText?: string;
    createdAt?: string;
  };
}

interface ProductQASectionProps {
  productId: string;
  initialQA?: QAItem[];
}

type SessionUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

type SessionWithToken = {
  accessToken?: string;
  user?: SessionUser;
};

export const ProductQASection = ({
  productId,
  initialQA = [],
}: ProductQASectionProps) => {
  const { data: session } = useSession();
  const sessionData = session as SessionWithToken | null;
  const token = sessionData?.accessToken;
  const user = sessionData?.user;
  const userRole = (sessionData?.user as (SessionUser & { role?: string }))?.role;
  const isAdmin = userRole === 'admin';

  const [items, setItems] = useState<QAItem[]>(initialQA);
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingQaId, setEditingQaId] = useState<string | null>(null);

  const questionCount = useMemo(() => items.length, [items.length]);

  const fetchQA = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/v1/product-qna/product/${productId}`
      );
      const data = Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      setItems(data);
    } catch (error) {
      console.error('Failed to load product Q&A', error);
      toast.error('Failed to load questions.');
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchQA();
  }, [fetchQA]);

  const handleSubmit = async () => {
    if (!question.trim()) {
      toast.error('Please enter your question.');
      return;
    }

    if (!user?.id || !token) {
      toast.error('Please sign in to ask a question.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        qaId: `QA-${Date.now()}`,
        productId,
        userId: user.id,
        userName: user.name || user.email || 'Customer',
        userEmail: user.email || 'unknown@guptodhon.com',
        userImage: user.image || undefined,
        question: question.trim(),
      };

      const response = await axios.post('/api/v1/product-qna', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const created = response.data?.data;
      if (created) {
        setItems((prev) => [created, ...prev]);
      } else {
        fetchQA();
      }
      setQuestion('');
      toast.success('Question submitted! Our team will respond soon.');
    } catch (error: unknown) {
      console.error('Failed to submit question', error);
      const axiosMessage =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message;
      const message = axiosMessage || 'Failed to submit your question.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Questions About this Product ({questionCount})
          </h3>
          <p className="text-sm text-gray-500">
            Have a question? Ask and we&apos;ll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Enter your question here"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="h-12 flex-1"
          disabled={isSubmitting}
        />
        <Button
          className="h-12 sm:w-40"
          onClick={handleSubmit}
          disabled={isSubmitting || !question.trim()}
        >
          {isSubmitting ? 'Submitting...' : 'Ask Question'}
        </Button>
      </div>

      {isLoading ? (
        <Card className="p-6 text-center text-gray-500">
          Loading questions...
        </Card>
      ) : items.length === 0 ? (
        <Card className="p-6 text-center text-gray-500">
          No questions yet. Be the first to ask!
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((qa) => (
            <div
              key={qa._id || qa.qaId}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <MessageCircleQuestion className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{qa.question}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {qa.userName || 'Customer'} •{' '}
                    {qa.createdAt
                      ? new Date(qa.createdAt).toLocaleDateString()
                      : 'Just now'}
                  </p>

                  {qa.answer?.answerText && (
                    <div className="mt-4 flex gap-3 rounded-xl bg-gray-50 p-3">
                      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <MessageCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {qa.answer.answerText}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Answered by {qa.answer.answeredByName || 'Support Team'}
                        </p>
                      </div>
                    </div>
                  )}
                  {isAdmin && qa._id && (
                    <div className="mt-4 space-y-2">
                      {editingQaId === qa._id || !qa.answer?.answerText ? (
                        <ProductQAAdminReply
                          qaId={qa._id}
                          initialAnswer={qa.answer?.answerText}
                          token={token}
                          adminName={user?.name}
                          adminEmail={user?.email}
                          onSuccess={(answerText) => {
                            setItems((prev) =>
                              prev.map((item) =>
                                item._id === qa._id
                                  ? {
                                      ...item,
                                      answer: {
                                        ...(item.answer || {}),
                                        answerText,
                                        answeredByName: user?.name || 'Admin',
                                      },
                                    }
                                  : item
                              )
                            );
                            setEditingQaId(null);
                          }}
                          onCancel={() => setEditingQaId(null)}
                        />
                      ) : (
                        <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
                          <p className="text-sm text-gray-600">
                            You have replied to this question. Need to update your answer?
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-fit"
                            onClick={() => setEditingQaId(qa._id!)}
                          >
                            Edit Reply
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

