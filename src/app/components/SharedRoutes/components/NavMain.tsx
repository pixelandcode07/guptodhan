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
  console.log('User Session:', session);

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
            // className="w-full bg-white rounded-lg px-4 py-2 flex items-center gap-2"
            >
              {/* <SearchBarTrigger /> */}
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00005E" className="size-5 lg:size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                    </svg>
                  </div>
                  <span className="text-[#00005E] text-[10px] lg:text-[12px] whitespace-nowrap">Join Vendor</span>
                </Link>
              </li>

              {/* Join As Provider - Desktop/Large Tablet only or Shorter Text */}
              <li className="flex flex-col justify-center items-center text-[#00005E] font-medium min-w-fit">
                <Link href={'/join-as-provider'} className="flex flex-col items-center gap-0.5 group">
                  <div className="p-1 group-hover:bg-blue-50 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 lg:size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                    </svg>
                  </div>
                  <span className="text-[#00005E] text-[10px] lg:text-[12px] whitespace-nowrap">Provider</span>
                </Link>
              </li>

              {/* Cart & Wishlist - Critical Icons */}
              <li className="scale-90 lg:scale-100"><CartIcon /></li>
              <li className="scale-90 lg:scale-100"><WishlistIcon /></li>

              {/* Track Order */}
              <li className="flex flex-col justify-center items-center text-[#00005E] font-medium">
                <Link href={'#'} className="flex flex-col items-center gap-1">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>

                  </span>
                  <span className="text-[#00005E] text-[10px] lg:text-[12px] whitespace-nowrap">
                    Track Order
                  </span>
                </Link>
              </li>

              {/* Profile / Auth */}
              {session ? (
                <li className="flex flex-col justify-center items-center text-[#00005E] font-medium">
                  {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
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
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-56 mt-2 shadow-xl border-gray-100">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none text-[#00005E]">{user?.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                        </div>
                      </DropdownMenuLabel>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild>
                        <Link href="/home/UserProfile" className="cursor-pointer flex items-center w-full">
                          <UserIcon className="mr-2 h-4 w-4" />
                          <span>Profile Setting</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={async () => {
                          if (isLoggingOut) return;
                          setIsLoggingOut(true);
                          toast.loading("Logging out...");
                          await signOut({ callbackUrl: "/" });
                        }}
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                        disabled={isLoggingOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> */}
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

              {/* More*/}
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

                    <DropdownMenuItem asChild>
                      <Link href="/home/buyandsell" className="cursor-pointer flex items-center gap-3 py-2">
                        <ShoppingBag size={18} className="text-blue-500" />
                        <span className="font-medium text-gray-700">Buy & Sell</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/home/donation" className="cursor-pointer flex items-center gap-3 py-2">
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