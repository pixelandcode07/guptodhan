import { DataTable } from "@/components/TableHelper/data-table";
import { SmsHistory, sms_history_columns } from "@/components/TableHelper/sms_history_columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

function getData(): SmsHistory[] {
  return [
    {
      id: 1,
      sms_template: "Order Confirmation",
      sending_type: "Bulk",
      contact: "+8801234567890",
      sms_receivers: "All Customers",
      order_count_range: "1-5",
      order_value_range: "৳500-৳2000",
      sent_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 2,
      sms_template: "Payment Reminder",
      sending_type: "Individual",
      contact: "+8809876543210",
      sms_receivers: "Specific Customer",
      order_count_range: "1-1",
      order_value_range: "৳1000-৳1000",
      sent_at: "2024-08-17 14:30:15 am"
    },
    {
      id: 3,
      sms_template: "Delivery Update",
      sending_type: "Bulk",
      contact: "+8801122334455",
      sms_receivers: "Pending Orders",
      order_count_range: "1-10",
      order_value_range: "৳300-৳5000",
      sent_at: "2024-08-16 11:20:30 pm"
    }
  ];
}

export default function ViewAllSmsHistoryPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">View All SMS History</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </span>
        <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
          <Trash2 className="w-4 h-4 mr-2" />
          Remove All SMS Before 15 days
        </Button>
      </div>
      <DataTable columns={sms_history_columns} data={data} />
    </div>
  );
}
