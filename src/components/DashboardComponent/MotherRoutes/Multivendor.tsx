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
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        <p className="text-[#f1bf43] text-[14px]">Multivendor Modules</p>
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <Collapsible key={item.title} className="group/collapsible">
              {/* Parent Button */}
              <CollapsibleTrigger asChild>
                <SidebarMenuItem>
                  <SidebarMenuButton className="flex items-center gap-2 text-white bg-[#132843] pl-5 hover:bg-[#051b38] hover:text-white rounded-md">
                    <item.icon />
                    <span>{item.title}</span>
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </CollapsibleTrigger>

              {/* Child Items */}
              <CollapsibleContent>
                <div className="pl-6">
                  {item.title === 'Vendors' &&
                    vendor.map((subItem) => {
                      const active = isActive(subItem.url);
                      return (
                        <SidebarMenuItem key={subItem.url}>
                          <SidebarMenuButton
                            asChild
                            className={`flex items-center gap-2 ${active
                                ? 'bg-[#051b38] hover:bg-[#051b38] text-white hover:text-white border-b border-white rounded-md pl-5'
                                : 'text-white bg-[#132843] pl-5'
                              }`}
                          >
                            <Link href={subItem.url}>{subItem.title}</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}

                  {item.title === 'Stores' &&
                    stores.map((sub) => {
                      const active = isActive(sub.url);
                      return (
                        <SidebarMenuItem key={sub.url}>
                          <SidebarMenuButton
                            asChild
                            className={`flex items-center gap-2 ${active
                                ? 'bg-[#051b38] hover:bg-[#051b38] text-white hover:text-white border-b border-white rounded-md pl-5'
                                : 'text-white bg-[#132843] pl-5'
                              }`}
                          >
                            <Link href={sub.url}>{sub.title}</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}

                  {item.title === 'Withdrawal' &&
                    withdrawal.map((sub) => {
                      const active = isActive(sub.url);
                      return (
                        <SidebarMenuItem key={sub.url}>
                          <SidebarMenuButton
                            asChild
                            className={`flex items-center gap-2 ${active
                                ? 'bg-[#051b38] hover:bg-[#051b38] text-white hover:text-white border-b border-white rounded-md pl-5'
                                : 'text-white bg-[#132843] pl-5'
                              }`}
                          >
                            <Link href={sub.url}>{sub.title}</Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
