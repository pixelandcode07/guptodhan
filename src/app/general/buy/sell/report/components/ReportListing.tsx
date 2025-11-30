'use client';

import { DataTable } from '@/components/TableHelper/data-table';
import { reportListing_columns } from '@/components/TableHelper/reportListing_columns';
import type { ReportListing as Report } from '@/types/ReportType';

interface ReportListingProps {
    initialReports: Report[];
}

export default function ReportListing({ initialReports }: ReportListingProps) {
    return (
        <DataTable
            columns={reportListing_columns}
            data={initialReports}
        />
    );
}