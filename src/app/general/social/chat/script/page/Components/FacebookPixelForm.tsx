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

export default function FacebookPixelForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Facebook Pixel Form Data:', Object.fromEntries(formData));
    // Replace console.log with actual POST request if needed
  };

  return (
    <div className="tab-pane fade active w-full">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full"
        encType="multipart/form-data">
        {/* Facebook Pixel Status */}
        <div className="space-y-2 w-full">
          <Label htmlFor="fb_pixel_status">Allow Facebook Pixel</Label>
          <Select name="fb_pixel_status" defaultValue="1">
            <SelectTrigger id="fb_pixel_status" className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Enable Facebook Pixel</SelectItem>
              <SelectItem value="0">Disable Facebook Pixel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Facebook App ID */}
        <div className="space-y-2 w-full">
          <Label htmlFor="fb_pixel_app_id">Facebook App Id</Label>
          <Input
            type="text"
            id="fb_pixel_app_id"
            name="fb_pixel_app_id"
            defaultValue={1492891321697241}
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
