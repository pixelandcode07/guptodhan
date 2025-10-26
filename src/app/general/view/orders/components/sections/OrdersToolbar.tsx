import TableListToolbar from '@/components/TableHelper/TableListToolbar'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RefreshCw, Download, Filter } from 'lucide-react'

interface OrdersToolbarProps {
    initialStatus?: string
    showBulkCourierEntry?: boolean
    onRefresh?: () => void
    onExport?: () => void
    onFilter?: () => void
}

export default function OrdersToolbar({ 
    initialStatus, 
    showBulkCourierEntry = false,
    onRefresh,
    onExport,
    onFilter
}: OrdersToolbarProps) {
    const router = useRouter();
    const normalized = (initialStatus || '').toLowerCase().replace(/\s+/g, '-');
    const statusOptions = ["Select Status", "Pending", "Approved", "Ready to Ship", "In Transit", "Delivered", "Cancelled"];
    
    const labelFromSlug = (slug: string) => {
        switch (slug) {
            case 'ready-to-ship': return 'Ready to Ship';
            case 'in-transit': return 'In Transit';
            case 'steadfast': return 'Steadfast';
            default: return slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Select Status';
        }
    }
    
    const slugFromLabel = (label: string) => {
        switch (label) {
            case 'Pending': return 'pending';
            case 'Approved': return 'approved';
            case 'Ready to Ship': return 'ready-to-ship';
            case 'In Transit': return 'in-transit';
            case 'Delivered': return 'delivered';
            case 'Cancelled': return 'cancelled';
            case 'Steadfast': return 'steadfast';
            default: return '';
        }
    }
    
    const selectedLabel = normalized ? labelFromSlug(normalized) : 'Select Status';
    
    const handleStatusChange = (status: string) => {
        if (status === 'Select Status') {
            router.push('/general/view/orders');
        } else {
            const slug = slugFromLabel(status);
            if (slug) {
                router.push(`/general/view/orders/${slug}`);
            }
        }
    };

    return (
        <div className="rounded-lg border border-[#e4e7eb] bg-white shadow-sm">
            <div className="px-3 py-2 md:px-4 md:py-3">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <TableListToolbar
                            title={`${selectedLabel === 'Select Status' ? 'All' : selectedLabel} Orders`}
                            statusOptions={statusOptions}
                            selectedStatus={selectedLabel}
                            onStatusChange={handleStatusChange}
                            pageSizeOptions={[20, 50, 100]}
                            onBulkCourierEntryClick={showBulkCourierEntry ? () => {} : undefined}
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                        {onRefresh && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onRefresh}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Refresh
                            </Button>
                        )}
                        
                        {onFilter && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onFilter}
                                className="flex items-center gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                Filter
                            </Button>
                        )}
                        
                        {onExport && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onExport}
                                className="flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Export
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}


