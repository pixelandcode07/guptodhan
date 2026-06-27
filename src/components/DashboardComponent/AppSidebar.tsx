'use client';

import { useEffect, useState } from 'react';
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
import { House, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '../ui/input';

// Import All Sub-Modules
import WebsiteConfig from './MotherRoutes/WebsiteConfig';
import { EcommerceModules } from './MotherRoutes/EcommerceModules';
import { ContentManagement } from './MotherRoutes/ContentManagement';
import CRMModules from './MotherRoutes/CRMModules';
import BuySell from './MotherRoutes/BuySell';
import Donation from './MotherRoutes/Donation';
import Multivendor from './MotherRoutes/Multivendor';
import Logout from './MotherRoutes/Logout';
import UserRolePermision from './MotherRoutes/UserRolePermision';
import ServiceModule from './MotherRoutes/ServiceModule';
import JobModule from './MotherRoutes/JobModule';

// Module list mapping for search filtering
// This array defines the module names so we can hide/show them based on the search query.
const MODULE_NAMES = [
  { id: 'ecommerce', name: 'Ecommerce Modules' },
  { id: 'content', name: 'Content Management' },
  { id: 'multivendor', name: 'Multivendor' },
  { id: 'buysell', name: 'BuySell Modules' },
  { id: 'service', name: 'Service Modules' },
  { id: 'job', name: 'Job Modules' },
  { id: 'donation', name: 'Donation Modules' },
  { id: 'config', name: 'Website Config' },
  { id: 'crm', name: 'CRM Modules' },
  { id: 'userRole', name: 'User Role & Permission' }
];

export default function AppSidebar() {
  const pathname = usePathname() ?? '';
  const isDashboardActive = pathname === '/general/home' || pathname.startsWith('/general/home/');

  // State for Search functionality
  const [searchQuery, setSearchQuery] = useState('');

  // Scroll to active menu on load
  useEffect(() => {
    const timer = setTimeout(() => {
      const sidebarContent = document.querySelector('[data-sidebar="content"]') as HTMLElement;
      const activeElement = document.querySelector('[data-active="true"]') as HTMLElement;

      if (activeElement && sidebarContent) {
        const container = sidebarContent;
        const elementTop = activeElement.offsetTop;
        const elementBottom = elementTop + activeElement.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;

        if (elementTop < containerTop || elementBottom > containerBottom) {
          activeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Handle Search Filtering
  const isMatch = (moduleName: string) => {
    if (!searchQuery) return true; // Show all if search is empty
    return moduleName.toLowerCase().includes(searchQuery.toLowerCase());
  };

  // Ecommerce Mock Data
  const ecommerceData = [
    { title: 'Config' },
    { title: 'Category' },
    { title: 'Subcategory' },
    { title: 'Child Category' },
    { title: 'Manage Products' },
    { title: 'Manage Orders' },
    { title: 'Promo Codes' },
    { title: 'Push Notification' },
    { title: 'Customers' },
    { title: 'Story Management' },
    { title: "Customer's Wishlist" },
    { title: 'Delivery Charges' },
    { title: 'Upazila & Thana' },
    { title: 'Payment History' },
    { title: 'Account Deletion' },
    { title: 'Generate Reports' },
    { title: 'Download Backup' },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          
          {/* Logo Section */}
          <SidebarMenuItem>
            <Link
              href="/general/home"
              className="flex justify-center items-center py-6"
            >
              <Image
                src="/img/logo.png" 
                alt="Guptodhan"
                width={150}
                height={50}
                priority
              />
            </Link>
          </SidebarMenuItem>

          {/* 🔍 Search Bar Section */}
          <SidebarMenuItem className="px-3 pb-4">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-gray-100 border-none text-sm rounded-md focus-visible:ring-1 focus-visible:ring-blue-500 w-full"
              />
            </div>
          </SidebarMenuItem>

          {/* Dashboard Main Link */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isDashboardActive}>
              <Link href="/general/home">
                <House /> Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        
        {/* Render Modules only if they match the search query */}
        
        {isMatch('ecommerce product order promo category') && (
          <EcommerceModules items={ecommerceData} />
        )}
        
        {isMatch('content management slider testimonial faq') && (
          <ContentManagement />
        )}
        
        {isMatch('multivendor store request') && (
          <Multivendor />
        )}
        
        {isMatch('buy sell ads listing') && (
          <BuySell />
        )}
        
        {isMatch('service provide provider request') && (
          <ServiceModule />
        )}
        
        {isMatch('job management apply resume') && (
          <JobModule />
        )}
        
        {isMatch('donation claim report') && (
          <Donation />
        )}
        
        {isMatch('config website general setting') && (
          <WebsiteConfig />
        )}
        
        {isMatch('crm support ticket contact subscribe') && (
          <CRMModules />
        )}
        
        {isMatch('user role permission admin staff') && (
          <UserRolePermision />
        )}

        {/* Logout is always visible */}
        <div className="mt-4 pt-4 border-t border-gray-100">
           <Logout />
        </div>

      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}