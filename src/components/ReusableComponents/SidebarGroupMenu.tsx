"use client";

import { ElementType } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = {
  title: string;
  url: string;
  icon?: ElementType;
};

type SidebarGroupMenuProps = {
  label: string;
  items: MenuItem[];
};

export function SidebarGroupMenu({ label, items }: SidebarGroupMenuProps) {
  const pathname = usePathname() ?? "";

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <p className="text-[#f1bf43] text-[14px]">{label}</p>
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.url || pathname.startsWith(item.url + "/");

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`pl-5 ${isActive ? "bg-[#051b38] text-white font-medium" : "text-white"}`}
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}