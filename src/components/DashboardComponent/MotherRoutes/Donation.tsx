import {
  ChartNoAxesCombined,
  UserCog,
  HeartHandshake,
  ClipboardList,
  Logs,
  Settings,
} from "lucide-react";
import { SidebarGroupMenu } from '@/components/ReusableComponents/SidebarGroupMenu';

const donationItems = [
  { title: "Dashboard", url: "/general/donation/dashboard", icon: ChartNoAxesCombined },
  { title: "User Management", url: "/general/donation/user-management", icon: UserCog },
  { title: "Donations", url: "/general/donation/donate-list", icon: HeartHandshake },
  { title: "Claims", url: "/general/donation/donate-item-claim-list", icon: ClipboardList },
  { title: "Categories", url: "/general/donation/categories", icon: Logs },
  { title: "Setting", url: "/general/donation/config", icon: Settings },
];



export default function Donation() {
  return (
    <SidebarGroupMenu
      label="Donation Modules"
      items={donationItems}
    />
  )
}
