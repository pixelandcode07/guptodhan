"use client";

import { useCallback } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { downloadProductsCSV } from "@/app/(vendor)/products/all/components/csv";

interface DownloadCSVButtonProps {
  rows: any[];
}

export default function DownloadCSVButton({
  rows,
}: DownloadCSVButtonProps) {
  const onDownloadCSV = useCallback(() => {
    if (!downloadProductsCSV(rows)) {
      toast.error("No vendors data available to export");
    } else {
      toast.success(
        `Exported ${rows.length} vendor(s) successfully`
      );
    }
  }, [rows]);

  return (
    <div className="flex items-end">
      <Button
        onClick={onDownloadCSV}
        className="h-10 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium"
        disabled={rows.length === 0}
      >
        <Download className="w-4 h-4 mr-2" />
        Download CSV
      </Button>
    </div>
  );
}