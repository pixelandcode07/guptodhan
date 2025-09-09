'use client';

import {
  Bell,
  Box,
  ChevronDown,
  CloudDownload,
  Command,
  Filter,
  Gift,
  Headphones,
  Heart,
  Image as ImageIcon,
  Link as LinkIcon,
  Map,
  MessageSquare,
  Printer,
  Settings,
  ShoppingCart,
  Truck,
  Users,
} from 'lucide-react';
import { ElementType } from 'react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../../ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../ui/collapsible';
import Link from 'next/link';

interface EcommerceModuleTitleOnly {
  title: string;
}

type ChildItem = {
  title: string;
  url: string;
  count?: string;
  isNew?: boolean;
};

const MENU_CONFIG: Record<
  string,
  { icon: ElementType; items: ChildItem[]; url?: string }
> = {
  items: {
    icon: Filter,
    items: [
      { title: 'Product Sizes', url: '/general/view/all/sizes' },
      { title: 'Storage', url: '/general/view/all/storages' },
      { title: 'Sim Type', url: '/general/view/all/sims' },
      { title: 'Device Condition', url: '/general/view/all/device/conditions' },
      { title: 'Product Warranty', url: '/general/view/all/warrenties' },
      { title: 'Product Colors', url: '/general/view/all/colors' },
      { title: 'Measurement Units', url: '/general/view/all/units' },
      { title: 'Product Brands', url: '/general/view/all/brands' },
      { title: 'Models of Brand', url: '/general/view/all/models' },
      { title: 'Product Flags', url: '/general/view/all/flags' },
      { title: 'Contact Config', url: '/general/contact/config' },
    ],
  },
  Category: {
    icon: Filter,
    items: [
      { title: 'Add New Category', url: '/general/add/new/category' },
      { title: 'View All Categories', url: '/general/view/all/category' },
    ],
  },
  Subcategory: {
    icon: Command,
    items: [
      { title: 'Add New Subcategory', url: '/general/add/new/subcategory' },
      { title: 'View All Subcategories', url: '/general/view/all/subcategory' },
    ],
  },
  'Child Category': {
    icon: LinkIcon,
    items: [
      { title: 'Add Child Category', url: '/general/add/new/childcategory' },
      {
        title: 'View Child Categories',
        url: '/general/view/all/childcategory',
      },
    ],
  },
  'Manage Products': {
    icon: Box,
    items: [
      { title: 'Add New Product', url: '/general/add/new/product' },
      {
        title: 'View All Products (829)',
        url: '/general/view/all/product',
        count: '829',
      },
      {
        title: 'Bulk Upload New',
        url: '/general/products/from/excel',
        isNew: true,
      },
      {
        title: "Products's Review (0)",
        url: '/general/view/product/reviews',
        count: '0',
      },
      {
        title: 'Product Ques/Ans (0)',
        url: '/general/view/product/question/answer',
        count: '0',
      },
    ],
  },
  'Manage Orders': {
    icon: ShoppingCart,
    items: [
      { title: 'All Orders (11)', url: '/general/view/orders', count: '11' },
      {
        title: 'Pending Orders (5)',
        url: '/general/view/orders?status=pending',
        count: '5',
      },
      {
        title: 'Approved Orders (0)',
        url: '/general/view/orders?status=approved',
        count: '0',
      },
      {
        title: 'Ready to Ship (0)',
        url: '/general/view/orders?status=ready-to-ship',
        count: '0',
      },
      {
        title: 'InTransit Orders (1)',
        url: '/general/view/orders?status=intransit',
        count: '1',
      },
      {
        title: 'Delivered Orders (1)',
        url: '/general/view/orders?status=delivered',
        count: '1',
      },
      {
        title: 'Cancelled Orders (2)',
        url: '/general/view/orders?status=cancelled',
        count: '2',
      },
    ],
  },
  'Promo Codes': {
    icon: Gift,
    items: [
      { title: 'Add New Promo Code', url: '/general/add/new/code' },
      { title: 'View All Promo Codes', url: '/general/view/all/promo/codes' },
    ],
  },
  'Push Notification': {
    icon: Bell,
    items: [
      { title: 'Send Notification', url: '/general/send/notification/page' },
      {
        title: 'Previous Notifications',
        url: '/general/view/all/notifications',
      },
    ],
  },
  'SMS Service': {
    icon: MessageSquare,
    items: [
      { title: 'SMS Templates', url: '/general/view/sms/templates' },
      { title: 'Send SMS', url: '/general/send/sms/page' },
      { title: 'SMS History', url: '/general/view/sms/history' },
    ],
  },
  'Gateway & API': {
    icon: Settings,
    items: [
      { title: 'Email Credentials', url: '/general/view/email/credential' },
      { title: 'Email Templates', url: '/general/view/email/templates' },
      { title: 'SMS Gateways', url: '/general/setup/sms/gateways' },
      { title: 'Payment Gateways', url: '/general/setup/payment/gateways' },
      { title: 'Courier API Keys', url: '/general/setup/courier/api/keys' },
    ],
  },
  Customers: {
    icon: Headphones,
    items: [],
    url: '/general/view/all/customers',
  },
  "Customer's Wishlist": {
    icon: Heart,
    items: [],
    url: '/general/view/customers/wishlist',
  },
  'Delivery Charges': {
    icon: Truck,
    items: [],
    url: '/general/view/delivery/charges',
  },
  'Upazila & Thana': {
    icon: Map,
    items: [],
    url: '/general/view/upazila/thana',
  },
  'Payment History': {
    icon: Printer,
    items: [],
    url: '/general/view/payment/history',
  },
  'Generate Reports': {
    icon: Printer,
    items: [{ title: 'Sales Report', url: '/general/sales/report' }],
  },
  'Download Backup': {
    icon: CloudDownload,
    items: [
      { title: 'Database Backup', url: '/general/backup/database' },
      { title: 'Product Images Backup', url: '/general/backup/product-images' },
      { title: 'User Images Backup', url: '/general/backup/user-images' },
      { title: 'Banner Images Backup', url: '/general/backup/banner-images' },
      { title: 'Category Icon Backup', url: '/general/backup/category-icons' },
      { title: 'Subcategory Backup', url: '/general/backup/subcategory' },
      { title: 'Flag Icon Backup', url: '/general/backup/flag-icons' },
      { title: 'Ticket Files Backup', url: '/general/backup/ticket-files' },
      { title: 'Blog Files Backup', url: '/general/backup/blog-files' },
      { title: 'Other Images Backup', url: '/general/backup/other-images' },
    ],
  },
};

