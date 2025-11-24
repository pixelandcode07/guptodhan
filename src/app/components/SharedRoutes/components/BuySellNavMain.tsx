"use client";

import { User } from "lucide-react";
import Image from "next/image";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
} from "@/components/ui/dialog";
import LogInRegister from "../../LogInAndRegister/LogIn_Register";
import SearchBar from "./SearchBar";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BuySellNavMain() {
    const { data: session } = useSession();
    const router = useRouter();
    const [openLoginDialog, setOpenLoginDialog] = useState(false);

    const isLoggedIn = !!session?.accessToken;

    //   const handlePostAdClick = () => {
    //     if (isLoggedIn) {
    //       router.push("/home/buyandsell/select/category");
    //     } else {
    //       setOpenLoginDialog(true);
    //     }
    //   };

    const handlePostAdClick = () => {
        if (isLoggedIn) {
            router.push("/home/buyandsell/select/category");
        } else {
            // এই URL টা login এর পর যাবে
            localStorage.setItem("redirectAfterLogin", "/home/buyandsell/select/category");
            setOpenLoginDialog(true);
        }
    };





    return (
        <div className="bg-white text-black flex w-full justify-between items-center py-5 px-4 md:px-15 border-b-2 border-gray-200">
            {/* Logo */}
            <Link href="/">
                <Image src="/img/logo.png" width={130} height={44} alt="Logo" />
            </Link>

            {/* Search */}
            <div className="relative hidden md:flex flex-1 justify-center max-w-md mx-8">
                <SearchBar />
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-6">
                {/* Dialog + Trigger + Content সব একসাথে */}
                <Dialog open={openLoginDialog} onOpenChange={setOpenLoginDialog}>
                    {/* Profile or Login Button */}
                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex flex-col items-center gap-1">
                                    <Image
                                        src={session?.user?.image || "/default-avatar.png"}
                                        alt="Profile"
                                        width={38}
                                        height={38}
                                        className="rounded-full border-2 border-indigo-600"
                                    />
                                    <span className="text-xs font-medium">
                                        {session?.user?.name?.split(" ")[0] || "User"}
                                    </span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href="/home/UserProfile">Profile Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-red-600">
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <DialogTrigger asChild>
                            <button className="hidden md:flex flex-col items-center gap-1 text-[#00005E] font-bold hover:text-[#00008B] cursor-pointer">
                                <User size={30} />
                                <span className="text-xs">Login / Register</span>
                            </button>
                        </DialogTrigger>
                    )}

                    {/* Post a Free Ad */}
                    <Button onClick={handlePostAdClick} variant="BlueBtn" size="lg" className="font-bold">
                        Post a Free Ad
                    </Button>

                    {/* Dialog Content — এটা Dialog এর ভিতরে থাকতেই হবে */}
                    <DialogContent className="max-w-md p-0 border-none rounded-2xl overflow-hidden">
                        <LogInRegister onSuccess={() => setOpenLoginDialog(false)} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}