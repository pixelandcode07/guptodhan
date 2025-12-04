// import BuySellLayoutWrapper from '@/Providers/BuySellLayoutWrapper'
import type { Metadata } from 'next'
// import UserSidebar from '@/components/UserProfile/UserSidebar'

export const metadata: Metadata = {
  title: 'User Profile',
}

export default function BuyAndSellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      {/* flex gap-6 max-w-7xl mx-auto w-full px-4 py-6 */}
      {/* <main className="flex-1"> */}
      {/* <BuySellLayoutWrapper> */}
        {children}
      {/* </BuySellLayoutWrapper> */}
      {/* </main> */}
    </div>
  )
}


