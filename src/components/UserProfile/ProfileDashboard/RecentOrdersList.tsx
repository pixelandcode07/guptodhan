import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Store, Star, ArrowRight } from 'lucide-react'
import { DashboardOrder } from '@/app/home/UserProfile/page'

interface RecentOrdersListProps {
  orders?: DashboardOrder[]
}

export default function RecentOrdersList({ orders = [] }: RecentOrdersListProps) {

  const getStatusStyles = (status: DashboardOrder['status']) => {
    switch (status) {
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100'
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      case 'processing': return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100'
      default: return 'bg-gray-50 text-gray-600 border-gray-200'
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
            
            <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-gray-800 text-sm">{order.seller}</span>
                {order.sellerVerified && <CheckCircle className="h-4 w-4 text-blue-500" />}
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getStatusStyles(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            {/* ✅ সবগুলো প্রোডাক্ট শো করানো হচ্ছে */}
            <div className="flex flex-col">
              {order.items.map((item, idx) => (
                <Link key={idx} href={`/product/${item.productSlug}`} className="p-4 flex gap-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors block">
                  <div className="relative h-20 w-20 shrink-0 border border-gray-200 rounded-md overflow-hidden bg-white block">
                    <Image src={item.productImage} alt={item.productName} fill className="object-cover hover:scale-105 transition-transform" />
                  </div>
                  
                  <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-[#0097E9] transition-colors">
                        {item.productName}
                      </div>
                      {(item.size || item.color) && (
                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                          {item.color && <span>Color: {item.color}</span>}
                          {item.size && item.color && <span className="text-gray-300">|</span>}
                          {item.size && <span>Size: {item.size}</span>}
                        </div>
                      )}
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-sm font-semibold text-gray-900">{item.price}</div>
                      <div className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white gap-3">
              <div className="text-xs font-medium text-gray-500">
                {order.totalItems && order.totalItems > 1 ? `${order.totalItems} Items` : '1 Item'}
              </div>
              
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full sm:w-auto">
                <div className="text-sm flex items-center gap-2">
                  <span className="text-gray-600 font-medium">Total Order:</span>
                  <span className="text-lg font-bold text-[#EF4A23]">{order.totalPrice}</span>
                </div>

                <div className="flex gap-2">
                   {/* ✅ Review Button (আগের জায়গায়) */}
                   {order.status === 'delivered' && order.items.length > 0 && order.items[0].productSlug && (
                     <Link 
                        href={`/product/${order.items[0].productSlug}#reviews`} 
                        onClick={(e) => e.stopPropagation()} 
                        className="text-xs font-bold text-[#0097E9] bg-blue-50 hover:bg-[#0097E9] hover:text-white border border-blue-100 px-4 py-2 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap"
                     >
                       <Star className="w-3.5 h-3.5" /> Write a Review
                     </Link>
                   )}
                   
                   <Link href={`/home/UserProfile/orders/${order.id}`} className="text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 px-4 py-2 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap">
                     View Order <ArrowRight className="w-3.5 h-3.5" />
                   </Link>
                </div>
              </div>
            </div>
            
          </div>
        ))
      )}
    </div>
  )
}