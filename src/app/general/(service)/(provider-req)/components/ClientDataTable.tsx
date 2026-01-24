'use client'

import { DataTable } from '@/components/TableHelper/data-table'
import { provider_management_columns } from '@/components/TableHelper/provider_management_columns';
import { IProvider } from '@/types/ProviderType';
import { useState } from 'react'

type ClientDataTableProps = {
    serviceUsers: IProvider[];
}


export default function ClientDataTable({ serviceUsers }: ClientDataTableProps) {
    const [data, setdata] = useState(serviceUsers)
    return (
        <div>
            <DataTable columns={provider_management_columns} data={data} setData={setdata} />
        </div>
    )
}
