'use client'

import { Label } from '@/components/ui/label'
import { useState } from 'react'

interface FilterState {
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

export default function OrdersFilters() {
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
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4 items-end">
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Order No</Label>
                <input 
                    className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200' 
                    placeholder='12354698'
                    value={filters.orderNo}
                    onChange={(e) => handleFilterChange('orderNo', e.target.value)}
                />
            </div>
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Source</Label>
                <select 
                    className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200'
                    value={filters.source}
                    onChange={(e) => handleFilterChange('source', e.target.value)}
                >
                    <option value="">Select One</option>
                    <option value="website">Website</option>
                    <option value="mobile">Mobile App</option>
                    <option value="admin">Admin Panel</option>
                </select>
            </div>
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Payment Status</Label>
                <select 
                    className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200'
                    value={filters.paymentStatus}
                    onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
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
                    onChange={(e) => handleFilterChange('customerName', e.target.value)}
                />
            </div>
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Customer Phone</Label>
                <input 
                    className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200' 
                    placeholder='+8801'
                    value={filters.customerPhone}
                    onChange={(e) => handleFilterChange('customerPhone', e.target.value)}
                />
            </div>
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Order Status</Label>
                <select 
                    className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200'
                    value={filters.orderStatus}
                    onChange={(e) => handleFilterChange('orderStatus', e.target.value)}
                >
                    <option value="">Select One</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
            <div className='sm:col-span-2'>
                <Label className='mb-1 block text-xs md:text-sm'>Ordered Product</Label>
                <select 
                    className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200'
                    value={filters.orderedProduct}
                    onChange={(e) => handleFilterChange('orderedProduct', e.target.value)}
                >
                    <option value="">Select One</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="books">Books</option>
                    <option value="home">Home & Garden</option>
                </select>
            </div>
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Delivery Method</Label>
                <select 
                    className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200'
                    value={filters.deliveryMethod}
                    onChange={(e) => handleFilterChange('deliveryMethod', e.target.value)}
                >
                    <option value="">Select One</option>
                    <option value="standard">Standard Delivery</option>
                    <option value="express">Express Delivery</option>
                    <option value="pickup">Store Pickup</option>
                </select>
            </div>
            <div>
                <Label className='mb-1 block text-xs md:text-sm'>Coupon Code</Label>
                <input 
                    className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200' 
                    placeholder='ex. OFF10'
                    value={filters.couponCode}
                    onChange={(e) => handleFilterChange('couponCode', e.target.value)}
                />
            </div>
            <div className='sm:col-span-2'>
                <Label className='mb-1 block text-xs md:text-sm'>Purchase Date Range</Label>
                <input 
                    className='h-10 w-full border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200' 
                    placeholder='Select date range'
                    type="date"
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                />
            </div>
            <div>
                <button 
                    className='h-10 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 transition text-white rounded-md px-4 w-full sm:w-max text-sm'
                    onClick={clearFilters}
                >
                    Clear Filters
                </button>
            </div>
        </div>
    );
}


