import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Home } from 'lucide-react';
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
      {' '}
      <SidebarGroupLabel>
        <p className="text-[#f1bf43] text-[12px] uppercase">Website Config</p>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url}>
                <SidebarMenuSubButton className="flex gap-2 text-white   items-center">
                  <item.icon className="w-4 h-4 text-white stroke-white" />
                  <span>{item.title}</span>
                </SidebarMenuSubButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
