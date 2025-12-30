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
    ChevronRight,
    Wallet,
    History,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
            { title: "All Products", url: "/products/all", icon: List },
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
    // {
    //     title: "Withdrawal",
    //     icon: DollarSign,
    //     subItems: [
    //         { title: "Withdraw Amount", url: "/withdrawal/request", icon: Wallet },
    //         { title: "Withdrawal History", url: "/withdrawal/history", icon: History },
    //     ],
    // },
    {
        title: "Store",
        url: "/store",
        icon: Store,
    },
];

export function AppSidebar() {
    const pathname = usePathname();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Track which collapsible is open
    const [openCollapsibles, setOpenCollapsibles] = useState<string[]>([]);

    const toggleCollapsible = (title: string) => {
        // Check if any subitem is active → auto open
        const item = menuItems.find((i) => i.title === title);
        const hasActiveSubItem = item?.subItems?.some((sub) => sub.url === pathname);

        if (hasActiveSubItem) {
            setOpenCollapsibles((prev) => [...new Set([...prev, title])]);
        } else {
            setOpenCollapsibles((prev) =>
                prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
            );
        }
    };

    // Auto-open if any subitem is active
    //   React.useEffect(() => {
    useEffect(() => {
        menuItems.forEach((item) => {
            if (item.subItems?.some((sub) => sub.url === pathname)) {
                setOpenCollapsibles((prev) => [...new Set([...prev, item.title])]);
            }
        });
    }, [pathname]);

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="flex items-center gap-2 text-lg font-bold mt-5 mb-10">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <Image
                                src="/img/vendor/smile.png"
                                alt="logo"
                                width={40}
                                height={40}
                            />
                            <span className="text-lg font-bold text-white">Guptodhan</span>
                        </Link>
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => {
                                const isActive = item.url === pathname;
                                const hasSubItems = !!item.subItems;
                                const isOpen = openCollapsibles.includes(item.title);

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        {hasSubItems ? (
                                            <Collapsible open={isOpen} onOpenChange={() => toggleCollapsible(item.title)}>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton
                                                        className={`w-full justify-between ${isActive || item.subItems?.some((sub) => sub.url === pathname)
                                                            ? "bg-accent text-accent-foreground"
                                                            : ""
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <item.icon className="w-5 h-5" />
                                                            <span>{item.title}</span>
                                                        </div>
                                                        {isOpen ? (
                                                            <ChevronDown className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronRight className="w-4 h-4" />
                                                        )}
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>

                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {item.subItems!.map((sub) => {
                                                            const subActive = sub.url === pathname;
                                                            return (
                                                                <SidebarMenuSubItem key={sub.title}>
                                                                    <SidebarMenuSubButton asChild isActive={subActive}>
                                                                        <Link href={sub.url} className="flex items-center gap-3">
                                                                            <sub.icon className="w-4 h-4" />
                                                                            <span>{sub.title}</span>
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            );
                                                        })}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        ) : (
                                            <SidebarMenuButton asChild isActive={isActive}>
                                                <Link href={item.url!}>
                                                    <item.icon className="w-5 h-5" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        )}
                                    </SidebarMenuItem>
                                );
                            })}

                            {/* Logout */}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    disabled={isLoggingOut}
                                    className="text-red-500 hover:bg-red-500/10 w-full"
                                    onClick={async () => {
                                        setIsLoggingOut(true);
                                        toast.loading("Logging out...");
                                        await signOut({ callbackUrl: "/" });
                                    }}
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}