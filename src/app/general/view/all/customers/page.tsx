import { Customer } from "@/components/TableHelper/customer_columns";
import CustomersClient from './components/CustomersClient';

export const dynamic = 'force-dynamic';

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
  return <CustomersClient initialRows={data} />;
}
