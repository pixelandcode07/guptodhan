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

export default function TawkChatForm() {
  const [loading, setLoading] = useState(false);
  const [chatStatus, setChatStatus] = useState('1');
  const [tawkLink, setTawkLink] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/v1/public/integrations');
      const data = await res.json();
      if (data.success) {
        setChatStatus(data.data?.tawkToEnabled ? '1' : '0');
        setTawkLink(data.data?.tawkToLink || '');
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
        tawkToEnabled: chatStatus === '1',
        tawkToLink: tawkLink,
      };

      const res = await fetch('/api/v1/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Tawk.to Chat updated successfully!');
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
    <div className="tab-pane fade active show bg-white">
      <form className="space-y-4" onSubmit={handleSubmit}>
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

        <div className="flex flex-col space-y-1">
          <Label htmlFor="tawk_chat_link">Tawk.to Direct Chat Link</Label>
          <Input
            id="tawk_chat_link"
            value={tawkLink}
            onChange={(e) => setTawkLink(e.target.value)}
            placeholder="https://embed.tawk.to/..."
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