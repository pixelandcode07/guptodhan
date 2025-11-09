import { ChevronDown, Heart, LogOut, Menu, User, X } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import LogInRegister from '../../LogInAndRegister/LogIn_Register';
import SearchBar from './SearchBar';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { navigationData } from '@/data/navigation_data';
import CartIcon from '@/components/CartIcon';
import WishlistIcon from '@/components/WishlistIcon';

export default function NavMain() {
  const { data: session } = useSession();
  const user = session?.user;
  const [mobileOpen, setMobileOpen] = useState(false);

  // Track which category is open
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (title: string) => {
    if (openCategory === title) {
      setOpenCategory(null);
    } else {
      setOpenCategory(title);
    }
  };

  return (
    <div> 
{/* bg-[#0097E9] md:bg-[#FFFFFF] text-black md:max-w-[90vw] m-auto flex justify-between items-center py-2 md:py-5 px-1 md:px-1 lg:px-10 border-2 md:border-0 */}
    <div className="bg-[#0097E9] md:bg-[#FFFFFF] text-black max-w-[95vw] xl:max-w-[90vw] mx-auto flex justify-between items-center py-2 md:py-5 px-1 md:px-1 lg:px-10 border-2 md:border-0">
      <div className="flex justify-between items-center gap2">
        <div className="flex lg:block items-center">
          {/* <button
            // onClick={openMenu}
            className="block lg:hidden ml-3">
            <Menu />
          </button> */}
          <button
            className="block lg:hidde text-white cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link href={'/'} className="logo hidden md:block">
            <Image src="/img/logo.png" width={130} height={44} alt="logo" />
          </Link>
          <Link href={'/'} className="logo md:hidden">
            <Image src="/white-logo.png" width={120} height={40} alt="logo" />
          </Link>
        </div>
        {/* Search functionality for mobile view */}
        <div className="search flex md:hidden max-w-1/2 items-center justify-center w-full  my-2 md:my-5 relative">
          <SearchBar />
        </div>
      </div>
      {/* Search functionality for Laptop view */}
      <div className="search hidden md:flex items-center justify-center w-full max-w-[30vw] lg:max-w-md mx-auto relative">
        <SearchBar />
      </div>

      <div className="hidden md:flex">
        <Dialog>
          <ul className="flex gap-4 text-base">
            <li>
              <WishlistIcon className="text-[#00005E]" />
            </li>
            <li>
              <CartIcon />
            </li>

            {session ? (
              <>
                <li className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer">
                  <Link
                    href={'/home/UserProfile'}
                    className="flex flex-col justify-center items-center">
                    {user?.image ? (
                      <Image
                        src={user.image}
                        width={24}
                        height={24}
                        alt={user?.name ?? 'Profile picture'}
                        className="rounded-full"
                      />
                    ) : (
                      <User />
                    )}
                    <span className="text-[#00005E] text-[12px]">Profile</span>
                  </Link>
                </li>
                <li
                  onClick={() => signOut()}
                  className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer">
                  <LogOut />
                  <span className="text-[#00005E] text-[12px]">Log out</span>
                </li>
              </>
            ) : (
              <DialogTrigger>
                <li className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer">
                  <User />
                  <span className="text-[#00005E] text-[12px]">
                    Login /Register
                  </span>
                </li>
              </DialogTrigger>
            )}
          </ul>
          {/* Login page */}
          <LogInRegister />
        </Dialog>
      </div>
    </div>

     {/* Mobile HeroNav Below Main Nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#000066] text-white w-full">
          {/* Mobile Cart and Wishlist */}
          <div className="flex justify-center gap-6 py-4 border-b border-gray-600">
            <WishlistIcon className="text-white" />
            <div className="flex flex-col items-center text-white">
              <CartIcon showCount={true} className="text-white" />
            </div>
          </div>
          
          <ul className="flex flex-col px-3 py-2 gap-1">
            {navigationData.map(nav => (
              <li key={nav.title}>
                {/* Category Button */}
                <button
                  className="flex text-white justify-between w-full py-2 px-2 font-medium items-center cursor-pointer hover:text-gray-300"
                  onClick={() => toggleCategory(nav.title)}>
                  {nav.title}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openCategory === nav.title ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Subcategories */}
                {openCategory === nav.title && (
                  <div className="pl-4 flex flex-col gap-1">
                    {nav.subtitles.map(item => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="py-1 px-2 rounded hover:bg-gray-100 hover:text-[#000066] transition-colors">
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      
    </div >
  );
}
