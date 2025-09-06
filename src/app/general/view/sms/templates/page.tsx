import { DataTable } from "@/components/TableHelper/data-table";
import { SmsTemplate, sms_template_columns } from "@/components/TableHelper/sms_template_columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function getData(): SmsTemplate[] {
  return [
    {
      id: 1,
      template_title: "Order Confirmation",
      template_description: "Your order has been confirmed and will be processed soon",
      created_at: "2024-08-18 09:58:42 pm"
    },
    {
      id: 2,
      template_title: "Payment Reminder",
      template_description: "Please complete your payment to confirm your order",
      created_at: "2024-08-17 14:30:15 am"
    },
    {
      id: 3,
      template_title: "Delivery Update",
      template_description: "Your order is out for delivery and will arrive shortly",
      created_at: "2024-08-16 11:20:30 pm"
    }
  ];
}

export default function ViewAllSmsTemplatesPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">View All SMS Templates</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </span>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create New Template
        </Button>
      </div>
      <DataTable columns={sms_template_columns} data={data} />
    </div>
  );
}
