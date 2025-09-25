'use client';

import { ChevronDown } from 'lucide-react';
import { ElementType } from 'react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import Link from 'next/link';

const category = [
  { title: 'Create New', url: '/general/create/donation/category' },
  { title: 'View All Categories', url: '/general/view/donation/categories' },
];

export function Donation({
  items,
}: {
  items: { title: string; url: string; icon: ElementType }[];
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        <p className="text-[#f1bf43] text-[14px]">Donation Modules</p>
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => (
            <Collapsible key={item.title} className="group/collapsible">
              {/* (defaultOpen) - Collapsible class */}
              {/* Parent Button */}
              <CollapsibleTrigger asChild>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <item.icon />
                    {/* Donation Config */}
                    {item.title === 'Donation Config' && (
                      <Link
                        href="/general/donation/config"
                        className="flex items-center gap-2">
                        {item.title}
                      </Link>
                    )}

                    {/* Donation Categories */}
                    {item.title !== 'Donation Config' &&
                      item.title !== 'Donation Listing' &&
                      item.title !== 'Donation Request' && (
                        <span className="flex items-center gap-2">
                          {item.title}
                        </span>
                      )}
                    {item.title === 'Donation Categories' && (
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    )}

                    {/* Donation Listing */}
                    {item.title === 'Donation Listing' && (
                      <Link
                        href="/general/donation/listing"
                        className="flex items-center gap-2">
                        {item.title}
                      </Link>
                    )}

                    {/* Donation Request */}
                    {item.title === 'Donation Request' && (
                      <Link
                        href="/general/donation/requests"
                        className="flex items-center gap-2">
                        {item.title}
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </CollapsibleTrigger>
              {/* Child Items */}
              <CollapsibleContent>
                <div className="pl-6">
                  {item.title === 'Donation Categories' &&
                    category.map(sub => (
                      <SidebarMenuItem key={sub.url}>
                        {' '}
                        <Link
                          href={sub.url}
                          className="flex items-center gap-2">
                          <SidebarMenuButton asChild>
                            {/* <sub.icon className="h-4 w-4" /> */}
                            <span>{sub.title}</span>
                          </SidebarMenuButton>{' '}
                        </Link>
                      </SidebarMenuItem>
                    ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
