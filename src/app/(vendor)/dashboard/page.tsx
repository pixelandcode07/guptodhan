// 'use client'


import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
// import { useSession } from 'next-auth/react'

export default async function VendorDashboard() {
  // const session = useSession()
  // const session = getServerSession(authOptions)

  const session = await getServerSession(authOptions);
  // const token = session?.accessToken as string | undefined;
  console.log('Vendor Dashboard Session:', session)
  // const vendorRole = (session?.data?.user as any)?.role
  // console.log("Vendor role:", vendorRole)
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Vendor Dashboard</h1>
      <p>Welcome back! Here's your store overview.</p>
    </div>
  )
}
