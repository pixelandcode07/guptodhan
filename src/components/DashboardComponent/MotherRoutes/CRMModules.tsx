'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Headset, Phone, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';

export default function CRMModules() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const token = (session as any)?.accessToken;
    
    // পেন্ডিং টিকেট গণনার জন্য state
    const [pendingCount, setPendingCount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // অ্যাডমিন প্যানেলে দেখানোর জন্য CRM লিঙ্কগুলো
    const crmLinks = [
        {
            href: '/general/support/tickets',
            label: 'Support Ticket',
            icon: Headset,
            count: pendingCount, // এটি API থেকে লোড হবে
        },
        {
            href: '/general/view/all/contact/requests', // আপনার ফাইল স্ট্রাকচার অনুযায়ী
            label: 'Contact Request',
            icon: Phone,
            count: null, // এখানে কোনো কাউন্ট নেই
        },
        {
            href: '#', // সার্ভিস কোয়েরির জন্য কোনো পেজ এখনো নেই
            label: 'Service Query Form',
            icon: ClipboardList,
            count: null,
            disabled: true, // লিঙ্কটি নিষ্ক্রিয় রাখা হলো
        }
    ];

    // API থেকে পেন্ডিং টিকেটের সংখ্যা fetch করা
    useEffect(() => {
        const fetchTicketStats = async () => {
            if (token) {
                try {
                    setIsLoading(true);
                    // আপনার তৈরি করা stats API-কে কল করা হচ্ছে
                    const res = await axios.get('/api/v1/crm-modules/support-ticket/stats', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.data.success) {
                        setPendingCount(res.data.data.Pending || 0);
                    }
                } catch (error) {
                    console.error("Failed to fetch ticket stats:", error);
                    setPendingCount(0); // Error হলেও 0 দেখাবে
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchTicketStats();
    }, [token]);

    return (
        <div className="px-4 py-3">
            {/* CRM টাইটেল (image_bea01e.png অনুযায়ী) */}
            <span className="text-xs font-semibold text-gray-500 uppercase px-3">
                CRM
            </span>
            <ul className="mt-2 space-y-1">
                {crmLinks.map((link) => {
                    // বর্তমান URL-এর সাথে লিঙ্কটি মিলিয়ে দেখা হচ্ছে
                    const isActive = pathname.startsWith(link.href);
                    
                    return (
                        <li key={link.label}>
                            <Link
                                href={link.disabled ? '#' : link.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-blue-700 text-white" // Active লিঙ্ক (ডিজাইন অনুযায়ী)
                                        : "text-gray-700 hover:bg-gray-100",
                                    link.disabled ? "opacity-50 cursor-not-allowed" : ""
                                )}
                            >
                                <link.icon className="h-5 w-5" />
                                <span>{link.label}</span>
                                
                                {/* কাউন্ট দেখানোর লজিক */}
                                {isLoading && link.label === 'Support Ticket' && (
                                    <Skeleton className="h-4 w-6 ml-auto rounded-full" />
                                )}
                                {!isLoading && link.count !== null && (
                                    <span className={cn(
                                        "ml-auto text-xs font-semibold px-2 py-0.5 rounded-full",
                                        isActive
                                            ? "bg-white text-blue-700"
                                            : "bg-gray-200 text-gray-700"
                                    )}>
                                        {link.count}
                                    </span>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}