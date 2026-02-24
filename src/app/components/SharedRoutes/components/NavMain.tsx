'use client';

import { Heart, Menu, X, ShoppingBag, UserIcon, LayoutGrid, Info, Search, Briefcase, HandCoins, Wrench } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LogInRegister from '../../LogInAndRegister/LogIn_Register';
import SearchBar from './SearchBar';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import CartIcon from '@/components/CartIcon';
import WishlistIcon from '@/components/WishlistIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import axios from 'axios';

export default function NavMain() {
  const { data: session } = useSession();
  const user = session?.user;
  const role = (session?.user as any)?.role as string;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  
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

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div>
      {/* Main Top Bar */}
      <div className="bg-[#0097E9] md:bg-[#FFFFFF] text-black flex justify-between items-center md:max-w-[95vw] xl:container sm:px-8 mx-auto py-4" id="navbar">
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
              
              {/* Mobile Logo */}
              <div className="w-[50vw] logo md:hidden flex justify-end">
                <Link href={'/'} >
                  <Image 
                    src={settings?.primaryLogoLight || "/white-logo.png"} 
                    width={120} 
                    height={40} 
                    alt="logo" 
                    className="object-contain h-10 w-auto"
                  />
                </Link>
              </div>
            </div>

            {/* Desktop Logo */}
            <div className="logo hidden md:block">
              <Link href={'/'} >
                <Image 
                    src={settings?.primaryLogoLight || "/img/logo.png"} 
                    width={130} 
                    height={44} 
                    alt="logo" 
                    className="object-contain h-12 w-auto"
                />
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
                      <LayoutGrid className="size-5 lg:size-6" />
                    </div>
                    <span className="text-[#00005E] text-[10px] lg:text-[12px] whitespace-nowrap">Dashboard</span>
                  </Link>
                </li>
              )}

              {/* Join As Vendor */}
              <li className="flex flex-col justify-center items-center text-[#00005E] font-medium min-w-fit">
                <Link href={'/join-as-vendor'} className="flex flex-col items-center gap-0.5 group">
                  <div className="p-1 group-hover:bg-blue-50 rounded-full transition-colors">
                    <ShoppingBag className="size-5 lg:size-6 text-[#00005E]" />
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

              {/* Job */}
              <li className="flex flex-col justify-center items-center text-[#00005E] font-medium min-w-fit">
                <Link href={'/jobs'} className="flex flex-col items-center gap-0.5 group">
                  <div className="p-1 group-hover:bg-blue-50 rounded-full transition-colors">
                    <Briefcase className="size-5 lg:size-6" />
                  </div>
                  <span className="text-[#00005E] text-[10px] lg:text-[12px] whitespace-nowrap">Job</span>
                </Link>
              </li>

              {/* Cart & Wishlist */}
              <li className="scale-90 lg:scale-100"><CartIcon /></li>
              <li className="scale-90 lg:scale-100"><WishlistIcon /></li>

              {/* Profile / Auth */}
              {session ? (
                <li className="flex flex-col justify-center items-center text-[#00005E] font-medium">
                  <Link href="/home/UserProfile" className="flex flex-col items-center gap-1">
                    <button className="flex flex-col items-center gap-0.5 outline-none group cursor-pointer">
                      <Avatar className="h-6 w-6 lg:h-7 lg:w-7 border-2 border-transparent group-hover:border-blue-400 transition-all">
                        <AvatarImage src={user?.image && user.image !== "undefined" ? user.image : undefined} alt={user?.name ?? "User"} />
                        <AvatarFallback className="bg-[#00005E] text-white text-[10px]">{getInitials(user?.name)}</AvatarFallback>
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
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </ul>
            <LogInRegister />
          </Dialog>
        </div>
      </div>

      {/* === MOBILE MENU (UPDATED) === */}
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
                <div className="flex justify-between items-center p-4 border-b border-gray-600">
                  <h2 className="text-lg font-bold">Menu</h2>
                  <button onClick={() => setMobileOpen(false)} className="p-1 hover:bg-white/10 rounded">
                    <X size={20} />
                  </button>
                </div>
                
                {/* Mobile Menu Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Grid Cards for Main Sections */}
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

                  {/* List Links */}
                  <div className="space-y-2 border-t border-gray-600 pt-4">
                    <Link onClick={() => setMobileOpen(false)} href="/join-as-vendor" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition">
                      <ShoppingBag size={18} className="text-yellow-400"/>
                      <span className="text-sm">Join as Vendor</span>
                    </Link>
                    <Link onClick={() => setMobileOpen(false)} href="/join-as-provider" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition">
                      <Wrench size={18} className="text-orange-400"/>
                      <span className="text-sm">Join as Provider</span>
                    </Link>
                    <Link onClick={() => setMobileOpen(false)} href="/about-us" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition">
                      <Info size={18} className="text-blue-300"/>
                      <span className="text-sm">About Us</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile Search Overlay */}
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
              className="bg-white p-3 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileSearchOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-black"
                >
                  <X size={20} />
                </button>
                <div className="flex-1 text-black">
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