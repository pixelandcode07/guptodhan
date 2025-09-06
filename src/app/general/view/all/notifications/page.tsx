import { DataTable } from "@/components/TableHelper/data-table";
import { Notification, notification_columns } from "@/components/TableHelper/notification_columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

function getData(): Notification[] {
  return [
    {
      id: 1,
      notification_channel: "/topics/example",
      notification_title: "Test Notify",
      notification_description: "Hello Everyone Do you need something",
      sent_at: "2025-02-03 05:51:42 pm"
    },
    {
      id: 2,
      notification_channel: "/topics/promotions",
      notification_title: "Special Offer",
      notification_description: "Get 50% off on all electronics this weekend",
      sent_at: "2025-02-02 10:30:15 am"
    },
    {
      id: 3,
      notification_channel: "/topics/updates",
      notification_title: "System Maintenance",
      notification_description: "Scheduled maintenance will occur tonight from 2 AM to 4 AM",
      sent_at: "2025-02-01 08:45:30 pm"
    }
  ];
}

export default function ViewAllNotificationsPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">View All Previous Push Notifications</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </span>
        <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
          <Trash2 className="w-4 h-4 mr-2" />
          Remove All Notifications Before 15 days
        </Button>
      </div>
      <DataTable columns={notification_columns} data={data} />
    </div>
  );
}
