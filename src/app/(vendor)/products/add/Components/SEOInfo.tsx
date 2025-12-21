'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SEOInfoProps {
  formData: {
    metaTitle: string;
    metaKeywords: string;
    metaDescription: string;
  };
  handleInputChange: (field: string, value: unknown) => void;
}

export default function SEOInfo({ formData, handleInputChange }: SEOInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">
        SEO Information (Optional)
      </h2>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="metaTitle" className="text-sm font-medium">
            Meta Title
          </Label>
          <Input
            id="metaTitle"
            placeholder="Enter meta title for SEO"
            value={formData.metaTitle}
            onChange={(e) => handleInputChange('metaTitle', e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Recommended: 50-60 characters
          </p>
        </div>

        <div>
          <Label htmlFor="metaKeywords" className="text-sm font-medium">
            Meta Keywords
          </Label>
          <Input
            id="metaKeywords"
            placeholder="keyword1, keyword2, keyword3"
            value={formData.metaKeywords}
            onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate keywords with commas
          </p>
        </div>

        <div>
          <Label htmlFor="metaDescription" className="text-sm font-medium">
            Meta Description
          </Label>
          <Textarea
            id="metaDescription"
            placeholder="Enter meta description for SEO"
            value={formData.metaDescription}
            onChange={(e) => handleInputChange('metaDescription', e.target.value)}
            className="mt-1"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">
            Recommended: 150-160 characters
          </p>
        </div>
      </div>
    </div>
  );
}
