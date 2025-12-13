import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import ProfileClient from './components/ProfileClient'
import PageHeader from '@/components/ReusableComponents/PageHeader'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  const user = session?.user
  const userName = user?.name ?? 'Guest User'
  const userImage = user?.image ?? null

  return (
    <div className="bg-white rounded-md p-6">
      <PageHeader title="Profile" />

      <ProfileClient 
        userName={userName} 
        userImage={userImage}
      />
    </div>
  )
}
