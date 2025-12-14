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

export default function FacebookPixelForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('1');
  const [pixelId, setPixelId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/v1/public/integrations');
      const data = await res.json();
      if (data.success) {
        setStatus(data.data?.facebookPixelEnabled ? '1' : '0');
        setPixelId(data.data?.facebookPixelId || '');
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
        facebookPixelEnabled: status === '1',
        facebookPixelId: pixelId,
      };

      const res = await fetch('/api/v1/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Facebook Pixel updated successfully!');
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
    <div className="tab-pane fade active w-full">
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div className="space-y-2 w-full">
          <Label htmlFor="fb_pixel_status">Allow Facebook Pixel</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="fb_pixel_status" className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Enable Facebook Pixel</SelectItem>
              <SelectItem value="0">Disable Facebook Pixel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="fb_pixel_app_id">Facebook Pixel ID</Label>
          <Input
            type="text"
            id="fb_pixel_app_id"
            value={pixelId}
            onChange={(e) => setPixelId(e.target.value)}
            placeholder="1492891321697241"
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