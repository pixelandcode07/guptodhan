"use client"

import { DollarSign, Home, Store, StoreIcon, UserCheck, Workflow } from "lucide-react"
import { ElementType } from "react"
// import { DollarSign, Store, UserCheck } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar"
import Link from "next/link"

const vendor = [
  { title: "Sellers", url: "/sellers", icon: UserCheck },
  { title: "Stores", url: "/stores", icon: Store },
  { title: "Plans", url: "/plans", icon: DollarSign },
]

const stores = [
  { title: "All Stores", url: "/all-stores", icon: StoreIcon },
  { title: "Add New Store", url: "/add-new-store", icon: Home },
]

const Withdrawal = [
  { title: "Withdrawal", url: "/withdrawal", icon: DollarSign },
  { title: "Add New Withdrawal", url: "/add-new-withdrawal", icon: Workflow },
  { title: "All Withdrawal", url: "/all-withdrawal", icon: DollarSign },
]

export function Multivendor({ items }: { items: { title: string, url: string, icon: ElementType }[] }) {

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Multivendor Modules</SidebarGroupLabel>
      <Collapsible defaultOpen className="group/collapsible">
        {/* <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger> */}
        {/* <SidebarGroupLabel asChild>
          <CollapsibleTrigger>
            Help
            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
        </SidebarGroupLabel> */}
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild>
                  <div>
                    <item.icon />
                    <span>{item.title}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

          </SidebarMenu>
        </SidebarGroupContent>
        {/* <CollapsibleContent>
          <SidebarGroupContent />
        </CollapsibleContent> */}
      </Collapsible>
    </SidebarGroup>
  )
}
