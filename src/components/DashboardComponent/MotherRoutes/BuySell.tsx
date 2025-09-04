"use client"

import { ChevronDown } from "lucide-react"
import { ElementType } from "react"
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"


const category = [
    { title: "Create New Store", url: "/general/create/new/store" },
    { title: "View All Stores", url: "/general/view/all/stores" },
]


export function BuySell({ items }: { items: { title: string, url: string, icon: ElementType }[] }) {

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>
                <p className="text-[#f1bf43] text-[14px]">
                    BuySell Modules
                </p>
            </SidebarGroupLabel>

            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <Collapsible key={item.title} className="group/collapsible">
                            {/* (defaultOpen) - Collapsible class */}
                            {/* Parent Button */}
                            <CollapsibleTrigger asChild>
                                <SidebarMenuItem >
                                    <SidebarMenuButton>
                                        <item.icon />
                                        {(item.title === "Buy Sell Config" || item.title === "Buy Sell Listing") ? (
                                            <Link href="/general/buy/sell/config">
                                                <span>{item.title}</span>
                                            </Link>
                                        ) : (
                                            <span>{item.title}</span>
                                        )}
                                        {item.title === "Buy Sell Categories" && <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </CollapsibleTrigger>
                            {/* Child Items */}
                            <CollapsibleContent>
                                <div className="pl-6">
                                    {item.title === "Buy Sell Categories" &&
                                        category.map((sub) => (
                                            <SidebarMenuItem key={sub.url}>
                                                <SidebarMenuButton asChild>
                                                    <Link
                                                        href={sub.url}
                                                        className="flex items-center gap-2"
                                                    >
                                                        {/* <sub.icon className="h-4 w-4" /> */}
                                                        <span>{sub.title}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}

                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
