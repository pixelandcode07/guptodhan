'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ButtonRowProps {
  buttonText: string;
  setButtonText: (value: string) => void;
  buttonLink: string;
  setButtonLink: (value: string) => void;
}

export default function ButtonRow({
  buttonText,
  setButtonText,
  buttonLink,
  setButtonLink,
}: ButtonRowProps) {
  const maxButtonTextLength = 50;

  return (
    <div className="space-y-4 border-l-4 border-purple-500 pl-4">
      {/* Section Title */}
      <div className="font-semibold text-gray-800 mb-4">🔘 Button Configuration</div>

      {/* Button Text - OPTIONAL */}
      <div>
        <Label htmlFor="buttonText" className="text-sm font-medium text-gray-700">
          Button Text (Optional)
        </Label>
        <Input
          id="buttonText"
          placeholder="e.g., Shop Now, View Collection, Learn More"
          value={buttonText}
          onChange={(e) => setButtonText(e.target.value.slice(0, maxButtonTextLength))}
          className="mt-1.5 border-gray-300 focus:border-purple-500"
          maxLength={maxButtonTextLength}
        />
        <div className="flex justify-between mt-1">
          <p className="text-xs text-gray-500">Text displayed on the call-to-action button</p>
          <span
            className={`text-xs font-medium ${
              buttonText.length > maxButtonTextLength * 0.9 ? 'text-orange-600' : 'text-gray-400'
            }`}
          >
            {buttonText.length}/{maxButtonTextLength}
          </span>
        </div>
      </div>

      {/* Button Link - OPTIONAL */}
      <div>
        <Label htmlFor="buttonLink" className="text-sm font-medium text-gray-700">
          Button Link (Optional)
        </Label>
        <Input
          id="buttonLink"
          type="url"
          placeholder="https://example.com/shop"
          value={buttonLink}
          onChange={(e) => setButtonLink(e.target.value)}
          className="mt-1.5 border-gray-300 focus:border-purple-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          URL that opens when user clicks the button. Leave empty to disable button.
        </p>
      </div>
    </div>
  );
}