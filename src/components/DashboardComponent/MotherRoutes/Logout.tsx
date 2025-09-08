import { Button } from '@/components/ui/button'
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import Link from 'next/link';
import React, { ElementType } from 'react'

export default function Logout({
    items,
}: {
    items: { title: string; url: string; icon: ElementType }[];
}) {
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>
                <p className="text-[#f1bf43] text-[14px]">
                    {/* Donation Modules */}
                </p>
            </SidebarGroupLabel>

            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        < SidebarMenuItem key={item.title} >
                            <SidebarMenuButton >
                                <item.icon />
                                {item.title === "Logout" && <div>
                                    <Link href="/general/logout" className="flex items-center gap-2">{item.title}</Link>
                                </div>}

                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup >
    )
}
