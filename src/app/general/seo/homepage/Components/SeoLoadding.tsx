'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function SeoLoading() {
  return (
    <div className="p-6 space-y-6 opacity-60 blur-[2px] select-none pointer-events-none">
      <div>
        <label className="block text-sm font-medium mb-2">Meta Title</label>
        <Input placeholder="Enter meta title..." className="w-full" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Meta Description
        </label>
        <Textarea placeholder="Write meta description..." rows={4} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Keywords</label>
        <Input placeholder="Add SEO keywords..." className="w-full" />
      </div>

      <div className="flex justify-center items-center pt-4">
        <Button className="w-40">Update SEO Data</Button>
      </div>
    </div>
  );
}
