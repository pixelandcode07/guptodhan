"use client"

import { ChevronDown, DollarSign, Home, Store, StoreIcon, UserCheck, Workflow } from "lucide-react"
import { ElementType } from "react"
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import Link from "next/link"

const vendor = [
  { title: "Add Category", url: "/general/create/vendor/category", icon: UserCheck },
  { title: "Business Categories", url: "/view/vendor/categories", icon: Store },
  { title: "Create New Vendor", url: "/create/new/vendor", icon: Store },
  { title: "Plans", url: "/plans", icon: DollarSign },
]

const stores = [
  { title: "All Stores", url: "/all-stores", icon: StoreIcon },
  { title: "Add New Store", url: "/add-new-store", icon: Home },
]

const withdrawal = [
  // { title: "Withdrawal", url: "/withdrawal", icon: DollarSign },
  { title: "Add New Withdrawal", url: "/add-new-withdrawal", icon: Workflow },
  { title: "All Withdrawal", url: "/all-withdrawal", icon: DollarSign },
]

export function Multivendor({ items }: { items: { title: string, url: string, icon: ElementType }[] }) {

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Multivendor Modules</SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <Collapsible key={item.title} className="group/collapsible">
              {/* (defaultOpen) - Collapsible class */}
              {/* Parent Button */}
              <CollapsibleTrigger asChild>
                <SidebarMenuItem >
                  <SidebarMenuButton >
                    <item.icon />
                    <span>{item.title}</span>
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </CollapsibleTrigger>
              {/* Child Items */}
              <CollapsibleContent>
                <div>
                  {item?.title === "Vendors" && vendor.map((subItem) => (
                    <SidebarMenuItem key={subItem?.url}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={subItem?.url}
                          className="flex items-center gap-2"
                        >
                          <subItem.icon className="h-4 w-4" />
                          <span>{subItem?.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  {item.title === "Stores" &&
                    stores.map((sub) => (
                      <SidebarMenuItem key={sub.url}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={sub.url}
                            className="flex items-center gap-2"
                          >
                            <sub.icon className="h-4 w-4" />
                            <span>{sub.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}

                  {item.title === "Withdrawal" &&
                    withdrawal.map((sub) => (
                      <SidebarMenuItem key={sub.url}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={sub.url}
                            className="flex items-center gap-2"
                          >
                            <sub.icon className="h-4 w-4" />
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
