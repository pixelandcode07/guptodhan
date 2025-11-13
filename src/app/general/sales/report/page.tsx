import SectionTitle from '@/components/ui/SectionTitle';
import SalesReportClient from './sections/SalesReportFilters';

export default function SalesReportPage() {
    return (
        <div className="space-y-4 py-4 p-4 sm:p-6">
            <SectionTitle text="Sales Report Criteria" />
            <div className="px-1 sm:px-5">
                <SalesReportClient />
            </div>
        </div>
    );
}