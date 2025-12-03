'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Headset, Phone, ClipboardList, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../../ui/sidebar';

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
            count: pendingCount,
        },
        {
            href: '/general/view/all/contact/requests',
            label: 'Contact Request',
            icon: Phone,
            count: null,
        },
        {
            href: '/general/view/all/subscribed/users',
            label: 'Subscribed Users',
            icon: Users,
            count: null,
        },
        {
            href: '#',
            label: 'Service Query Form',
            icon: ClipboardList,
            count: null,
            disabled: true,
        }
    ];

    // API থেকে পেন্ডিং টিকেটের সংখ্যা fetch করা
    useEffect(() => {
        const fetchTicketStats = async () => {
            if (token) {
                try {
                    setIsLoading(true);
                    const res = await axios.get('/api/v1/crm-modules/support-ticket/stats', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.data.success) {
                        setPendingCount(res.data.data.Pending || 0);
                    }
                } catch (error) {
                    console.error("Failed to fetch ticket stats:", error);
                    setPendingCount(0);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchTicketStats();
    }, [token]);

    const isActive = (href: string) => {
        if (href === '#' || !pathname) return false;
        return pathname.startsWith(href);
    };

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="text-[#f1bf43] text-[14px]">
                CRM MODULES
            </SidebarGroupLabel>

            <SidebarGroupContent>
                <SidebarMenu>
                    {crmLinks.map((link) => {
                        const active = isActive(link.href);
                        
                        return (
                            <SidebarMenuItem key={link.label}>
                                <SidebarMenuButton
                                    asChild
                                    disabled={link.disabled}
                                    isActive={active}
                                    className={`flex items-center gap-2 pl-5 ${
                                        active
                                            ? 'bg-[#051b38] hover:bg-[#051b38] text-white hover:text-white border-b border-white rounded-md font-medium'
                                            : 'text-white bg-[#132843]'
                                    } ${link.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <Link href={link.disabled ? '#' : link.href}>
                                        <link.icon className="h-5 w-5" />
                                        <span>{link.label}</span>
                                        
                                        {/* কাউন্ট দেখানোর লজিক */}
                                        {isLoading && link.label === 'Support Ticket' && (
                                            <span className="ml-auto text-xs px-2 py-1 rounded bg-gray-600 text-white animate-pulse">
                                                ...
                                            </span>
                                        )}
                                        {!isLoading && link.count !== null && link.count !== undefined && (
                                            <span className={`ml-auto text-xs px-2 py-1 rounded ${
                                                link.count === 0
                                                    ? 'bg-orange-500 text-white'
                                                    : 'bg-blue-400 text-white'
                                            }`}>
                                                {link.count}
                                            </span>
                                        )}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}