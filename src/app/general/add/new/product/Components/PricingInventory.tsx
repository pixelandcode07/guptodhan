'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Truck } from 'lucide-react';

interface PricingInventoryProps {
  formData: {
    price: string | number;
    discountPrice: string | number;
    rewardPoints: string | number;
    stock: string | number;
    shippingCost: string | number; // ✅ shippingCost type added
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
        {/* Price Field */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Price (BDT)<span className="text-red-500">*</span>
          </Label>
          <div className="relative flex items-center">
            <Input
              type="number"
              value={formData.price || ''}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className="text-center pr-8 pl-8 h-10 rounded-r-none border-r-0 w-full"
              placeholder=""
              min="0"
            />
            <Button
              type="button" variant="default" size="icon"
              onClick={() => handleNumberChange('price', -1)}
              className="absolute left-0 h-10 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-l-md rounded-r-none"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              type="button" variant="default" size="icon"
              onClick={() => handleNumberChange('price', 1)}
              className="absolute right-0 h-10 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md rounded-l-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Discount Price */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Discount Price</Label>
          <div className="relative flex items-center">
            <Input
              type="number"
              value={formData.discountPrice || ''}
              onChange={(e) => handleInputChange('discountPrice', e.target.value)}
              className="text-center pr-8 pl-8 h-10 rounded-r-none border-r-0 w-full"
              placeholder=""
              min="0"
            />
            <Button
              type="button" variant="default" size="icon"
              onClick={() => handleNumberChange('discountPrice', -1)}
              className="absolute left-0 h-10 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-l-md rounded-r-none"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              type="button" variant="default" size="icon"
              onClick={() => handleNumberChange('discountPrice', 1)}
              className="absolute right-0 h-10 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md rounded-l-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stock */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Stock</Label>
          <div className="relative flex items-center">
            <Input
              type="number"
              value={formData.stock || ''}
              onChange={(e) => handleInputChange('stock', e.target.value)}
              className="text-center pr-8 pl-8 h-10 rounded-r-none border-r-0 w-full"
              placeholder=""
              min="0"
            />
            <Button
              type="button" variant="default" size="icon"
              onClick={() => handleNumberChange('stock', -1)}
              className="absolute left-0 h-10 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-l-md rounded-r-none"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              type="button" variant="default" size="icon"
              onClick={() => handleNumberChange('stock', 1)}
              className="absolute right-0 h-10 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md rounded-l-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Reward Points */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Reward Points</Label>
          <div className="relative flex items-center">
            <Input
              type="number"
              value={formData.rewardPoints || ''}
              onChange={(e) => handleInputChange('rewardPoints', e.target.value)}
              className="text-center pr-8 pl-8 h-10 rounded-r-none border-r-0 w-full"
              placeholder=""
              min="0"
            />
            <Button
              type="button" variant="default" size="icon"
              onClick={() => handleNumberChange('rewardPoints', -1)}
              className="absolute left-0 h-10 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-l-md rounded-r-none"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              type="button" variant="default" size="icon"
              onClick={() => handleNumberChange('rewardPoints', 1)}
              className="absolute right-0 h-10 w-8 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md rounded-l-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ✅ NEW: Extra Delivery Charge (For Heavy Items) */}
        <div className="col-span-2 mt-2 p-3 bg-orange-50 border border-orange-100 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="h-4 w-4 text-orange-600" />
            <Label className="text-sm font-medium text-orange-900 block">
              Extra Delivery Charge (Optional)
            </Label>
          </div>
          <div className="relative flex items-center">
            <Input
              type="number"
              value={formData.shippingCost || ''}
              onChange={(e) => handleInputChange('shippingCost', e.target.value)}
              className="text-center pr-8 pl-8 h-10 rounded-r-none border-r-0 w-full border-orange-200 focus-visible:ring-orange-500"
              placeholder="0"
              min="0"
            />
            <Button
              type="button" variant="default" size="icon"
              onClick={() => handleNumberChange('shippingCost', -10)}
              className="absolute left-0 h-10 w-8 bg-orange-500 hover:bg-orange-600 text-white rounded-l-md rounded-r-none"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              type="button" variant="default" size="icon"
              onClick={() => handleNumberChange('shippingCost', 10)}
              className="absolute right-0 h-10 w-8 bg-orange-500 hover:bg-orange-600 text-white rounded-r-md rounded-l-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-orange-700 mt-1.5">
            Add amount for heavy items (Fridge, AC). Leave 0 for standard delivery charges.
          </p>
        </div>

      </div>
    </div>
  );
}