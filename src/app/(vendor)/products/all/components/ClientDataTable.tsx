'use client'

import { DataTable } from '@/components/TableHelper/data-table'
import { vendor_product_columns } from '@/components/TableHelper/vendor_product_columns'
import React, { useState } from 'react'

export default function ClientDataTable({ vendorData }: any) {
    const [data, setData] = useState<any>(vendorData);
    return (
        <div>
            <DataTable columns={vendor_product_columns} data={data} setData={setData} />
        </div>
    )
}
