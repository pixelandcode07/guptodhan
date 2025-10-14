'use client';

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Home, LayoutPanelTopIcon, MessageSquareText, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import LogInRegister from "../../LogInAndRegister/LogIn_Register";

export default function MobileFooter() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const user = session?.user;

    // check if route is active
    const isActive = (href: string) => pathname === href;

    return (
        <Dialog>
            <ul className="fixed bottom-0 left-0 w-full bg-white flex justify-around items-center p-3 border-t border-gray-300 gap-4 z-50">
                <li>
                    <Link
                        href="/"
                        className={`text-sm flex flex-col items-center ${isActive("/") ? "text-[#0097E9]" : "text-gray-800"
                            }`}
                    >
                        <Home size={20} />
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        href="/categories"
                        className={`text-sm flex flex-col items-center ${isActive("/categories") ? "text-[#0097E9]" : "text-gray-800"
                            }`}
                    >
                        <LayoutPanelTopIcon size={20} />
                        Category
                    </Link>
                </li>
                <li>
                    <Link
                        href="/messages"
                        className={`text-sm flex flex-col items-center ${isActive("/messages") ? "text-[#0097E9]" : "text-gray-800"
                            }`}
                    >
                        <MessageSquareText size={20} />
                        Message
                    </Link>
                </li>
                <li>
                    <Link
                        href="/cart"
                        className={`text-sm flex flex-col items-center ${isActive("/cart") ? "text-[#0097E9]" : "text-gray-800"
                            }`}
                    >
                        <ShoppingCart size={20} />
                        Cart
                    </Link>
                </li>

                {/* Sign In / Profile */}
                <li>
                    {!user ? (
                        // Show Sign In button if no user
                        <DialogTrigger>
                            <h2 className="text-sm flex flex-col items-center cursor-pointer text-gray-800">
                                <User size={20} />
                                Sign In
                            </h2>
                        </DialogTrigger>
                    ) : (
                        // Show dropdown with profile pic if logged in
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex flex-col items-center focus:outline-none">
                                    <Image
                                        src={user.image || "/default-avatar.png"}
                                        alt="Profile"
                                        width={28}
                                        height={28}
                                        className="rounded-full"
                                    />
                                    <span className="text-xs text-gray-800">Profile</span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" align="end" className="w-40">
                                <DropdownMenuItem asChild>
                                    <Link href="/home/UserProfile" className='cursor-pointer'>Profile Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => signOut()}>
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </li>
            </ul>
            {/* Login page */}
            <LogInRegister />
        </Dialog>
    );
}
