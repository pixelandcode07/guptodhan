'use client'


import { useSession } from 'next-auth/react'

export default function VendorDashboard() {
  const session = useSession()
  // console.log('Vendor Dashboard Session:', session)
  const vendorRole = (session?.data?.user as any)?.role
  console.log("Vendor role:", vendorRole)
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Vendor Dashboard</h1>
      <p>Welcome back! Here's your store overview.</p>
    </div>
  )
}
