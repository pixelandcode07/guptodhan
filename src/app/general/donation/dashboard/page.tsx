"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import {
    Users, Gift, UserPlus, Clock, CheckCircle, ArrowUp, ArrowDown,
    Activity, MoreHorizontal, Calendar, Filter, Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useSession } from "next-auth/react";
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// --- Utility: Time Ago Formatter ---
const timeAgo = (dateString: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " min ago";
    return "Just now";
};

// --- Components ---

interface StatCardProps {
    title: string;
    value: string | number;
    change: number;
    icon: React.ReactNode;
    colorClass?: string;
    subText?: string;
}

function StatCard({ title, value, change, icon, colorClass, subText }: StatCardProps) {
    const isPositive = change >= 0;
    return (
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            <div className="flex items-start justify-between">
                <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-500 whitespace-nowrap">{title}</p>
                    <h3 className="mt-2 text-2xl font-bold text-gray-900">{value}</h3>
                </div>
                {/* 🔥 FIX: flex-shrink-0 added to prevent icon from squeezing */}
                <div className={cn("p-3 rounded-xl bg-opacity-10 flex-shrink-0 ml-2", colorClass?.replace('text-', 'bg-'))}>
                    {icon}
                </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <span className={cn("flex items-center font-medium px-2 py-0.5 rounded-full bg-opacity-10", 
                    isPositive ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
                )}>
                    {isPositive ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                    {Math.abs(change)}%
                </span>
                <span className="text-gray-400 text-xs truncate">{subText || "vs last month"}</span>
            </div>
            {/* Decoration */}
            <div className={cn("absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-5 transition-all group-hover:scale-110", colorClass?.replace('text-', 'bg-'))} />
        </div>
    );
}

function AnalyticsChart({ data }: { data: any[] }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Donation vs Claims</h3>
                    <p className="text-sm text-gray-500">Analytics for the last 30 days</p>
                </div>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                    <Calendar className="mr-2 h-4 w-4" /> Last 30 Days
                </Button>
            </div>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorClaims" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F3F4F6" />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="donations" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorDonations)" />
                        <Area type="monotone" dataKey="claims" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorClaims)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function RecentActivityList({ activities }: { activities: any[] }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm h-full">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">View All</Button>
            </div>
            <div className="space-y-4">
                {activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="bg-gray-50 p-3 rounded-full mb-2">
                            <Activity className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500">No recent activities found.</p>
                    </div>
                ) : (
                    activities.map((act) => (
                        <div key={act.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0 group">
                            <Avatar className="h-9 w-9 border border-gray-100">
                                <AvatarFallback className={cn(
                                    "text-xs font-bold transition-colors",
                                    act.action === 'donated' ? "bg-blue-50 text-blue-600 group-hover:bg-blue-100" : 
                                    act.action === 'claimed' ? "bg-orange-50 text-orange-600 group-hover:bg-orange-100" : "bg-gray-50 text-gray-600"
                                )}>
                                    {act.avatar}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {act.user} 
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {act.action} <span className="font-semibold text-gray-700">{act.item}</span>
                                </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-[10px] text-gray-400 whitespace-nowrap">{timeAgo(act.time)}</span>
                                <span className={cn(
                                    "text-[9px] px-1.5 py-0.5 rounded-full capitalize font-medium",
                                    act.status === 'completed' || act.status === 'approved' ? "bg-green-50 text-green-700" :
                                    act.status === 'pending' ? "bg-yellow-50 text-yellow-700" : "bg-gray-50 text-gray-600"
                                )}>
                                    {act.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// --- Main Page ---

export default function DonationDashboard() {
    const { data: session } = useSession();
    const [data, setData] = useState<any>({
        totalCampaigns: 0, totalCampaignsChange: 0,
        totalClaims: 0, totalClaimsChange: 0,
        pendingClaims: 0, pendingClaimsChange: 0,
        completedCampaigns: 0, completedCampaignsChange: 0,
        newClaimsToday: 0, newClaimsTodayChange: 0,
        chartData: [],
        activities: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // @ts-ignore
                const token = session?.accessToken; 
                if (!token) return;

                const res = await axios.get('/api/v1/donation-stats/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoading(false);
            }
        };

        if (session) fetchStats();
    }, [session]);

    if (loading) return (
        <div className="flex h-[80vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <p className="text-sm text-gray-500">Loading Dashboard...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/30 p-4 md:p-6 space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
                    <p className="text-sm text-gray-500 mt-1">Real-time donation analytics and activities.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="bg-white hover:bg-gray-50"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm"><Download className="mr-2 h-4 w-4" /> Export</Button>
                </div>
            </div>
            
            {/* 🔥 FIX: Responsive Grid Adjusted */}
            {/* xl:grid-cols-5 removed, changed to xl:grid-cols-4 and 2xl:grid-cols-5 for better spacing */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                <StatCard title="Total Campaigns" value={data.totalCampaigns} change={data.totalCampaignsChange} icon={<Gift className="h-5 w-5 text-blue-600" />} colorClass="text-blue-600 bg-blue-100" />
                <StatCard title="Total Claims" value={data.totalClaims} change={data.totalClaimsChange} icon={<Users className="h-5 w-5 text-purple-600" />} colorClass="text-purple-600 bg-purple-100" />
                <StatCard title="New Claims Today" value={data.newClaimsToday} change={data.newClaimsTodayChange} icon={<UserPlus className="h-5 w-5 text-emerald-600" />} colorClass="text-emerald-600 bg-emerald-100" subText="Since yesterday" />
                <StatCard title="Pending Action" value={data.pendingClaims} change={data.pendingClaimsChange} icon={<Activity className="h-5 w-5 text-orange-600" />} colorClass="text-orange-600 bg-orange-100" />
                <StatCard title="Completed" value={data.completedCampaigns} change={data.completedCampaignsChange} icon={<CheckCircle className="h-5 w-5 text-teal-600" />} colorClass="text-teal-600 bg-teal-100" />
            </div>

            {/* Charts and Activity Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <AnalyticsChart data={data.chartData} />
                </div>
                <div className="lg:col-span-1">
                    <RecentActivityList activities={data.activities} />
                </div>
            </div>
        </div>
    );
}