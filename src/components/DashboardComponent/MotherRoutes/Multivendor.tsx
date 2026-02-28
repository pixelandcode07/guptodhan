import { CollapsibleMenuGroup } from "@/components/ReusableComponents/CollapsibleMenuGroup";
import { UserCheck, Store, DollarSign } from "lucide-react";

const vendor = [
  { title: "Add Category", url: "/general/create/vendor/category" },
  { title: "Business Categories", url: "/general/view/vendor/categories" },
  { title: "Create New Vendor", url: "/general/create/new/vendor" },
  { title: "Vendor Requests", url: "/general/view/vendor/requests" },
  { title: "Approved Vendors", url: "/general/view/all/vendors" },
  { title: "Inactive Vendors", url: "/general/view/inactive/vendors" },
];

const stores = [
  { title: "Create New Store", url: "/general/create/new/store" },
  { title: "View All Stores", url: "/general/view/all/stores" },
];

const withdrawal = [
  { title: "All Withdrawal", url: "/general/view/all/withdraws" },
  // { title: "Create Withdrawal", url: "/general/create/new/withdraw" },
  { title: "Withdrawal Requests", url: "/general/view/withdraw/requests" },
  { title: "Completed Withdraws", url: "/general/view/completed/withdraws" },
  { title: "Cancelled Withdraws", url: "/general/view/cancelled/withdraws" },
  { title: "Payment History", url: "/general/view/payment/history" },
];

export default function Multivendor() {
  return (
    <CollapsibleMenuGroup
      label="Multivendor Modules"
      sections={[
        {
          title: "Vendors",
          icon: UserCheck,
          items: vendor,
        },
        {
          title: "Stores",
          icon: Store,
          items: stores,
        },
        {
          title: "Withdrawal",
          icon: DollarSign,
          items: withdrawal,
        },
      ]}
    />
  );
}