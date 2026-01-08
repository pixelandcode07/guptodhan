
import Image from "next/image";
import Link from "next/link";
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Linkedin,
    SendHorizontal,
    Mail,
    MessageCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export default function FooterComplete() {
    return (
        <footer className=" bg-gray-100 border-t border-gray-100 font-sans">
            {/* --- Newsletter Section --- */}
            <div className="md:max-w-[95vw] xl:container sm:px-8 mx-auto py-4 md:py-10 border-b border-gray-100">
                <div className="flex flex-col xl:flex-row items-center justify-center xl:justify-between gap-6">
                    <Link href="/">
                        <Image src="/img/logo.png" alt="Guptodhan" width={160} height={50} className="h-auto w-auto" />
                    </Link>
                    <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4">
                        <div className="bg-gray-50 p-4 rounded-full">
                            <Mail className="w-6 h-6 md:w-8 md:h-8 text-gray-700" />
                        </div>
                        <div>
                            <h3 className="text-base md:text-lg font-bold text-[#00005E] uppercase tracking-tight">
                                Subscribe to our Newsletter
                            </h3>
                            <p className="text-xs md:text-sm text-gray-500">
                                Get all the latest information on Events, Sales and Offers.
                            </p>
                        </div>
                    </div>

                    <div className="flex w-full xl:w-auto justify-center">
                        <div className="flex w-full max-w-sm items-center gap-2">
                            <Input type="email" placeholder="Email" />
                            <Button type="submit" variant="FooterSubscribeBtn">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Main Footer Content --- */}
            <div className="md:max-w-[95vw] xl:container sm:px-8 mx-auto py-10 md:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-10">

                    {/* Column 1: Contact Info */}
                    <div className="sm:col-span-2 xl:col-span-1 space-y-5">

                        <div className="space-y-1">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Got Question? Call us 24/7</p>
                            <Link
                                href="https://wa.me/8801816500600?text=Welcome%20,%20How%20can%20we%20help%20you?"
                                target="_blank"
                                className="block group"
                            >
                                <p className="text-2xl font-bold text-[#00005E] group-hover:text-green-600 transition-colors">
                                    01816500600
                                </p>
                                <span className="text-[10px] text-green-600 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MessageCircle size={12} /> Click to Chat on WhatsApp
                                </span>
                            </Link>
                        </div>
                        <p className="text-sm font-semibold text-[#00005E]">guptodhan24@gmail.com</p>
                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                            Guptodhan Bangladesh is online version of Guptodhan situated at Dhaka since 2024
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {[
                                { Icon: Facebook, color: "bg-[#3b5998]" },
                                { Icon: Twitter, color: "bg-[#00acee]" },
                                { Icon: Instagram, color: "bg-[#d62976]" },
                                { Icon: Youtube, color: "bg-[#FF0000]" },
                                { Icon: Linkedin, color: "bg-[#0072b1]" },
                            ].map((social, i) => (
                                <Link key={i} href="#" className={`${social.color} text-white p-2.5 rounded-full hover:-translate-y-1 transition-all shadow-sm`}>
                                    <social.Icon size={16} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Company */}
                    <div className="md:pl-4">
                        <h4 className="font-bold text-[#00005E] mb-6 uppercase text-sm tracking-widest border-b-2 border-blue-50 pb-2 inline-block">Company</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li>
                                {/* <Link href="/" className="hover:text-blue-600 transition-colors"> */}
                                <a href="#navbar" className="hover:text-blue-600 transition-colors">Home</a>
                                {/* </Link> */}
                            </li>
                            <li><Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                            <li><Link href="https://wa.me/8801816500600?text=Welcome%20,%20How%20can%20we%20help%20you?"
                                target="_blank"
                                className="block group hover:text-blue-600 transition-colors">Contact Us</Link></li>
                            <li>
                                <Link href="/home/vendor-shops" className="hover:text-blue-600 transition-colors">Vendor Shops</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: My Account */}
                    <div>
                        <h4 className="font-bold text-[#00005E] mb-6 uppercase text-sm tracking-widest border-b-2 border-blue-50 pb-2 inline-block">My Account</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link href="/home/UserProfile" className="hover:text-blue-600 transition-colors">My Dashboard</Link></li>
                            <li><Link href="/home/UserProfile/orders" className="hover:text-blue-600 transition-colors">My Orders</Link></li>
                            <li><Link href="/home/UserProfile/wishlist" className="hover:text-blue-600 transition-colors">My Wishlist</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">My Payments</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Promo/Coupons</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Customer Service */}
                    <div>
                        <h4 className="font-bold text-[#00005E] mb-6 uppercase text-sm tracking-widest border-b-2 border-blue-50 pb-2 inline-block">Service</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link href="/track" className="hover:text-blue-600 transition-colors">Track My Order</Link></li>
                            <li><Link href="/support" className="hover:text-blue-600 transition-colors">Support Ticket</Link></li>
                            <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/shipping" className="hover:text-blue-600 transition-colors">Shipping Policy</Link></li>
                            <li><Link href="/return" className="hover:text-blue-600 transition-colors">Return Policy</Link></li>
                        </ul>
                    </div>

                    {/* Column 5: Download App */}
                    <div className="flex flex-col gap-4 sm:items-start">
                        <h4 className="font-bold text-[#00005E] uppercase text-sm tracking-widest">Download App</h4>
                        <Link href="#" className="inline-block transition-transform hover:scale-105 active:scale-95">
                            <Image
                                src="/img/google-play.svg"
                                alt="Get it on Google Play"
                                width={160}
                                height={48}
                                className="rounded-md"
                            />
                        </Link>
                    </div>
                </div>
            </div>

            {/* --- Bottom Footer Bar --- */}
            <div className="bg-[#00005E] text-white py-5">
                <div className="md:max-w-[95vw] xl:container sm:px-8 mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="text-sm text-center lg:text-left space-y-1">
                        <p className="opacity-90">Copyright © 2026 GuptoDhan. All Rights Reserved.</p>
                        <p className="text-blue-300 text-xs mt-1 tracking-wide">
                            Powered by <span className="text-white font-bold">Pixel&Code</span>
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-2">
                        {/* Payment Icons */}
                        <Image
                            src="/img/footer-payment-options.png"
                            alt="Payment Methods"
                            width={1200}
                            height={40}
                            className=""
                        />
                    </div>
                </div>
            </div>
        </footer>
    )
}
