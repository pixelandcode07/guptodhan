'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BannerPosition, TextPosition } from './types';

type Props = {
  bannerPosition: BannerPosition | '';
  setBannerPosition: (v: BannerPosition | '') => void;
  textPosition: TextPosition | '';
  setTextPosition: (v: TextPosition | '') => void;
  bannerLink: string;
  setBannerLink: (v: string) => void;
  isValidUrl?: (url: string) => boolean;
};

export default function TopRow({ bannerPosition, setBannerPosition, textPosition, setTextPosition, bannerLink, setBannerLink, isValidUrl }: Props) {
  const isBannerLinkValid = bannerLink.trim() === '' || (isValidUrl ? isValidUrl(bannerLink) : true);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>Banner Position</Label>
        <Select value={bannerPosition || undefined} onValueChange={(v) => setBannerPosition(v as BannerPosition)}>
          <SelectTrigger className="h-10 w-full">
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
        <Label>Banner Link</Label>
        <Input 
          className={`h-10 w-full ${!isBannerLinkValid ? 'border-red-500 focus:border-red-500' : ''}`} 
          value={bannerLink} 
          onChange={(e) => setBannerLink(e.target.value)} 
          placeholder="https://example.com" 
        />
        {!isBannerLinkValid && (
          <p className="text-xs text-red-500">Please enter a valid URL</p>
        )}
      </div>
    </div>
  );
}


