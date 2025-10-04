import React from 'react'
import StatsCards from './components/StatsCards'

export default function BuySellDashboard() {
  return (
    <div className="p-6 space-y-10">
      <div>
        <h1 className='text-2xl font-semibold'>Dashboard Overview 🍉</h1>
        <h5 className='text-base text-gray-500'>Welcome back! Here&apos;s what&apos;s happening with your site today.</h5>
      </div>
      <div >
        <StatsCards />
      </div>
    </div>
  )
}
