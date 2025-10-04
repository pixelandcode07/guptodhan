"use client"

import { ElementType } from "react"
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"
import { usePathname } from "next/navigation"


export function BuySell({ items }: { items: { title: string, url: string, icon: ElementType }[] }) {
    const pathname = usePathname()
    const isActive = (href: string) => pathname === href


    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>
                <p className="text-[#f1bf43] text-[14px]">
                    BuySell Modules
                </p>
            </SidebarGroupLabel>

            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => {
                        // define route based on title
                        let href = "#"
                        if (item.title === "Dashboard") href = "/general/buy/sell/dashboard"
                        if (item.title === "Listing Management") href = "/general/buy/sell/listing"
                        if (item.title === "Report Listing") href = "/general/buy/sell/report"
                        if (item.title === "Categories") href = "/general/categories"
                        if (item.title === "Setting") href = "/general/buy/sell/config"
                        const active = isActive(href)
                        return (
                            <Collapsible key={item.title} className="group/collapsible">
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuItem >
                                        <SidebarMenuButton className={`flex items-center gap-2 ${active
                                            ? "bg-[#051b38] hover:bg-[#051b38] text-white hover:text-white border-b border-white rounded-md pl-5"
                                            : "text-white bg-[#132843] pl-5"
                                            }`}>
                                            <item.icon />
                                            <Link href={href}>{item.title}</Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </CollapsibleTrigger>
                            </Collapsible>
                        )
                    })}

                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
