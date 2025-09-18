import Image from 'next/image'
import Link from 'next/link'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import LogInRegister from '../../LogInAndRegister/LogIn_Register'
import { useSession, signOut } from 'next-auth/react'
import { User, LogOut } from 'lucide-react'
import SearchBar from './SearchBar'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function DonationNavMain() {
    const { data: session } = useSession()
    const user = session?.user
    const router = useRouter()

    return (
        <div className='bg-[#FFFFFF] text-black  flex justify-between items-center py-5 px-15 border-2'>
            <Link href={'/'} className="logo">
                <Image src="/logo.png" width={130} height={44} alt="logo" />
            </Link>
            <div className="search flex items-center justify-center w-full max-w-md mx-auto relative">
                <SearchBar />
            </div>
            <div>
                <Dialog>
                    <ul className='flex gap-4 text-base'>
                        {session ? <>
                            <li className='flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer'>
                                <Link href={'/home/UserProfile'} className='flex flex-col justify-center items-center'>
                                    {user?.image ? (
                                        <Image src={user.image} width={24} height={24} alt={user?.name ?? 'Profile picture'} className='rounded-full' />
                                    ) : (
                                        <User />
                                    )}
                                    <span className='text-[#00005E] text-[12px]'>Profile</span>
                                </Link>
                            </li>
                            <li onClick={(e) => { e.stopPropagation(); signOut(); }} className='flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer'>
                                <LogOut />
                                <span className='text-[#00005E] text-[12px]'>Log out</span>
                            </li>
                        </> :
                            <DialogTrigger>
                                <li className='flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer'>
                                    <User />
                                    <span className='text-[#00005E] text-[12px]'>Login /Register</span>
                                </li>
                            </DialogTrigger>
                        }
                        <Button variant={'BlueBtn'} type='button' onClick={() => router.push('/home/donation?donate=1')}>Donate</Button>
                    </ul>
                    <LogInRegister />
                </Dialog>
            </div>
        </div>
    )
}


