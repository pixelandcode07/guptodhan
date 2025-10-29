import React from 'react'
import { ShoppingCart, TrendingUp, Smile, Trash2, Package, Truck } from 'lucide-react'
import api from '@/lib/axios'
import FancyLoadingPage from '@/app/general/loading'

type ApiOrder = {
    _id: string
    totalAmount?: number
    orderStatus?: string
    paymentStatus?: string
    deliveryMethodId?: string
    trackingId?: string
    parcelId?: string
}

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

export default function OrdersStats() {
    const [stats, setStats] = React.useState<OrderStats>({
        pending: { count: 0, total: 0 },
        processing: { count: 0, total: 0 },
        shipped: { count: 0, total: 0 },
        delivered: { count: 0, total: 0 },
        cancelled: { count: 0, total: 0 },
        cod: { count: 0, total: 0 },
        steadfast: { count: 0, total: 0 }
    })
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true)
                // Fetch all orders for comprehensive statistics
                const response = await api.get('/product-order')
                const orders = (response.data?.data ?? []) as ApiOrder[]
                
                const newStats: OrderStats = {
                    pending: { count: 0, total: 0 },
                    processing: { count: 0, total: 0 },
                    shipped: { count: 0, total: 0 },
                    delivered: { count: 0, total: 0 },
                    cancelled: { count: 0, total: 0 },
                    cod: { count: 0, total: 0 },
                    steadfast: { count: 0, total: 0 }
                }

                orders.forEach(order => {
                    const amount = typeof order.totalAmount === 'number' ? order.totalAmount : 0
                    const status = (order.orderStatus || '').toLowerCase()
                    const isCOD = (order.deliveryMethodId || '').toLowerCase() === 'cod'
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

                setStats(newStats)
            } catch (error) {
                console.error('Error fetching order statistics:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (loading) {
        return <FancyLoadingPage />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pending Orders */}
            <div className="relative p-4 bg-white rounded border border-[#e4e7eb] hover:shadow-md transition-shadow">
                <p className='text-xs text-gray-500'>Pending Orders</p>
                <p className='text-lg font-semibold'>{formatAmount(stats.pending.total)}</p>
                <p className='text-xs text-gray-400'>{stats.pending.count} orders</p>
                <span className='absolute right-3 top-3 text-yellow-500/90'>
                    <ShoppingCart size={18} />
                </span>
            </div>

            {/* Processing Orders */}
            <div className="relative p-4 bg-white rounded border border-[#e4e7eb] hover:shadow-md transition-shadow">
                <p className='text-xs text-gray-500'>Processing Orders</p>
                <p className='text-lg font-semibold'>{formatAmount(stats.processing.total)}</p>
                <p className='text-xs text-gray-400'>{stats.processing.count} orders</p>
                <span className='absolute right-3 top-3 text-blue-500/90'>
                    <Package size={18} />
                </span>
            </div>

            {/* Shipped Orders */}
            <div className="relative p-4 bg-white rounded border border-[#e4e7eb] hover:shadow-md transition-shadow">
                <p className='text-xs text-gray-500'>Shipped Orders</p>
                <p className='text-lg font-semibold'>{formatAmount(stats.shipped.total)}</p>
                <p className='text-xs text-gray-400'>{stats.shipped.count} orders</p>
                <span className='absolute right-3 top-3 text-purple-500/90'>
                    <Truck size={18} />
                </span>
            </div>

            {/* Delivered Orders */}
            <div className="relative p-4 bg-white rounded border border-[#e4e7eb] hover:shadow-md transition-shadow">
                <p className='text-xs text-gray-500'>Delivered Orders</p>
                <p className='text-lg font-semibold'>{formatAmount(stats.delivered.total)}</p>
                <p className='text-xs text-gray-400'>{stats.delivered.count} orders</p>
                <span className='absolute right-3 top-3 text-green-600/90'>
                    <Smile size={18} />
                </span>
            </div>

            {/* COD Orders */}
            <div className="relative p-4 bg-white rounded border border-[#e4e7eb] hover:shadow-md transition-shadow">
                <p className='text-xs text-gray-500'>COD Orders</p>
                <p className='text-lg font-semibold'>{formatAmount(stats.cod.total)}</p>
                <p className='text-xs text-gray-400'>{stats.cod.count} orders</p>
                <span className='absolute right-3 top-3 text-orange-500/90'>
                    <ShoppingCart size={18} />
                </span>
            </div>

            {/* Steadfast Orders */}
            <div className="relative p-4 bg-white rounded border border-[#e4e7eb] hover:shadow-md transition-shadow">
                <p className='text-xs text-gray-500'>Steadfast Orders</p>
                <p className='text-lg font-semibold'>{formatAmount(stats.steadfast.total)}</p>
                <p className='text-xs text-gray-400'>{stats.steadfast.count} orders</p>
                <span className='absolute right-3 top-3 text-indigo-500/90'>
                    <Truck size={18} />
                </span>
            </div>

            {/* Cancelled Orders */}
            <div className="relative p-4 bg-white rounded border border-[#e4e7eb] hover:shadow-md transition-shadow">
                <p className='text-xs text-gray-500'>Cancelled Orders</p>
                <p className='text-lg font-semibold'>{formatAmount(stats.cancelled.total)}</p>
                <p className='text-xs text-gray-400'>{stats.cancelled.count} orders</p>
                <span className='absolute right-3 top-3 text-rose-600/90'>
                    <Trash2 size={18} />
                </span>
            </div>

            {/* Total Orders Summary */}
            <div className="relative p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded border border-blue-200 hover:shadow-md transition-shadow">
                <p className='text-xs text-gray-600'>Total Orders Value</p>
                <p className='text-lg font-semibold text-blue-700'>
                    {formatAmount(stats.pending.total + stats.processing.total + stats.shipped.total + stats.delivered.total)}
                </p>
                <p className='text-xs text-gray-500'>
                    {stats.pending.count + stats.processing.count + stats.shipped.count + stats.delivered.count} active orders
                </p>
                <span className='absolute right-3 top-3 text-blue-600/90'>
                    <TrendingUp size={18} />
                </span>
            </div>
        </div>
    );
}


