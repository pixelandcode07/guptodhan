"use client"

import { ChevronDown, Headphones, Phone, Users, MessageCircle } from "lucide-react"
import { ElementType } from "react"
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../../ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible"
import Link from "next/link"

interface CRMModuleTitleOnly { title: string }

type ChildItem = { title: string; url: string; count?: string; color?: string }

const CRM_MENU_CONFIG: Record<string, { icon: ElementType; items: ChildItem[]; url?: string; badge?: string }> = {
  "Support Ticket": {
    icon: Headphones,
    badge: "0",
    items: [
      { title: "Pending Supports", url: "/general/pending/support/tickets", count: "0", color: "text-blue-500" },
      { title: "Solved Supports", url: "/general/solved/support/tickets", count: "1", color: "text-green-500" },
      { title: "On Hold Supports", url: "/general/on/hold/support/tickets", count: "0", color: "text-yellow-500" },
      { title: "Rejected Supports", url: "/general/rejected/support/tickets", count: "1", color: "text-red-500" },
    ],
  },
  "Contact Request": {
    icon: Phone,
    items: [],
    url: "/general/view/all/contact/requests",
  },
  "Subscribed Users": {
    icon: Users,
    items: [],
    url: "/general/view/all/subscribed/users",
  },
  "Blog Comments": {
    icon: MessageCircle,
    items: [],
    url: "/general/view/all/blog/comments",
  },
}

export function CRMModules({ items }: { items: CRMModuleTitleOnly[] }) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-[#f1bf43] text-[14px]">
        CRM MODULES
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const cfg = CRM_MENU_CONFIG[item.title]
            if (!cfg) return null
            
            if (cfg.items.length === 0) {
              // Direct link for items without sub-routes
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={cfg.url || "#"} className="flex items-center gap-2">
                      <cfg.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            }
            
            // Collapsible for items with sub-routes
            return (
              <Collapsible key={item.title} className="group/collapsible">
                <CollapsibleTrigger asChild>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <cfg.icon />
                      <span>{item.title}</span>
                      {cfg.badge && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cfg.badge}
                        </span>
                      )}
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="pl-6">
                    {cfg.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.url}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={subItem.url}
                            className="flex items-center gap-2"
                          >
                            <span className={subItem.color || "text-white"}>{subItem.title}</span>
                            {subItem.count && (
                              <span className={`ml-auto text-xs px-2 py-1 rounded ${
                                subItem.count === "0" ? "bg-orange-500 text-white" : 
                                subItem.count === "1" ? "bg-green-500 text-white" : "text-blue-400"
                              }`}>
                                ({subItem.count})
                              </span>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
