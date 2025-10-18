'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RichTextEditor from '@/components/ReusableComponents/RichTextEditor';

interface BasicInfoProps {
  formData: {
    title: string;
    shortDescription: string;
    fullDescription: string;
    specification: string;
    warrantyPolicy: string;
  };
  handleInputChange: (field: string, value: unknown) => void;
}

export default function BasicInfo({ formData, handleInputChange }: BasicInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-6">
        Basic Product Information
      </h2>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="title" className="text-sm font-medium">
            Product Title<span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Enter Product Name Here"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="shortDescription" className="text-sm font-medium">
            Short Description (Max 255 Characters)
          </Label>
          <Textarea
            id="shortDescription"
            placeholder="Enter Short Description Here"
            value={formData.shortDescription}
            onChange={(e) => handleInputChange('shortDescription', e.target.value)}
            className="mt-1"
            maxLength={255}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.shortDescription.length}/255 characters
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Detailed Information</Label>
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specification">Specification</TabsTrigger>
              <TabsTrigger value="warranty">Warranty Policy</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <RichTextEditor
                value={formData.fullDescription}
                onChange={(value) => handleInputChange('fullDescription', value)}
              />
            </TabsContent>
            <TabsContent value="specification" className="mt-4">
              <RichTextEditor
                value={formData.specification}
                onChange={(value) => handleInputChange('specification', value)}
              />
            </TabsContent>
            <TabsContent value="warranty" className="mt-4">
              <RichTextEditor
                value={formData.warrantyPolicy}
                onChange={(value) => handleInputChange('warrantyPolicy', value)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
