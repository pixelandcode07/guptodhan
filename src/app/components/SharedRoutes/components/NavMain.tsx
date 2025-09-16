
import { Handbag, Heart, LogOut, User } from 'lucide-react'
import Image from 'next/image'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import LogInRegister from '../../LogInAndRegister/LogIn_Register'
import SearchBar from './SearchBar'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function NavMain() {
    const { data: session, status } = useSession()
    console.log("Navuser is", session)
    const user = session?.user
    const avatarInitial = (user?.name ?? user?.email ?? 'U').charAt(0).toUpperCase()

    return (
        <div className='bg-[#FFFFFF] text-black  flex justify-between items-center py-5 px-15 border-2'>
            <Link href={'/'} className="logo">
                <Image src="/logo.png" width={130} height={44} alt="logo" />
            </Link>
            <div className="search flex items-center justify-center w-full max-w-md mx-auto relative">
                {/* Search functionality */}
                <SearchBar />
            </div>
            <div>
                <Dialog>
                    <ul className='flex gap-4 text-base'>
                        <li className='flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer'><Heart /><span className='text-[#00005E] text-[12px]'> Whishlist</span></li>
                        <li className='flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer'><Handbag /><span className='text-[#00005E] text-[12px]'> Cart</span></li>

                        {session ? <>
                            <li className='flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer'>
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={user?.image || ''} alt={user?.name ?? 'Profile picture'} />
                                    <AvatarFallback>{avatarInitial}</AvatarFallback>
                                </Avatar>
                                <span className='text-[#00005E] text-[12px]'>Profile</span>
                            </li>
                            <li
                                onClick={() => signOut()}
                                className='flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer'><LogOut /><span className='text-[#00005E] text-[12px]'>
                                    Log out
                                </span>
                            </li>
                        </> :
                            <DialogTrigger>
                                <li className='flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer'><User /><span className='text-[#00005E] text-[12px]'>
                                    Login /Register
                                </span></li>

                            </DialogTrigger>
                        }

                    </ul>
                    {/* Login page */}
                    <LogInRegister />
                </Dialog>
            </div>
        </div>
    )
}
