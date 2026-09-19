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
import { House, Search, X } from 'lucide-react';
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

// ✅ Added 'Download Backup' at the end of ecommerceModules
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

  const [searchQuery, setSearchQuery] = useState('');

  // Scroll to active menu on load
  useEffect(() => {
    const timer = setTimeout(() => {
      const sidebarContent = document.querySelector('[data-sidebar="content"]') as HTMLElement;
      const activeElement = document.querySelector('[data-active="true"]') as HTMLElement;

      if (activeElement && sidebarContent) {
        const elementTop = activeElement.offsetTop;
        const elementBottom = elementTop + activeElement.offsetHeight;
        const containerTop = sidebarContent.scrollTop;
        const containerBottom = containerTop + sidebarContent.clientHeight;

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

  // 💡 BULLETPROOF FIX: Deep DOM Filtering and Auto-Expand
  useEffect(() => {
    const sidebarContent = document.querySelector('[data-sidebar="content"]');
    if (!sidebarContent) return;

    const query = searchQuery.toLowerCase().trim();
    const allGroups = sidebarContent.querySelectorAll('[data-sidebar="group"]');

    // ── ১. যদি সার্চ বক্স ফাঁকা থাকে, তবে সব মেনু শো করো ──
    if (!query) {
      const allListItems = sidebarContent.querySelectorAll('li');
      allListItems.forEach(li => ((li as HTMLElement).style.display = ''));
      allGroups.forEach(g => ((g as HTMLElement).style.display = ''));
      return;
    }

    // ── ২. FORCE EXPAND HIDDEN SECTIONS ──
    const closedTriggers = sidebarContent.querySelectorAll('[data-state="closed"]');
    closedTriggers.forEach(trigger => {
      if (typeof (trigger as HTMLElement).click === 'function') {
        (trigger as HTMLElement).click();
      }
    });

    // ── ৩. ফিল্টারিং লজিক ──
    const filterTimer = setTimeout(() => {
      const currentListItems = sidebarContent.querySelectorAll('li');

      currentListItems.forEach(li => {
        if (li.querySelector('a, button')) {
           (li as HTMLElement).style.display = 'none';
        }
      });

      const allElements = sidebarContent.querySelectorAll('*');
      allElements.forEach(element => {
        let directText = '';
        element.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) {
            directText += node.nodeValue;
          }
        });
        directText = directText.toLowerCase().trim();

        if (directText && directText.includes(query)) {
          let currentLi = element.closest('li');
          
          if (currentLi) {
            currentLi.style.display = '';

            let parent = currentLi.parentElement;
            while (parent && sidebarContent.contains(parent)) {
              if (parent.tagName === 'LI') {
                (parent as HTMLElement).style.display = '';
              }
              parent = parent.parentElement;
            }

            if (currentLi.querySelector('[data-state]')) {
              const childLis = currentLi.querySelectorAll('li');
              childLis.forEach(child => ((child as HTMLElement).style.display = ''));
            }
          }
        }
      });

      // ৪. যেই মেইন গ্রুপগুলোর ভেতরে কোনো আইটেম নেই, সেগুলো হাইড করো
      allGroups.forEach(group => {
        const hasVisibleLi = Array.from(group.querySelectorAll('li')).some(
          li => li.style.display !== 'none'
        );
        (group as HTMLElement).style.display = hasVisibleLi ? '' : 'none';
      });

    }, 150);

    return () => clearTimeout(filterTimer);
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

          {/* 🔍 Search Bar Section */}
          <SidebarMenuItem className="px-4 pb-4">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-gray-500 z-10" />
              <Input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ color: '#0f172a', backgroundColor: '#ffffff' }}
                className="pl-9 pr-9 h-10 border border-gray-300 rounded-md focus-visible:ring-2 focus-visible:ring-blue-500 w-full font-medium shadow-sm !text-black placeholder:!text-gray-400"
              />
              {/* Clear Search Button */}
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="absolute right-3 text-gray-400 hover:text-gray-700 z-10"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
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
        
        {/* Render ALL Modules normally */}
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