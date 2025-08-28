"use client"

import { ChevronDown } from "lucide-react"
import { ElementType } from "react"
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import Link from "next/link"

interface EcommerceModuleItem {
  title: string
  icon: ElementType
  items?: {
    title: string
    url: string
    count?: string
    isNew?: boolean
  }[]
}

export function EcommerceModules({ items }: { items: EcommerceModuleItem[] }) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-yellow-300 font-semibold text-lg">
        E-COMMERCE MODULES
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <Collapsible key={item.title} defaultOpen={false} className="group/collapsible">
              {/* Parent Button */}
              <CollapsibleTrigger asChild>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <item.icon />
                    <span>{item.title}</span>
                    {item.items && (
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </CollapsibleTrigger>
              
              {/* Child Items */}
              {item.items && (
                <CollapsibleContent>
                  <div>
                    {item.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.url}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={subItem.url}
                            className="flex items-center gap-2 pl-8"
                          >
                            <span>{subItem.title}</span>
                            {subItem.count && (
                              <span className={`ml-auto text-xs px-2 py-1 rounded ${
                                subItem.count === "0" ? "bg-orange-500 text-white" : 
                                subItem.count === "829" ? "text-green-500" : "text-blue-400"
                              }`}>
                                {subItem.count}
                              </span>
                            )}
                            {subItem.isNew && (
                              <span className="ml-auto text-xs bg-orange-500 text-white px-2 py-1 rounded">
                                New
                              </span>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </div>
                </CollapsibleContent>
              )}
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
