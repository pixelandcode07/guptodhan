'use client'

import { Label } from '@/components/ui/label'

// ফিল্টার টাইপ (অন্যান্য ফাইলে ব্যবহারের জন্য এক্সপোর্ট করা হলো)
export interface FilterState {
    orderNo: string;
    source: string;
    paymentStatus: string;
    customerName: string;
    customerPhone: string;
    orderStatus: string;
    orderedProduct: string;
    deliveryMethod: string;
    couponCode: string;
    dateRange: string;
}

interface OrdersFiltersProps {
    filters: FilterState;
    onFilterChange: (field: keyof FilterState, value: string) => void;
    onClear: () => void;
}

export default function OrdersFilters({ filters, onFilterChange, onClear }: OrdersFiltersProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4 items-end">
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Order No</Label>
                <input 
                    className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200' 
                    placeholder='12354698'
                    value={filters.orderNo}
                    onChange={(e) => onFilterChange('orderNo', e.target.value)}
                />
            </div>
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Source</Label>
                <select 
                    className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200'
                    value={filters.source}
                    onChange={(e) => onFilterChange('source', e.target.value)}
                >
                    <option value="">Select One</option>
                    <option value="Website">Website</option>
                    <option value="App">App</option>
                </select>
            </div>
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Payment Status</Label>
                <select 
                    className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200'
                    value={filters.paymentStatus}
                    onChange={(e) => onFilterChange('paymentStatus', e.target.value)}
                >
                    <option value="">Select One</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                </select>
            </div>
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Customer Name</Label>
                <input 
                    className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200' 
                    placeholder='Mr/Mrs.'
                    value={filters.customerName}
                    onChange={(e) => onFilterChange('customerName', e.target.value)}
                />
            </div>
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Customer Phone</Label>
                <input 
                    className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200' 
                    placeholder='+8801'
                    value={filters.customerPhone}
                    onChange={(e) => onFilterChange('customerPhone', e.target.value)}
                />
            </div>
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Order Status</Label>
                <select 
                    className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200'
                    value={filters.orderStatus}
                    onChange={(e) => onFilterChange('orderStatus', e.target.value)}
                >
                    <option value="">Select One</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="returned">Returned</option>
                </select>
            </div>
            
            {/* Delivery Method */}
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Delivery Method</Label>
                <select 
                    className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200'
                    value={filters.deliveryMethod}
                    onChange={(e) => onFilterChange('deliveryMethod', e.target.value)}
                >
                    <option value="">Select One</option>
                    <option value="standard">Standard</option>
                    <option value="steadfast">Steadfast</option>
                    <option value="office">Office Pickup</option>
                </select>
            </div>

            {/* Clear Filters Button */}
            <div>
                <button 
                    className='h-10 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 transition text-white rounded-md px-4 w-full sm:w-max text-sm'
                    onClick={onClear}
                >
                    Clear Filters
                </button>
            </div>
        </div>
    );
}