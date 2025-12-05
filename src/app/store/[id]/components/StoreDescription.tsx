'use client';

import { Card, CardTitle } from '@/components/ui/card';
import { StoreData } from './types';

interface StoreDescriptionProps {
  fullDescription: string;
}

export default function StoreDescription({ fullDescription }: StoreDescriptionProps) {
  if (!fullDescription) {
    return null;
  }

  return (
    <Card className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
      <div className="p-3 sm:p-4 md:p-6 pb-1 sm:pb-2">
        <CardTitle className="text-base sm:text-lg">About Store</CardTitle>
      </div>
      <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
        <div 
          className="prose prose-xs sm:prose-sm max-w-none text-gray-700 text-xs sm:text-sm md:text-base"
          dangerouslySetInnerHTML={{ __html: fullDescription }}
        />
      </div>
    </Card>
  );
}

