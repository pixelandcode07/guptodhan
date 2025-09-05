'use client';

import { useState } from 'react';
import { RichTextEditor } from '@/components/RichTextEditor/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import SectionTitle from '@/components/ui/SectionTitle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Helper (same logic যেটা editor এ ব্যবহার করছেন)
const plainToHtml = (text: string) => {
  if (!text) return '';
  if (/<[a-z][\s\S]*>/i.test(text)) return text; // already HTML
  return text
    .split('\n')
    .map(line => `<p>${line || '<br>'}</p>`)
    .join('');
};

export default function Page() {
  const [text, setText] = useState(
    `🎯 আমাদের মিশন:

শরীয়তপুরের মানুষকে নিরাপদ, সহজ ও স্মার্ট অনলাইন কেনাকাটার সুবিধা প্রদান করা, যেখানে স্থানীয় বিক্রেতা ও ক্রেতারা একই প্ল্যাটফর্মে যুক্ত হতে পারেন।

🚀 আমাদের ভিশন:

শরীয়তপুরের শীর্ষস্থানীয় অনলাইন মার্কেটপ্লেস হিসেবে গড়ে ওঠা, যেখানে সবার জন্য বিশ্বাসযোগ্য ও সুবিধাজনক কেনাকাটার সুযোগ থাকবে।`
  );

  return (
    <div className="bg-white pt-5 px-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between">
        <SectionTitle text="General Information Form" />
        <div className="flex flex-wrap gap-2">
          <Button variant="destructive">Cancel</Button>
          <Button>Done</Button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 p-5 space-y-6">
        <div>
          <p className="text-xs font-semibold mb-2">About Content</p>
          <RichTextEditor
            value={plainToHtml(text)} // editor এ html পাঠাচ্ছি
            onChange={value => setText(value)} // user input update
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue="1" required>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select One" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Active</SelectItem>
                <SelectItem value="0">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {/* Validation message */}
            <p className="text-sm text-red-500">{/* error message here */}</p>
          </div>
        </div>

        <div className="flex justify-center items-center w-full">
          <div className="flex flex-wrap gap-2">
            <Button variant="destructive">Cancel</Button>
            <Button>Done</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
