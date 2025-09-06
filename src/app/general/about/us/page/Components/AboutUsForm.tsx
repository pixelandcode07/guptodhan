'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';

type AboutUsFormProps = {
  initialContent?: string;
};

export default function AboutUsForm({ initialContent = '' }: AboutUsFormProps) {
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState('1');

  const handleCancel = () => {
    setContent(initialContent);
    setStatus('1');
  };

  const handleDone = () => {
    console.log({ content, status });
    alert('Information Updated!');
  };

  return (
    <div className="mt-6 p-5 space-y-6">
      {/* Rich Text Editor */}
      <div>
        <p className="text-xs font-semibold mb-2">About Content</p>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      {/* Status Select */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            name="status"
            value={status}
            onValueChange={setStatus}
            required>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select One" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Active</SelectItem>
              <SelectItem value="0">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center items-center w-full">
        <div className="flex flex-wrap gap-2">
          <Button variant="destructive" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleDone}>Done</Button>
        </div>
      </div>
    </div>
  );
}
