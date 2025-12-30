"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User, LogOut, LogIn } from 'lucide-react'
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
        <div className='bg-[#FFFFFF] text-black flex justify-between items-center py-5 px-6 md:px-15 border-b-2'>
            {/* Logo Section */}
            <Link href={'/'} className="logo">
                <Image 
                    src="/img/logo.png" 
                    width={130} 
                    height={44} 
                    alt="logo" 
                    priority 
                />
            </Link>
            
            {/* Search Bar Section */}
            <div className="search hidden md:flex items-center justify-center w-full max-w-md mx-auto relative">
                <SearchBar />
            </div>

            {/* Auth & Navigation Section */}
            <div>
                <Dialog>
                    <ul className='flex gap-4 text-base items-center'>
                        {session ? (
                            <>
                                {/* Profile Link */}
                                <li className='flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer'>
                                    <Link href={'/home/UserProfile'} className='flex flex-col justify-center items-center gap-1'>
                                        {user?.image ? (
                                            <Image 
                                                src={user.image} 
                                                width={24} 
                                                height={24} 
                                                alt={user?.name ?? 'Profile'} 
                                                className='rounded-full' 
                                            />
                                        ) : (
                                            <User size={20} />
                                        )}
                                        <span className='text-[#00005E] text-[12px]'>Profile</span>
                                    </Link>
                                </li>

                                {/* Logout Button */}
                                <li 
                                    onClick={() => signOut()} 
                                    className='flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer gap-1'
                                >
                                    <LogOut size={20} />
                                    <span className='text-[#00005E] text-[12px]'>Log out</span>
                                </li>

                                {/* Donate Button (Only for Logged in Users) */}
                                <li>
                                    <Button 
                                        variant={'BlueBtn'} 
                                        type='button' 
                                        onClick={() => router.push('/home/donation?donate=1')}
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
                                        localStorage.setItem("redirectAfterLogin", window.location.pathname + window.location.search);
                                    }}
                                    className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer gap-1"
                                >
                                    <User size={22} />
                                    <span className="text-[#00005E] text-[12px]">Login / Register</span>
                                </li>
                            </DialogTrigger>
                        )}
                    </ul>

                    {/* Login Modal Content */}
                    <DialogContent className="sm:max-w-md p-0 border-none bg-transparent">
                        <LogInRegister />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}