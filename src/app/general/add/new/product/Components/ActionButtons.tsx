'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X, AlertCircle } from 'lucide-react';

interface ActionButtonsProps {
  onDiscard: () => void;
  onSubmit: (e: React.FormEvent) => void; // ✅ FIX: Added the missing onSubmit prop
  isSubmitting?: boolean;
}

export default function ActionButtons({ onDiscard, onSubmit, isSubmitting = false }: ActionButtonsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <AlertCircle className="w-4 h-4" />
          <span>All fields marked with * are required</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={onDiscard}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Discard Changes
          </Button>
          <Button 
            type="submit" 
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </Button>
          
        </div>
      </div>
    </div>
  );
}
