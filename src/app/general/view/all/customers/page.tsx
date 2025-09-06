import { DataTable } from "@/components/TableHelper/data-table"
import { customer_columns, Customer } from "@/components/TableHelper/customer_columns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download } from "lucide-react"

function getData(): Customer[] {
  return [
    {
      id: 1,
      image: "",
      name: "Dewan center",
      email: "mjoy98592@gmail.com",
      phone: "01740648071",
      address: "dogri Bazar, agargaow, kaji Kandi, naria, shariatpur",
      delete_request_submitted: "",
      wallet: 0,
      created_at: "2025-09-03 01:31:38 am"
    },
    {
      id: 2,
      image: "",
      name: "Tareq Mahmud",
      email: "tmahmud771@gmail.com",
      phone: "01716638449",
      address: "Gosairhat Bazar, Shariatpur.",
      delete_request_submitted: "",
      wallet: 0,
      created_at: "1970-01-01 06:00:00 am"
    },
    {
      id: 3,
      image: "",
      name: "Harun Rashid",
      email: "harunlinklion@gmail.com",
      phone: "01718798527",
      address: "SHARIATPUR,SADRA",
      delete_request_submitted: "",
      wallet: 0,
      created_at: "2025-08-31 11:33:19 am"
    },
    {
      id: 4,
      image: "",
      name: "Pabel Mun",
      email: "lockpabel99@gmail.com",
      phone: "01333061763",
      address: "Rangpur Gaibandha",
      delete_request_submitted: "",
      wallet: 0,
      created_at: "2025-08-31 11:33:19 am"
    },
    {
      id: 5,
      image: "",
      name: "MITUL",
      email: "",
      phone: "",
      address: "surcit Haus rood shariatpur",
      delete_request_submitted: "",
      wallet: 0,
      created_at: "2025-08-31 11:33:19 am"
    },
    {
      id: 6,
      image: "",
      name: "Nisad Ahmed",
      email: "nisadahmed899@gmail.com",
      phone: "",
      address: "Shariatpur",
      delete_request_submitted: "",
      wallet: 0,
      created_at: "2025-08-31 11:33:19 am"
    },
    {
      id: 7,
      image: "",
      name: "oliullaobaidi",
      email: "oliullahobaidi1992@gmail.com",
      phone: "",
      address: "Shariatpur",
      delete_request_submitted: "",
      wallet: 0,
      created_at: "2025-08-31 11:33:19 am"
    },
    {
      id: 8,
      image: "",
      name: "Efti Ahmed Tanjil",
      email: "",
      phone: "",
      address: "Shariatpur",
      delete_request_submitted: "",
      wallet: 0,
      created_at: "2025-08-31 11:33:19 am"
    },
    {
      id: 9,
      image: "",
      name: "Customer 9",
      email: "customer9@example.com",
      phone: "01712345678",
      address: "Dhaka, Bangladesh",
      delete_request_submitted: "",
      wallet: 0,
      created_at: "2025-08-30 10:15:30 am"
    },
    {
      id: 10,
      image: "",
      name: "Customer 10",
      email: "customer10@example.com",
      phone: "01787654321",
      address: "Chittagong, Bangladesh",
      delete_request_submitted: "",
      wallet: 0,
      created_at: "2025-08-29 09:45:20 am"
    }
  ];
}

export default function ViewAllCustomersPage() {
  const data = getData();
  return (
    <div className="m-5 p-5 border ">
      <div>
        <h1 className="text-lg font-semibold border-l-2 border-blue-500">
          <span className="pl-5">View All Customers</span>
        </h1>
      </div>
      
      <div className="mt-4 mb-4">
        <h2 className="text-md font-medium">Customers List</h2>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select className="border border-gray-300 rounded px-2 py-1">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>entries</span>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Download As Excel
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span>Search:</span>
          <Input type="text" className="border border-gray-500" />
        </div>
      </div>
      
      <DataTable columns={customer_columns} data={data} />
    </div>
  );
}
