import { LogIn, UserPlus, Briefcase, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ServiceProviderBanner() {
    return (
        <section className="w-full bg-gradient-to-r from-blue-50 via-white to-indigo-50 md:py-12">
            <div className="md:max-w-[90vw] mx-auto px-0 md:px-12 lg:px-20">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white/60 backdrop-blur-md p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                    {/* Decorative blobs */}
                    <svg className="absolute -left-20 -top-20 w-72 h-72 opacity-20" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <defs>
                            <linearGradient id="g1" x1="0%" x2="100%">
                                <stop offset="0%" stopColor="#2563eb" />
                                <stop offset="100%" stopColor="#4f46e5" />
                            </linearGradient>
                        </defs>
                        <path fill="url(#g1)" d="M42.8,-62.3C54.5,-51.9,63.8,-41.1,69.5,-27.8C75.2,-14.6,77.3,1.2,72.9,15.8C68.6,30.4,57.8,43.8,44.4,52.6C31,61.4,15.5,65.6,-0.2,65.9C-15.9,66.1,-31.8,62.4,-45.3,53.9C-58.8,45.3,-69.8,31.8,-74.3,16.6C-78.8,1.4,-76.9,-15.5,-68.2,-29.2C-59.5,-42.8,-43.9,-53.2,-28.1,-61.2C-12.3,-69.2,3.8,-74.9,19.2,-73.5C34.6,-72.1,49.6,-63.6,42.8,-62.3Z" transform="translate(100 100)" />
                    </svg>

                    {/* Left: Text + CTA */}
                    <div className="relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg">
                                <Briefcase className="text-white w-6 h-6" />
                            </div>
                            <div>
                                <h6 className="text-sm font-semibold text-slate-600">Provider Portal</h6>
                                <p className="text-xs text-slate-400">for professionals & agencies</p>
                            </div>
                        </div>

                        <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight">
                            Grow your business with <span className="text-blue-600">Guptodhan</span>
                        </h1>

                        <p className="mt-4 text-slate-600 max-w-lg">
                            Sign in to manage your bookings, list your professional services, and connect with new clients — or register as a provider to start earning today.
                        </p>

                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                            <Link
                                href="/service/login"
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                                aria-label="Sign in to Provider Portal"
                            >
                                <LogIn size={18} />
                                Provider Login
                            </Link>

                            <Link
                                href="/service/register"
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-blue-600 text-blue-600 font-semibold bg-white/70 hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
                                aria-label="Register as a Service Provider"
                            >
                                <UserPlus size={18} />
                                Join as Provider
                            </Link>
                        </div>

                        <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-500 max-w-sm">
                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500" /> Secure Bookings</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500" /> Service Analytics</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500" /> Easy Scheduling</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500" /> Verified Reviews</li>
                        </ul>
                    </div>

                    {/* Right: Illustration / Dashboard SVG */}
                    <div className="relative z-10 flex items-center justify-center">
                        <div className="w-full max-w-md p-4 rounded-xl bg-gradient-to-tr from-white to-blue-50 shadow-inner border border-white/60">
                            <div className="rounded-lg overflow-hidden shadow-sm">
                                
                                {/* ✅ MAGIC FIX: Professional Dashboard SVG Illustration */}
                                <svg className="w-full h-52 object-cover bg-slate-50" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="400" height="200" fill="#f0f9ff" />
                                    {/* Sidebar */}
                                    <rect x="0" y="0" width="70" height="200" fill="#1e40af" />
                                    <rect x="15" y="20" width="40" height="8" rx="4" fill="#60a5fa" />
                                    <rect x="15" y="45" width="30" height="4" rx="2" fill="#3b82f6" />
                                    <rect x="15" y="60" width="35" height="4" rx="2" fill="#3b82f6" />
                                    <rect x="15" y="75" width="25" height="4" rx="2" fill="#3b82f6" />
                                    <rect x="15" y="90" width="30" height="4" rx="2" fill="#3b82f6" />

                                    {/* Header */}
                                    <rect x="70" y="0" width="330" height="30" fill="#ffffff" />
                                    <circle cx="370" cy="15" r="8" fill="#dbeafe" />
                                    <rect x="310" y="13" width="40" height="4" rx="2" fill="#e2e8f0" />

                                    {/* Content Area */}
                                    {/* Stats Card 1 */}
                                    <rect x="90" y="50" width="135" height="60" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                                    <circle cx="115" cy="80" r="14" fill="#dbeafe" />
                                    <path d="M110 80 L114 84 L120 76" stroke="#2563eb" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                    <rect x="140" y="65" width="50" height="6" rx="3" fill="#94a3b8" />
                                    <rect x="140" y="80" width="70" height="10" rx="5" fill="#1e293b" />

                                    {/* Stats Card 2 */}
                                    <rect x="240" y="50" width="135" height="60" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                                    <circle cx="265" cy="80" r="14" fill="#dcfce7" />
                                    <path d="M261 80 L264 83 L269 77" stroke="#16a34a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                    <rect x="290" y="65" width="50" height="6" rx="3" fill="#94a3b8" />
                                    <rect x="290" y="80" width="60" height="10" rx="5" fill="#1e293b" />

                                    {/* Chart Area */}
                                    <rect x="90" y="125" width="285" height="60" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                                    <rect x="110" y="145" width="15" height="25" rx="3" fill="#3b82f6" />
                                    <rect x="140" y="135" width="15" height="35" rx="3" fill="#93c5fd" />
                                    <rect x="170" y="155" width="15" height="15" rx="3" fill="#3b82f6" />
                                    <rect x="200" y="130" width="15" height="40" rx="3" fill="#93c5fd" />
                                    <rect x="230" y="140" width="15" height="30" rx="3" fill="#3b82f6" />
                                    <rect x="260" y="125" width="15" height="45" rx="3" fill="#93c5fd" />
                                    <rect x="290" y="150" width="15" height="20" rx="3" fill="#3b82f6" />
                                    <rect x="320" y="135" width="15" height="35" rx="3" fill="#93c5fd" />
                                </svg>
                                
                                <div className="p-4 bg-white">
                                    <h3 className="font-semibold text-slate-800">Professional Dashboard</h3>
                                    <p className="text-sm text-slate-500 mt-2">Track your appointments, manage service listings, and monitor your monthly growth.</p>

                                    <div className="mt-3 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-md bg-blue-100 flex items-center justify-center text-blue-700 font-bold">৳</div>
                                        <div>
                                            <p className="text-sm text-slate-600">Pending Payout</p>
                                            <p className="font-semibold text-slate-800">৳ 18,500</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subtle frame */}
                    <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/30"></div>
                </div>

                {/* Support */}
                <div className="mt-8 text-center text-sm text-slate-600">
                    Need help setting up your profile?{" "}
                    <a
                        href="https://wa.me/8801816500600?text=Hello!%20I%20need%20help%20with%20the%20Service%20Provider%20onboarding."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Contact Provider Support
                    </a>
                </div>
            </div>
        </section>
    );
}