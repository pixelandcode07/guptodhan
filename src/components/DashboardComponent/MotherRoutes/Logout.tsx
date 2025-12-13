import {
    SidebarGroup, SidebarGroupContent, SidebarMenu,
    SidebarMenuButton, SidebarMenuItem
} from '@/components/ui/sidebar';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Logout() {
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupContent>
                <SidebarMenu>
                    < SidebarMenuItem  >
                        <SidebarMenuButton onClick={() => signOut()} className='cursor-pointer' >
                            <LogOut /> Log Out
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup >
    )
}
