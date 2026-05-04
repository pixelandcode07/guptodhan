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
import { ChevronDown, LogOut, User } from 'lucide-react'; // Added 'User' icon, removed 'Key'
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link'; // Imported Link from Next.js

export default function UserDropdown() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;
  const user = session?.user;
  console.log("TOKEN:", token);

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
        
        {/* Profile Button added here */}
        <DropdownMenuItem asChild>
          <Link href="/home/UserProfile/profile" className="flex items-center cursor-pointer w-full gap-2">
            <User className="w-4 h-4" /> 
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={isLoggingOut}
          className="text-red-500 hover:bg-red-500/10 w-full cursor-pointer flex items-center gap-2"
          onClick={async () => {
            setIsLoggingOut(true);
            toast.loading("Logging out...");
            await signOut({ callbackUrl: "/" });
          }}>
          <LogOut className="w-4 h-4" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}