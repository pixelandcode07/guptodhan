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

const data = {
  ecommerceModules: [
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
  ],
};

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

  // 💡 MAGIC FIX: Deep Search DOM Filtering (কোনো চাইল্ড ফাইল এডিট করা ছাড়াই সব মেনু ফিল্টার হবে)
  useEffect(() => {
    const sidebarContent = document.querySelector('[data-sidebar="content"]');
    if (!sidebarContent) return;

    const allListItems = sidebarContent.querySelectorAll('li');
    
    // যদি সার্চ বক্স ফাঁকা থাকে, তবে সব মেনু আবার শো করবে
    if (!searchQuery.trim()) {
      allListItems.forEach(li => (li.style.display = ''));
      return;
    }

    const query = searchQuery.toLowerCase().trim();

    // প্রথমে সব মেনু হাইড করে দিচ্ছি
    allListItems.forEach(li => (li.style.display = 'none'));

    // এবার যেসব লিংকের টেক্সট সার্চের সাথে ম্যাচ করবে, শুধু সেগুলো শো করাবো
    const allLinksAndButtons = sidebarContent.querySelectorAll('a, button, span');
    allLinksAndButtons.forEach(element => {
      // শুধু মাত্র টেক্সট নোডগুলো নিচ্ছি
      const text = Array.from(element.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent)
        .join('')
        .toLowerCase() || element.textContent?.toLowerCase() || '';

      if (text.includes(query)) {
        let current = element.closest('li');
        
        // ১. ম্যাচ হওয়া আইটেমের ওপরের সব প্যারেন্ট (Parent) মেনু ওপেন/শো করবে
        let parent = current;
        while (parent && sidebarContent.contains(parent)) {
          parent.style.display = '';
          parent = parent.parentElement?.closest('li') || null;
        }

        // ২. যদি কোনো মেইন ক্যাটাগরিতে (যেমন E-commerce) সার্চ ম্যাচ করে, তবে তার ভেতরের সব চাইল্ড শো করবে
        if (current) {
          const descendants = current.querySelectorAll('li');
          descendants.forEach(childLi => childLi.style.display = '');
        }
      }
    });
  }, [searchQuery]);

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

          {/* 🔍 Search Bar Section (Fixed Text Visibility) */}
          <SidebarMenuItem className="px-4 pb-4">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-gray-500 z-10" />
              <Input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                // ✅ FIX: Added bg-white and text-gray-900 so text is always clear and visible
                className="pl-9 h-10 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-md focus-visible:ring-2 focus-visible:ring-blue-500 w-full font-medium shadow-sm"
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

      <SidebarContent className="px-2 pb-20">
        
        {/* Render ALL Modules normally. The useEffect hook will automatically filter them! */}
        <EcommerceModules items={data.ecommerceModules} />
        <ContentManagement />
        <Multivendor />
        <BuySell />
        <ServiceModule />
        <JobModule />
        <Donation />
        <WebsiteConfig />
        <CRMModules />
        <UserRolePermision />

        {/* Logout is always visible */}
        <div className="mt-4 pt-4 border-t border-gray-700/30">
           <Logout />
        </div>

      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}