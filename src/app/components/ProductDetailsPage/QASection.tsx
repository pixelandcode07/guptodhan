'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, HelpCircle } from 'lucide-react';
import { Props } from 'react-select';

export type QA = {
  id: number;
  question: string;
  answer: string;
  user: string;
  timeAgo: string;
};

type QASectionProps = {
  data: QA[];
  total: number;
};

export function QASection({ data, total }: QASectionProps) {
  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Questions About this Product ({total})
        </h2>
      </div>

      {/* Input + Button */}
      <div className="flex gap-2 mb-6">
        <Input placeholder="Enter your questions here" />
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          Ask Question
        </Button>
      </div>

      <p className="font-medium mb-4">Question Answered by- ABC Shop</p>

      {/* Q&A List */}
      <div className="space-y-6">
        {data.map(qa => (
          <div key={qa.id} className="space-y-3 border-b pb-4">
            {/* Question */}
            <div className="flex items-start gap-2">
              <HelpCircle className="text-blue-500 w-5 h-5 mt-1" />
              <div>
                <p className="text-gray-800">{qa.question}</p>
                <p className="text-sm text-gray-500">
                  {qa.user} • {qa.timeAgo}
                </p>
              </div>
            </div>
            {/* Answer */}
            <div className="flex items-start gap-2">
              <MessageSquare className="text-blue-500 w-5 h-5 mt-1" />
              <div>
                <p className="text-gray-800">{qa.answer}</p>
                <p className="text-sm text-gray-500">
                  {qa.user} • {qa.timeAgo}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
