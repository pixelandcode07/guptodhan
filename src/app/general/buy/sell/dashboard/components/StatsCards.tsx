"use client";

import {
    Users,
    Eye,
    UserPlus,
    Clock,
    AlertTriangle,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    change: number; // positive or negative %
    icon: React.ReactNode;
}

function StatCard({ title, value, change, icon }: StatCardProps) {
    const isPositive = change >= 0;

    return (
        <div className="flex flex-col gap-2 rounded-lg border bg-white p-4 shadow-sm">
            {/* Title + Icon */}
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                {icon}
                {title}
            </div>

            {/* Value + Percentage Change */}
            <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-gray-900">{value}</span>
                <span
                    className={cn(
                        "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md",
                        isPositive
                            ? "text-green-700 bg-green-100"
                            : "text-red-700 bg-red-100"
                    )}
                >
                    {isPositive ? (
                        <ArrowUp className="h-3 w-3" />
                    ) : (
                        <ArrowDown className="h-3 w-3" />
                    )}
                    {Math.abs(change)}%
                </span>
            </div>

            {/* Footer */}
            <p className="text-xs text-gray-500">Compared to last month</p>
        </div>
    );
}

export default function StatsCards() {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatCard
                title="Total Users"
                value="12,543"
                change={19}
                icon={<Users className="h-4 w-4 text-sky-500" />}
            />
            <StatCard
                title="Total Listings"
                value="8,392"
                change={8}
                icon={<Eye className="h-4 w-4 text-sky-500" />}
            />
            <StatCard
                title="New Today"
                value="47"
                change={5}
                icon={<UserPlus className="h-4 w-4 text-sky-500" />}
            />
            <StatCard
                title="Pending Approvals"
                value="156"
                change={5}
                icon={<Clock className="h-4 w-4 text-sky-500" />}
            />
            <StatCard
                title="Reported Listings"
                value="23"
                change={-2}
                icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
            />
        </div>
    );
}
