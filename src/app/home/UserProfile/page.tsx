"use client"
import React, { useEffect, useState, useCallback } from 'react'
import OrderSummaryCards from '../../../components/UserProfile/ProfileDashboard/OrderSummaryCards'
import RecentOrdersList from '../../../components/UserProfile/ProfileDashboard/RecentOrdersList'
import { useSession } from 'next-auth/react'
import api from '@/lib/axios'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export type DashboardOrder = {
    id: string
    seller: string
    sellerVerified: boolean
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'return request' | 'returned'
    items: Array<{
        productName: string
        productImage: string
        productSlug: string
        size: string
        color: string
        price: string
        quantity: number
    }>
    totalPrice: string
    totalItems: number
}

const hasVariant = (v: string | undefined): boolean => {
  const s = v != null ? String(v).trim() : ''
  return s !== '' && s !== '—'
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

            const res = await api.get(`/product-order?userId=${userId}`, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    ...(userRole ? { 'x-user-role': userRole } : {}),
                }
            })

            const apiOrders = (res.data?.data ?? []) as Array<{
                _id?: string
                storeId?: { storeName?: string; verified?: boolean } | string
                orderStatus?: string
                totalAmount?: number
                orderDetails?: Array<{
                    productId?: { _id?: string; slug?: string; productTitle?: string; thumbnailImage?: string; photoGallery?: string[]; productPrice?: number; discountPrice?: number }
                    quantity?: number
                    size?: string
                    color?: string
                }>
            }>

            const mapped: DashboardOrder[] = apiOrders.map((o) => {
                const orderItems = (o.orderDetails || []).map((detail) => {
                    const product = detail.productId && typeof detail.productId === 'object' ? detail.productId : undefined;
                    const priceNumber = product?.discountPrice != null && product?.productPrice != null && product.discountPrice < product.productPrice
                        ? product.discountPrice
                        : product?.productPrice;
                    const img = product?.thumbnailImage || (Array.isArray(product?.photoGallery) && product.photoGallery?.length ? product.photoGallery[0] : null);
                    
                    return {
                        productName: product?.productTitle || 'Product',
                        productImage: img || '/img/product/p-1.png',
                        productSlug: product?.slug || product?._id || '',
                        size: detail.size != null && hasVariant(detail.size) ? detail.size : '',
                        color: detail.color != null && hasVariant(detail.color) ? detail.color : '',
                        price: typeof priceNumber === 'number' ? `৳ ${priceNumber.toLocaleString()}` : '৳ 0',
                        quantity: detail.quantity || 1,
                    };
                });

                const totalItemsCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);
                const orderTotal = o.totalAmount != null 
                    ? o.totalAmount 
                    : orderItems.reduce((sum, item) => sum + (Number(item.price.replace(/[^0-9]/g, '')) * item.quantity), 0);

                return {
                    id: String(o._id || ''),
                    seller: (typeof o.storeId === 'object' && o.storeId && 'storeName' in o.storeId) ? (o.storeId.storeName || 'Store') : 'Store',
                    sellerVerified: (typeof o.storeId === 'object' && o.storeId && 'verified' in o.storeId) ? Boolean((o.storeId as { verified?: boolean }).verified) : true,
                    status: (o.orderStatus?.toLowerCase() as DashboardOrder['status']) || 'pending',
                    items: orderItems,
                    totalPrice: `৳ ${orderTotal.toLocaleString()}`,
                    totalItems: totalItemsCount,
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

    // ✅ FIXED: Counting Logic (Shipped goes to Processing, Return Request added)
    const counts = orders.reduce(
        (acc, o) => {
            const status = o.status.toLowerCase();
            if (status === 'pending') acc.pending++;
            else if (status === 'processing' || status === 'shipped') acc.processing++;
            else if (status === 'delivered') acc.delivered++;
            else if (status === 'cancelled') acc.cancelled++;
            else if (status === 'return request' || status === 'returned') acc.returns++;
            return acc;
        },
        { pending: 0, processing: 0, delivered: 0, cancelled: 0, returns: 0 }
    )

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading your dashboard...</div>;
    }

    return (
        <div className="">
            <div className="flex items-center justify-between px-4 mt-2 mb-4">
                <h1 className="text-xl font-semibold">Dashboard</h1>
                <Link href="/products" className="flex items-center gap-2 bg-[#0097E9] hover:bg-[#0097E9]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                    <ShoppingBag className="w-4 h-4" />
                    Shop Now
                </Link>
            </div>
            
            {/* ✅ Updated Prop passed down */}
            <OrderSummaryCards 
                pending={counts.pending} 
                processing={counts.processing} 
                delivered={counts.delivered} 
                cancelled={counts.cancelled} 
                returns={counts.returns} 
            />
            
            <RecentOrdersList orders={orders} />
        </div>
    )
}