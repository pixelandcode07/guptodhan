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

export default function CrispChatForm() {
  const [chatStatus, setChatStatus] = useState('1');
  const [websiteId, setWebsiteId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      crisp_chat_status: chatStatus,
      crisp_website_id: websiteId,
    };

    console.log('Crisp Chat Form Data:', formData);
  };

  return (
    <div className="tab-pane fade active  bg-white shadow rmx-auto">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Allow Crisp Live Chat */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="crisp_chat_status">Allow Crisp Live Chat</Label>
          <Select value={chatStatus} onValueChange={setChatStatus}>
            <SelectTrigger id="crisp_chat_status">
              <SelectValue placeholder="Select Option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Enable Crisp Live Chat</SelectItem>
              <SelectItem value="0">Disable Crisp Live Chat</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Crisp Website ID */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="crisp_website_id">Crisp Website_ID</Label>
          <Input
            id="crisp_website_id"
            value={websiteId}
            onChange={e => setWebsiteId(e.target.value)}
            placeholder="ex. 7b6ec17d-256a-41e8-9732-17ff58bd515t"
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
