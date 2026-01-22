'use client';

import { DataTable } from '@/components/TableHelper/data-table'
import { service_data_columns } from '@/components/TableHelper/service_data_columns';
import { ServiceData } from '@/types/ServiceDataType';
import { useState } from 'react';


type ClientDataTableProps = {
    providerServices: ServiceData[];
}

export default function ClientDataTable({ providerServices }: ClientDataTableProps) {
    const [data, setdata] = useState(providerServices)
    return (
        <div>
            <DataTable columns={service_data_columns} data={data} setData={setdata} />
        </div>
    )
}
