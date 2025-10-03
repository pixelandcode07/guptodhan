'use client';
import * as React from 'react';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { navigationData } from '@/data/navigation_data';
import { Button } from '@/components/ui/button';
import { HandCoins, House } from 'lucide-react';

export default function HeroNav() {
  return (
    <div className="bg-white w-full">
      <NavigationMenu className="py-0">
        <div className="flex p-0 max-w-[80vw] mx-auto justify-between items-center w-full">
          {/* Left side nav links */}
          <div className="flex gap-5">
            {navigationData.map(heading => (
              <NavigationMenuItem key={heading.title}>
                <NavigationMenuTrigger>{heading.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 py-6 p-4 w-[200px]">
                    {heading.subtitles.map(sub => (
                      <li key={sub.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={sub.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">
                              {sub.title}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex">
            <Button className="rounded-none " variant={'HomeBuy'} size={'xxl'}>
              <House size={24} className="mr-2" />
              <Link href={'/home/buyandsell'}>Buy & Sale</Link>
            </Button>
            <Button
              className="rounded-none"
              variant={'HomeDoante'}
              size={'xxl'}>
              <HandCoins size={24} className="mr-2" />
              <Link href={'/home/donate'}>Donation</Link>
            </Button>
          </div>
        </div>
      </NavigationMenu>
    </div>
  );
}
