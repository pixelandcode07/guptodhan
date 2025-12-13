'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Key } from 'lucide-react';
import { useSession } from 'next-auth/react';
import LogoutBtn from './LogoutBtn';

export default function UserDropdown() {
  const { data: session, status } = useSession();
  const token = session?.accessToken;
  console.log("TOKEN:", token)
  const user = session?.user;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex gap-2 justify-center items-center cursor-pointer">
          {/* Avatar always visible */}
          <Avatar>
            <AvatarImage src={user?.image ?? undefined} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          {/* Name + Chevron only visible on md and up */}
          <div className="hidden md:flex items-center">
            <h1 className="mr-1">{user?.name}</h1>
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
          <LogoutBtn />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
