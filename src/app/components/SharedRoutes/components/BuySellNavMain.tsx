
import { User } from 'lucide-react'
import Image from 'next/image'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import LogInRegister from '../../LogInAndRegister/LogIn_Register'
import SearchBar from './SearchBar'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function BuySellNavMain() {
    const { data: session } = useSession()
    // status
    console.log("Navuser is", session)
    // const user = session?.user

    return (
        <div className='bg-[#FFFFFF] text-black flex w-full justify-between items-center py-5 md:px-15 border-2'>
            <Link href={'/'} className="logo">
                <Image src="/img/logo.png" width={130} height={44} alt="logo" />
            </Link>
            <div className="search  hidden md:flex items-center justify-center w-full max-w-md mx-auto relative">
                {/* Search functionality */}
                <SearchBar />
                <SearchBar />
            </div>
            <div>
                <Dialog>
                    <ul className='flex gap-4 text-base'>
                        {session ? <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex flex-col items-center focus:outline-none">
                                        <Image
                                            src={session?.user?.image || "/default-avatar.png"}
                                            alt="Profile"
                                            width={28}
                                            height={28}
                                            className="rounded-full cursor-pointer"
                                        />
                                        <span className="text-xs text-gray-800">Profile</span>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="top" align="end" className="w-40">
                                    <DropdownMenuItem asChild>
                                        <Link href="/home/UserProfile" className='cursor-pointer'>Profile Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => signOut()} className='cursor-pointer'>
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </> :
                            <DialogTrigger>
                                <li className='hidden md:flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer'><User /><span className='text-[#00005E] text-[12px]'>
                                    Login /Register
                                </span></li>

                            </DialogTrigger>
                        }
                        <Link href={'/home/buyandsell/select/category'}>
                            {/* className='flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer' */}
                            <Button variant={'BlueBtn'}>Post a Free Add</Button>
                        </Link>
                    </ul>
                    {/* Login page */}
                    <LogInRegister />
                </Dialog>
            </div>
        </div>
    )
}
