"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
    Package,
    ShoppingCart,
    Star,
    DollarSign,
    Store,
    LogOut,
    Home,
    Plus,
    List,
    ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Products",
        icon: Package,
        subItems: [
            { title: "Add New Product", url: "/products/add", icon: Plus },
            { title: "Products", url: "/products", icon: List },
        ],
    },
    {
        title: "Manage Orders",
        url: "/orders",
        icon: ShoppingCart,
    },
    {
        title: "Rating & Reviews",
        url: "/reviews",
        icon: Star,
    },
    {
        title: "Withdrawal",
        url: "/withdrawal",
        icon: DollarSign,
    },
    {
        title: "Store",
        url: "/store",
        icon: Store,
    },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="flex items-center gap-2 text-lg font-bold mt-5 mb-10">
                        <Link href="/dashboard" className="flex justify-center items-center gap-2">
                            <Image src={'/img/vendor/smile.png'}
                                alt="logo"
                                width={40}
                                height={40}
                                className="text-white" />
                            <span className="text-lg font-bold text-white">GetCommerce</span>
                        </Link>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    {item.subItems ? (
                                        <>
                                            <SidebarMenuButton asChild>
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex items-center gap-2">
                                                        <item.icon className="w-5 h-5" />
                                                        <span>{item.title}</span>
                                                    </div>
                                                    <ChevronDown className="w-4 h-4" />
                                                </div>
                                            </SidebarMenuButton>
                                            <SidebarMenuSub>
                                                {item.subItems.map((sub) => (
                                                    <SidebarMenuSubItem key={sub.title}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={pathname === sub.url}
                                                        >
                                                            <Link href={sub.url}>
                                                                <sub.icon className="w-4 h-4" />
                                                                <span>{sub.title}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        </>
                                    ) : (
                                        <SidebarMenuButton
                                            asChild
                                            isActive={pathname === item.url}
                                        >
                                            <Link href={item.url}>
                                                <item.icon className="w-5 h-5" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            ))}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild className="text-red-600">
                                    <Link href="/api/auth/signout">
                                        <LogOut className="w-5 h-5" />
                                        <span>Logout</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}