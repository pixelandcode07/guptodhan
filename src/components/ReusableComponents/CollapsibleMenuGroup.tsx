
"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { CollapsibleMenu } from "./CollapsibleMenu";

type MenuSection = {
  title: string;
  items: { title: string; url: string; icon?: React.ElementType }[];
  icon?: React.ElementType;
};

type CollapsibleMenuGroupProps = {
  label: string;
  sections: MenuSection[];
};

export function CollapsibleMenuGroup({ label, sections }: CollapsibleMenuGroupProps) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {/* Group Label */}
      <SidebarGroupLabel>
        <p className="text-[#f1bf43] text-[14px] font-medium">{label}</p>
      </SidebarGroupLabel>

      {/* All Collapsible Sections */}
      <SidebarGroupContent className="space-y-1">
        {sections.map((section) => (
          <CollapsibleMenu
            key={section.title}
            title={section.title}
            icon={section.icon}
            items={section.items.map((item) => ({
              ...item,
              icon: item.icon ?? undefined,
            }))}
          />
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}