export function EcommerceModules({
  items,
}: {
  items: EcommerceModuleTitleOnly[];
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-[#f1bf43] text-[14px]">
        E-COMMERCE MODULES
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => {
            const cfg = MENU_CONFIG[item.title];
            if (!cfg) return null;

            if (cfg.items.length === 0) {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={cfg.url || '#'}
                      className="flex items-center gap-2">
                      <cfg.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }

            return (
              <Collapsible key={item.title} className="group/collapsible">
                <CollapsibleTrigger asChild>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <cfg.icon />
                      <span>{item.title}</span>
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="pl-6">
                    {cfg.items.map(subItem => (
                      <SidebarMenuItem key={subItem.url}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={subItem.url}
                            className="flex items-center gap-2">
                            <span>{subItem.title}</span>
                            {subItem.count && (
                              <span
                                className={`ml-auto text-xs px-2 py-1 rounded ${
                                  subItem.count === '0'
                                    ? 'bg-orange-500 text-white'
                                    : subItem.count === '829'
                                    ? 'text-green-500'
                                    : 'text-blue-400'
                                }`}>
                                {subItem.count}
                              </span>
                            )}
                            {subItem.isNew && (
                              <span className="ml-auto text-xs bg-orange-500 text-white px-2 py-1 rounded">
                                New
                              </span>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
