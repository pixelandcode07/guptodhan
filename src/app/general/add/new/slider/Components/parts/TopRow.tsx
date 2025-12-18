'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TextPosition } from '../SliderForm';

// ✅ Props টাইপ সঠিকভাবে সংজ্ঞায়িত
type Props = {
  textPosition: TextPosition | '';
  setTextPosition: (v: TextPosition | '') => void;
  sliderLink: string;
  setSliderLink: (v: string) => void;
};

export default function TopRow({ 
  textPosition, 
  setTextPosition, 
  sliderLink, 
  setSliderLink 
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Text Position Selector */}
      <div className="space-y-2">
        <Label className="font-semibold">Text Position</Label>
        <Select 
          value={textPosition || undefined} 
          onValueChange={(v) => setTextPosition(v as TextPosition)}
        >
          <SelectTrigger className="h-10 w-full bg-white border-2">
            <SelectValue placeholder="Select Position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Left">⬅️ Left</SelectItem>
            <SelectItem value="Right">➡️ Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Slider Link Input */}
      <div className="space-y-2">
        <Label className="font-semibold">Slider Link (Web)</Label>
        <Input 
          type="url" 
          className="h-10 w-full bg-white border-2" 
          value={sliderLink || ''} 
          onChange={(e) => setSliderLink(e.target.value)} 
          placeholder="https://example.com" 
        />
      </div>
    </div>
  );
}