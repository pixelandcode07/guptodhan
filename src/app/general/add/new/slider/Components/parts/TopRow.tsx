'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TextPosition } from '../SliderForm';

type Props = {
  textPosition: TextPosition | '';
  setTextPosition: (v: TextPosition | '') => void;
  sliderLink: string;
  setSliderLink: (v: string) => void;
};

export default function TopRow({ textPosition, setTextPosition, sliderLink, setSliderLink }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Text Position</Label>
        <Select value={textPosition || undefined} onValueChange={(v) => setTextPosition(v as TextPosition)}>
          <SelectTrigger className="h-10 w-full">
            <SelectValue placeholder="Select Option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Left">Left</SelectItem>
            <SelectItem value="Right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Slider Link</Label>
        <Input type="url" className="h-10 w-full" value={sliderLink} onChange={(e) => setSliderLink(e.target.value)} placeholder="https://" />
      </div>
    </div>
  );
}


