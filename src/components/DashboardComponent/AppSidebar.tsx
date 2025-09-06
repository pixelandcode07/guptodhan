"use client"

import React from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { DollarSign, LayoutDashboard, Store, UserCheck } from 'lucide-react'
import { Multivendor } from './MotherRoutes/Multivendor'
import Link from 'next/link'
import Image from 'next/image'
import WebsiteConfig from './MotherRoutes/WebsiteConfig'
import { EcommerceModules } from './MotherRoutes/EcommerceModules'

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/home",
              icon: LayoutDashboard,
        },
        {
            title: "General Info",
            url: "/general-info",
              icon: LayoutDashboard,
        },
        {
            title: "Footer Settings",
            url: "/footer-settings",
              icon: LayoutDashboard,
        },
        {
            title: "Website Theme Color",
            url: "/website-theme-color",
              icon: LayoutDashboard,
        },
        {
            title: "Social Media Links",
            url: "/social-media-links",
              icon: LayoutDashboard,
        },
        {
            title: "Home Page SEO",
            url: "/home-page-seo",
              icon: LayoutDashboard,
        },
        {
            title: "Custom CSS & JS",
            url: "/custom-css-js",
              icon: LayoutDashboard,
        },
        {
            title: "Social & Chat Scripts",
            url: "/social-chat-scripts",
              icon: LayoutDashboard,
        },
    ],


    documents: [
        {
            title: "Vendors",
            url: "#",
            icon: UserCheck,
        },
        {
            title: "Stores",
            url: "#",
            icon: Store,
        },
        {
            title: "Withdrawal",
            url: "#",
            icon: DollarSign,
        },
    ],
      ecommerceModules: [
        { title: "Config" },
        { title: "Category" },
        { title: "Subcategory" },
        { title: "Child Category" },
        { title: "Manage Products" },
        { title: "Manage Orders" },
        { title: "Promo Codes" },
        { title: "Push Notification" },
        { title: "SMS Service" },
        { title: "Gateway & API" },
        { title: "Customers" },
        { title: "Marketing & Content" },
        { title: "Customer Management" },
        { title: "Delivery & Payment" },
        { title: "Reports" },
        { title: "Download Backup" },
      ],
}


export default function AppSidebar() {
    return (
        <Sidebar >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-3"
                        >
                            <Link href="/general/home">
                                <Image src="/img/logo.jpg" alt="Guptodhan" width={120} height={24} />
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild>
                            <Link href="/general/home">Dashboard</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <WebsiteConfig items={data.navMain} />
                <Multivendor items={data.documents} />
                <EcommerceModules items={data.ecommerceModules} />
            </SidebarContent>
            <SidebarFooter>

            </SidebarFooter>
        </Sidebar>
    )
}
