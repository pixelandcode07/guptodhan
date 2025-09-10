'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
  bannerLink: string;
  setBannerLink: (v: string) => void;
  buttonLink: string;
  setButtonLink: (v: string) => void;
};

export default function Links({ bannerLink, setBannerLink, buttonLink, setButtonLink }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Banner Link</Label>
        <Input value={bannerLink} onChange={(e) => setBannerLink(e.target.value)} placeholder="https://" />
      </div>
      <div className="space-y-2">
        <Label>Button link</Label>
        <Input value={buttonLink} onChange={(e) => setButtonLink(e.target.value)} placeholder="https://" />
      </div>
    </div>
  );
}


