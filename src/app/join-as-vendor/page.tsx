// import React from 'react'

// export default function JoinAsVendorPage() {
//   return (
//   <>


//   </>
//   )
// }


import React from "react";
import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

// Guptodhan Vendor Sign In / Sign Up Banner
// TailwindCSS classes used. Drop this component into a Next.js + Tailwind project.

export default function GuptodhanVendorBanner() {
    return (
        <section className="w-full bg-gradient-to-r from-emerald-50 via-white to-sky-50 py-12">
            <div className="max-w-[90vw] mx-auto px-6 md:px-12 lg:px-20">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white/60 backdrop-blur-md p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                    {/* Decorative blobs */}
                    <svg className="absolute -left-20 -top-20 w-72 h-72 opacity-20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <defs>
                            <linearGradient id="g1" x1="0%" x2="100%">
                                <stop offset="0%" stopColor="#06b6d4" />
                                <stop offset="100%" stopColor="#10b981" />
                            </linearGradient>
                        </defs>
                        <path fill="url(#g1)" d="M42.8,-62.3C54.5,-51.9,63.8,-41.1,69.5,-27.8C75.2,-14.6,77.3,1.2,72.9,15.8C68.6,30.4,57.8,43.8,44.4,52.6C31,61.4,15.5,65.6,-0.2,65.9C-15.9,66.1,-31.8,62.4,-45.3,53.9C-58.8,45.3,-69.8,31.8,-74.3,16.6C-78.8,1.4,-76.9,-15.5,-68.2,-29.2C-59.5,-42.8,-43.9,-53.2,-28.1,-61.2C-12.3,-69.2,3.8,-74.9,19.2,-73.5C34.6,-72.1,49.6,-63.6,42.8,-62.3Z" transform="translate(100 100)" />
                    </svg>

                    {/* Left: Text + CTA */}
                    <div className="relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-sky-500 flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold">G</span>
                            </div>
                            <div>
                                <h6 className="text-sm font-semibold text-slate-600">Vendor Portal</h6>
                                <p className="text-xs text-slate-400">for suppliers & merchants</p>
                            </div>
                        </div>

                        <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight">
                            Welcome to <span className="text-emerald-600">Guptodhan</span>
                        </h1>

                        <p className="mt-4 text-slate-600 max-w-lg">
                            Sign in to manage your shop, list products, and communicate with buyers — or create a new vendor account to start selling on Guptodhan today.
                        </p>

                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                            <Link
                                href="/vendor-singin"
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                aria-label="Sign in to Guptodhan"
                            >
                                <LogIn size={18} />
                                Sign In
                            </Link>

                            <Link
                                href="/vendor-singup"
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-emerald-600 text-emerald-600 font-semibold bg-white/70 hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-200"
                                aria-label="Create a vendor account on Guptodhan"
                            >
                                <UserPlus size={18} />
                                Sign Up
                            </Link>
                        </div>

                        <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-500 max-w-xs">
                            <li>✔ Verified payments</li>
                            <li>✔ Easy product listing</li>
                            <li>✔ Quick payouts</li>
                            <li>✔ Seller analytics</li>
                        </ul>

                    </div>

                    {/* Right: Illustration / Images */}
                    <div className="relative z-10 flex items-center justify-center">
                        <div className="w-full max-w-md p-4 rounded-xl bg-gradient-to-tr from-white to-emerald-50 shadow-inner border border-white/60">
                            <div className="rounded-lg overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=4f0d1a6e2c9b9f6b5f0c2c2d8d6c9b7a"
                                    alt="vendors dashboard preview"
                                    className="w-full h-52 object-cover"
                                />
                                <div className="p-4 bg-white">
                                    <h3 className="font-semibold text-slate-800">Vendor Dashboard</h3>
                                    <p className="text-sm text-slate-500 mt-2">Manage inventory, view orders, and track earnings — all in one place.</p>

                                    <div className="mt-3 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">BDT</div>
                                        <div>
                                            <p className="text-sm text-slate-600">Earnings</p>
                                            <p className="font-semibold text-slate-800">৳ 24,800</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subtle frame */}
                    <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/30"></div>
                </div>

                <p className="mt-6 text-center text-sm text-slate-500">Need help? <a href="#contact" className="text-emerald-600 font-semibold">Contact Guptodhan support</a></p>
            </div>
        </section>
    );
}
