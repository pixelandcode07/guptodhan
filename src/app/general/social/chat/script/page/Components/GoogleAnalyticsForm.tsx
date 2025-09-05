'use client';

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

export default function GoogleAnalyticsForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Google Analytics:', Object.fromEntries(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="space-y-2 w-full">
        <Label className="w-full">Allow Google Analytic</Label>
        <Select defaultValue="1">
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
        <Label className="w-full">Tracking ID</Label>
        <Input name="trackingId" defaultValue="G-123456" className="w-full" />
      </div>

      <Button type="submit">✓ Update</Button>
    </form>
  );
}
