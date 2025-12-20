'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface PricingInventoryProps {
  formData: {
    price: string | number;
    discountPrice: string | number;
    rewardPoints: string | number;
    stock: string | number;
  };
  handleInputChange: (field: string, value: unknown) => void;
  handleNumberChange: (field: string, delta: number) => void;
}

export default function PricingInventory({ 
  formData, 
  handleInputChange, 
  handleNumberChange 
}: PricingInventoryProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Price (BDT)<span className="text-red-500">*</span>
          </Label>
          <div className="relative flex items-center">
            <Input
              type="number"
              value={formData.price || ''}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className="text-center pr-8 pl-8 h-10 rounded-r-none border-r-0 w-full text-base [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              placeholder=""
              min="0"
              step="1"
            />
            <Button
              type="button"
              variant="default"
              size="icon"
              onClick={() => handleNumberChange('price', -1)}
              className="absolute left-0 h-10 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-l-md rounded-r-none border-r border-blue-700"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="default"
              size="icon"
              onClick={() => handleNumberChange('price', 1)}
              className="absolute right-0 h-10 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md rounded-l-none border-l border-blue-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Discount Price</Label>
          <div className="relative flex items-center">
            <Input
              type="number"
              value={formData.discountPrice || ''}
              onChange={(e) => handleInputChange('discountPrice', e.target.value)}
              className="text-center pr-1 pl-1 h-10 rounded-r-none border-r-0 w-full text-base [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              placeholder=""
              min="0"
              step="1"
            />
            <Button
              type="button"
              variant="default"
              size="icon"
              onClick={() => handleNumberChange('discountPrice', -1)}
              className="absolute left-0 h-10 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-l-md rounded-r-none border-r border-blue-700"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="default"
              size="icon"
              onClick={() => handleNumberChange('discountPrice', 1)}
              className="absolute right-0 h-10 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md rounded-l-none border-l border-blue-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Reward Points</Label>
          <div className="relative flex items-center">
            <Input
              type="number"
              value={formData.rewardPoints || ''}
              onChange={(e) => handleInputChange('rewardPoints', e.target.value)}
              className="text-center pr-8 pl-8 h-10 rounded-r-none border-r-0 w-full text-base [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              placeholder=""
              min="0"
              step="1"
            />
            <Button
              type="button"
              variant="default"
              size="icon"
              onClick={() => handleNumberChange('rewardPoints', -1)}
              className="absolute left-0 h-10 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-l-md rounded-r-none border-r border-blue-700"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="default"
              size="icon"
              onClick={() => handleNumberChange('rewardPoints', 1)}
              className="absolute right-0 h-10 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md rounded-l-none border-l border-blue-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Stock</Label>
          <div className="relative flex items-center">
            <Input
              type="number"
              value={formData.stock || ''}
              onChange={(e) => handleInputChange('stock', e.target.value)}
              className="text-center pr-8 pl-8 h-10 rounded-r-none border-r-0 w-full text-base [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              placeholder=""
              min="0"
              step="1"
            />
            <Button
              type="button"
              variant="default"
              size="icon"
              onClick={() => handleNumberChange('stock', -1)}
              className="absolute left-0 h-10 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-l-md rounded-r-none border-r border-blue-700"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="default"
              size="icon"
              onClick={() => handleNumberChange('stock', 1)}
                className="absolute right-0 h-10 w-8 bg-blue-610 hover:bg-blue-700 text-white rounded-r-md rounded-l-none border-l border-blue-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
