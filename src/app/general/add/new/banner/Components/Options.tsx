'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BannerPosition, TextPosition } from './types';

type Props = {
  bannerPosition: BannerPosition | '';
  setBannerPosition: (value: BannerPosition | '') => void;
  textPosition: TextPosition | '';
  setTextPosition: (value: TextPosition | '') => void;
};

export default function Options({ bannerPosition, setBannerPosition, textPosition, setTextPosition }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Banner Position</Label>
        <Select value={bannerPosition || undefined} onValueChange={(v) => setBannerPosition(v as BannerPosition)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Top (Homepage)">Top (Homepage)</SelectItem>
            <SelectItem value="Left (Homepage)">Left (Homepage)</SelectItem>
            <SelectItem value="Right (Homepage)">Right (Homepage)</SelectItem>
            <SelectItem value="Middle (Homepage)">Middle (Homepage)</SelectItem>
            <SelectItem value="Bottom (Homepage)">Bottom (Homepage)</SelectItem>
            <SelectItem value="Top (ShopPage)">Top (ShopPage)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Text Position</Label>
        <Select value={textPosition || undefined} onValueChange={(v) => setTextPosition(v as TextPosition)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Left">Left</SelectItem>
            <SelectItem value="Right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}


