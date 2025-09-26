'use client';

import React from 'react';
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
  Box,
  Code,
  DollarSign,
  House,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Palette,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Store,
  UserCheck,
  UserCog,
  Users,
} from 'lucide-react';
import { Multivendor } from './MotherRoutes/Multivendor';
import Link from 'next/link';
import Image from 'next/image';
import WebsiteConfig from './MotherRoutes/WebsiteConfig';
import { EcommerceModules } from './MotherRoutes/EcommerceModules';
import { ContentManagement } from './MotherRoutes/ContentManagement';
import UserRolePermition from './MotherRoutes/UserRolePermition';
import { CRMModules } from './MotherRoutes/CRMModules';
import { BuySell } from './MotherRoutes/BuySell';
import { Donation } from './MotherRoutes/Donation';
import { DemoProducts } from './MotherRoutes/DemoProducts';
import Logout from './MotherRoutes/Logout';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'General Info',
      url: '/general/info',
      icon: LayoutDashboard,
    },
    {
      title: 'Footer Settings',
      url: '/general/view/footer/widget/1',
      icon: Settings,
    },
    {
      title: 'Website Theme Color',
      url: '/general/website/theme/page',
      icon: Palette,
    },
    {
      title: 'Social Media Links',
      url: '/general/social/media/page',
      icon: Share2,
    },
    {
      title: 'Home Page SEO',
      url: '/general/seo/homepage',
      icon: Search,
    },
    {
      title: 'Custom CSS & JS',
      url: ' /general/custom/css/js',
      icon: Code,
    },
    {
      title: 'Social & Chat Scripts',
      url: '/general/social/chat/script/page',
      icon: MessageCircle,
    },
  ],
  buysell: [
    {
      title: 'Buy Sell Config',
      url: '/general/buy/sell/config',
      icon: LayoutDashboard,
    },
    {
      title: 'Buy Sell Categories',
      url: '*',
      icon: LayoutDashboard,
    },
    {
      title: 'Buy Sell Listing',
      url: '/general/buy/sell/listing',
      icon: LayoutDashboard,
    },
  ],
  donations: [
    {
      title: 'Donation Config',
      url: '/general/donation/config',
      icon: LayoutDashboard,
    },
    {
      title: 'Donation Categories',
      url: '*',
      icon: LayoutDashboard,
    },
    {
      title: 'Donation Listing',
      url: '/general/donation/listing',
      icon: LayoutDashboard,
    },
    {
      title: 'Donation Request',
      url: '/general/donation/requests',
      icon: LayoutDashboard,
    },
  ],

  documents: [
    {
      title: 'Vendors',
      url: '#',
      icon: UserCheck,
    },
    {
      title: 'Stores',
      url: '#',
      icon: Store,
    },
    {
      title: 'Withdrawal',
      url: '#',
      icon: DollarSign,
    },
  ],
  demoProducts: [
    {
      title: 'Demo Products',
      url: '#',
      icon: Box,
    },
  ],
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
  userRole: [
    {
      title: 'System Users',
      url: '/general/view/system/users',
      icon: Users,
    },
    {
      title: 'Permission Routes',
      url: '/general/view/permission/routes',
      icon: ShieldCheck,
    },
    {
      title: 'User Roles',
      url: '/general/view/user/roles',
      icon: UserCog,
    },
    {
      title: 'Addign Role Permission',
      url: '/general/view/user/role/permission',
      icon: UserCheck,
    },
  ],
  crmModules: [
    { title: 'Support Ticket' },
    { title: 'Contact Request' },
    { title: 'Subscribed Users' },
    { title: 'Blog Comments' },
  ],
  logoutAction: [
    {
      title: 'Logout',
      url: '/general/logout',
      icon: LogOut,
    },
  ],
};

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <SidebarMenuButton asChild className="">
              <Link
                href="/general/home"
                className="flex justify-center items-center py-2 hover:bg-transparent">
                <Image
                  src="/logo.png"
                  alt="Guptodhan"
                  width={140}
                  height={50}
                />
              </Link>
            </SidebarMenuButton> */}
            {/* <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-3"> */}
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
            {/* </SidebarMenuButton> */}
            {/* <SidebarMenuButton asChild>
              <Link href="/general/home">
                <House /> Dashboard
              </Link>
            </SidebarMenuButton> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <WebsiteConfig items={data.navMain} />
        <BuySell items={data.buysell} />
        <Donation items={data.donations} />
        <Multivendor items={data.documents} />
        <EcommerceModules items={data.ecommerceModules} />
        <CRMModules items={data.crmModules} />
        <ContentManagement />
        <UserRolePermition items={data.userRole} />
        <DemoProducts items={data.demoProducts} />
        <Logout items={data.logoutAction} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
