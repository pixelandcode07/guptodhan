'use client'; // ✅ এটি যুক্ত করা হয়েছে

import {
    SidebarGroup, SidebarGroupContent, SidebarMenu,
    SidebarMenuButton, SidebarMenuItem
} from '@/components/ui/sidebar';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner'; // (Optional) টোস্ট দেখানোর জন্য

export default function Logout() {
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            onClick={async () => {
                                toast.loading("Logging out...");
                                await signOut({ callbackUrl: "/" }); 
                            }} 
                            className='cursor-pointer' 
                        >
                            <LogOut /> Log Out
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}