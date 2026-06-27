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
  const isMatch = (keywords: string) => {
    if (!searchQuery) return true; 
    const query = searchQuery.toLowerCase().trim();
    return keywords.toLowerCase().includes(query);
  };

  // 💡 E-Commerce Mock Data (আগের মতোই রাখা হয়েছে)
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
        
        {/* Render Modules ONLY if their sub-menu names match the search query */}
        
        {/* 1. Ecommerce Modules */}
        {isMatch('ecommerce modules config product sizes storage sim type device condition product warranty product colors measurement units product brands models of brand product flags countries category add new category view all categories subcategory add new subcategory view all subcategories child category add child category view child manage products add new product view all products products review product ques ans manage orders all orders pending approved ready to ship in transit delivered cancelled return request promo codes push notification send previous registered devices customers story management customer wishlist delivery charges upazila thana payment history account deletion generate sales report') && (
          <EcommerceModules items={ecommerceData} />
        )}
        
        {/* 2. Content Management */}
        {isMatch('content management slider banners view all sliders view all banners promotional testimonials add new testimonial policies terms privacy shipping return about us facts cta team faq') && (
          <ContentManagement />
        )}
        
        {/* 3. Multivendor */}
        {isMatch('multivendor vendors business categories create new vendor vendor requests approved inactive stores all withdrawal requests completed cancelled payment history') && (
          <Multivendor />
        )}
        
        {/* 4. BuySell Modules */}
        {isMatch('buysell modules listing management approved products report listing') && (
          <BuySell />
        )}
        
        {/* 5. Service Modules */}
        {isMatch('service modules category banner acknowledgements service provider requests service bookings') && (
          <ServiceModule />
        )}
        
        {/* 6. Job Modules */}
        {isMatch('job modules job management manage jobs') && (
          <JobModule />
        )}
        
        {/* 7. Donation Modules */}
        {isMatch('donation modules dashboard user management donations claims categories setting') && (
          <Donation />
        )}
        
        {/* 8. Website Config */}
        {isMatch('website config general info social media links home page seo social chat scripts') && (
          <WebsiteConfig />
        )}
        
        {/* 9. CRM Modules */}
        {isMatch('crm modules support ticket subscribed users') && (
          <CRMModules />
        )}
        
        {/* 10. User Role Permission */}
        {isMatch('user role permission system users') && (
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