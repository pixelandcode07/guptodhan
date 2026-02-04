'use client'

import { DataTable } from '@/components/TableHelper/data-table'
import { service_data_columns } from '@/components/TableHelper/service_data_columns';
import { ServiceData } from '@/types/ServiceDataType';
import { useState, useEffect } from 'react'

type ClientDataTableProps = {
    allAds: ServiceData[];
}

export default function ClientDataTable({ allAds }: ClientDataTableProps) {
    const [data, setData] = useState<ServiceData[]>(allAds || []);

    // Server theke notun data asle state update kora dorkar hote pare
    useEffect(() => {
        if(allAds) {
            setData(allAds);
        }
    }, [allAds]);

    return (
        <div>
            {/* Rearrange path na thakle undefined pathao */}
            <DataTable 
                columns={service_data_columns} 
                data={data} 
                setData={setData} 
            />
        </div>
    )
}