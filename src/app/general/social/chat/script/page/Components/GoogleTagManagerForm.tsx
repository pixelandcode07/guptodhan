'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function GoogleTagManagerForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('1');
  const [gtmId, setGtmId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/v1/public/integrations');
      const data = await res.json();
      if (data.success) {
        setStatus(data.data?.googleTagManagerEnabled ? '1' : '0');
        setGtmId(data.data?.gtmId || '');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        googleTagManagerEnabled: status === '1',
        gtmId: gtmId,
      };

      const res = await fetch('/api/v1/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Google Tag Manager updated successfully!');
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
    <div className="tab-pane fade active show w-full">
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div className="space-y-2 w-full">
          <Label htmlFor="google_tag_manager_status">
            Allow Google Tag Manager
          </Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="google_tag_manager_status" className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Enable Google Tag Manager</SelectItem>
              <SelectItem value="0">Disable Google Tag Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="google_tag_manager_id">Google Tag Manager ID</Label>
          <Input
            type="text"
            id="google_tag_manager_id"
            value={gtmId}
            onChange={(e) => setGtmId(e.target.value)}
            placeholder="GTM-XXXXXXX"
            className="w-full"
          />
        </div>

        <div className="mb-2 w-full">
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : '✓ Update'}
          </Button>
        </div>
      </form>
    </div>
  );
}