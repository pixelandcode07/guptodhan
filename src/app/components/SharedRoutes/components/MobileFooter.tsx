'use client';

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Home,
    LayoutPanelTopIcon,
    MessageSquareText,
    ShoppingCart,
    User,
    Settings,
    LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import LogInRegister from "../../LogInAndRegister/LogIn_Register";
import { useState, useEffect } from "react"; // স্টেট ইম্পোর্ট করা হয়েছে

export default function MobileFooter() {
    const pathname = usePathname() || "";
    const { data: session } = useSession();
    const user = session?.user;

    // হাইড্রেশন এরর ফিক্স করার জন্য স্টেট
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isActive = (path: string) => pathname.startsWith(path);

    const getInitials = (name: string | null | undefined) => {
        if (!name) return "U";
        return name
            .trim()
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    if (!mounted) return null;

    return (
        <>
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                <ul className="flex justify-around items-center py-2">
                    <li>
                        <Link
                            href="/"
                            className={`flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium ${isActive("/") ? "text-[#0097E9]" : "text-gray-600"
                                }`}
                        >
                            <Home size={22} />
                            <span>Home</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            href="/home/categories"
                            className={`flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium ${isActive("/buy-sell") ? "text-[#0097E9]" : "text-gray-600"
                                }`}
                        >
                            <LayoutPanelTopIcon size={22} />
                            <span>Category</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            href="/home/chat"
                            className={`flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium ${isActive("/messages") ? "text-[#0097E9]" : "text-gray-600"
                                }`}
                        >
                            <MessageSquareText size={22} />
                            <span>Message</span>
                        </Link>
                    </li>

                    <li>
                        <Link
                            href="/products/shopping-cart"
                            className={`flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium ${isActive("/cart") ? "text-[#0097E9]" : "text-gray-600"
                                }`}
                        >
                            <ShoppingCart size={22} />
                            <span>Cart</span>
                        </Link>
                    </li>

                    <li>
                        {user ? (
                            // <DropdownMenu>
                            //     <DropdownMenuTrigger asChild>
                            //         <button className="flex flex-col items-center gap-1 px-3 py-2">
                            //             <Avatar className="h-8 w-8">
                            //                 <AvatarImage
                            //                     src={
                            //                         user.image && user.image !== "undefined" && user.image !== "null"
                            //                             ? user.image
                            //                             : undefined
                            //                     }
                            //                 />
                            //                 <AvatarFallback className="bg-[#0097E9] text-white text-sm font-bold">
                            //                     {getInitials(user.name)}
                            //                 </AvatarFallback>
                            //             </Avatar>
                            //             <span className="text-xs text-gray-700">Profile</span>
                            //         </button>
                            //     </DropdownMenuTrigger>

                            //     <DropdownMenuContent side="top" align="center" className="w-48">
                            //         <DropdownMenuItem asChild>
                            //             <Link href="/home/UserProfile" className="flex items-center gap-3">
                            //                 <Settings size={16} />
                            //                 Profile Settings
                            //             </Link>
                            //         </DropdownMenuItem>
                            //         <DropdownMenuItem
                            //             onClick={() => signOut()}
                            //             className="flex items-center gap-3 text-red-600"
                            //         >
                            //             <LogOut size={16} />
                            //             Logout
                            //         </DropdownMenuItem>
                            //     </DropdownMenuContent>
                            // </DropdownMenu>
                            <Link href="/home/UserProfile" className={`flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium ${isActive("/cart") ? "text-[#0097E9]" : "text-gray-600"
                                }`}>
                                <button className="flex flex-col items-center gap-1 px-3 py-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={
                                                user.image && user.image !== "undefined" && user.image !== "null"
                                                    ? user.image
                                                    : undefined
                                            }
                                        />
                                        <AvatarFallback className="bg-[#0097E9] text-white text-sm font-bold">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-gray-700">Profile</span>
                                </button>
                            </Link>
                        ) : (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium text-gray-600">
                                        <User size={22} />
                                        <span>Sign In</span>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md p-0">
                                    <LogInRegister />
                                </DialogContent>
                            </Dialog>
                        )}
                    </li>
                </ul>
            </nav>
        </>
    );
}