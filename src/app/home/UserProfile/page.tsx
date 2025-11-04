"use client"
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import OrderSummaryCards from '../../../components/UserProfile/ProfileDashboard/OrderSummaryCards'
import RecentOrdersList from '../../../components/UserProfile/ProfileDashboard/RecentOrdersList'
import { useSession } from 'next-auth/react'
import api from '@/lib/axios'

type DashboardOrder = {
  id: string
  seller: string
  sellerVerified: boolean
  status: 'pending' | 'processing' | 'delivered' | 'cancelled'
  productName: string
  productImage: string
  size: string
  color: string
  price: string
  quantity: number
}

export default function UserProfilePage() {
    const { data: session } = useSession()
    const [orders, setOrders] = useState<DashboardOrder[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true)
            const userLike = (session?.user ?? {}) as { id?: string; _id?: string; role?: string }
            const userId = userLike._id || userLike.id
            const token = (session as { accessToken?: string })?.accessToken
            const userRole = userLike.role

            if (!userId) {
                setOrders([])
                return
            }

            const res = await api.get(`/product-order?userId=${userId}` , {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    ...(userRole ? { 'x-user-role': userRole } : {}),
                }
            })

            const apiOrders = (res.data?.data ?? []) as Array<{
                _id?: string
                storeId?: { storeName?: string; verified?: boolean } | string
                orderStatus?: string
                orderDetails?: Array<{
                    productId?: any
                    quantity?: number
                }>
            }>

            const mapped: DashboardOrder[] = apiOrders.map((o) => {
                const firstItem = Array.isArray(o.orderDetails) && o.orderDetails.length > 0 ? o.orderDetails[0] : undefined
                const product = firstItem?.productId && typeof firstItem.productId === 'object' ? firstItem.productId : undefined
                const priceNumber = product?.discountPrice && product.discountPrice < product.productPrice
                    ? product.discountPrice
                    : product?.productPrice

                return {
                    id: String(o._id || ''),
                    seller: (typeof o.storeId === 'object' && o.storeId && 'storeName' in o.storeId) ? (o.storeId.storeName || 'Store') : 'Store',
                    sellerVerified: (typeof o.storeId === 'object' && o.storeId && 'verified' in o.storeId) ? Boolean((o.storeId as any).verified) : true,
                    status: (o.orderStatus?.toLowerCase() as DashboardOrder['status']) || 'pending',
                    productName: product?.productTitle || 'Product',
                    productImage: product?.thumbnailImage || (Array.isArray(product?.photoGallery) ? (product?.photoGallery[0] || '/img/product/p-1.png') : '/img/product/p-1.png'),
                    size: 'Standard',
                    color: 'Default',
                    price: typeof priceNumber === 'number' ? `৳ ${priceNumber.toLocaleString()}` : '৳ 0',
                    quantity: firstItem?.quantity || 1,
                }
            })

            setOrders(mapped)
        } catch (e) {
            setOrders([])
        } finally {
            setLoading(false)
        }
    }, [session])

    useEffect(() => {
        fetchOrders()
    }, [fetchOrders])

    const counts = orders.reduce(
        (acc, o) => {
            acc.pending += o.status === 'pending' ? 1 : 0
            acc.processing += o.status === 'processing' ? 1 : 0
            acc.delivered += o.status === 'delivered' ? 1 : 0
            acc.cancelled += o.status === 'cancelled' ? 1 : 0
            return acc
        },
        { pending: 0, processing: 0, delivered: 0, cancelled: 0 }
    )

    return (
        <div className="">
            <h1 className="text-xl font-semibold px-4 mt-1">Dashboard</h1>
            <OrderSummaryCards 
                pending={counts.pending}
                processing={counts.processing}
                delivered={counts.delivered}
                cancelled={counts.cancelled}
            />
            <RecentOrdersList orders={orders} />
        </div>
    )
}


