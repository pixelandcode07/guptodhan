'use client';

import { useState, useEffect } from 'react';
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
import { toast } from 'sonner';

export default function MessengerChatForm() {
  const [loading, setLoading] = useState(false);
  const [chatStatus, setChatStatus] = useState('0');
  const [messengerLink, setMessengerLink] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/v1/public/integrations');
      const data = await res.json();
      if (data.success) {
        setChatStatus(data.data?.messengerChatEnabled ? '1' : '0');
        setMessengerLink(data.data?.messengerLink || '');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        messengerChatEnabled: chatStatus === '1',
        messengerLink: messengerLink,
      };

      const res = await fetch('/api/v1/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Messenger Chat updated successfully!');
        fetchData();
      } else {
        toast.error(data.message || 'Failed to update');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-pane fade active bg-white rounded-md">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-1">
          <Label htmlFor="messenger_chat_status">Allow Messenger Chat Plugin</Label>
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

        <div className="flex flex-col space-y-1">
          <Label htmlFor="fb_page_id">Messenger Link</Label>
          <Input
            id="fb_page_id"
            value={messengerLink}
            onChange={(e) => setMessengerLink(e.target.value)}
            placeholder="https://m.me/your-page"
          />
        </div>

        <div>
          <Button type="submit" variant="default" disabled={loading}>
            {loading ? 'Updating...' : '✓ Update'}
          </Button>
        </div>
      </form>
    </div>
  );
}