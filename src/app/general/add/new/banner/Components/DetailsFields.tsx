'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  subTitle: string;
  setSubTitle: (v: string) => void;
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
};

export default function DetailsFields({ subTitle, setSubTitle, title, setTitle, description, setDescription }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Sub Title</Label>
        <Input value={subTitle} onChange={(e) => setSubTitle(e.target.value)} placeholder="Write Sub Title Here" />
      </div>
      <div className="space-y-2">
        <Label>Banner Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Write Title Here" />
      </div>
      <div className="space-y-2">
        <Label>Banner Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write Description Here" />
      </div>
    </div>
  );
}


