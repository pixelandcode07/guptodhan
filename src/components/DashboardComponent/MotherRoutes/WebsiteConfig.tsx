import {
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';

import { ElementType } from 'react';

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
