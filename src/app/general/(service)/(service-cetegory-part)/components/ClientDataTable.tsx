'use client'

import { DataTable } from '@/components/TableHelper/data-table'
import { service_category_columns } from '@/components/TableHelper/service_category_columns';
import { IServiceCategory } from '@/types/ServiceCategoryType';
import { useState } from 'react'

type ClientDataTableProps = {
    allCategory: IServiceCategory[];
}


export default function ClientDataTable({ allCategory }: ClientDataTableProps) {
    const [data, setdata] = useState(allCategory)
    return (
        <div>
            <DataTable columns={service_category_columns} data={data} setData={setdata} />
        </div>
    )
}
