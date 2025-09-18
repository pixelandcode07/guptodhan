import React from 'react'
import HeroNav from '@/app/components/Hero/HeroNav'
import ShoppingCartContent from './ShoppingCartContent'

// Mock data for shopping cart

const mockCartItems = [
  {
    id: '1',
    seller: {
      name: 'TechStore Pro',
      verified: true
    },
    product: {
      id: 'p1',
      name: 'Braun Silk-épil 9 Cordless Epilator',
      image: '/img/product/p-1.png',
      size: 'XL',
      color: 'Green',
      price: 7200,
      originalPrice: 7400,
      quantity: 2
    }
  },
  {
    id: '2',
    seller: {
      name: 'TechStore Pro',
      verified: true
    },
    product: {
      id: 'p2',
      name: 'Braun Silk-épil 9 Cordless Epilator',
      image: '/img/product/p-2.png',
      size: 'L',
      color: 'Blue',
      price: 7200,
      originalPrice: 7400,
      quantity: 1
    }
  }
]

const mockRecommendations = [
  { id: 'r1', name: 'Philips Epilator', price: 4500, originalPrice: 5000, image: '/img/product/p-1.png' },
  { id: 'r2', name: 'Pet House', price: 3200, originalPrice: 3800, image: '/img/product/p-2.png' },
  { id: 'r3', name: 'Panasonic Epilator', price: 2800, originalPrice: 3200, image: '/img/product/p-3.png' },
  { id: 'r4', name: 'Hair Dryer', price: 1500, originalPrice: 1800, image: '/img/product/p-4.png' },
  { id: 'r5', name: 'Curling Iron', price: 2200, originalPrice: 2500, image: '/img/product/p-5.png' },
  { id: 'r6', name: 'Smart Watch', price: 8900, originalPrice: 9500, image: '/img/product/p-1.png' }
]

export default function ShoppingCartPage() {
  return (
    <>
      <HeroNav />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ShoppingCartContent cartItems={mockCartItems} recommendations={mockRecommendations} />
      </div>
    </>
  )
}
