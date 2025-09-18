import React from 'react'
import HeroNav from '@/app/components/Hero/HeroNav'
import ShoppingInfoContent from './ShoppingInfoContent'

export default function ShoppingInfoPage() {
  return (
    <>
      <HeroNav />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ShoppingInfoContent />
      </div>
    </>
  )
}
