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

export default function MessengerChatForm() {
  const [chatStatus, setChatStatus] = useState('0');
  const [messengerLink, setMessengerLink] = useState('https://m.me');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      messenger_chat_status: chatStatus,
      fb_page_id: messengerLink,
    };

    console.log('Form Data:', formData);
  };

  return (
    <div className="tab-pane fade active  bg-white rounded-md">
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Allow Messenger Chat Plugin */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="tawk_chat_status">Allow Messenger Chat Plugin</Label>
          <Select value={chatStatus} onValueChange={setChatStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select Option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Enable Messenger Chat Plugin</SelectItem>
              <SelectItem value="0">Disable Messenger Chat Plugin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Messenger Link */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="fb_page_id">Messenger Link</Label>
          <Input
            id="fb_page_id"
            value={messengerLink}
            onChange={e => setMessengerLink(e.target.value)}
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
