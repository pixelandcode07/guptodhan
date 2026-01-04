'use client'

import { DataTable } from '@/components/TableHelper/data-table'
import { service_data_columns } from '@/components/TableHelper/service_data_columns';
import { ServiceData } from '@/types/ServiceDataType';
import { useState } from 'react'

type ClientDataTableProps = {
    allAds: ServiceData[];
}


export default function ClientDataTable({ allAds }: ClientDataTableProps) {
    const [data, setdata] = useState(allAds)
    return (
        <div>
            <DataTable columns={service_data_columns} data={data} setData={setdata} />
        </div>
    )
}
