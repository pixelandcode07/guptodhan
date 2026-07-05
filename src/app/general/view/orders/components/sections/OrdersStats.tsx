import React, { useMemo } from 'react'
import { ShoppingCart, TrendingUp, Smile, Trash2, Package, Truck, CheckSquare } from 'lucide-react'
import { OrderRow } from '@/components/TableHelper/orders_columns'

type OrderStats = {
    pending: { count: number; total: number }
    processing: { count: number; total: number }
    shipped: { count: number; total: number }
    delivered: { count: number; total: number }
    cancelled: { count: number; total: number }
    cod: { count: number; total: number }
    steadfast: { count: number; total: number }
}

function formatAmount(amount: number): string {
    return `৳ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

interface OrdersStatsProps {
    currentOrders: OrderRow[];
    selectedOrders?: OrderRow[]; // ✅ MAGIC FIX: সিলেক্ট করা অর্ডার রিসিভ করার জন্য
}

export default function OrdersStats({ currentOrders, selectedOrders = [] }: OrdersStatsProps) {
    
    const hasSelection = selectedOrders.length > 0;
    
    // ✅ MAGIC FIX: যদি সিলেক্ট করা অর্ডার থাকে তাহলে সেটার হিসাব হবে, না থাকলে সব ডাটার হিসাব হবে
    const targetOrders = hasSelection ? selectedOrders : currentOrders;

    const stats = useMemo(() => {
        const newStats: OrderStats = {
            pending: { count: 0, total: 0 },
            processing: { count: 0, total: 0 },
            shipped: { count: 0, total: 0 },
            delivered: { count: 0, total: 0 },
            cancelled: { count: 0, total: 0 },
            cod: { count: 0, total: 0 },
            steadfast: { count: 0, total: 0 }
        }

        targetOrders.forEach(order => {
            const amount = typeof order.total === 'number' ? order.total : 0
            const status = (order.status || '').toLowerCase()
            const isCOD = (order.deliveryMethod || '').toLowerCase() === 'cod'
            const hasSteadfast = !!(order.trackingId || order.parcelId)

            // Count by status
            switch (status) {
                case 'pending':
                    newStats.pending.count++
                    newStats.pending.total += amount
                    break
                case 'processing':
                    newStats.processing.count++
                    newStats.processing.total += amount
                    break
                case 'shipped':
                    newStats.shipped.count++
                    newStats.shipped.total += amount
                    break
                case 'delivered':
                    newStats.delivered.count++
                    newStats.delivered.total += amount
                    break
                case 'cancelled':
                case 'canceled':
                    newStats.cancelled.count++
                    newStats.cancelled.total += amount
                    break
            }

            // Count COD orders
            if (isCOD) {
                newStats.cod.count++
                newStats.cod.total += amount
            }

            // Count Steadfast orders
            if (hasSteadfast) {
                newStats.steadfast.count++
                newStats.steadfast.total += amount
            }
        })

        return newStats;
    }, [targetOrders]);

    return (
        <div className="space-y-3">
            {/* ✅ MAGIC FIX: চেকবক্স সিলেক্ট করলে একটি সুন্দর নোটিফিকেশন দেখাবে */}
            {hasSelection && (
                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium animate-fadeIn">
                    <div className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                        <span>Showing real-time statistics for <b>{selectedOrders.length}</b> selected order(s)</span>
                    </div>
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Custom Selection</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Pending Orders */}
                <div className={`relative p-4 rounded border transition-all ${hasSelection ? 'bg-blue-50/30 border-blue-300 shadow-sm' : 'bg-white border-[#e4e7eb] hover:shadow-md'}`}>
                    <p className='text-xs text-gray-500'>Pending Orders</p>
                    <p className='text-lg font-semibold'>{formatAmount(stats.pending.total)}</p>
                    <p className='text-xs text-gray-400'>{stats.pending.count} orders</p>
                    <span className='absolute right-3 top-3 text-yellow-500/90'>
                        <ShoppingCart size={18} />
                    </span>
                </div>

                {/* Processing Orders */}
                <div className={`relative p-4 rounded border transition-all ${hasSelection ? 'bg-blue-50/30 border-blue-300 shadow-sm' : 'bg-white border-[#e4e7eb] hover:shadow-md'}`}>
                    <p className='text-xs text-gray-500'>Processing Orders</p>
                    <p className='text-lg font-semibold'>{formatAmount(stats.processing.total)}</p>
                    <p className='text-xs text-gray-400'>{stats.processing.count} orders</p>
                    <span className='absolute right-3 top-3 text-blue-500/90'>
                        <Package size={18} />
                    </span>
                </div>

                {/* Shipped Orders */}
                <div className={`relative p-4 rounded border transition-all ${hasSelection ? 'bg-blue-50/30 border-blue-300 shadow-sm' : 'bg-white border-[#e4e7eb] hover:shadow-md'}`}>
                    <p className='text-xs text-gray-500'>Shipped Orders</p>
                    <p className='text-lg font-semibold'>{formatAmount(stats.shipped.total)}</p>
                    <p className='text-xs text-gray-400'>{stats.shipped.count} orders</p>
                    <span className='absolute right-3 top-3 text-purple-500/90'>
                        <Truck size={18} />
                    </span>
                </div>

                {/* Delivered Orders */}
                <div className={`relative p-4 rounded border transition-all ${hasSelection ? 'bg-blue-50/30 border-blue-300 shadow-sm' : 'bg-white border-[#e4e7eb] hover:shadow-md'}`}>
                    <p className='text-xs text-gray-500'>Delivered Orders</p>
                    <p className='text-lg font-semibold'>{formatAmount(stats.delivered.total)}</p>
                    <p className='text-xs text-gray-400'>{stats.delivered.count} orders</p>
                    <span className='absolute right-3 top-3 text-green-600/90'>
                        <Smile size={18} />
                    </span>
                </div>

                {/* COD Orders */}
                <div className={`relative p-4 rounded border transition-all ${hasSelection ? 'bg-blue-50/30 border-blue-300 shadow-sm' : 'bg-white border-[#e4e7eb] hover:shadow-md'}`}>
                    <p className='text-xs text-gray-500'>COD Orders</p>
                    <p className='text-lg font-semibold'>{formatAmount(stats.cod.total)}</p>
                    <p className='text-xs text-gray-400'>{stats.cod.count} orders</p>
                    <span className='absolute right-3 top-3 text-orange-500/90'>
                        <ShoppingCart size={18} />
                    </span>
                </div>

                {/* Steadfast Orders */}
                <div className={`relative p-4 rounded border transition-all ${hasSelection ? 'bg-blue-50/30 border-blue-300 shadow-sm' : 'bg-white border-[#e4e7eb] hover:shadow-md'}`}>
                    <p className='text-xs text-gray-500'>Steadfast Orders</p>
                    <p className='text-lg font-semibold'>{formatAmount(stats.steadfast.total)}</p>
                    <p className='text-xs text-gray-400'>{stats.steadfast.count} orders</p>
                    <span className='absolute right-3 top-3 text-indigo-500/90'>
                        <Truck size={18} />
                    </span>
                </div>

                {/* Cancelled Orders */}
                <div className={`relative p-4 rounded border transition-all ${hasSelection ? 'bg-blue-50/30 border-blue-300 shadow-sm' : 'bg-white border-[#e4e7eb] hover:shadow-md'}`}>
                    <p className='text-xs text-gray-500'>Cancelled Orders</p>
                    <p className='text-lg font-semibold'>{formatAmount(stats.cancelled.total)}</p>
                    <p className='text-xs text-gray-400'>{stats.cancelled.count} orders</p>
                    <span className='absolute right-3 top-3 text-rose-600/90'>
                        <Trash2 size={18} />
                    </span>
                </div>

                {/* Total Orders Summary */}
                <div className={`relative p-4 rounded transition-all ${hasSelection ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:shadow-md'}`}>
                    <p className={`text-xs ${hasSelection ? 'text-blue-100 font-medium' : 'text-gray-600'}`}>
                        {hasSelection ? 'Selected Orders Value' : 'Total Orders Value'}
                    </p>
                    <p className={`text-lg font-semibold ${hasSelection ? 'text-white' : 'text-blue-700'}`}>
                        {formatAmount(stats.pending.total + stats.processing.total + stats.shipped.total + stats.delivered.total)}
                    </p>
                    <p className={`text-xs ${hasSelection ? 'text-blue-100' : 'text-gray-500'}`}>
                        {stats.pending.count + stats.processing.count + stats.shipped.count + stats.delivered.count} active orders
                    </p>
                    <span className={`absolute right-3 top-3 ${hasSelection ? 'text-white/80' : 'text-blue-600/90'}`}>
                        <TrendingUp size={18} />
                    </span>
                </div>
            </div>
        </div>
    );
}