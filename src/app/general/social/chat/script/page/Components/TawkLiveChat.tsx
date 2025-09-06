'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TawkChatForm() {
  const [chatStatus, setChatStatus] = useState('1');
  const [tawkLink, setTawkLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      tawk_chat_status: chatStatus,
      tawk_chat_link: tawkLink,
    };

    console.log('Form Data:', formData);
  };

  return (
    <div className="tab-pane fade active show bg-white  ">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Allow Tawk.to Live Chat */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="tawk_chat_status">Allow Tawk.to Live Chat</Label>
          <Select value={chatStatus} onValueChange={setChatStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select Option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Enable Tawk.to Live Chat</SelectItem>
              <SelectItem value="0">Disable Tawk.to Live Chat</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tawk.to Direct Chat Link */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="tawk_chat_link">Tawk.to Direct Chat Link</Label>
          <Input
            id="tawk_chat_link"
            value={tawkLink}
            onChange={e => setTawkLink(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div>
          <Button type="submit" variant="default">
            ✓ Update
          </Button>
        </div>
      </form>
    </div>
  );
}
