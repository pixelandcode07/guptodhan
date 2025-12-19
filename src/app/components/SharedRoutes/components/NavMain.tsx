'use client';

import { Heart, LogOut, Menu, User, X, ShoppingBag, Gift, UserPlus, Truck, Phone, LogIn } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LogInRegister from '../../LogInAndRegister/LogIn_Register';
import SearchBar from './SearchBar';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import CartIcon from '@/components/CartIcon';
import WishlistIcon from '@/components/WishlistIcon';
import { motion, AnimatePresence } from 'framer-motion';

export default function NavMain() {
  const { data: session } = useSession();
  const user = session?.user;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Helper: Get initials from name
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div>
      {/* Main Top Bar */}
      <div className="bg-[#0097E9] md:bg-[#FFFFFF] text-black md:max-w-[95vw] xl:max-w-[90vw] mx-auto flex justify-between items-center py-2 md:py-5 px-1 md:px-1 lg:px-10">
        <div className="flex justify-between items-center gap-2">
          <div className="flex lg:block items-center">
            {/* Mobile Menu Toggle */}
            <button
              className="block lg:hidden text-white cursor-pointer z-50"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href={'/'} className="logo hidden md:block">
              <Image src="/img/logo.png" width={130} height={44} alt="logo" />
            </Link>
            <Link href={'/'} className="logo md:hidden">
              <Image src="/white-logo.png" width={120} height={40} alt="logo" />
            </Link>
          </div>

          {/* Mobile Search */}
          {/* <div className="search flex md:hidden max-w-1/2 items-center justify-center w-full my-2 md:my-5 relative">
            <SearchBar />
          </div> */}
          {/* Mobile Search Trigger */}
          <div className="flex md:hidden flex-1 justify-end px-2">
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="w-full bg-white rounded-lg px-4 py-2 flex items-center gap-2"
            >
              <SearchBarTrigger />
            </button>
          </div>
        </div>

        {/* Desktop Search */}
        <div className="search hidden md:flex items-center justify-center w-full max-w-[30vw] lg:max-w-md mx-auto relative">
          <SearchBar />
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex">
          <Dialog>
            <ul className="flex gap-4 text-base items-center">
              <li><WishlistIcon className="text-[#00005E]" /></li>
              <li><CartIcon /></li>

              {session ? (
                <>
                  {/* Profile Avatar with Fallback */}
                  <li className="flex flex-col justify-center items-center text-[#00005E] font-medium">
                    <Link href={'/home/UserProfile'} className="flex flex-col items-center gap-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={user?.image && user.image !== 'undefined' ? user.image : undefined}
                          alt={user?.name ?? 'User'}
                        />
                        <AvatarFallback className="bg-[#00005E] text-white text-xs font-medium">
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[#00005E] text-[12px]">Profile</span>
                    </Link>
                  </li>

                  {/* Logout */}
                  <li
                    onClick={() => signOut()}
                    className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer"
                  >
                    <LogOut size={20} />
                    <span className="text-[#00005E] text-[12px]">Log out</span>
                  </li>
                </>
              ) : (
                <DialogTrigger asChild>
                  <li
                    onClick={() => {
                      localStorage.setItem("redirectAfterLogin", window.location.pathname + window.location.search);
                    }}
                    className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer"
                  >
                    <User size={20} />
                    <span className="text-[#00005E] text-[12px]">Login / Register</span>
                  </li>
                </DialogTrigger>
              )}
            </ul>
            <LogInRegister />
          </Dialog>
        </div>
      </div>

      {/* === MOBILE MENU === */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-black/50"
            />
            <Dialog>
              <motion.div className="relative w-80 max-w-full bg-[#000066] text-white flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-600">
                  <h2 className="text-lg font-bold">Menu</h2>
                  <button onClick={() => setMobileOpen(false)} className="p-1 hover:bg-white/10 rounded">
                    <X size={20} />
                  </button>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {/* Buy & Sell + Donation */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Link href="/home/buyandsell" className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition">
                      <ShoppingBag size={24} />
                      <span className="text-xs mt-1">Buy & Sell</span>
                    </Link>
                    <Link href="/home/donation" className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 transition">
                      <Gift size={24} />
                      <span className="text-xs mt-1">Donation</span>
                    </Link>
                  </div>

                  <hr className="border-gray-600 my-2" />

                  {/* Vendor Section */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Vendor</h3>
                    <Link href="/vendor-singin" className="flex items-center gap-3 p-2 hover:bg-white/10 rounded">
                      <LogIn size={16} />
                      <span>Vendor Login</span>
                    </Link>
                    <Link href="/vendor-singup" className="flex items-center gap-3 p-2 hover:bg-white/10 rounded">
                      <UserPlus size={16} />
                      <span>Vendor Registration</span>
                    </Link>
                  </div>

                  <hr className="border-gray-600 my-2" />

                  {/* Service Provider */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Service Provider</h3>
                    <Link href="/service-provider/register" className="flex items-center gap-3 p-2 hover:bg-white/10 rounded">
                      <UserPlus size={16} />
                      <span>Register</span>
                    </Link>
                    <Link href="/service-provider/login" className="flex items-center gap-3 p-2 hover:bg-white/10 rounded">
                      <LogIn size={16} />
                      <span>Login</span>
                    </Link>
                  </div>

                  <hr className="border-gray-600 my-2" />

                  {/* Others */}
                  <div className="space-y-1">
                    <Link href="/track-order" className="flex items-center gap-3 p-2 hover:bg-white/10 rounded">
                      <Truck size={16} />
                      <span>Track Order</span>
                    </Link>
                    <Link href="/contact" className="flex items-center gap-3 p-2 hover:bg-white/10 rounded">
                      <Phone size={16} />
                      <span>Contact Us</span>
                    </Link>
                    <Link href="/wishlist" className="flex items-center gap-3 p-2 hover:bg-white/10 rounded">
                      <Heart size={16} />
                      <span>Wishlist</span>
                    </Link>
                  </div>
                </div>

                {/* Footer - Mobile Login/Profile */}
                <div className="p-4 mb-20 border-t border-gray-600">
                  {session ? (
                    <div className="space-y-3">
                      <Link href="/home/UserProfile" className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.image && user.image !== 'undefined' ? user.image : undefined} />
                          <AvatarFallback className="bg-white text-[#000066] font-medium">
                            {getInitials(user?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user?.name || 'User'}</p>
                          <p className="text-xs text-gray-300">{user?.email}</p>
                        </div>
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-red-600 hover:bg-red-700 rounded font-medium"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <DialogTrigger className="w-full">
                      <DialogContent className="sm:max-w-md p-0">
                        <LogInRegister />
                      </DialogContent>
                    </DialogTrigger>
                  )}
                </div>
              </motion.div>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 md:hidden"
          >
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              exit={{ y: -50 }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              className="bg-white p-3"
            >
              <div className="flex items-center gap-2">
                {/* Back Button */}
                <button
                  onClick={() => setMobileSearchOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>

                {/* FULL WIDTH SEARCH */}
                <div className="flex-1">
                  <SearchBar />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}



function SearchBarTrigger() {
  return (
    <>
      <span className="text-gray-500 text-sm">Search products...</span>
    </>
  );
}