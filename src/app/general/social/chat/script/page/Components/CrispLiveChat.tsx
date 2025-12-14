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

export default function CrispChatForm() {
  const [loading, setLoading] = useState(false);
  const [chatStatus, setChatStatus] = useState('1');
  const [websiteId, setWebsiteId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/v1/public/integrations');
      const data = await res.json();
      if (data.success) {
        setChatStatus(data.data?.crispChatEnabled ? '1' : '0');
        setWebsiteId(data.data?.crispWebsiteId || '');
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
        crispChatEnabled: chatStatus === '1',
        crispWebsiteId: websiteId,
      };

      const res = await fetch('/api/v1/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Crisp Chat updated successfully!');
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
    <div className="tab-pane fade active bg-white shadow mx-auto">
      <form className="space-y-4" onSubmit={handleSubmit}>
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

        <div className="flex flex-col space-y-1">
          <Label htmlFor="crisp_website_id">Crisp Website ID</Label>
          <Input
            id="crisp_website_id"
            value={websiteId}
            onChange={(e) => setWebsiteId(e.target.value)}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
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