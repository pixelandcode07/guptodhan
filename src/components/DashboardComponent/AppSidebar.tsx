'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';
import {
  House,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import WebsiteConfig from './MotherRoutes/WebsiteConfig';
import { EcommerceModules } from './MotherRoutes/EcommerceModules';
import { ContentManagement } from './MotherRoutes/ContentManagement';
import CRMModules from './MotherRoutes/CRMModules';
import BuySell from './MotherRoutes/BuySell';
import Donation from './MotherRoutes/Donation';
import Multivendor from './MotherRoutes/Multivendor';
import DemoProducts from './MotherRoutes/DemoProducts';
import Logout from './MotherRoutes/Logout';
import UserRolePermision from './MotherRoutes/UserRolePermision';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  ecommerceModules: [
    { title: 'Config' },
    { title: 'Category' },
    { title: 'Subcategory' },
    { title: 'Child Category' },
    { title: 'Manage Products' },
    { title: 'Manage Orders' },
    { title: 'Promo Codes' },
    { title: 'Push Notification' },
    { title: 'SMS Service' },
    { title: 'Gateway & API' },
    { title: 'Customers' },
    { title: "Customer's Wishlist" },
    { title: 'Delivery Charges' },
    { title: 'Upazila & Thana' },
    { title: 'Payment History' },
    { title: 'Generate Reports' },
    { title: 'Download Backup' },
  ],
  crmModules: [
    { title: 'Support Ticket' },
    { title: 'Contact Request' },
    { title: 'Subscribed Users' },
    { title: 'Blog Comments' },
  ],
};

export default function AppSidebar() {
  const pathname = usePathname() ?? '';
  const isDashboardActive = pathname === '/general/home' || pathname.startsWith('/general/home/');

  // Scroll active item into view after scroll position is restored (only if not visible)
  useEffect(() => {
    // Wait for scroll position to restore from sessionStorage first
    const timer = setTimeout(() => {
      const sidebarContent = document.querySelector('[data-sidebar="content"]') as HTMLElement;
      const activeElement = document.querySelector('[data-active="true"]') as HTMLElement;
      
      if (activeElement && sidebarContent) {
        const container = sidebarContent;
        const elementTop = activeElement.offsetTop;
        const elementBottom = elementTop + activeElement.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;

        // Only scroll if the active element is not already visible
        if (elementTop < containerTop || elementBottom > containerBottom) {
          activeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }
      }
    }, 300); // Wait for scroll restoration

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link
              href="/general/home"
              className="flex justify-center items-center py-6">
              <Image
                src="/img/logo.png"
                alt="Guptodhan"
                width={150}
                height={50}
              />
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isDashboardActive}>
              <Link href="/general/home">
                <House /> Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <WebsiteConfig />
        <BuySell />
        <Donation />
        <Multivendor />
        <EcommerceModules items={data.ecommerceModules} />
        <CRMModules />
        <ContentManagement />
        <UserRolePermision />
        <DemoProducts />
        <Logout />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
