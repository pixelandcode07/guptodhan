'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, House, HandCoins } from 'lucide-react';
import { navigationData } from '@/data/navigation_data';
import { Button } from '@/components/ui/button';

const HeroNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-[#000066] text-white relative z-50">
      <div className="xl:max-w-[80vw] md:max-w-[95vw] w-full lg:px-0  mx-auto flex justify-between items-center">
        {/* Left Side Navigation */}
        <div className="flex items-center space-x-6">
          {/* Hamburger for mobile */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex ">
            {navigationData.map(nav => (
              <li
                key={nav.title}
                className="relative cursor-pointer xl:px-3  px-2 py-3  xl:text-sm md:text-xs  font-medium group   select-none space-y-1 rounded-md leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                {/* Main Link */}
                <button className=" cursor-pointer flex items-center">
                  {nav.title}
                  {/* Animated Chevron */}
                  <ChevronDown className="ml-1 w-3 h-3 transition-transform duration-400 group-hover:rotate-180" />
                </button>

                {/* Submenu (dropdown) */}
                <div className="absolute top-full left-0  mt-2 p-3 bg-white text-black rounded-md shadow-md w-48 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {nav.subtitles.map(item => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="block px-4 py-2 rounded-md hover:bg-gray-100 hover:text-[#000066] transition-colors">
                      {item.title}
                    </Link>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side Buttons */}
        <div className="flex h-full">
          <Button
            className="rounded-none h-full"
            variant={'HomeBuy'}
            size={'xxl'}>
            <House size={20} className="mr-2" />
            <Link href={'/home/buyandsell'}>Buy & Sale</Link>
          </Button>
          <Button
            className="rounded-none h-full"
            variant={'HomeDoante'}
            size={'xxl'}>
            <HandCoins size={20} className="mr-2" />
            <Link href={'/home/donate'}>Donation</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default HeroNav;
