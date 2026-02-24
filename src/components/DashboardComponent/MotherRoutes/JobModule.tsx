import { CollapsibleMenuGroup } from '@/components/ReusableComponents/CollapsibleMenuGroup'
import { Briefcase, List } from 'lucide-react';

const jobItems = [
    { title: "Manage Jobs", url: "/general/jobs" },
];

export default function JobModule() {
    return (
        <div>
            <CollapsibleMenuGroup
                label="Job Modules"
                sections={[
                    {
                        title: "Job Management",
                        icon: Briefcase,
                        items: jobItems,
                    }
                ]}
            />
        </div>
    )
}