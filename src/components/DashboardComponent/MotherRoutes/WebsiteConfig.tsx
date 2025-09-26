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
    <div className="">
      <SidebarGroupLabel>
        <p className="text-[#f1bf43] text-[12px] uppercase">Website Config</p>
      </SidebarGroupLabel>
      <div className="list-none">
        {items.map(item => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <Link href={item.url || '#'} className="flex items-center gap-2">
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </div>
    </div>
  );
}
