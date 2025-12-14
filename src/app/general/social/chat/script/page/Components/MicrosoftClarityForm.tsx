'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function MicrosoftClarityForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('1');
  const [clarityId, setClarityId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/v1/public/integrations');
      const data = await res.json();
      if (data.success) {
        setStatus(data.data?.microsoftClarityEnabled ? '1' : '0');
        setClarityId(data.data?.microsoftClarityId || '');
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
        microsoftClarityEnabled: status === '1',
        microsoftClarityId: clarityId,
      };

      const res = await fetch('/api/v1/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Microsoft Clarity updated successfully!');
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
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="space-y-2 w-full">
        <Label className="w-full">Allow Microsoft Clarity</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Enable</SelectItem>
            <SelectItem value="0">Disable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 w-full">
        <Label className="w-full">Clarity Project ID</Label>
        <Input
          value={clarityId}
          onChange={(e) => setClarityId(e.target.value)}
          placeholder="xxxxxxxxxx"
          className="w-full"
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Updating...' : '✓ Update'}
      </Button>
    </form>
  );
}