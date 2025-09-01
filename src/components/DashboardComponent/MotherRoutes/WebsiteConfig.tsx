import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuSubButton } from '@/components/ui/sidebar'
// import { ChevronDown } from 'lucide-react'
// import { Key } from 'lucide-react'
import React, { ElementType } from 'react'

export default function WebsiteConfig({ items }: { items: { title: string, url: string, icon: ElementType }[] }) {
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>
                <p className="text-[#f1bf43] text-[14px]">
                    Multivendor Modules
                </p>
            </SidebarGroupLabel>

            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        // {/* (defaultOpen) - Collapsible class */}
                        // {/* Parent Button */}
                        // <CollapsibleTrigger asChild>
                        <SidebarMenuItem key={item.title} >
                            <SidebarMenuSubButton>
                                {/* <item.icon /> */}
                                <span>{item.title}</span>
                                {/* <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" /> */}
                            </SidebarMenuSubButton>
                        </SidebarMenuItem>
                        // {/* </CollapsibleTrigger> */}
                    ))}

                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
