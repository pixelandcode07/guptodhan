// import { allWithdrawal, AllWithdrawalData, TotalWithdrawalInfo } from "@/components/TableHelper/allWithdrawal"
import { allWithdrawal, AllWithdrawalData, TotalWithdrawalInfo } from "@/components/TableHelper/allWithdrawal"
import { DataTable } from "@/components/TableHelper/data-table"
import { Input } from "@/components/ui/input"
import { DollarSign } from "lucide-react"


// Withdrawal data set
const getWithdrawalData = async (): Promise<TotalWithdrawalInfo[]> => {
    return [
        {
            type: "Completed",
            title: "Completed Withrawal",
            amount: 1000,
        },
        {
            type: "Pending",
            title: "Pending Withrawal",
            amount: 1000,
        },
        {
            type: "Cancelled",
            title: "Cancelled Withdrawal",
            amount: 1000,
        },
        {
            type: "Vendor",
            title: "Vendor Balance",
            amount: 1000,
        },
    ]
}



const getWithdrawalReport = async (): Promise<AllWithdrawalData[]> => {
    return [
        {
            serial: '1',
            vendor_name: 'Shannon-Knight',
            amount: 120,
            date_time: '2024-09-03',
            method: 'Shannon-Knight LLC',
            bank: 'Agrani Bank PLC',
            bank_acc: '005562005562',
            mfs_acc: '01840060000',
            transction_id: 'DB4651368FCK1000BDT',
            status: 'pending'
        }
    ]

}

export default async function AllWithdrawal() {
    const withdrawalData = await getWithdrawalData()
    const withdrawalRepo = await getWithdrawalReport()


    return (
        <div className="p-5">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8  bg-[#f8f9fb]">
                {withdrawalData.map((val, idx) =>
                    <div key={idx} className="flex items-center justify-between py-10 px-5 bg-[#fff] border rounded-md mb-4">
                        <div className="flex flex-col gap-4">
                            <h1 className="text-gray-500">{val.title}</h1>
                            <p className="font-semibold text-2xl"><span className="text-2xl font-bold pr-2">৳</span>{val.amount}</p>
                        </div>
                        <span>
                            {val.type === "Completed" && <DollarSign className="h-10 w-10 p-2 bg-green-100 text-green-600 rounded-full" />}
                            {val.type === "Pending" && <DollarSign className="h-10 w-10 p-2 bg-yellow-100 text-yellow-600 rounded-full" />}
                            {val.type === "Cancelled" && <DollarSign className="h-10 w-10 p-2 bg-red-100 text-red-600 rounded-full" />}
                            {val.type === "Vendor" && <DollarSign className="h-10 w-10 p-2 bg-blue-100 text-blue-600 rounded-full" />}
                        </span>
                    </div>
                )}
            </div>


            <div >
                <h1 className="text-lg font-semibold border-l-2 border-blue-500">
                    <span className="pl-5">All Withdraws</span>
                </h1>
            </div>
            <div className="md:flex justify-between my-5 space-y-2.5">
                <p>Show (Pagination) entries</p>
                <span className="md:flex gap-4 space-y-2.5">
                    <span className="flex items-center gap-2">
                        Search:
                        <Input type="text" className="border border-gray-500" />
                    </span>
                </span>
            </div>


            <div>
                <DataTable columns={allWithdrawal} data={withdrawalRepo} />
            </div>
        </div>
    )
}
