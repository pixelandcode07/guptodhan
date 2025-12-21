'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar } from 'lucide-react';

interface OffersVariantsProps {
  formData: {
    specialOffer: boolean;
    offerEndTime: string;
    hasVariant: boolean;
  };
  handleInputChange: (field: string, value: unknown) => void;
}

export default function OffersVariants({ formData, handleInputChange }: OffersVariantsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">
        Offers & Variants
      </h2>
      
      <div className="space-y-6">
        {/* Special Offer Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Switch
              checked={formData.specialOffer}
              onCheckedChange={(checked) => handleInputChange('specialOffer', checked)}
            />
            <Label className="text-sm font-medium">Enable Special Offer</Label>
          </div>

          {formData.specialOffer && (
            <div>
              <Label htmlFor="offerEndTime" className="text-sm font-medium">
                Offer End Time
              </Label>
              <div className="relative mt-1">
                <Input
                  id="offerEndTime"
                  type="datetime-local"
                  value={formData.offerEndTime}
                  onChange={(e) => handleInputChange('offerEndTime', e.target.value)}
                  className="pl-10"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Product Variants Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Switch
              checked={formData.hasVariant}
              onCheckedChange={(checked) => handleInputChange('hasVariant', checked)}
            />
            <Label className="text-sm font-medium">Product Has Variants</Label>
          </div>
          
          {formData.hasVariant && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                Variant management will be implemented in the next phase.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
