import { SidebarGroupMenu } from "@/components/ReusableComponents/SidebarGroupMenu"
import { ShieldCheck, UserCheck, UserCog, Users } from "lucide-react"
const userRole = [
    {
        title: 'System Users',
        url: '/general/view/system/users',
        icon: Users,
    },
    {
        title: 'Permission Routes',
        url: '/general/view/permission/routes',
        icon: ShieldCheck,
    },
    {
        title: 'User Roles',
        url: '/general/view/user/roles',
        icon: UserCog,
    },
    {
        title: 'Addign Role Permission',
        url: '/general/view/user/role/permission',
        icon: UserCheck,
    },
]

export default function UserRolePermision() {
    return (
        <SidebarGroupMenu
            label="Website Config"
            items={userRole}
        />
    )
}
