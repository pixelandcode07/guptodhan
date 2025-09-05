'use client';

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

export default function GoogleTagManagerForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Form Data:', Object.fromEntries(formData));
    // You can replace console.log with a fetch POST request if needed
  };

  return (
    <div className="tab-pane fade active show w-full">
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        {/* Google Tag Manager Status */}
        <div className="space-y-2 w-full">
          <Label htmlFor="google_tag_manager_status">
            Allow Google Tag Manager
          </Label>
          <Select name="google_tag_manager_status" defaultValue="1">
            <SelectTrigger id="google_tag_manager_status" className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Enable Google Tag Manager</SelectItem>
              <SelectItem value="0">Disable Google Tag Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Google Tag Manager ID */}
        <div className="space-y-2 w-full">
          <Label htmlFor="google_tag_manager_id">Google Tag Manager ID</Label>
          <Input
            type="text"
            id="google_tag_manager_id"
            name="google_tag_manager_id"
            defaultValue="GTM-MNXFTXSL"
            placeholder="ex. GTM-546FMKZS"
            className="w-full"
          />
        </div>

        {/* Submit Button */}
        <div className="mb-2 w-full">
          <Button type="submit">✓ Update</Button>
        </div>
      </form>
    </div>
  );
}
