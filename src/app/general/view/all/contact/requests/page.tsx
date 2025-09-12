import { DataTable } from '@/components/TableHelper/data-table'
import { ContactRequestRow, contact_requests_columns } from '@/components/TableHelper/contact_requests_columns'
import { Input } from '@/components/ui/input'

async function getData(): Promise<ContactRequestRow[]> {
    return [
        { id: '11', sl: 11, name: 'aviator igra_mcPa', email: 'bln rwbikgub@afum.sqk', message: 'aviator игра на деньги …', status: 'Not Served' },
        { id: '12', sl: 12, name: 'proekt pereplanirovki kvartiri', email: 'lbw djxxnnx@tfca.llq', message: 'проект перепланировки …', status: 'Not Served' },
        { id: '13', sl: 13, name: 'aviator igra_hmEa', email: 'ium sahjannq@iiii.chc', message: 'aviator gioco …', status: 'Not Served' },
        { id: '15', sl: 15, name: 'Kala Viner', email: 'viner.kala36@msn.com', message: 'Greetings, I\'d like to share a tailored option…', status: 'Not Served' },
    ]
}

export default async function ViewAllContactRequestsPage() {
    const data = await getData()
    return (
        <div className="m-5 p-5 border ">
            <div>
                <h1 className="text-lg font-semibold border-l-2 border-blue-500">
                    <span className="pl-5">Contact Requests List</span>
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
            <DataTable columns={contact_requests_columns} data={data} />
        </div>
    )
}


