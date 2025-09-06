'use client';

import { ChevronDown } from 'lucide-react';
import { ElementType } from 'react';
import Link from 'next/link';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';

import {
  Image,
  MessageSquare,
  FileText,
  File,
  FilePlus,
  Info,
  HelpCircle,
} from 'lucide-react';

// Sub-items
const sliders = [
  { title: 'View All Sliders', url: '/general/view/all/sliders' },
  { title: 'View All Banners', url: '/general/view/all/banners' },
  { title: 'Promotional Banners', url: '/general/view/promotional/banner' },
];

const testimonials = [
  { title: 'Add New Testimonial', url: '/general/add/testimonial' },
  { title: 'View All Testimonials', url: '/general/view/testimonials' },
];

const blog = [
  { title: 'Blog Categories', url: '/general/add/new/category' },
  { title: 'Write a Blog', url: '/general/add/new/blog' },
  { title: 'View All Blogs', url: '/general/view/all/blogs' },
];

const condition = [
  { title: 'Terms & Condition', url: '/general/terms/and/condition' },
  { title: 'Privacy Policy', url: '/general/view/privacy/policy' },
  { title: 'Shipping Policy', url: '/general/view/shipping/policy' },
  { title: 'Return Policy', url: '/general/view/return/policy' },
];

const customPage = [
  { title: 'Create New Page', url: '/general/create/new/page' },
  { title: 'View All Pages', url: '/general/view/all/pages' },
];

const aboutUs = [
  { title: 'About Content', url: '/general/about/us/page' },
  { title: 'View Facts', url: '/general/view/facts' },
  { title: 'CTA', url: '/general/create/cta' },
  { title: 'Team Config', url: '/general/team/config' },
  { title: 'View Teams', url: '/general/view/terms' },
];

const faq = [
  { title: 'FAQ Categories', url: '/general/faq/categories' },
  { title: "FAQ's", url: '/general/view/all/faqs' },
];

// Main menu items with icons and sub-items
const contentItems: {
  title: string;
  icon: ElementType;
  subItems: { title: string; url: string }[];
}[] = [
  { title: 'Slider & Banners', icon: Image, subItems: sliders },
  { title: 'Testimonials', icon: MessageSquare, subItems: testimonials },
  { title: 'Manage Blogs', icon: FileText, subItems: blog },
  { title: 'Terms & Policies', icon: File, subItems: condition },
  { title: 'Custom Pages', icon: FilePlus, subItems: customPage },
  { title: 'About Us', icon: Info, subItems: aboutUs },
  { title: "FAQ's", icon: HelpCircle, subItems: faq },
];

export function ContentManagement() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>
        <p className="text-[#f1bf43] text-[12px] uppercase">
          Content Management
        </p>
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {contentItems.map(item => (
            <Collapsible key={item.title} className="group/collapsible">
              <CollapsibleTrigger asChild>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <item.icon className="w-5 h-5 mr-2" />
                    <span>{item.title}</span>
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="pl-6">
                  {item.subItems.map(sub => (
                    <SidebarMenuItem key={sub.url}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={sub.url}
                          className="flex items-center gap-2">
                          <span>{sub.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
