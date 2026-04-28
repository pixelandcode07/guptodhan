"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function VendorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Vendor Route Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="text-center space-y-5 max-w-md">
        <h2 className="text-3xl font-bold text-slate-800">Something went wrong!</h2>
        <p className="text-slate-600">
          We encountered an unexpected error while loading this page. 
        </p>
        <Button 
          onClick={() => reset()} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}