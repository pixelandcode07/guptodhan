import Link from 'next/link';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ChevronDown, Key, LogOut, Send } from 'lucide-react';
import { Button } from '../ui/button';
import { SidebarTrigger } from '../ui/sidebar';
import BreadcrumbNav from '../ReusableComponents/BreadcrumbNav';

export default function DashNavbar() {
  return (
    <nav className="flex justify-between p-4 items-center border-[#e3e8f3] border-b-[1px]">
      {/* Left side */}
      <div className="flex justify-center items-center gap-2">
        <SidebarTrigger />
        <BreadcrumbNav />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        <div className="block">
          <Button variant={'secondary'}>
            <Send className="mr-1" />
            <Link href={'/'}>Visit Website</Link>
          </Button>
        </div>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex gap-2 justify-center items-center cursor-pointer">
              {/* Avatar always visible */}
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              {/* Name + Chevron only visible on md and up */}
              <div className="hidden md:flex items-center">
                <h1 className="mr-1">Yeamin Matbor</h1>
                <ChevronDown size={18} />
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent sideOffset={18}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Key /> Change Password
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
