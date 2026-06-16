'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import OrdersStats from './sections/OrdersStats';
import OrdersFilters, { FilterState } from './sections/OrdersFilters';
import OrdersTable from './sections/OrdersTable';
import OrdersToolbar from './sections/OrdersToolbar';
import { OrderRow } from '@/components/TableHelper/orders_columns';
import { printOrders } from '../utils/printOrders';
import { toast } from 'sonner';

export default function OrdersPage({ initialStatus }: { initialStatus?: string }) {
    const normalizedStatus = useMemo(() => initialStatus?.toLowerCase(), [initialStatus]);
    const [showFilters, setShowFilters] = useState<boolean>(false); 
    const [showStats, setShowStats] = useState<boolean>(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [ordersData, setOrdersData] = useState<OrderRow[]>([]);
    const [selectedOrders, setSelectedOrders] = useState<OrderRow[]>([]);

    // ✅ NEW: Search State for the Toolbar Search Box
    const [searchTerm, setSearchTerm] = useState('');

    const [filters, setFilters] = useState<FilterState>({
        orderNo: '',
        source: '',
        paymentStatus: '',
        customerName: '',
        customerPhone: '',
        orderStatus: '',
        orderedProduct: '',
        deliveryMethod: '',
        couponCode: '',
        dateRange: '' 
    });

    const handleFilterChange = (field: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const clearFilters = () => {
        setFilters({
            orderNo: '', source: '', paymentStatus: '', customerName: '', customerPhone: '',
            orderStatus: '', orderedProduct: '', deliveryMethod: '', couponCode: '', dateRange: ''
        });
        setSearchTerm(''); // Clear global search as well
        setRefreshKey(prev => prev + 1);
    };

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
        toast.success('Orders refreshed successfully');
    };

    const handleExport = () => {
        const ordersToExport = selectedOrders.length > 0 ? selectedOrders : ordersData;
        if (ordersToExport.length === 0) {
            toast.error('No orders to export');
            return;
        }
        const headers = ['SL', 'Order No', 'Order Date', 'Customer Name', 'Phone', 'Email', 'Total Amount', 'Payment Status', 'Order Status', 'Delivery Method', 'Tracking ID', 'Parcel ID'];
        const csvRows = [headers.join(',')];
        ordersToExport.forEach(order => {
            const values = [
                order.sl || '', order.orderNo || '', order.orderDate || '', order.name || '', order.phone || '', order.email || '',
                order.total || '0', order.payment || '', order.status || '', order.deliveryMethod || '', order.trackingId || '', order.parcelId || ''
            ];
            csvRows.push(values.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','));
        });
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        const filename = `orders-${new Date().toISOString().split('T')[0]}.csv`;
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Exported ${ordersToExport.length} orders`);
    };

    const handleFilter = () => {
        setShowFilters(!showFilters);
    };

    const handlePrintSelected = () => {
        const ordersToPrint = selectedOrders.length > 0 ? selectedOrders : ordersData;
        if (ordersToPrint.length === 0) {
            toast.error('No orders to print');
            return;
        }
        printOrders({
            orders: ordersToPrint,
            status: 'Selected',
            onSuccess: () => toast.success(`Printing ${ordersToPrint.length} orders`),
            onError: (err) => toast.error(err)
        });
    };

    return (
        <div className="space-y-4 md:space-y-6 w-full max-w-full overflow-x-hidden">
            {!normalizedStatus && (
                <section className="rounded-lg border border-[#e4e7eb] bg-white/60 backdrop-blur-sm shadow-sm">
                    <header className="flex items-center justify-between px-3 py-2 md:px-4 md:py-3 border-b border-[#e4e7eb]">
                        <p className="text-sm font-medium text-gray-800">Order Statistics</p>
                        <button onClick={() => setShowStats(s => !s)} className="p-1.5 rounded hover:bg-gray-100">
                            {showStats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </header>
                    {showStats && <div className="px-3 py-3"><OrdersStats /></div>}
                </section>
            )}

            <section className="rounded-lg border border-[#e4e7eb] bg-white/60 backdrop-blur-sm shadow-sm">
                <header className="flex items-center justify-between px-3 py-2 md:px-4 md:py-3 border-b border-[#e4e7eb]">
                    <p className="text-sm font-medium text-gray-800">Advanced Filters</p>
                    <button onClick={() => setShowFilters(s => !s)} className="p-1.5 rounded hover:bg-gray-100">
                        {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </header>
                {showFilters && (
                    <div className="px-3 py-3">
                        <OrdersFilters 
                            filters={filters} 
                            onFilterChange={handleFilterChange} 
                            onClear={clearFilters} 
                        />
                    </div>
                )}
            </section>

            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur rounded-lg border border-[#e4e7eb] mb-4 shadow-sm">
                <div className="px-3 py-2">
                    <OrdersToolbar 
                        initialStatus={normalizedStatus} 
                        selectedCount={selectedOrders.length}
                        onRefresh={handleRefresh}
                        onExport={handleExport}
                        onFilter={handleFilter}
                        onPrint={handlePrintSelected}
                        searchTerm={searchTerm}           // ✅ NEW
                        setSearchTerm={setSearchTerm}     // ✅ NEW
                    />
                </div>
            </div>

            <div className="rounded-lg border border-[#e4e7eb] bg-white shadow-sm">
                <OrdersTable 
                    key={refreshKey}
                    initialStatus={normalizedStatus}
                    filters={filters}
                    searchTerm={searchTerm} // ✅ NEW
                    onDataChange={setOrdersData}
                    onSelectionChange={setSelectedOrders}
                />
            </div>
        </div>
    );
}