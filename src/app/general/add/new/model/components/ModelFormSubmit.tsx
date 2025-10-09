"use client"

import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";

interface ModelFormSubmitProps {
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ModelFormSubmit({ loading, onSubmit }: ModelFormSubmitProps) {
  return (
    <div className="flex flex-col gap-4 pt-4 sm:pt-6 border-t border-gray-200">
      {/* Info Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
          <span className="font-medium">Ready to create</span>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          Make sure all fields are filled correctly before submitting
        </p>
      </div>
      
      {/* Submit Button */}
      <div className="w-full">
        <Button 
          type="submit" 
          onClick={onSubmit}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full h-11 sm:h-12 text-sm sm:text-base"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Model
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
