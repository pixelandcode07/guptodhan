"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User, LogOut } from 'lucide-react'
import SearchBar from './SearchBar'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import LogInRegister from '../../LogInAndRegister/LogIn_Register'

export default function DonationNavMain() {
    const { data: session } = useSession()
    const user = session?.user
    const router = useRouter()

    return (
        // ✅ Fixed Alignment: Matches Donation Pages & JustForYou
        <div className='bg-white border-b-2'>
            <div className='md:max-w-[95vw] xl:container mx-auto px-4 md:px-8 py-4 flex justify-between items-center'>
                
                {/* Logo Section */}
                <Link href={'/'} className="logo flex-shrink-0">
                    <Image 
                        src="/img/logo.png" 
                        width={130} 
                        height={44} 
                        alt="logo" 
                        priority 
                        className="w-[100px] md:w-[130px] h-auto"
                    />
                </Link>
                
                {/* Search Bar Section - Centered */}
                <div className="hidden md:flex flex-1 max-w-md mx-6 lg:mx-10 relative">
                    <SearchBar />
                </div>

                {/* Auth & Navigation Section */}
                <div className="flex-shrink-0">
                    <Dialog>
                        <ul className='flex gap-4 sm:gap-6 text-base items-center'>
                            {session ? (
                                <>
                                    {/* Profile Link */}
                                    <li className='flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer'>
                                        <Link href={'/home/UserProfile'} className='flex flex-col justify-center items-center gap-1 group'>
                                            {user?.image ? (
                                                <Image 
                                                    src={user.image} 
                                                    width={24} 
                                                    height={24} 
                                                    alt={user?.name ?? 'Profile'} 
                                                    className='rounded-full border border-gray-200 group-hover:border-blue-500 transition-colors' 
                                                />
                                            ) : (
                                                <User size={20} className="group-hover:text-blue-600 transition-colors" />
                                            )}
                                            <span className='text-[#00005E] text-[10px] sm:text-[12px] group-hover:text-blue-600 transition-colors'>Profile</span>
                                        </Link>
                                    </li>

                                    {/* Logout Button */}
                                    <li 
                                        onClick={() => signOut()} 
                                        className='flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer gap-1 group'
                                    >
                                        <LogOut size={20} className="group-hover:text-red-600 transition-colors" />
                                        <span className='text-[#00005E] text-[10px] sm:text-[12px] group-hover:text-red-600 transition-colors'>Log out</span>
                                    </li>

                                    {/* Donate Button (Only for Logged in Users) */}
                                    <li>
                                        <Button 
                                            variant={'BlueBtn'} 
                                            size="sm"
                                            className="h-9 px-4 text-xs sm:text-sm font-semibold shadow-md"
                                            type='button' 
                                            onClick={() => router.push('/donation?donate=1')}
                                        >
                                            Donate
                                        </Button>
                                    </li>
                                </>
                            ) : (
                                /* Login / Register Trigger (When User is NOT Logged in) */
                                <DialogTrigger asChild>
                                    <li
                                        onClick={() => {
                                            if (typeof window !== 'undefined') {
                                                localStorage.setItem("redirectAfterLogin", window.location.pathname + window.location.search);
                                            }
                                        }}
                                        className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer gap-1 group"
                                    >
                                        <User size={22} className="group-hover:text-blue-600 transition-colors" />
                                        <span className="text-[#00005E] text-[10px] sm:text-[12px] group-hover:text-blue-600 transition-colors">Login / Register</span>
                                    </li>
                                </DialogTrigger>
                            )}
                        </ul>

                        {/* Login Modal Content */}
                        <DialogContent className="sm:max-w-md p-0 border-none bg-transparent shadow-none">
                            <LogInRegister />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}