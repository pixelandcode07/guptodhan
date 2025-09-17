
import { Handbag, Heart, LogOut, User } from 'lucide-react'
import Image from 'next/image'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import LogInRegister from '../../LogInAndRegister/LogIn_Register'
import SearchBar from './SearchBar'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function BuySellNavMain() {
    const { data: session, status } = useSession()
    console.log("Navuser is", session)
    const user = session?.user

    return (
        <div className='bg-[#FFFFFF] text-black  flex justify-between items-center py-5 px-15 border-2'>
            <Link href={'/'} className="logo">
                <Image src="/logo.png" width={130} height={44} alt="logo" />
            </Link>
            <div className="search flex items-center justify-center w-full max-w-md mx-auto relative">
                {/* Search functionality */}
                <SearchBar />
                <SearchBar />
            </div>
            <div>
                <Dialog>
                    <ul className='flex gap-4 text-base'>
                        {/* <li className='flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer'><Heart /><span className='text-[#00005E] text-[12px]'> Whishlist</span></li>
                        <li className='flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer'><Handbag /><span className='text-[#00005E] text-[12px]'> Cart</span></li> */}

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
                        <Button variant={'BlueBtn'}>Post a Free Add</Button>
                    </ul>
                    {/* Login page */}
                    <LogInRegister />
                </Dialog>
            </div>
        </div>
    )
}
