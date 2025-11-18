'use client';

import { all_store_columns } from '@/components/TableHelper/all_store_columns';
import { DataTable } from '@/components/TableHelper/data-table';
import { StoreInterface } from '@/types/StoreInterface';
import { useState } from 'react';

interface StoreProps {
    initialData: StoreInterface[];
}

export default function ClientDataTableStore({ initialData }: StoreProps) {
    const [storeData, setStoreData] = useState<StoreInterface[]>(initialData)
    return (
        <div>
            <DataTable
                columns={all_store_columns}
                data={storeData}
                setData={setStoreData}
            />
        </div>
    )
}
