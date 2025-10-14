'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StoreSelectionProps {
  formData: {
    store: string;
  };
  handleInputChange: (field: string, value: unknown) => void;
}

export default function StoreSelection({ formData, handleInputChange }: StoreSelectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">
        Store Selection
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <Label className="text-sm font-medium">Select Store</Label>
          <Select value={formData.store} onValueChange={(value) => handleInputChange('store', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main-store">Main Store</SelectItem>
              <SelectItem value="branch-store">Branch Store</SelectItem>
              <SelectItem value="online-store">Online Store</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
