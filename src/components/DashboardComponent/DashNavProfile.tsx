'use client'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { ChevronDown, LogOut, User } from 'lucide-react'
import { Dialog, DialogTrigger } from '../ui/dialog'
import Link from 'next/link'

export default function DashNavProfile() {
    const { data: session } = useSession()
    // status
    console.log("Navuser is", session)
    const user = session?.user
    return (
        <>
            <Dialog>
                {!user ? (
                    // Show Sign In button if no user
                    <DialogTrigger>
                        <h2 className="text-sm flex flex-col items-center cursor-pointer text-gray-800">
                            <User size={20} />
                            Sign In
                        </h2>
                    </DialogTrigger>
                ) : (
                    <DropdownMenuTrigger>
                        <div className="flex gap-2 justify-center items-center cursor-pointer">
                            {/* Avatar always visible */}
                            <Avatar>
                                <AvatarImage src={user?.image || 'https://github.com/shadcn.png'} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>

                            {/* Name + Chevron only visible on md and up */}
                            <div className="hidden md:flex items-center">
                                <h1 className="mr-1">{user?.name}</h1>
                                <ChevronDown size={18} />
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                )}
                <DropdownMenuContent sideOffset={18}>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/home/UserProfile" className='cursor-pointer'><User /> Profile Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()} className='cursor-pointer'>
                        <LogOut /> Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </Dialog>
        </>
    )
}
