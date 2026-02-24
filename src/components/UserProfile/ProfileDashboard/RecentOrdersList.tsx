import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

interface Order {
  id: string
  seller: string
  sellerVerified: boolean
  status: 'pending' | 'processing' | 'delivered' | 'cancelled'
  productName: string
  productImage: string
  size?: string
  color?: string
  price: string
  quantity: number
}

interface RecentOrdersListProps {
  orders?: Order[]
}

export default function RecentOrdersList({ orders = [] }: RecentOrdersListProps) {

  const getStatusStyles = (status: Order['status']) => {
    switch (status) {
      case 'cancelled':
        return 'bg-red-100 text-red-600'
      case 'delivered':
        return 'bg-green-100 text-green-700'
      case 'processing':
        return 'bg-blue-100 text-blue-600'
      case 'pending':
        return 'bg-yellow-100 text-yellow-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="space-y-3 p-4">
      <h2 className="text-base font-semibold">Recent Orders</h2>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-md border p-8 text-center text-gray-500 text-sm">
          No recent orders found.
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="bg-white rounded-md border shadow-sm">
            <div className="px-4 py-2 text-sm border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{order.seller}</span>
                {order.sellerVerified && (
                  <span className="text-blue-600 text-xs flex items-center gap-1">
                    Verified Seller
                    <CheckCircle className="h-3 w-3" />
                  </span>
                )}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${getStatusStyles(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <Link href={`/home/UserProfile/orders/${order.id}`} className="p-4 flex gap-4 hover:bg-gray-50 transition-colors">
              <Image 
                src={order.productImage} 
                alt={order.productName} 
                width={64} 
                height={64} 
                className="rounded border object-cover h-16 w-16" 
              />
              <div className="text-sm flex-1">
                <div className="font-medium line-clamp-2">{order.productName}</div>
                {(order.size || order.color) && (
                  <div className="text-gray-500 mt-1 text-xs">
                    {order.size && <span>Size: {order.size}</span>}
                    {order.size && order.color && ' · '}
                    {order.color && <span>Color: {order.color}</span>}
                  </div>
                )}
                <div className="text-blue-600 font-semibold mt-1">{order.price}</div>
                <div className="text-xs text-gray-500 mt-0.5">Qty {order.quantity}</div>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  )
}