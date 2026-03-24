'use client';

import { DataTable } from '@/components/TableHelper/data-table';
import { vendor_product_columns } from '@/components/TableHelper/vendor_product_columns';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { downloadProductsCSV } from './csv';
import { downloadProductsPDF } from './pdf';

export default function ClientDataTable({ vendorData }: any) {
    const [data, setData] = useState<any>(vendorData);
    const [isPdfLoading, setIsPdfLoading] = useState(false);

    const handleDownloadPDF = async () => {
        setIsPdfLoading(true);
        await downloadProductsPDF(data);
        setIsPdfLoading(false);
    };

    return (
        <div className="space-y-4">
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 items-center">
                <Button 
                    variant="outline" 
                    className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
                    onClick={() => downloadProductsCSV(data)}
                >
                    <FileSpreadsheet size={16} />
                    Export CSV
                </Button>

                <Button 
                    variant="default" 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white min-w-[130px]"
                    onClick={handleDownloadPDF}
                    disabled={isPdfLoading}
                >
                    {isPdfLoading ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <FileText size={16} />
                            Export PDF
                        </>
                    )}
                </Button>
            </div>

            {/* Data Table */}
            <DataTable columns={vendor_product_columns} data={data} setData={setData} />
        </div>
    );
}