'use client';

import { all_store_columns } from '@/components/TableHelper/all_store_columns';
import { DataTable } from '@/components/TableHelper/data-table';
import { StoreInterface } from '@/types/StoreInterface';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { confirmDelete } from '@/components/ReusableComponents/ConfirmToast';

interface StoreProps {
    initialData: StoreInterface[];
}

export default function ClientDataTableStore({ initialData }: StoreProps) {
    const [storeData, setStoreData] = useState<StoreInterface[]>(initialData);

    const handleBulkDelete = async (selectedRows: StoreInterface[]) => {
        const confirmed = await confirmDelete(`Are you sure you want to delete ${selectedRows.length} selected stores?`);
        if (!confirmed) return;

        const toastId = toast.loading(`Deleting ${selectedRows.length} stores...`);
        
        try {
            const promises = selectedRows.map(store => 
                axios.delete(`/api/v1/vendor-store/${store._id}`)
            );
            
            await Promise.all(promises);
            
            toast.success(`${selectedRows.length} stores deleted successfully!`, { id: toastId });
            
            const deletedIds = selectedRows.map(s => s._id);
            setStoreData(prev => prev.filter(item => !deletedIds.includes(item._id)));

        } catch (error: any) {
            console.error("Bulk delete error:", error);
            const errMsg = error.response?.data?.message || 'Some stores could not be deleted (might be linked to products).';
            toast.error(errMsg, { id: toastId });
        }
    };

    return (
        <div>
            <DataTable
                columns={all_store_columns}
                data={storeData}
                setData={setStoreData}
                onBulkDelete={handleBulkDelete}
            />
        </div>
    );
}