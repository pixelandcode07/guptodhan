"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface BasicInfoFieldsProps {
  title: string
  onTitleChange: (value: string) => void
  startDate: string
  onStartDateChange: (value: string) => void
  endingDate: string
  onEndingDateChange: (value: string) => void
  type: string
  onTypeChange: (value: string) => void
  value: string
  onValueChange: (value: string) => void
  minimumOrderAmount: string
  onMinimumOrderAmountChange: (value: string) => void
  code: string
  onCodeChange: (value: string) => void
  shortDescription: string
  onShortDescriptionChange: (value: string) => void
}

export default function BasicInfoFields({
  title,
  onTitleChange,
  startDate,
  onStartDateChange,
  endingDate,
  onEndingDateChange,
  type,
  onTypeChange,
  value,
  onValueChange,
  minimumOrderAmount,
  onMinimumOrderAmountChange,
  code,
  onCodeChange,
  shortDescription,
  onShortDescriptionChange,
}: BasicInfoFieldsProps) {
  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Title *</Label>
        <Input 
          value={title} 
          onChange={(e) => onTitleChange(e.target.value)}
          className="h-10 sm:h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
          placeholder="25% OFF Promo"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Effective Date *</Label>
          <Input 
            type="date"
            value={startDate} 
            onChange={(e) => onStartDateChange(e.target.value)}
            className="h-10 sm:h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Expiry Date *</Label>
          <Input 
            type="date"
            value={endingDate} 
            onChange={(e) => onEndingDateChange(e.target.value)}
            className="h-10 sm:h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Type *</Label>
          <Select value={type} onValueChange={onTypeChange}>
            <SelectTrigger className="h-10 sm:h-11 border-gray-300 focus:border-green-500 focus:ring-green-500">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Percentage">Percentage</SelectItem>
              <SelectItem value="Fixed Amount">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Value *</Label>
          <Input 
            type="number"
            value={value} 
            onChange={(e) => onValueChange(e.target.value)}
            className="h-10 sm:h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
            placeholder="Enter discount value"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Minimum Order Amount</Label>
        <Input 
          type="number"
          value={minimumOrderAmount} 
          onChange={(e) => onMinimumOrderAmountChange(e.target.value)}
          className="h-10 sm:h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
          placeholder="Enter minimum order amount"
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Code *</Label>
        <Input 
          value={code} 
          onChange={(e) => onCodeChange(e.target.value)}
          className="h-10 sm:h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
          placeholder="SNNY22"
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Short Description</Label>
        <Textarea 
          value={shortDescription} 
          onChange={(e) => onShortDescriptionChange(e.target.value)}
          className="border-gray-300 focus:border-green-500 focus:ring-green-500"
          placeholder="During this sale, we're offering 25% OFF this summary. Make sure you don't miss it."
          rows={4}
        />
      </div>
    </div>
  )
}


