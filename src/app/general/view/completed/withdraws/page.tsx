import { complet_withdraw_columns, Complete_Withdraw_req } from '@/components/TableHelper/complet_withdraw_columns'
import { DataTable } from '@/components/TableHelper/data-table'
import { Input } from '@/components/ui/input'



const getCompletedWithdrawal = async (): Promise<Complete_Withdraw_req[]> => {
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

export default async function CompletedWithdrawals() {
    const completeWithdrawal = await getCompletedWithdrawal()
    return (
        <>
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
                <DataTable columns={complet_withdraw_columns} data={completeWithdrawal} />
            </div>
        </>
    )
}




