import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import Link from 'next/link';
// import { ChevronDown } from 'lucide-react'
// import { Key } from 'lucide-react'
import React, { ElementType } from 'react';

export default function WebsiteConfig({
  items,
}: {
  items: { title: string; url: string; icon: ElementType }[];
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenuButton>
        <Link href="/general/home">Dashboard</Link>
      </SidebarMenuButton>
      <SidebarGroupLabel>
        <p className="text-[#f1bf43] text-[12px] uppercase">Website Config</p>
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuSubButton>
                <Link className="flex gap-2  items-center" href={item.url}>
                  <item.icon className="w-4 h-4 " />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
