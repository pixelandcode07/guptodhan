import { DataTable } from '@/components/TableHelper/data-table'
import { SupportTicketRow, support_tickets_columns } from '@/components/TableHelper/support_tickets_columns'
import { Input } from '@/components/ui/input'

async function getData(): Promise<SupportTicketRow[]> {
    // Static seed for now; replace with API fetch later
    return [
        { id: '1', sl: 1, ticketNo: 'T-1001', customer: 'John Doe', subject: 'Order not received', attachment: null, status: 'Pending' },
        { id: '2', sl: 2, ticketNo: 'T-1002', customer: 'Jane Smith', subject: 'Refund request', attachment: 'refund.pdf', status: 'Pending' },
    ]
}

export default async function PendingSupportTicketsPage() {
    const data = await getData()
    return (
        <div className="m-5 p-5 border ">
            <div>
                <h1 className="text-lg font-semibold border-l-2 border-blue-500">
                    <span className="pl-5">Support List</span>
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
            <DataTable columns={support_tickets_columns} data={data} />
        </div>
    )
}

