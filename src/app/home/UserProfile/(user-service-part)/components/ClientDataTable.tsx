'use client';

import { DataTable } from '@/components/TableHelper/data-table'
import { service_data_columns_user } from '@/components/TableHelper/service_data_columns_user';
import { ServiceData } from '@/types/ServiceDataType';
import { useState } from 'react';


type ClientDataTableProps = {
    providerServices: ServiceData[];
}

export default function ClientDataTable({ providerServices }: ClientDataTableProps) {
    const [data, setdata] = useState(providerServices)
    return (
        <div>
            <DataTable columns={service_data_columns_user} data={data} setData={setdata} />
        </div>
    )
}
