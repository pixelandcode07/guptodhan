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

const vendor = [
  { title: 'Add Category', url: '/general/create/vendor/category' },
  { title: 'Business Categories', url: '/general/view/vendor/categories' },
  { title: 'Create New Vendor', url: '/general/create/new/vendor' },
  { title: 'Vendor Requests', url: '/general/view/vendor/requests' },
  { title: 'Approved Vendors', url: '/general/view/all/vendors' },
  { title: 'Inactive Vendors', url: '/general/view/inactive/vendors' },
];

const stores = [
  { title: 'Create New Store', url: '/general/create/new/store' },
  { title: 'View All Stores', url: '/general/view/all/stores' },
];

const withdrawal = [
  { title: 'All Withdrawal', url: '/general/view/all/withdraws' },
  { title: 'Create Withdrawal', url: '/general/create/new/withdraw' },
  { title: 'Withdrawal Requests', url: '/general/view/withdraw/requests' },
  { title: 'Completed Withdraws', url: '/general/view/completed/withdraws' },
  { title: 'Cancelled Withdraws', url: '/general/view/cancelled/withdraws' },
  { title: 'Payment History', url: '/general/view/payment/history' },
];

export function Multivendor({
  items,
}: {
  items: { title: string; url: string; icon: ElementType }[];
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        <p className="text-[#f1bf43] text-[14px]">Multivendor Modules</p>
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
                    <span>{item.title}</span>
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </CollapsibleTrigger>
              {/* Child Items */}
              <CollapsibleContent>
                <div className="pl-6">
                  {item?.title === 'Vendors' &&
                    vendor.map(subItem => (
                      <SidebarMenuItem key={subItem?.url}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={subItem?.url}
                            className="flex items-center gap-2">
                            {/* <subItem.icon className="h-4 w-4" /> */}
                            <span>{subItem?.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  {item.title === 'Stores' &&
                    stores.map(sub => (
                      <SidebarMenuItem key={sub.url}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={sub.url}
                            className="flex items-center gap-2">
                            {/* <sub.icon className="h-4 w-4" /> */}
                            <span>{sub.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}

                  {item.title === 'Withdrawal' &&
                    withdrawal.map(sub => (
                      <SidebarMenuItem key={sub.url}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={sub.url}
                            className="flex items-center gap-2">
                            {/* <sub.icon className="h-4 w-4" /> */}
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
  );
}
