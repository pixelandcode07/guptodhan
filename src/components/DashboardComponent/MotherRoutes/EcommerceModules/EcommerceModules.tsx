'use client';

import { ChevronDown } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../../../ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../ui/collapsible';
import Link from 'next/link';
import { EcommerceModuleTitleOnly, ChildItem } from './types';
import { MENU_CONFIG } from './menuConfig';
import { useEcommerceCounts } from './useEcommerceCounts';
import { useIsActive } from './utils';
import { buildDynamicMenuConfig } from './menuConfigHelpers';

export function EcommerceModules({
  items,
}: {
  items: EcommerceModuleTitleOnly[];
}) {
  const isActive = useIsActive();
  const counts = useEcommerceCounts();
  const dynamicMenuConfig = buildDynamicMenuConfig(MENU_CONFIG, counts);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="text-[#f1bf43] text-[14px]">
        E-COMMERCE MODULES
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map(item => {
            const cfg = dynamicMenuConfig[item.title];
            if (!cfg) return null;

            if (cfg.items.length === 0) {
              const active = isActive(cfg.url || '#');
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    className={`flex items-center gap-2 pl-5 ${active
                      ? 'bg-[#051b38] hover:bg-[#051b38] text-white hover:text-white border-b border-white rounded-md font-medium'
                      : 'text-white bg-[#132843]'
                      }`}>
                    <Link href={cfg.url || '#'}>
                      <cfg.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }

            // Check if any child item is active (to auto-open the collapsible)
            const hasActiveChild = cfg.items.some((subItem: ChildItem) => isActive(subItem.url));

            return (
              <Collapsible key={item.title} className="group/collapsible" defaultOpen={hasActiveChild}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="text-white bg-[#132843] pl-5">
                      <cfg.icon />
                      <span>{item.title}</span>
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="pl-6">
                    {cfg.items.map((subItem: any) => { // 'any' ব্যবহার করছি যেহেতু types আপনার ফাইলে আছে
                    const active = isActive(subItem.url);
                    return (
                      <SidebarMenuItem key={subItem.url}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          className={`flex items-center gap-2 pl-5 ${active
                            ? 'bg-[#051b38] hover:bg-[#051b38] text-white border-b border-white rounded-md font-medium'
                            : 'text-white bg-[#132843]'
                          }`}
                        >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                            
                            {/* ✅ কাউন্ট থাকলে কাউন্ট দেখাবে */}
                            {subItem.count && (
                              <span className="ml-auto text-xs px-2 py-1 rounded bg-orange-500 text-white">
                                {subItem.count}
                              </span>
                            )}

                            {/* ✅ New Badge: এখানে subItem.isNew চেক করা হচ্ছে */}
                            {subItem.isNew && (
                              <span className="ml-auto text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold uppercase">
                                New
                              </span>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
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

