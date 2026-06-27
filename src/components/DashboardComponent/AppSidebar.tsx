'use client';

import { useEffect, useRef, useState } from 'react';
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
  const isDashboardActive =
    pathname === '/general/home' || pathname.startsWith('/general/home/');

  const [searchQuery, setSearchQuery] = useState('');

  // Ref to track the injected <style> tag so we can remove it later
  const forceExpandStyleRef = useRef<HTMLStyleElement | null>(null);

  // ── Scroll to active menu on route change ──
  useEffect(() => {
    const timer = setTimeout(() => {
      const sidebarContent = document.querySelector(
        '[data-sidebar="content"]'
      ) as HTMLElement;
      const activeElement = document.querySelector(
        '[data-active="true"]'
      ) as HTMLElement;

      if (activeElement && sidebarContent) {
        const elementTop = activeElement.offsetTop;
        const elementBottom = elementTop + activeElement.offsetHeight;
        const containerTop = sidebarContent.scrollTop;
        const containerBottom = containerTop + sidebarContent.clientHeight;

        if (elementTop < containerTop || elementBottom > containerBottom) {
          activeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          });
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  // ── Main Search Effect ──
  useEffect(() => {
    const sidebarContent = document.querySelector('[data-sidebar="content"]');
    if (!sidebarContent) return;

    const allListItems = sidebarContent.querySelectorAll('li');

    // ─── CASE 1: Search cleared → reset everything ───
    if (!searchQuery.trim()) {
      allListItems.forEach((li) => ((li as HTMLElement).style.display = ''));

      // Remove the force-expand style tag
      forceExpandStyleRef.current?.remove();
      forceExpandStyleRef.current = null;
      return;
    }

    // ─── CASE 2: Search is active ───

    // STEP A ── Inject CSS to force-expand ALL collapsed Radix accordions.
    //
    // ROOT CAUSE: Radix UI's Collapsible uses [data-state="closed"] with
    // `height: 0; overflow: hidden; animation: ...` to visually hide content.
    // Even though the DOM nodes exist, they are NOT visible/queryable via normal
    // layout. Setting `li.style.display = ''` on children does nothing because
    // the parent collapsible wrapper is still height:0.
    //
    // FIX: While searching, inject a <style> that overrides ALL [data-state="closed"]
    // elements inside the sidebar to be fully visible. After 100ms (giving the
    // browser time to apply the CSS), run the DOM filtering logic.
    if (!forceExpandStyleRef.current) {
      const style = document.createElement('style');
      style.textContent = `
        /* Force-expand all Radix/Shadcn collapsible sections while searching */
        [data-sidebar="content"] [data-state="closed"] {
          height: auto !important;
          max-height: none !important;
          overflow: visible !important;
          animation: none !important;
          transition: none !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        }
        /* Handle Radix hidden attribute variant */
        [data-sidebar="content"] [data-state="closed"][hidden],
        [data-sidebar="content"] [data-state="closed"] [hidden] {
          display: block !important;
        }
      `;
      document.head.appendChild(style);
      forceExpandStyleRef.current = style;
    }

    // STEP B ── Wait 100ms for CSS to visually expand everything, THEN filter ──
    const filterTimer = setTimeout(() => {
      const query = searchQuery.toLowerCase().trim();

      // 1. Hide all list items that contain interactive elements
      allListItems.forEach((li) => {
        if ((li as HTMLElement).querySelector('a, button')) {
          (li as HTMLElement).style.display = 'none';
        }
      });

      // 2. Find every a / button / span whose text matches the query
      const searchableElements = sidebarContent.querySelectorAll('a, button, span');
      searchableElements.forEach((element) => {
        const text = element.textContent?.toLowerCase() ?? '';
        if (!text.includes(query)) return;

        // Show this item's parent li AND every ancestor li up to the sidebar root
        let parentLi: HTMLElement | null = (element as HTMLElement).closest('li');
        while (parentLi && sidebarContent.contains(parentLi)) {
          parentLi.style.display = '';
          parentLi = parentLi.parentElement?.closest('li') ?? null;
        }

        // Show all descendant li elements inside the matched item
        // (e.g. searching "manage orders" → also show All Orders, Pending Orders…)
        const matchedLi = (element as HTMLElement).closest('li') as HTMLElement | null;
        if (matchedLi) {
          matchedLi
            .querySelectorAll('li')
            .forEach((childLi) => ((childLi as HTMLElement).style.display = ''));
        }
      });
    }, 100); // 100 ms: browser needs this to repaint after CSS injection

    return () => clearTimeout(filterTimer);
  }, [searchQuery]);

  // ── Cleanup injected style on component unmount ──
  useEffect(() => {
    return () => {
      forceExpandStyleRef.current?.remove();
    };
  }, []);

  // ── Module-level filter: controls which top-level module sections render ──
  const isMatch = (keywords: string) => {
    if (!searchQuery) return true;
    const queryWords = searchQuery.toLowerCase().trim().split(/\s+/);
    const targetText = keywords.toLowerCase();
    // Every word the user typed must appear somewhere in the keyword list
    return queryWords.every((word) => targetText.includes(word));
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          {/* Logo */}
          <SidebarMenuItem>
            <Link href="/general/home" className="flex justify-center items-center py-6">
              <Image src="/img/logo.png" alt="Guptodhan" width={150} height={50} priority />
            </Link>
          </SidebarMenuItem>

          {/* Search Bar */}
          <SidebarMenuItem className="px-4 pb-4">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-gray-500 z-10" />
              <Input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9 h-10 bg-white text-gray-900 placeholder:text-gray-400 border border-gray-200 rounded-md focus-visible:ring-2 focus-visible:ring-blue-500 w-full font-medium shadow-sm"
              />
              {/* Clear button — only visible when there is a query */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 z-10 flex items-center justify-center"
                  aria-label="Clear search"
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
        {/* 1. Ecommerce Modules */}
        {isMatch(
          'ecommerce modules config product sizes storage sim type device condition product warranty product colors measurement units product brands models of brand product flags countries category add new category view all categories subcategory add new subcategory view all subcategories child category add child category view child manage products add new product view all products products review product ques ans manage orders all orders pending orders approved orders ready to ship intransit orders delivered orders cancelled orders return request promo codes add new promo code view all promo codes push notification send notification previous notifications registered devices customers story management customer wishlist delivery charges upazila thana payment history account deletion generate reports sales report download backup'
        ) && <EcommerceModules items={data.ecommerceModules} />}

        {/* 2. Content Management */}
        {isMatch(
          'content management slider banners view all sliders view all banners promotional banners testimonials add new testimonial view all testimonials policies terms condition privacy shipping return about us facts cta team config view teams faq categories faqs'
        ) && <ContentManagement />}

        {/* 3. Multivendor */}
        {isMatch(
          'multivendor modules vendors add category business categories create new vendor vendor requests approved vendors inactive vendors stores create new store view all stores withdrawal all withdrawal withdrawal requests completed withdraws cancelled withdraws payment history'
        ) && <Multivendor />}

        {/* 4. BuySell Modules */}
        {isMatch('buysell modules listing management approved products report listing') && (
          <BuySell />
        )}

        {/* 5. Service Modules */}
        {isMatch(
          'service modules category part add category view categories banner part create banner all banners service acknowledgements service requests provider requests all provider requests service bookings all service bookings'
        ) && <ServiceModule />}

        {/* 6. Job Modules */}
        {isMatch('job modules job management manage jobs') && <JobModule />}

        {/* 7. Donation Modules */}
        {isMatch(
          'donation modules dashboard user management donations claims categories setting'
        ) && <Donation />}

        {/* 8. Website Config */}
        {isMatch(
          'website config general info social media links home page seo social chat scripts'
        ) && <WebsiteConfig />}

        {/* 9. CRM Modules */}
        {isMatch(
          'crm modules support ticket subscribed users blog comments contact request'
        ) && <CRMModules />}

        {/* 10. User Role Permission */}
        {isMatch('user role permission system users admin staff') && <UserRolePermision />}

        {/* Logout – always visible */}
        <div className="mt-4 pt-4 border-t border-gray-700/30">
          <Logout />
        </div>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}