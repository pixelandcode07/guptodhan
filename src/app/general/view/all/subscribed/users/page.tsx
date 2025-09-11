import { DataTable } from '@/components/TableHelper/data-table'
import { SubscribedUserRow, subscribed_users_columns } from '@/components/TableHelper/subscribed_users_columns'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

async function getData(): Promise<SubscribedUserRow[]> {
    return [
        { id: '1', sl: 1, email: 'isohana230@gmail.com', subscribedOn: 'Wednesday 28th of May 2025 12:55:05 AM' },
        { id: '2', sl: 2, email: 'wmadber@gmail.com', subscribedOn: 'Tuesday 20th of May 2025 03:32:08 PM' },
        { id: '3', sl: 3, email: 'hossainshafaat8@gmail.com', subscribedOn: 'Tuesday 20th of May 2025 02:58:14 PM' },
        { id: '4', sl: 4, email: 'mizanur89@gmail.com', subscribedOn: 'Tuesday 20th of May 2025 02:19:14 PM' },
        { id: '5', sl: 5, email: 'tuhinal170@gmail.com', subscribedOn: 'Friday 21st of March 2025 05:45:24 PM' },
    ]
}

export default async function ViewAllSubscribedUsersPage() {
    const data = await getData()
    return (
        <div className="m-5 p-5 border ">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold border-l-2 border-blue-500">
                    <span className="pl-5">Subscribed Users List</span>
                </h1>
                <Button className='bg-green-500 text-white'>⬇ Download As Excel</Button>
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
            <DataTable columns={subscribed_users_columns} data={data} />
        </div>
    )
}


