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

export default function DashNavbar() {
  return (
    <nav className="flex justify-between p-4  border-[#e3e8f3] border-b-[1px]">
      {/* Left side */}
      <SidebarTrigger />
      {/* Right side */}
      <div className="flex gap-5">
        <Button variant={'GrayBtn'}>
          <Send />
          <Link href={'#'}>Visit Website</Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex gap-2 justify-center items-center cursor-pointer">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex items-center">
                <h1>Yeamin Matbor</h1>
                <span>
                  <ChevronDown />
                </span>
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
