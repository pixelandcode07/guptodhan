// import { columns, Payment } from "./columns";
// import { DataTable } from "./data-table";

import { columns, Payment } from "@/components/TableHelper/columns";
import { DataTable } from "@/components/TableHelper/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const getData = async (): Promise<Payment[]> => {
    return [
        {
            serial: '1',
            category_id: 1,
            category_name: 'Organic',
            slug: 'organic',
            status: "active",
        },
        {
            serial: '2',
            category_id: 2,
            category_name: 'Travel & Luggagessss',
            slug: 'travel-luggage',
            status: "inactive",
        },
        {
            serial: '3',
            category_id: 3,
            category_name: 'Travel & Luggagessss',
            slug: 'travel-luggage',
            status: "inactive",
        },
        {
            serial: '4',
            category_id: 4,
            category_name: 'Toys & Games',
            slug: 'toys-games',
            status: "active",
        },
        {
            serial: '1',
            category_id: 5,
            category_name: 'Organic',
            slug: 'organic',
            status: "active",
        },
        {
            serial: '1',
            category_id: 6,
            category_name: 'Travel & Luggagessss',
            slug: 'travel-luggage',
            status: "inactive",
        },
        {
            serial: '1',
            category_id: 1,
            category_name: 'Travel & Luggagessss',
            slug: 'travel-luggage',
            status: "inactive",
        },
        {
            serial: '1',
            category_id: 1,
            category_name: 'Toys & Games',
            slug: 'toys-games',
            status: "active",
        },
        {
            serial: '1',
            category_id: 1,
            category_name: 'Organic',
            slug: 'organic',
            status: "active",
        },
        {
            serial: '1',
            category_id: 1,
            category_name: 'Travel & Luggagessss',
            slug: 'travel-luggage',
            status: "inactive",
        },
        {
            serial: '1',
            category_id: 1,
            category_name: 'Travel & Luggagessss',
            slug: 'travel-luggage',
            status: "inactive",
        },
        {
            serial: '1',
            category_id: 1,
            category_name: 'Toys & Games',
            slug: 'toys-games',
            status: "active",
        },
        {
            serial: '1',
            category_id: 1,
            category_name: 'Organic',
            slug: 'organic',
            status: "active",
        },
        {
            serial: '1',
            category_id: 1,
            category_name: 'Travel & Luggagessss',
            slug: 'travel-luggage',
            status: "inactive",
        },
        {
            serial: '1',
            category_id: 1,
            category_name: 'Travel & Luggagessss',
            slug: 'travel-luggage',
            status: "inactive",
        },
        {
            serial: '1',
            category_id: 1,
            category_name: 'Toys & Games',
            slug: 'toys-games',
            status: "active",
        },
        {
            serial: '1',
            category_id: 1,
            category_name: 'Organic',
            slug: 'organic',
            status: "active",
        },
        {
            serial: '1',
            category_id: 1,
            category_name: 'Travel & Luggagessss',
            slug: 'travel-luggage',
            status: "inactive",
        },
        {
            serial: '1',
            category_id: 1,
            category_name: 'Travel & Luggagessss',
            slug: 'travel-luggage',
            status: "inactive",
        },
        {
            serial: '1',
            category_id: 1,
            category_name: 'Toys & Games',
            slug: 'toys-games',
            status: "active",
        },
    ]
}

export default async function PaymentPage() {
    const data = await getData();
    return (
        <div className="m-5 p-5 border ">
            <div >
                <h1 className="text-lg font-semibold border-l-2 border-blue-500">
                    <span className="pl-5">Category List</span>
                </h1>
            </div>
            <div className="md:flex justify-between my-5 space-y-2.5">
                <p>Show (Pagination) entries</p>
                <span className="md:flex gap-4 space-y-2.5">
                    <span className="flex items-center gap-2">
                        Search:
                        <Input type="text" className="border border-gray-500" />
                    </span>
                    <Button variant={'AquaBtn'}>Rearrange Categories</Button>
                </span>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    )
}
