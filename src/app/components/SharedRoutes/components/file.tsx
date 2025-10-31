'use client';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { navigationData } from '@/data/navigation_data';
import {
  ChevronDown,
  Handbag,
  Heart,
  LogOut,
  Menu,
  User,
  X,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import LogInRegister from '../../LogInAndRegister/LogIn_Register';
import SearchBar from './SearchBar';

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
    <div className="relative">
      {/* Main Nav */}
      <div className="bg-[#0097E9] md:bg-[#FFFFFF] text-black flex justify-between items-center md:py-5 px-3 border-2">
        <div className="flex w-full gap-2 py-3 items-center justify-between">
          <div className="flex gap-2">
            {/* Mobile Menu Button */}
            <button
              className="block lg:hidde text-white cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href={'/'}>
              <Image
                src={'/white-logo.png'}
                width={130}
                height={40}
                alt="logo"
              />
            </Link>
          </div>
          {/* Mobile Search */}{' '}
          <div className="flex lg:hidden max-w-1/2 items-center justify-center w-full relative">
            <SearchBar />{' '}
          </div>
        </div>

        {/* Desktop Search */}
        <div className="hidden lg:flex items-center justify-center w-full max-w-md mx-auto relative">
          <SearchBar />
        </div>

        {/* Right Icons */}
        <div className="hidden md:flex items-center gap-4">
          <Dialog>
            <ul className="flex gap-4 text-base">
              <li className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer">
                <Heart />
                <span className="text-[12px]">Wishlist</span>
              </li>
              <li className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer">
                <Handbag />
                <span className="text-[12px]">Cart</span>
              </li>

              {session ? (
                <>
                  <li className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer">
                    <Link href={'/home/UserProfile'}>
                      {user?.image ? (
                        <Image
                          src={user.image}
                          width={24}
                          height={24}
                          alt={user?.name ?? 'Profile'}
                          className="rounded-full"
                        />
                      ) : (
                        <User />
                      )}
                      <span className="text-[12px]">Profile</span>
                    </Link>
                  </li>
                  <li
                    onClick={() => signOut()}
                    className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer">
                    <LogOut />
                    <span className="text-[12px]">Log out</span>
                  </li>
                </>
              ) : (
                <DialogTrigger>
                  <li className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer">
                    <User />
                    <span className="text-[12px]">Login /Register</span>
                  </li>
                </DialogTrigger>
              )}
            </ul>
            <LogInRegister />
          </Dialog>
        </div>
      </div>

      {/* Mobile HeroNav Below Main Nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#000066] text-white w-full">
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
    </div>
  );
}
