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
        <div className="rounded-lg border border-[#e4e7eb] bg-white shadow-sm overflow-x-hidden">
            <div className="px-3 py-3 md:px-4 md:py-3">
                {/* Header Row with Title and Action Buttons */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <h2 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                            {selectedLabel === 'Select Status' ? 'All Orders' : `${selectedLabel} Orders`}
                        </h2>
                        <span className="hidden sm:inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-2.5 py-1 text-xs">
                            {selectedLabel}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                        {onRefresh && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onRefresh}
                                className="flex items-center gap-1.5"
                            >
                                <RefreshCw className="h-4 w-4" />
                                <span className="hidden sm:inline">Refresh</span>
                            </Button>
                        )}
                        
                        {onFilter && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onFilter}
                                className="flex items-center gap-1.5"
                            >
                                <Filter className="h-4 w-4" />
                                <span className="hidden sm:inline">Filter</span>
                            </Button>
                        )}
                        
                        {onExport && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onExport}
                                className="flex items-center gap-1.5"
                            >
                                <Download className="h-4 w-4" />
                                <span className="hidden sm:inline">Export</span>
                            </Button>
                        )}
                    </div>
                </div>
                
                {/* Controls Row - Status and Actions */}
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 flex-wrap">
                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                        <label className="text-xs md:text-sm text-gray-600 whitespace-nowrap">Status:</label>
                        <select
                            className="h-9 border border-gray-300 rounded-md px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 md:flex-none md:w-40"
                            value={selectedLabel}
                            onChange={(e) => handleStatusChange(e.target.value)}
                        >
                            {statusOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button 
                            variant="default" 
                            size="sm" 
                            className="h-9 rounded-md px-3 text-xs md:text-sm bg-gray-900 text-white hover:bg-gray-800 whitespace-nowrap"
                            onClick={() => {}}
                        >
                            <span className="hidden lg:inline">Change Selected Orders</span>
                            <span className="lg:hidden">Change</span>
                        </Button>
                        
                        <Button 
                            variant="default" 
                            size="sm" 
                            className="h-9 rounded-md px-3 text-xs md:text-sm bg-gray-900 text-white hover:bg-gray-800 whitespace-nowrap"
                            onClick={() => {}}
                        >
                            <span className="hidden lg:inline">Print Selected</span>
                            <span className="lg:hidden">Print</span>
                        </Button>
                        
                        <Button 
                            variant="default" 
                            size="sm" 
                            className="h-9 rounded-md px-3 text-xs md:text-sm bg-gray-900 text-white hover:bg-gray-800 whitespace-nowrap"
                            onClick={() => {}}
                        >
                            <span className="hidden lg:inline">Courier Status</span>
                            <span className="lg:hidden">Courier</span>
                        </Button>
                        
                        {showBulkCourierEntry && (
                            <Button 
                                variant="default" 
                                size="sm" 
                                className="h-9 rounded-md px-3 text-xs md:text-sm bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap"
                                onClick={() => {}}
                            >
                                <span className="hidden lg:inline">Bulk Courier Entry</span>
                                <span className="lg:hidden">Bulk</span>
                            </Button>
                        )}
                    </div>
                    
                    {/* Right Side Controls */}
                    <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                        <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">Show:</span>
                        <select className="h-9 border border-gray-300 rounded-md px-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">entries</span>
                    </div>
                </div>
                
                {/* Search Bar */}
                <div className="mt-2">
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
        </div>
    )
}


