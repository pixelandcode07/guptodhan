import { DataTable } from "@/components/TableHelper/data-table";
import { PromoCode, promo_codes_columns } from "@/components/TableHelper/promo_codes_columns";
import { Input } from "@/components/ui/input";

function getData(): PromoCode[] {
  return [
    {
      id: 1,
      title: "Summer Sale 2024",
      effective_date: "2024-06-01",
      expiry_date: "2024-08-31",
      type: "Percentage",
      value: "20%",
      min_spend: "৳500",
      code: "SUMMER20",
      status: "Active"
    },
    {
      id: 2,
      title: "New Customer Discount",
      effective_date: "2024-07-01",
      expiry_date: "2024-12-31",
      type: "Fixed Amount",
      value: "৳100",
      min_spend: "৳1000",
      code: "NEW100",
      status: "Active"
    },
    {
      id: 3,
      title: "Flash Sale Weekend",
      effective_date: "2024-05-15",
      expiry_date: "2024-05-17",
      type: "Percentage",
      value: "30%",
      min_spend: "৳300",
      code: "FLASH30",
      status: "Expired"
    }
  ];
}

export default function ViewAllPromoCodesPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">Promo Codes</span>
        </h1>
      </div>
      <div className="flex items-center justify-end gap-4 mb-4">
        <span className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </span>
      </div>
      <DataTable columns={promo_codes_columns} data={data} />
    </div>
  );
}
