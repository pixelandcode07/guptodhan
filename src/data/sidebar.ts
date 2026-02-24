// src/data/sidebar.ts
import {
  IconChartBar,
  IconDashboard,
  IconFileDescription,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconFilter,
  IconCommand,
  IconLink,
  IconBox,
  IconShoppingCart,
  IconGift,
  IconBell,
  IconMessage,
  IconHeadset,
  IconPhoto,
  IconUsersGroup,
  IconTruck,
  IconPrinter,
  IconCloudDownload,
} from '@tabler/icons-react';

import { DollarSign, Store, UserCheck } from 'lucide-react';

export const sidebarData = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },

  navMain: [
    { title: 'Dashboard', url: '/home', icon: IconDashboard },
    { title: 'General Info', url: '/general/info', icon: IconListDetails },
    { title: 'Footer Settings', url: '/footer-settings', icon: IconSettings },
    // {
    //   title: 'Website Theme Color',
    //   url: '/general/website/theme/page',
    //   icon: IconChartBar,
    // },
    {
      title: 'Social Media Links',
      url: '/social-media-links',
      icon: IconUsers,
    },
    { title: 'Home Page SEO', url: '/home-page-seo', icon: IconReport },
    // {
    //   title: 'Custom CSS & JS',
    //   url: '/custom-css-js',
    //   icon: IconFileDescription,
    // },
    {
      title: 'Social & Chat Scripts',
      url: '/social-chat-scripts',
      icon: IconSearch,
    },
  ],

  documents: [
    { title: 'Vendors', url: '#', icon: UserCheck },
    { title: 'Stores', url: '#', icon: Store },
    { title: 'Withdrawal', url: '#', icon: DollarSign },
  ],

  ecommerceModules: [
    {
      title: 'Config',
      icon: IconSettings,
      items: [
        { title: 'Setup Your Config', url: '/general/config/setup' },
        { title: 'Product Sizes', url: '/general/view/all/sizes' },
        { title: 'Storage', url: '/general/view/all/storages' },
        { title: 'Product Colors', url: '/general/view/all/colors' },
        { title: 'Measurement Units', url: '/general/view/all/units' },
        { title: 'Product Brands', url: '/general/view/all/brands' },
        { title: 'Models of Brand', url: '/general/view/all/models' },
        { title: 'Product Flags', url: '/general/view/all/flags' },
        { title: 'Contact Config', url: '/general/contact/config' },
      ],
    },
    {
      title: 'Category',
      icon: IconFilter,
      items: [
        { title: 'Add New Category', url: '/general/add/new/category' },
        { title: 'View All Categories', url: '/general/view/all/category' },
      ],
    },
    {
      title: 'Subcategory',
      icon: IconCommand,
      items: [
        { title: 'Add New Subcategory', url: '/general/add/new/subcategory' },
        {
          title: 'View All Subcategories',
          url: '/general/view/all/subcategory',
        },
      ],
    },
    {
      title: 'Child Category',
      icon: IconLink,
      items: [
        { title: 'Add Child Category', url: '/general/add/new/childcategory' },
        {
          title: 'View Child Categories',
          url: '/general/view/all/childcategory',
        },
      ],
    },
    {
      title: 'Manage Products',
      icon: IconBox,
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
    {
      title: 'Manage Orders',
      icon: IconShoppingCart,
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
    {
      title: 'Promo Codes',
      icon: IconGift,
      items: [
        { title: 'Add New Promo Code', url: '/general/add/new/code' },
        { title: 'View All Promo Codes', url: '/general/view/all/promo/codes' },
      ],
    },
    {
      title: 'Push Notification',
      icon: IconBell,
      items: [
        { title: 'Send Notification', url: '/general/send/notification/page' },
        {
          title: 'Previous Notifications',
          url: '/general/view/all/notifications',
        },
      ],
    },
    {
      title: 'SMS Service',
      icon: IconMessage,
      items: [
        { title: 'SMS Templates', url: '/general/view/sms/templates' },
        { title: 'Send SMS', url: '/general/send/sms/page' },
        { title: 'SMS History', url: '/general/view/sms/history' },
      ],
    },
    {
      title: 'Gateway & API',
      icon: IconSettings,
      items: [
        { title: 'Email Credentials', url: '/general/view/email/credential' },
        { title: 'Email Templates', url: '/general/view/email/templates' },
        { title: 'SMS Gateways', url: '/general/setup/sms/gateways' },
        { title: 'Payment Gateways', url: '/general/setup/payment/gateways' },
        { title: 'Courier API Keys', url: '/general/setup/courier/api/keys' },
      ],
    },
    {
      title: 'Support Tickets',
      icon: IconHeadset,
      items: [
        {
          title: 'Pending Support Tickets',
          url: '/general/pending/support/tickets',
        },
        {
          title: 'Solved Support Tickets',
          url: '/general/solved/support/tickets',
        },
        {
          title: 'On Hold Support Tickets',
          url: '/general/on/hold/support/tickets',
        },
        {
          title: 'Rejected Support Tickets',
          url: '/general/rejected/support/tickets',
        },
      ],
    },
    {
      title: 'Marketing & Content',
      icon: IconPhoto,
      items: [
        { title: 'All Sliders', url: '/general/view/all/sliders' },
        { title: 'All Banners', url: '/general/view/all/banners' },
        {
          title: 'Promotional Banner',
          url: '/general/view/promotional/banner',
        },
        { title: 'Blog Comments', url: '/general/blog/comments' },
      ],
    },
    {
      title: 'Customer Management',
      icon: IconUsersGroup,
      items: [
        { title: 'All Customers', url: '/general/view/all/customers' },
        {
          title: "Customer's Wishlist",
          url: '/general/view/customers/wishlist',
        },
        {
          title: 'All Contact Requests',
          url: '/general/view/all/contact/requests',
        },
        {
          title: 'All Subscribed Users',
          url: '/general/view/all/subscribed/users',
        },
      ],
    },
    {
      title: 'Delivery & Payment',
      icon: IconTruck,
      items: [
        { title: 'Delivery Charges', url: '/general/view/delivery/charges' },
        { title: 'Upazila & Thana', url: '/general/view/upazila/thana' },
        { title: 'Payment History', url: '/general/view/payment/history' },
      ],
    },
    {
      title: 'Reports',
      icon: IconPrinter,
      items: [{ title: 'Sales Report', url: '/general/sales/report' }],
    },
    {
      title: 'Download Backup',
      icon: IconCloudDownload,
      items: [
        { title: 'Database Backup', url: '/general/backup/database' },
        {
          title: 'Product Images Backup',
          url: '/general/backup/product-images',
        },
        { title: 'User Images Backup', url: '/general/backup/user-images' },
        { title: 'Banner Images Backup', url: '/general/backup/banner-images' },
        {
          title: 'Category Icon Backup',
          url: '/general/backup/category-icons',
        },
        { title: 'Subcategory Backup', url: '/general/backup/subcategory' },
        { title: 'Flag Icon Backup', url: '/general/backup/flag-icons' },
        { title: 'Ticket Files Backup', url: '/general/backup/ticket-files' },
        { title: 'Blog Files Backup', url: '/general/backup/blog-files' },
        { title: 'Other Images Backup', url: '/general/backup/other-images' },
      ],
    },
  ],
};
