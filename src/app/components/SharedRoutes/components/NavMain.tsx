
import { Handbag, Heart, User } from 'lucide-react'
import Image from 'next/image'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import LogInRegister from '../../LogInAndRegister/LogIn_Register'
import SearchBar from './SearchBar'

export default function NavMain() {


    return (
        <div className='bg-[#FFFFFF] text-black  flex justify-between items-center py-5 px-15 border-2'>
            <div className="logo">
                <Image src="/logo.png" width={130} height={44} alt="logo" />
            </div>
            <div className="search flex items-center justify-center w-full max-w-md mx-auto relative">
                {/* Search functionality */}
                <SearchBar />
            </div>
            <div>
                <Dialog>
                    <ul className='flex gap-4 text-base'>
                        <li className='flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer'><Heart /><span className='text-[#00005E] text-[12px]'> Whishlist</span></li>
                        <li className='flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer'><Handbag /><span className='text-[#00005E] text-[12px]'> Cart</span></li>
                        <DialogTrigger>
                            <li className='flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer'><User /><span className='text-[#00005E] text-[12px]'>
                                Login /Register
                            </span></li>
                        </DialogTrigger>
                    </ul>
                    {/* Login page */}
                    <LogInRegister />
                </Dialog>
            </div>
        </div>
    )
}
