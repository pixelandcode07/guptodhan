'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface PricingInventoryProps {
  formData: {
    price: number;
    discountPrice: number;
    rewardPoints: number;
    stock: number;
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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">
        Pricing & Inventory
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Price (BDT)<span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleNumberChange('price', -1)}
              className="h-10 w-10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', Number(e.target.value))}
              className="text-center"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleNumberChange('price', 1)}
              className="h-10 w-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Discount Price</Label>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleNumberChange('discountPrice', -1)}
              className="h-10 w-10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={formData.discountPrice}
              onChange={(e) => handleInputChange('discountPrice', Number(e.target.value))}
              className="text-center"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleNumberChange('discountPrice', 1)}
              className="h-10 w-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Reward Points</Label>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleNumberChange('rewardPoints', -1)}
              className="h-10 w-10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={formData.rewardPoints}
              onChange={(e) => handleInputChange('rewardPoints', Number(e.target.value))}
              className="text-center"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleNumberChange('rewardPoints', 1)}
              className="h-10 w-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Stock Quantity</Label>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleNumberChange('stock', -1)}
              className="h-10 w-10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', Number(e.target.value))}
              className="text-center"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleNumberChange('stock', 1)}
              className="h-10 w-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
