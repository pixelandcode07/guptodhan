"use client";

import { User, LogOut, Settings, Plus, Wrench, ArrowRight, X } from "lucide-react";
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
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LogInRegister from "@/app/components/LogInAndRegister/LogIn_Register";
import SearchBar from "./SearchBar";
import { motion, AnimatePresence } from "framer-motion";

export default function ServiceNavMain() {
    const { data: session } = useSession();
    const router = useRouter();
    const [openLoginDialog, setOpenLoginDialog] = useState(false);
    const [openProviderModal, setOpenProviderModal] = useState(false);

    const user = session?.user;
    const role = (session?.user as any)?.role as string;
    const isLoggedIn = !!(session as any)?.accessToken;
    const isServiceProvider = role === "service-provider";

    const handlePostAdClick = () => {
        if (!isLoggedIn) {
            // ✅ Login নেই → login modal
            localStorage.setItem("redirectAfterLogin", "/home/post-service");
            setOpenLoginDialog(true);
            return;
        }

        if (isServiceProvider) {
            // ✅ Service provider → সরাসরি যাও
            router.push("/home/post-service");
            return;
        }

        // ✅ Logged in কিন্তু service provider না → provider modal
        setOpenProviderModal(true);
    };

    const handleBecomeProvider = async () => {
        // ✅ Logout করে service register page এ নিয়ে যাও
        await signOut({ redirect: false });
        window.location.href = "https://www.guptodhan.com/service/register";
    };

    const getInitials = (name: string | null | undefined) => {
        if (!name) return "U";
        return name.trim().split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    return (
        <>
            <div className="bg-white text-black flex w-full justify-between items-center md:max-w-[95vw] xl:container sm:px-8 mx-auto py-4">
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
                        <div className="flex items-center gap-6">
                            {isLoggedIn ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer">
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
                                            <Link href="/home/UserProfile" className="flex items-center gap-2 cursor-pointer">
                                                <Settings size={16} />
                                                Profile Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => signOut({ callbackUrl: "/" })}
                                            className="text-red-600 focus:text-red-600 flex items-center gap-2 cursor-pointer"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <DialogTrigger asChild>
                                    <button
                                        id="login-modal-btn-service"
                                        className="flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer"
                                    >
                                        <User size={20} />
                                        <span className="text-[#00005E] text-[12px]">Login / Register</span>
                                    </button>
                                </DialogTrigger>
                            )}

                            {/* Post Service Button */}
                            <Button
                                onClick={handlePostAdClick}
                                variant="BlueBtn"
                                size="lg"
                                className="font-bold px-6"
                            >
                                <Plus size={20} /> Post Service
                            </Button>
                        </div>

                        {/* Login Modal */}
                        <DialogContent className="max-w-md p-0 border-none rounded-2xl overflow-hidden">
                            <LogInRegister onSuccess={() => setOpenLoginDialog(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* =============================================*/}
            {/* ✅ Service Provider Check Modal             */}
            {/* =============================================*/}
            <AnimatePresence>
                {openProviderModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpenProviderModal(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setOpenProviderModal(false)}
                                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-10"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>

                            {/* Top Banner */}
                            <div className="bg-gradient-to-r from-[#00045e] to-[#0097E9] px-8 pt-10 pb-8 text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Wrench className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-white">
                                    Post a Service
                                </h2>
                                <p className="text-blue-100 text-sm mt-1">
                                    Only registered service providers can post services
                                </p>
                            </div>

                            {/* Content */}
                            <div className="px-8 py-6">
                                <p className="text-gray-700 text-center text-sm leading-relaxed mb-6">
                                    আপনি কি একজন <span className="font-bold text-[#0097E9]">Service Provider?</span>
                                    <br />
                                    <span className="text-gray-500 text-xs">
                                        Service post করতে হলে আপনাকে Service Provider হিসেবে নিবন্ধিত হতে হবে।
                                    </span>
                                </p>

                                {/* Divider */}
                                <div className="h-px bg-gray-100 mb-6" />

                                {/* Buttons */}
                                <div className="flex flex-col gap-3">
                                    {/* YES Button */}
                                    <motion.button
                                        onClick={handleBecomeProvider}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full flex items-center justify-between px-5 py-3.5 bg-[#0097E9] hover:bg-[#0080CC] text-white font-bold rounded-xl transition-colors group"
                                    >
                                        <span className="text-sm">হ্যাঁ, আমি Service Provider হতে চাই</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>

                                    {/* NO Button */}
                                    <motion.button
                                        onClick={() => setOpenProviderModal(false)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full px-5 py-3.5 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-semibold rounded-xl transition-colors text-sm"
                                    >
                                        না, পরে করব
                                    </motion.button>
                                </div>

                                <p className="text-center text-xs text-gray-400 mt-4">
                                    Yes click করলে আপনাকে logout করে{" "}
                                    <span className="text-[#0097E9] font-medium">Service Provider Registration</span>{" "}
                                    এ নিয়ে যাওয়া হবে।
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}