'use client';

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
import UserRolePermition from './MotherRoutes/UserRolePermision';
import CRMModules from './MotherRoutes/CRMModules';
import BuySell from './MotherRoutes/BuySell';
import Donation from './MotherRoutes/Donation';
import Multivendor from './MotherRoutes/Multivendor';
import DemoProducts from './MotherRoutes/DemoProducts';
import Logout from './MotherRoutes/Logout';

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
            <SidebarMenuButton asChild>
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
        <UserRolePermition />
        <DemoProducts />
        <Logout />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
