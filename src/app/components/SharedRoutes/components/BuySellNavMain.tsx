"use client";

import { User, LogOut, Settings, Plus } from "lucide-react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import LogInRegister from "../../LogInAndRegister/LogIn_Register";
import SearchBar from "./SearchBar";

// Import your custom MessageIcon component
import MessageIcon from "../../MessageIcon";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BuySellNavMain() {
    const { data: session } = useSession();
    const router = useRouter();
    const [openLoginDialog, setOpenLoginDialog] = useState(false);

    const user = session?.user;
    const isLoggedIn = !!session?.accessToken;

    const handlePostAdClick = () => {
        if (isLoggedIn) {
            router.push("/buy-sell/select/category");
        } else {
            localStorage.setItem("redirectAfterLogin", "/buy-sell/select/category");
            setOpenLoginDialog(true);
        }
    };

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

    return (
        <div className="bg-white text-black border-b-2 border-gray-200">
            <div className="md:max-w-[95vw] xl:container sm:px-8 mx-auto py-4 flex justify-between items-center">
                {/* fixed top-0 left-0 right-0 z-50 */}
                {/* Logo */}
                <div className="hidden md:block">
                    <Link href="/">
                        <img src="/img/logo.png" alt="Logo" className="h-11 w-auto" />
                    </Link>
                </div>
                <div className="block md:hidden">
                    <Link href="/">
                        <img src="/img/logo.png" alt="Logo" className="h-11 w-auto" />
                    </Link>
                </div>

                {/* Search - Desktop */}
                <div className="hidden md:block flex-1 max-w-md mx-8">
                    <SearchBar />
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4 sm:gap-6">
                    <Dialog open={openLoginDialog} onOpenChange={setOpenLoginDialog}>
                        {/* Profile / Login Area */}
                        <div className="flex items-center gap-4 sm:gap-6">
                            
                            {/* Message Icon will only show if user is logged in */}
                            {isLoggedIn && (
                                <div className="hidden md:block">
                                   {/* Wrapping it to fit navbar layout nicely */}
                                   <div className="relative w-12 h-12 flex items-center justify-center -mr-2">
                                     {/* Note: In your MessageIcon component you have "fixed bottom-25 right-7", 
                                         if you want it here in the navbar, you might need to adjust the classes 
                                         in MessageIcon to accept custom className props. For now, it will render here
                                         but might behave according to its internal 'fixed' classes. 
                                         Ideally, we use it directly here! */}
                                     <MessageIcon />
                                   </div>
                                </div>
                            )}

                            {isLoggedIn ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-3 hover:opacity-80 transition">
                                            <Avatar className="h-10 w-10 ring-2 ring-[#0097E9] ring-offset-2">
                                                <AvatarImage
                                                    src={
                                                        user?.image && user.image !== "undefined" && user.image !== "null"
                                                            ? user.image
                                                            : undefined
                                                    }
                                                    alt={user?.name || "User"}
                                                />
                                                <AvatarFallback className="bg-[#0097E9] text-white font-bold text-sm">
                                                    {getInitials(user?.name)}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="text-left hidden lg:block">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {user?.name?.split(" ")[0] || "User"}
                                                </p>
                                                <p className="text-xs text-gray-500">My Account</p>
                                            </div>
                                        </button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl shadow-lg border-gray-100">
                                        <DropdownMenuItem asChild className="cursor-pointer hover:bg-gray-50 py-2.5">
                                            <Link href="/home/UserProfile" className="flex items-center gap-2">
                                                <Settings size={16} className="text-gray-500" />
                                                <span className="font-medium text-gray-700">Profile Settings</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        
                                        <div className="h-px bg-gray-100 my-1 mx-2" />
                                        
                                        <DropdownMenuItem
                                            onClick={() => signOut({ callbackUrl: "/" })}
                                            className="text-red-600 focus:text-red-600 cursor-pointer hover:bg-red-50 py-2.5 flex items-center gap-2"
                                        >
                                            <LogOut size={16} />
                                            <span className="font-medium">Logout</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <DialogTrigger asChild>
                                    <button
                                        className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer hover:opacity-80 transition"
                                    >
                                        <User size={20} />
                                        <span className="text-[#00005E] text-[12px] mt-0.5">Login / Register</span>
                                    </button>
                                </DialogTrigger>
                            )}

                            {/* Post Ad Button */}
                            <Button onClick={handlePostAdClick} variant="BlueBtn" size="lg" className="font-bold px-5 sm:px-6 shadow-md hover:shadow-lg transition-all rounded-lg">
                                <Plus size={20} className="sm:mr-1.5" /> 
                                <span className="hidden sm:block">Post a Free Ad</span>
                            </Button>
                        </div>

                        {/* Login Modal */}
                        <DialogContent className="max-w-md p-0 border-none rounded-2xl overflow-hidden shadow-2xl">
                            <LogInRegister onSuccess={() => setOpenLoginDialog(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}