import React from 'react'
import StatsCards from './components/StatsCards'

export default function BuySellDashboard() {
  return (
    <div>
      <h1>Dashboard Overview 🍉</h1>
      <h5>Welcome back! Here&apos;s what&apos;s happening with your site today.</h5>
      <div className="p-6">
        <StatsCards />
      </div>
    </div>
  )
}
