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
            router.push("/home/buyandsell/select/category");
        } else {
            localStorage.setItem("redirectAfterLogin", "/home/buyandsell/select/category");
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
        <div className="bg-white text-black flex w-full justify-between items-center py-5 px-4 lg:px-15 border-b-2 border-gray-200">
            {/* Logo */}
            <Link href="/">
                <img src="/img/logo.png" alt="Logo" className="h-11 w-auto" />
            </Link>

            {/* Search - Desktop */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
                <SearchBar />
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-6">
                <Dialog open={openLoginDialog} onOpenChange={setOpenLoginDialog}>
                    {/* Profile / Login Area */}
                    <div className="flex items-center gap-6">
                        {isLoggedIn ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-3 hover:opacity-80 transition">
                                        <Avatar className="relative">
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
                                        </Avatar>

                                        <div className="text-left hidden lg:block">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {user?.name?.split(" ")[0] || "User"}
                                            </p>
                                            <p className="text-xs text-gray-500">My Account</p>
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem asChild>
                                        <Link href="/home/UserProfile" className="flex items-center gap-2">
                                            <Settings size={16} />
                                            Profile Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                        className="text-red-600 focus:text-red-600 flex items-center gap-2"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <DialogTrigger asChild>
                                <button
                                    // onClick={() => {
                                    //     localStorage.setItem("redirectAfterLogin", window.location.pathname + window.location.search);
                                    // }}
                                    className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer"
                                >
                                    <User size={20} />
                                    <span className="text-[#00005E] text-[12px]">Login / Register</span>
                                </button>
                            </DialogTrigger>
                        )}

                        {/* Post Ad Button */}
                        <Button onClick={handlePostAdClick} variant="BlueBtn" size="lg" className="font-bold px-6">
                            <Plus size={20} /> Post a Free Ad
                        </Button>
                    </div>

                    {/* Login Modal */}
                    <DialogContent className="max-w-md p-0 border-none rounded-2xl overflow-hidden">
                        <LogInRegister onSuccess={() => setOpenLoginDialog(false)} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}