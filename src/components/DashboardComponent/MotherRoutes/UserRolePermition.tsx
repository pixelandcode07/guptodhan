import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import Link from 'next/link';

import React, { ElementType } from 'react';

export default function UserRolePermition({
  items,
}: {
  items: { title: string; url: string; icon: ElementType }[];
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        <p className="text-[#f1bf43] text-[12px] uppercase">
          User Role Permission
        </p>
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => (
            <SidebarMenuItem key={item.title}>
              {' '}
              <Link href={item.url}>
                <SidebarMenuSubButton className="flex gap-2  items-center">
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
