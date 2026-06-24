// src/app/general/sales/report/page.tsx

import SectionTitle from '@/components/ui/SectionTitle';
import AdminDashboardReport from './sections/AdminDashboardReport';

export default function SalesReportPage() {
    return (
        <div className="space-y-4 py-4 p-4 sm:p-6">
            <SectionTitle text="Sales & Revenue Report" />
            <div className="px-1 sm:px-5">
                <AdminDashboardReport />
            </div>
        </div>
    );
}