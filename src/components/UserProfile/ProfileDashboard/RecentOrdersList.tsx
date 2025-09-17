import React from 'react'
import Image from 'next/image'
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
  // Default sample data
  const defaultOrders: Order[] = [
    {
      id: '1',
      seller: 'TechStore Pro',
      sellerVerified: true,
      status: 'cancelled',
      productName: 'Braun Silk-épil 9 Cordless Epilator',
      productImage: '/img/product/p-1.png',
      size: 'XL',
      color: 'Green',
      price: '৳ 7,200',
      quantity: 1,
    },
    {
      id: '2',
      seller: 'TechStore Pro',
      sellerVerified: true,
      status: 'delivered',
      productName: 'Braun Silk-épil 9 Cordless Epilator',
      productImage: '/img/product/p-2.png',
      size: 'XL',
      color: 'Green',
      price: '৳ 7,200',
      quantity: 1,
    },
  ]

  const displayOrders = orders.length > 0 ? orders : defaultOrders

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
    <div className="space-y-3">
      <h2 className="text-base font-semibold">Recent Orders</h2>
      {displayOrders.map((order) => (
        <div key={order.id} className="bg-white rounded-md border">
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
            <span className={`text-xs px-2 py-0.5 rounded ${getStatusStyles(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <div className="p-4 flex gap-4">
            <Image 
              src={order.productImage} 
              alt="Product" 
              width={64} 
              height={64} 
              className="rounded border" 
            />
            <div className="text-sm">
              <div className="font-medium">{order.productName}</div>
              <div className="text-gray-600">
                {order.size && order.color ? `Size: ${order.size}, Color: ${order.color}` : ''}
              </div>
              <div className="text-blue-600 font-semibold">{order.price}</div>
              <div className="text-xs text-gray-500">Qty {order.quantity}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


