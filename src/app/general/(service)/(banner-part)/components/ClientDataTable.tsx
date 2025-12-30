'use client'

import { DataTable } from '@/components/TableHelper/data-table'
import { service_banner_columns } from '@/components/TableHelper/service_banner_columns';
import { IServiceBanner } from '@/types/ServiceBannerType';
import { useState } from 'react'

type ClientDataTableProps = {
    allBanners: IServiceBanner[];
}


export default function ClientDataTable({ allBanners }: ClientDataTableProps) {
    const [data, setdata] = useState(allBanners)
    return (
        <div>
            <DataTable columns={service_banner_columns} data={data} setData={setdata} />
        </div>
    )
}
