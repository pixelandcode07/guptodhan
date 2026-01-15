import { SidebarGroupMenu } from "@/components/ReusableComponents/SidebarGroupMenu";
import { ChartNoAxesCombined, LayoutDashboard, Shield, Bug, Logs, Settings } from "lucide-react";

const buySellItems = [
    { title: "Listing Management", url: "/general/buy/sell/listing", icon: LayoutDashboard },
    { title: "Approved Products", url: "/general/buy/sell/approved/products", icon: Shield },
    { title: "Report Listing", url: "/general/buy/sell/report", icon: Bug },
    { title: "Categories", url: "/general/categories", icon: Logs },
    { title: "Setting", url: "/general/buy/sell/config", icon: Settings },
];

export default function BuySell() {
    return (
        <SidebarGroupMenu
            label="BuySell Modules"
            items={buySellItems}
        />
    )
}
