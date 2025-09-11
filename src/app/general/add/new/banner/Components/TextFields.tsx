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
  buttonText: string;
  setButtonText: (v: string) => void;
};

export default function TextFields({ subTitle, setSubTitle, title, setTitle, description, setDescription, buttonText, setButtonText }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4">
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
      <div className="space-y-2">
        <Label>Button Text</Label>
        <Input value={buttonText} onChange={(e) => setButtonText(e.target.value)} placeholder="ex. New Collection" />
      </div>
    </div>
  );
}


