"use client"

import { Bell, Box, ChevronDown, CloudDownload, Command, Filter, Gift, Headphones, Image as ImageIcon, Link as LinkIcon, MessageSquare, Printer, Settings, ShoppingCart, Truck, Users } from "lucide-react"
import { ElementType } from "react"
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../../ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible"
import Link from "next/link"

interface EcommerceModuleTitleOnly { title: string }

type ChildItem = { title: string; url: string; count?: string; isNew?: boolean }

const MENU_CONFIG: Record<string, { icon: ElementType; items: ChildItem[] }> = {
  "Config": {
    icon: Settings,
    items: [
      { title: "Setup Your Config", url: "/general/config/setup" },
      { title: "Product Sizes", url: "/general/view/all/sizes" },
      { title: "Storage", url: "/general/view/all/storages" },
      { title: "Product Colors", url: "/general/view/all/colors" },
      { title: "Measurement Units", url: "/general/view/all/units" },
      { title: "Product Brands", url: "/general/view/all/brands" },
      { title: "Models of Brand", url: "/general/view/all/models" },
      { title: "Product Flags", url: "/general/view/all/flags" },
      { title: "Contact Config", url: "/general/contact/config" },
    ],
  },
  "Category": {
    icon: Filter,
    items: [
      { title: "Add New Category", url: "/general/add/new/category" },
      { title: "View All Categories", url: "/general/view/all/category" },
    ],
  },
  "Subcategory": {
    icon: Command,
    items: [
      { title: "Add New Subcategory", url: "/general/add/new/subcategory" },
      { title: "View All Subcategories", url: "/general/view/all/subcategory" },
    ],
  },
  "Child Category": {
    icon: LinkIcon,
    items: [
      { title: "Add Child Category", url: "/general/add/new/childcategory" },
      { title: "View Child Categories", url: "/general/view/all/childcategory" },
    ],
  },
  "Manage Products": {
    icon: Box,
    items: [
      { title: "Add New Product", url: "/general/add/new/product" },
      { title: "View All Products (829)", url: "/general/view/all/product", count: "829" },
      { title: "Bulk Upload New", url: "/general/products/from/excel", isNew: true },
      { title: "Products's Review (0)", url: "/general/view/product/reviews", count: "0" },
      { title: "Product Ques/Ans (0)", url: "/general/view/product/question/answer", count: "0" },
    ],
  },
  "Manage Orders": {
    icon: ShoppingCart,
    items: [
      { title: "All Orders (11)", url: "/general/view/orders", count: "11" },
      { title: "Pending Orders (5)", url: "/general/view/orders?status=pending", count: "5" },
      { title: "Approved Orders (0)", url: "/general/view/orders?status=approved", count: "0" },
      { title: "Ready to Ship (0)", url: "/general/view/orders?status=ready-to-ship", count: "0" },
      { title: "InTransit Orders (1)", url: "/general/view/orders?status=intransit", count: "1" },
      { title: "Delivered Orders (1)", url: "/general/view/orders?status=delivered", count: "1" },
      { title: "Cancelled Orders (2)", url: "/general/view/orders?status=cancelled", count: "2" },
    ],
  },
  "Promo Codes": {
    icon: Gift,
    items: [
      { title: "Add New Promo Code", url: "/general/add/new/code" },
      { title: "View All Promo Codes", url: "/general/view/all/promo/codes" },
    ],
  },
  "Push Notification": {
    icon: Bell,
    items: [
      { title: "Send Notification", url: "/general/send/notification/page" },
      { title: "Previous Notifications", url: "/general/view/all/notifications" },
    ],
  },
  "SMS Service": {
    icon: MessageSquare,
    items: [
      { title: "SMS Templates", url: "/general/view/sms/templates" },
      { title: "Send SMS", url: "/general/send/sms/page" },
      { title: "SMS History", url: "/general/view/sms/history" },
    ],
  },
  "Gateway & API": {
    icon: Settings,
    items: [
      { title: "Email Credentials", url: "/general/view/email/credential" },
      { title: "Email Templates", url: "/general/view/email/templates" },
      { title: "SMS Gateways", url: "/general/setup/sms/gateways" },
      { title: "Payment Gateways", url: "/general/setup/payment/gateways" },
      { title: "Courier API Keys", url: "/general/setup/courier/api/keys" },
    ],
  },
  "Support Tickets": {
    icon: Headphones,
    items: [
      { title: "Pending Support Tickets", url: "/general/pending/support/tickets" },
      { title: "Solved Support Tickets", url: "/general/solved/support/tickets" },
      { title: "On Hold Support Tickets", url: "/general/on/hold/support/tickets" },
      { title: "Rejected Support Tickets", url: "/general/rejected/support/tickets" },
    ],
  },
  "Marketing & Content": {
    icon: ImageIcon,
    items: [
      { title: "All Sliders", url: "/general/view/all/sliders" },
      { title: "All Banners", url: "/general/view/all/banners" },
      { title: "Promotional Banner", url: "/general/view/promotional/banner" },
      { title: "Blog Comments", url: "/general/blog/comments" },
    ],
  },
  "Customer Management": {
    icon: Users,
    items: [
      { title: "All Customers", url: "/general/view/all/customers" },
      { title: "Customer's Wishlist", url: "/general/view/customers/wishlist" },
      { title: "All Contact Requests", url: "/general/view/all/contact/requests" },
      { title: "All Subscribed Users", url: "/general/view/all/subscribed/users" },
    ],
  },
  "Delivery & Payment": {
    icon: Truck,
    items: [
      { title: "Delivery Charges", url: "/general/view/delivery/charges" },
      { title: "Upazila & Thana", url: "/general/view/upazila/thana" },
      { title: "Payment History", url: "/general/view/payment/history" },
    ],
  },
  "Reports": {
    icon: Printer,
    items: [
      { title: "Sales Report", url: "/general/sales/report" },
    ],
  },
  "Download Backup": {
    icon: CloudDownload,
    items: [
      { title: "Database Backup", url: "/general/backup/database" },
      { title: "Product Images Backup", url: "/general/backup/product-images" },
      { title: "User Images Backup", url: "/general/backup/user-images" },
      { title: "Banner Images Backup", url: "/general/backup/banner-images" },
      { title: "Category Icon Backup", url: "/general/backup/category-icons" },
      { title: "Subcategory Backup", url: "/general/backup/subcategory" },
      { title: "Flag Icon Backup", url: "/general/backup/flag-icons" },
      { title: "Ticket Files Backup", url: "/general/backup/ticket-files" },
      { title: "Blog Files Backup", url: "/general/backup/blog-files" },
      { title: "Other Images Backup", url: "/general/backup/other-images" },
    ],
  },
}

export function EcommerceModules({ items }: { items: EcommerceModuleTitleOnly[] }) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-[#f1bf43] text-[14px]">
        E-COMMERCE MODULES
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const cfg = MENU_CONFIG[item.title]
            if (!cfg) return null
            return (
            <Collapsible key={item.title} className="group/collapsible">
              {/* Parent Button */}
              <CollapsibleTrigger asChild>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <cfg.icon />
                    <span>{item.title}</span>
                    {cfg.items && (
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </CollapsibleTrigger>
              
              {/* Child Items */}
              {cfg.items && (
                <CollapsibleContent>
                  <div className="pl-6">
                    {cfg.items.map((subItem) => (
                      <SidebarMenuItem key={subItem.url}>
                        <SidebarMenuButton asChild>
                          <Link
                            href={subItem.url}
                            className="flex items-center gap-2"
                          >
                            <span>{subItem.title}</span>
                            {subItem.count && (
                              <span className={`ml-auto text-xs px-2 py-1 rounded ${
                                subItem.count === "0" ? "bg-orange-500 text-white" : 
                                subItem.count === "829" ? "text-green-500" : "text-blue-400"
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
              )}
            </Collapsible>
          )})}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
