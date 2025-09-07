import { DataTable } from "@/components/TableHelper/data-table"
import { delivery_charges_columns, DeliveryCharge } from "@/components/TableHelper/delivery_charges_columns"
import { Input } from "@/components/ui/input"

function getData(): DeliveryCharge[] {
  return [
    {
      id: 1,
      division: "Chattagram",
      district: "Comilla",
      district_bangla: "কুমিল্লা",
      delivery_charge: 150
    },
    {
      id: 2,
      division: "Chattagram",
      district: "Feni",
      district_bangla: "ফেনী",
      delivery_charge: 150
    },
    {
      id: 3,
      division: "Chattagram",
      district: "Brahmanbaria",
      district_bangla: "ব্রাহ্মণবাড়িয়া",
      delivery_charge: 150
    },
    {
      id: 4,
      division: "Chattagram",
      district: "Rangamati",
      district_bangla: "রাঙ্গামাটি",
      delivery_charge: 150
    },
    {
      id: 5,
      division: "Chattagram",
      district: "Noakhali",
      district_bangla: "নোয়াখালী",
      delivery_charge: 150
    },
    {
      id: 6,
      division: "Chattagram",
      district: "Chandpur",
      district_bangla: "চাঁদপুর",
      delivery_charge: 150
    },
    {
      id: 7,
      division: "Chattagram",
      district: "Lakshmipur",
      district_bangla: "লক্ষ্মীপুর",
      delivery_charge: 150
    },
    {
      id: 8,
      division: "Chattagram",
      district: "Chattogram",
      district_bangla: "চট্টগ্রাম",
      delivery_charge: 150
    },
    {
      id: 9,
      division: "Chattagram",
      district: "Coxsbazar",
      district_bangla: "কক্সবাজার",
      delivery_charge: 150
    },
    {
      id: 10,
      division: "Chattagram",
      district: "Khagrachhari",
      district_bangla: "খাগড়াছড়ি",
      delivery_charge: 150
    },
    {
      id: 11,
      division: "Chattagram",
      district: "Bandarban",
      district_bangla: "বান্দরবান",
      delivery_charge: 150
    },
    {
      id: 12,
      division: "Rajshahi",
      district: "Sirajganj",
      district_bangla: "সিরাজগঞ্জ",
      delivery_charge: 150
    },
    {
      id: 13,
      division: "Rajshahi",
      district: "Pabna",
      district_bangla: "পাবনা",
      delivery_charge: 150
    },
    {
      id: 14,
      division: "Rajshahi",
      district: "Bogura",
      district_bangla: "বগুড়া",
      delivery_charge: 150
    },
    {
      id: 15,
      division: "Rajshahi",
      district: "Rajshahi",
      district_bangla: "রাজশাহী",
      delivery_charge: 150
    }
  ];
}

export default function DeliveryChargesPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Delivery Charge List</span>
        </h1>
      </div>
      
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </div>
      </div>
      
      <DataTable columns={delivery_charges_columns} data={data} />
    </div>
  );
}
