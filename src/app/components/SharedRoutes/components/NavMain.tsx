'use client';

import { Heart, LogOut, Menu, User, X, ShoppingBag, Gift, UserPlus, Truck, Phone, LogIn } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
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
          <div className="search flex md:hidden max-w-1/2 items-center justify-center w-full my-2 md:my-5 relative">
            <SearchBar />
          </div>
        </div>

        {/* Desktop Search */}
        <div className="search hidden md:flex items-center justify-center w-full max-w-[30vw] lg:max-w-md mx-auto relative">
          <SearchBar />
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex">
          <Dialog>
            <ul className="flex gap-4 text-base">
              <li><WishlistIcon className="text-[#00005E]" /></li>
              <li><CartIcon /></li>

              {session ? (
                <>
                  <li className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer">
                    <Link href={'/home/UserProfile'} className="flex flex-col justify-center items-center">
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
                      <span className="text-[#00005E] text-[12px]">Profile</span>
                    </Link>
                  </li>
                  <li
                    onClick={() => signOut()}
                    className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer"
                  >
                    <LogOut />
                    <span className="text-[#00005E] text-[12px]">Log out</span>
                  </li>
                </>
              ) : (
                <DialogTrigger>
                  <li className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer">
                    <User />
                    <span className="text-[#00005E] text-[12px]">Login / Register</span>
                  </li>
                </DialogTrigger>
              )}
            </ul>
            <LogInRegister />
          </Dialog>
        </div>
      </div>

      {/* === SLIDE-IN MOBILE MENU FROM LEFT === */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-black/50"
            />

            {/* Menu Panel */}
            <motion.div
              className="relative w-80 max-w-full bg-[#000066] text-white flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-600">
                <h2 className="text-lg font-bold">Menu</h2>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {/* Buy & Sell + Donation */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Link
                    href="/home/buyandsell"
                    className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition"
                  >
                    <ShoppingBag size={24} />
                    <span className="text-xs mt-1">Buy & Sell</span>
                  </Link>
                  <Link
                    href="/home/donation"
                    className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 transition"
                  >
                    <Gift size={24} />
                    <span className="text-xs mt-1">Donation</span>
                  </Link>
                </div>

                {/* Divider */}
                <hr className="border-gray-600 my-2" />

                {/* Vendor Section */}
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Vendor</h3>
                  <Link href="/vendor/login" className="flex items-center gap-3 p-2 hover:bg-white/10 rounded">
                    <LogIn size={16} />
                    <span>Vendor Login</span>
                  </Link>
                  <Link href="/vendor/register" className="flex items-center gap-3 p-2 hover:bg-white/10 rounded">
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

              {/* Footer */}
              <div className="p-4 border-t border-gray-600">
                {session ? (
                  <div className="space-y-2">
                    <Link href="/home/UserProfile" className="flex items-center gap-2 text-sm">
                      <User size={16} />
                      {user?.name || 'Profile'}
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <DialogTrigger className="w-full">
                    <button className="w-full py-2 bg-white text-[#000066] rounded font-medium hover:bg-gray-100">
                      Login / Register
                    </button>
                  </DialogTrigger>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}