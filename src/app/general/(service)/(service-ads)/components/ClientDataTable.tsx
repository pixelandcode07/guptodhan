'use client'

import { DataTable } from '@/components/TableHelper/data-table'
import { getServiceColumns } from '@/components/TableHelper/service_data_columns'; // ✅ Imported the dynamic function
import { ServiceData } from '@/types/ServiceDataType';
import { useState, useEffect } from 'react'
import { toast } from 'sonner';
import { confirmDelete } from '@/components/ReusableComponents/ConfirmToast';
import axios from 'axios';

type ClientDataTableProps = {
    allAds: ServiceData[];
}

export default function ClientDataTable({ allAds }: ClientDataTableProps) {
    const [data, setData] = useState<ServiceData[]>(allAds || []);

    useEffect(() => {
        if(allAds) {
            setData(allAds);
        }
    }, [allAds]);

    // ✅ Handle Bulk Delete
    const handleBulkDelete = async (selectedRows: ServiceData[]) => {
        if (selectedRows.length === 0) return;

        const isConfirmed = await confirmDelete(`Are you sure you want to delete ${selectedRows.length} services?`);
        if (!isConfirmed) return;

        const toastId = toast.loading(`Deleting ${selectedRows.length} services...`);

        try {
            const promises = selectedRows.map(row => 
                axios.delete(`/api/v1/service-section/provide-service/${row._id}`)
            );
            await Promise.all(promises);

            // Instant UI Update
            const deletedIds = selectedRows.map(r => r._id);
            setData(prev => prev.filter(ad => !deletedIds.includes(ad._id)));

            toast.success("Services deleted successfully!", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete some services.", { id: toastId });
        }
    };

    // ✅ Handle Bulk Status Change (Activate/Deactivate)
    const handleBulkStatusChange = async (selectedRows: ServiceData[], newStatus: 'active' | 'inactive') => {
        if (selectedRows.length === 0) return;

        const targetAction = newStatus === 'active' ? 'approve' : 'reject';
        const targetStatus = newStatus === 'active' ? 'Active' : 'Disabled';
        const toastId = toast.loading(`Marking ${selectedRows.length} services as ${targetStatus}...`);

        try {
            const promises = selectedRows.map(row => 
                // ✅ Sending correctly formatted data { action: 'approve'/'reject' }
                axios.patch(`/api/v1/service-section/provide-service/status/${row._id}`, { action: targetAction })
            );
            await Promise.all(promises);

            // Instant UI Update
            const updatedIds = selectedRows.map(r => r._id);
            setData(prev => prev.map(ad => 
                updatedIds.includes(ad._id) 
                ? { ...ad, service_status: targetStatus, is_visible_to_customers: newStatus === 'active' } 
                : ad
            ));

            toast.success(`Services marked as ${targetStatus} successfully!`, { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status for some services.", { id: toastId });
        }
    };

    return (
        <div>
            <DataTable 
                columns={getServiceColumns(setData)}  // ✅ Passing `setData` directly to columns
                data={data} 
                setData={setData} 
                onBulkDelete={handleBulkDelete}       // ✅ Enabled Bulk Delete
                onBulkStatusChange={handleBulkStatusChange} // ✅ Enabled Bulk Status Change
            />
        </div>
    )
}