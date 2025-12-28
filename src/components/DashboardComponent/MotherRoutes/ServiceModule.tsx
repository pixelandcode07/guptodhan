import { CollapsibleMenuGroup } from '@/components/ReusableComponents/CollapsibleMenuGroup'
import { BadgePlus } from 'lucide-react';
const category = [
    { title: "Add Category", url: "/general/create-service-category" },
    // { title: "Business Categories", url: "/general/view/vendor/categories" },
    // { title: "Create New Vendor", url: "/general/create/new/vendor" },
    // { title: "Vendor Requests", url: "/general/view/vendor/requests" },
    // { title: "Approved Vendors", url: "/general/view/all/vendors" },
    // { title: "Inactive Vendors", url: "/general/view/inactive/vendors" },
];

export default function ServiceModule() {
    return (
        <div>
            <CollapsibleMenuGroup
                label="Service Modules"
                sections={[
                    {
                        title: "Category Part",
                        icon: BadgePlus,
                        items: category,
                    },
                ]}
            />
        </div>
    )
}
