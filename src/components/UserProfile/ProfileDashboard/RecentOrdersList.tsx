import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Store, Star } from 'lucide-react' // ✅ Star আইকন যোগ করা হলো

interface Order {
  id: string
  seller: string
  sellerVerified: boolean
  status: 'pending' | 'processing' | 'delivered' | 'cancelled'
  productName: string
  productImage: string
  productSlug?: string // ✅
  size?: string
  color?: string
  price: string
  quantity: number
  totalPrice?: string
  totalItems?: number
}

interface RecentOrdersListProps {
  orders?: Order[]
}

export default function RecentOrdersList({ orders = [] }: RecentOrdersListProps) {

  const getStatusStyles = (status: Order['status']) => {
    switch (status) {
      case 'cancelled':
        return 'bg-red-50 text-red-600 border-red-100'
      case 'delivered':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      case 'processing':
        return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'pending':
        return 'bg-amber-50 text-amber-600 border-amber-100'
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200'
    }
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg border border-dashed border-gray-300 p-10 text-center text-gray-500 text-sm">
          No recent orders found.
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
            
            {/* ── Header: Store Name & Status ── */}
            <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-gray-800 text-sm">{order.seller}</span>
                {order.sellerVerified && (
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getStatusStyles(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            {/* ── Body: Product Info ── */}
            <Link href={`/home/UserProfile/orders/${order.id}`} className="block hover:bg-gray-50/80 transition-colors">
              <div className="p-4 flex gap-4">
                <div className="relative h-20 w-20 shrink-0 border border-gray-200 rounded-md overflow-hidden bg-white">
                  <Image 
                    src={order.productImage} 
                    alt={order.productName} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{order.productName}</h3>
                    {(order.size || order.color) && (
                      <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                        {order.color && <span>Color: {order.color}</span>}
                        {order.size && order.color && <span className="text-gray-300">|</span>}
                        {order.size && <span>Size: {order.size}</span>}
                      </div>
                    )}
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-sm font-semibold text-gray-900">{order.price}</div>
                    <div className="text-xs text-gray-500 mt-1">Qty: {order.quantity}</div>
                  </div>
                </div>
              </div>
            </Link>

            {/* ── Footer: Order Total & Review Button ── */}
            <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white gap-3">
              <div className="text-xs font-medium text-gray-500">
                {order.totalItems && order.totalItems > 1 ? `${order.totalItems} Items` : '1 Item'}
              </div>
              
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full sm:w-auto">
                <div className="text-sm flex items-center gap-2">
                  <span className="text-gray-600 font-medium">Total Order:</span>
                  <span className="text-lg font-bold text-[#EF4A23]">{order.totalPrice || order.price}</span>
                </div>

                {/* ✅ শুধুমাত্র Delivered হলেই Review বাটন শো করবে */}
                {order.status === 'delivered' && order.productSlug && (
                  <Link 
                    href={`/product/${order.productSlug}#reviews`}
                    className="text-xs font-bold text-[#0097E9] bg-blue-50 hover:bg-[#0097E9] hover:text-white border border-blue-100 hover:border-[#0097E9] px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Star className="w-3.5 h-3.5" />
                    Write a Review
                  </Link>
                )}
              </div>
            </div>
            
          </div>
        ))
      )}
    </div>
  )
}