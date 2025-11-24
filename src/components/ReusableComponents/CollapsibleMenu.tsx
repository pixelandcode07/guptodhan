"use client";

import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

type MenuItem = {
  title: string;
  url: string;
  icon?: React.ElementType;
};

type CollapsibleMenuProps = {
  title: string;
  icon?: React.ElementType;
  items: MenuItem[];
};

export function CollapsibleMenu({ title, icon: Icon, items }: CollapsibleMenuProps) {
  const pathname = usePathname() ?? "";
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveItem = items.some(
    (item) => item.url === pathname || pathname.startsWith(item.url + "/")
  );

  useEffect(() => {
    if (hasActiveItem) setIsOpen(true);
  }, [hasActiveItem, pathname]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={title}
            className="w-full justify-between data-[state=open]:bg-[#051b38] data-[state=open]:text-white hover:bg-[#051b38]/80 transition-colors"
          >
            <div className="flex items-center gap-3">
              {Icon && <Icon className="h-4 w-4 text-white/90" />}
              <span className="font-medium">{title}</span>
            </div>
            <ChevronDown className="h-4 w-4 ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <SidebarMenuSub className="pl-2">
          {items.map((item) => {
            const ItemIcon = item.icon;
            const isActive = pathname === item.url || pathname.startsWith(item.url + "/");

            return (
              <SidebarMenuSubItem key={item.url}>
                <SidebarMenuSubButton asChild isActive={isActive}>
                  <Link href={item.url} className="flex items-center gap-3 py-2">
                    {ItemIcon && <ItemIcon className="h-3.5 w-3.5 text-white/70" />}
                    <span className={isActive ? "font-medium" : ""}>{item.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            );
          })}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
}