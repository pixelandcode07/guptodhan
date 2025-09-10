import SectionTitle from '@/components/ui/SectionTitle';
import SalesReportFilters from './sections/SalesReportFilters';

export default function SalesReportPage() {
    return (
        <div className="space-y-4 py-4">
            <SectionTitle text="Sales Report Criteria" />
            <div className="px-5">
                <SalesReportFilters />
            </div>
        </div>
    );
}


