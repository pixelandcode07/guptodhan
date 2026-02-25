'use client';

import { Heart, LogOut, Menu, User, X, ShoppingBag, Gift, UserPlus, Truck, Phone, LogIn, Workflow, UserIcon, LayoutGrid, Info, HelpCircle, Store, PhoneCall, MessageCircle, Search, Briefcase, HandCoins, Wrench } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LogInRegister from '../../LogInAndRegister/LogIn_Register';
import SearchBar from './SearchBar';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import CartIcon from '@/components/CartIcon';
import WishlistIcon from '@/components/WishlistIcon';
import { motion, AnimatePresence } from 'framer-motion';
import MessageIcon from '../../MessageIcon';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import axios from 'axios';

export default function NavMain() {
  const { data: session } = useSession();
  const user = session?.user;
  const role = (session?.user as any)?.role as string;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/v1/public/settings');
        if (data.success) {
          setSettings(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  }, []);

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
      <div className="bg-[#0097E9] md:bg-[#FFFFFF] text-black  flex justify-between items-center md:max-w-[95vw] xl:container sm:px-8 mx-auto py-4" id="navbar">
        <div className="w-full md:w-3xs flex justify-between items-center gap-2 px-4">
          <div className="flex justify-between items-center lg:block ">
            {/* Mobile Menu Toggle */}
            <div className=" flex justify-between items-center gap-2">
              <button
                className="block lg:hidden text-white cursor-pointer z-50"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="w-[50vw] logo md:hidden flex justify-end">
                <Link href={'/'} >
                  <Image src={settings?.primaryLogoLight || "/white-logo.png"} width={120} height={40} alt="logo" className="object-contain h-10 w-auto" />
                </Link>
              </div>
            </div>

            {/* Logo */}
            <div className="logo hidden md:block">
              <Link href={'/'} >
                <Image src={settings?.primaryLogoLight || "/img/logo.png"} width={130} height={44} alt="logo" className="object-contain h-12 w-auto" />
              </Link>
            </div>

          </div>
          {/* Mobile Search Trigger */}
          <div className="flex md:hidden justify-end px-2">
            <button
              onClick={() => setMobileSearchOpen(true)}
            >
              <Search className='text-white cursor-pointer' />
            </button>
          </div>
        </div>

        {/* Desktop Search */}
        <div className="search hidden md:flex items-center justify-center w-full max-w-[30vw] lg:max-w-md mx-auto relative">
          <SearchBar />
        </div>

        {/* Desktop Links Section  */}
        <div className="hidden md:flex  justify-end">
          <Dialog>
            <ul className="flex flex-wrap lg:flex-nowrap gap-2 lg:gap-4 items-center justify-end">

              {/* Dashboard - Admin/Vendor */}
              {(role === 'vendor' || role === 'admin') && (
                <li className="flex flex-col justify-center items-center text-[#00005E] font-medium min-w-fit">
                  <Link href={role === 'vendor' ? '/dashboard' : '/general/home'} className="hidden lg:flex flex-col justify-center items-center gap-0.5 group">
                    <div className="p-1 group-hover:bg-blue-50 rounded-full transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 lg:size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      </svg>
                    </div>
                    <span className="text-[#00005E] text-[10px] lg:text-[12px] whitespace-nowrap">Dashboard</span>
                  </Link>
                </li>
              )}

              {/* Join As Vendor */}
              <li className="flex flex-col justify-center items-center text-[#00005E] font-medium min-w-fit">
                <Link href={'/join-as-vendor'} className="flex flex-col items-center gap-0.5 group">
                  <div className="p-1 group-hover:bg-blue-50 rounded-full transition-colors">
                    <Store className="size-5 lg:size-6 text-[#00005E]" />
                  </div>
                  <span className="text-[#00005E] text-[10px] lg:text-[12px] whitespace-nowrap">Join Vendor</span>
                </Link>
              </li>

              {/* Join As Provider */}
              <li className="flex flex-col justify-center items-center text-[#00005E] font-medium min-w-fit">
                <Link href={'/join-as-provider'} className="flex flex-col items-center gap-0.5 group">
                  <div className="p-1 group-hover:bg-blue-50 rounded-full transition-colors">
                    <Wrench className="size-5 lg:size-6 text-[#00005E]" />
                  </div>
                  <span className="text-[#00005E] text-[10px] lg:text-[12px] whitespace-nowrap">Provider</span>
                </Link>
              </li>

              {/* Job (Restored to Desktop Nav) */}
              <li className="flex flex-col justify-center items-center text-[#00005E] font-medium min-w-fit">
                <Link href={'/jobs'} className="flex flex-col items-center gap-0.5 group">
                  <div className="p-1 group-hover:bg-blue-50 rounded-full transition-colors">
                    <Briefcase className="size-5 lg:size-6 text-[#00005E]" />
                  </div>
                  <span className="text-[#00005E] text-[10px] lg:text-[12px] whitespace-nowrap">Jobs</span>
                </Link>
              </li>

              {/* Cart & Wishlist */}
              <li className="scale-90 lg:scale-100"><CartIcon /></li>
              <li className="scale-90 lg:scale-100"><WishlistIcon /></li>

              {/* Track Order (Restored to Desktop Nav) */}
              <li className="flex flex-col justify-center items-center text-[#00005E] font-medium min-w-fit">
                <Link href={'/track-order'} className="flex flex-col items-center gap-0.5 group">
                  <div className="p-1 group-hover:bg-blue-50 rounded-full transition-colors">
                    <Truck className="size-5 lg:size-6 text-[#00005E]" />
                  </div>
                  <span className="text-[#00005E] text-[10px] lg:text-[12px] whitespace-nowrap">Track Order</span>
                </Link>
              </li>

              {/* Profile / Auth */}
              {session ? (
                <li className="flex flex-col justify-center items-center text-[#00005E] font-medium">
                  <Link href="/home/UserProfile" className="flex flex-col items-center gap-1">
                    <button className="flex flex-col items-center gap-0.5 outline-none group cursor-pointer">
                      <Avatar className="h-6 w-6 lg:h-7 lg:w-7 border-2 border-transparent group-hover:border-blue-400 transition-all">
                        <AvatarImage
                          src={user?.image && user.image !== "undefined" ? user.image : undefined}
                          alt={user?.name ?? "User"}
                        />
                        <AvatarFallback className="bg-[#00005E] text-white text-[10px]">
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[#00005E] text-[10px] lg:text-[11px] font-medium">Account</span>
                    </button>
                  </Link>
                </li>
              ) : (
                <DialogTrigger asChild>
                  <li className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer min-w-fit group">
                    <div className="p-1 group-hover:bg-blue-50 rounded-full transition-colors">
                      <UserIcon size={18} className="lg:size-5" />
                    </div>
                    <span className="text-[#00005E] text-[10px] lg:text-[12px] whitespace-nowrap">Login</span>
                  </li>
                </DialogTrigger>
              )}

              {/* More Dropdown */}
              <li className="hidden xl:flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer min-w-fit outline-none group">
                      <div className="p-1 group-hover:bg-blue-50 rounded-full transition-colors">
                        <LayoutGrid size={20} className="lg:size-6" />
                      </div>
                      <span className="text-[#00005E] text-[10px] lg:text-[12px] whitespace-nowrap">More</span>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-64 p-2 shadow-2xl border-gray-100">
                    {/* Essential Links */}
                    <DropdownMenuItem asChild>
                      <Link href="/about-us" className="cursor-pointer flex items-center gap-3 py-2">
                        <Info size={18} className="text-blue-600" />
                        <span className="font-medium text-gray-700">About Us</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/home/UserProfile/wishlist" className="cursor-pointer flex items-center gap-3 py-2">
                        <Heart size={18} className="text-pink-500" />
                        <span className="font-medium text-gray-700">Wishlist</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/faqs" className="cursor-pointer flex items-center gap-3 py-2">
                        <HelpCircle size={18} className="text-orange-500" />
                        <span className="font-medium text-gray-700">FAQs</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Business Links */}
                    <DropdownMenuItem asChild>
                      <Link href="/join-as-vendor" className="cursor-pointer flex items-center gap-3 py-2">
                        <UserPlus size={18} className="text-indigo-600" />
                        <span className="font-medium text-gray-700">Vendor Register</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/home/vendor-shops" className="cursor-pointer flex items-center gap-3 py-2">
                        <Store size={18} className="text-emerald-600" />
                        <span className="font-medium text-gray-700">Shops</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* Buy & Sell and Donation restored exactly as they were in the Dropdown */}
                    <DropdownMenuItem asChild>
                      <Link href="/buy-sell" className="cursor-pointer flex items-center gap-3 py-2">
                        <ShoppingBag size={18} className="text-blue-500" />
                        <span className="font-medium text-gray-700">Buy & Sell</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/donation" className="cursor-pointer flex items-center gap-3 py-2">
                        <Gift size={18} className="text-red-500" />
                        <span className="font-medium text-gray-700">Donation</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Contact Links */}
                    <DropdownMenuItem asChild>
                      <Link href="tel:+8801816500600" className="cursor-pointer flex items-center gap-3 py-2 text-blue-600">
                        <PhoneCall size={18} />
                        <span className="font-bold">Call Us</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        href="https://wa.me/8801816500600?text=Welcome%20,%20How%20can%20we%20help%20you?"
                        target="_blank"
                        className="cursor-pointer flex items-center gap-3 py-2 text-green-600"
                      >
                        <MessageCircle size={18} />
                        <span className="font-bold">WhatsApp</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
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
                  <div className="grid grid-cols-2 gap-3 mb-4">
                      {/* Buy & Sell */}
                      <Link onClick={() => setMobileOpen(false)} href="/buy-sell" className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-sm">
                          <ShoppingBag size={24} className="mb-2 text-blue-100" />
                          <span className="text-xs font-medium">Buy & Sell</span>
                      </Link>
                      
                      {/* Services */}
                      <Link onClick={() => setMobileOpen(false)} href="/services" className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition shadow-sm">
                          <Wrench size={24} className="mb-2 text-indigo-100" />
                          <span className="text-xs font-medium">Services</span>
                      </Link>
                      
                      {/* Jobs */}
                      <Link onClick={() => setMobileOpen(false)} href="/jobs" className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg hover:from-teal-700 hover:to-teal-800 transition shadow-sm">
                          <Briefcase size={24} className="mb-2 text-teal-100" />
                          <span className="text-xs font-medium">Jobs</span>
                      </Link>
                      
                      {/* Donation */}
                      <Link onClick={() => setMobileOpen(false)} href="/donation" className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition shadow-sm">
                          <HandCoins size={24} className="mb-2 text-emerald-100" />
                          <span className="text-xs font-medium">Donation</span>
                      </Link>
                  </div>

                  <hr className="border-gray-600 my-2" />

                  {/* Vendor Section */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Vendor</h3>
                    <Link href="/join-as-vendor" className="flex items-center gap-3 p-2 hover:bg-white/10 rounded">
                      <LogIn size={16} />
                      <span>Vendor Login</span>
                    </Link>
                    <Link href="/join-as-vendor" className="flex items-center gap-3 p-2 hover:bg-white/10 rounded">
                      <UserPlus size={16} />
                      <span>Vendor Registration</span>
                    </Link>
                  </div>

                  <hr className="border-gray-600 my-2" />

                  {/* Service Provider */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Service Provider</h3>
                    <Link href="/join-as-provider" className="flex items-center gap-3 p-2 hover:bg-white/10 rounded">
                      <UserPlus size={16} />
                      <span>Register</span>
                    </Link>
                    <Link href="/join-as-provider" className="flex items-center gap-3 p-2 hover:bg-white/10 rounded">
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
                    <Link href="https://wa.me/8801816500600?text=Hello!%20Hope%20you're%20having%20a%20great%20day!%20I%20need%20assistance%20with...%20Thank%20you!"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 hover:bg-white/10 rounded">
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