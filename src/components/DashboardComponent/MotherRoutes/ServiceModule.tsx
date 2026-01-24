import { CollapsibleMenuGroup } from '@/components/ReusableComponents/CollapsibleMenuGroup'
import { Axe, BadgePlus, BookImage, SquareChartGantt } from 'lucide-react';
const category = [
    { title: "Add Category", url: "/general/create-service-category" },
    { title: "View Categories", url: "/general/all-service-category" },
];
const banner = [
    { title: "Create Banner", url: "/general/create-service-banner" },
    { title: "All Banners", url: "/general/all-service-banner" },
];
const service_req = [
    { title: "Service Requests", url: "/general/all-service-request" },
    // { title: "All Banners", url: "/general/all-service-banner" },
];
const provider_req = [
    { title: "All Provider Requests", url: "/general/all-provider-request" },
    // { title: "All Banners", url: "/general/all-service-banner" },
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
                    {
                        title: "Banner Part",
                        icon: BookImage,
                        items: banner,
                    },
                    {
                        title: "Service Acknowledgements",
                        icon: SquareChartGantt,
                        items: service_req,
                    },
                    {
                        title: "Provider Requests",
                        icon: Axe,
                        items: provider_req,
                    },
                ]}
            />
        </div>
    )
}
