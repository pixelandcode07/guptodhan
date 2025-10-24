'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
  buttonText: string;
  setButtonText: (v: string) => void;
  buttonLink: string;
  setButtonLink: (v: string) => void;
  isValidUrl?: (url: string) => boolean;
};

export default function ButtonRow({ buttonText, setButtonText, buttonLink, setButtonLink, isValidUrl }: Props) {
  const isButtonLinkValid = buttonLink.trim() === '' || (isValidUrl ? isValidUrl(buttonLink) : true);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Button Text</Label>
        <Input value={buttonText} onChange={(e) => setButtonText(e.target.value)} placeholder="ex. New Collection" />
      </div>
      <div className="space-y-2">
        <Label>Button link</Label>
        <Input 
          className={`h-10 w-full ${!isButtonLinkValid ? 'border-red-500 focus:border-red-500' : ''}`} 
          value={buttonLink} 
          onChange={(e) => setButtonLink(e.target.value)} 
          placeholder="https://example.com" 
        />
        {!isButtonLinkValid && (
          <p className="text-xs text-red-500">Please enter a valid URL</p>
        )}
      </div>
    </div>
  );
}


