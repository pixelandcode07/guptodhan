'use client'

import { DataTable } from '@/components/TableHelper/data-table'
import { service_data_columns } from '@/components/TableHelper/service_data_columns';
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

    // Server theke notun data asle state update kora dorkar hote pare
    useEffect(() => {
        if(allAds) {
            setData(allAds);
        }
    }, [allAds]);

    // ==========================================
    //  Bulk Delete Handler
    // ==========================================
    const handleBulkDelete = async (selectedRows: ServiceData[]) => {
        if (selectedRows.length === 0) return;

        const isConfirmed = await confirmDelete(`Are you sure you want to delete ${selectedRows.length} service ads?`);
        if (!isConfirmed) return;

        const toastId = toast.loading(`Deleting ${selectedRows.length} service ads...`);

        try {
            const promises = selectedRows.map(row => 
                axios.delete(`/api/v1/service-section/provide-service/${row._id}`)
            );
            await Promise.all(promises);

            // Filter out deleted items from local state instantly
            const deletedIds = selectedRows.map(r => r._id);
            setData(prev => prev.filter(ad => !deletedIds.includes(ad._id)));

            toast.success("Service ads deleted successfully!", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete some ads.", { id: toastId });
        }
    };

    // ==========================================
    //  Bulk Status Change Handler
    // ==========================================
    const handleBulkStatusChange = async (selectedRows: ServiceData[], newStatus: 'active' | 'inactive') => {
        if (selectedRows.length === 0) return;

        const toastId = toast.loading(`Marking ${selectedRows.length} service ads as ${newStatus}...`);

        try {
            const targetStatus = newStatus === 'active' ? 'approved' : 'rejected';
            
            const promises = selectedRows.map(row => 
                axios.patch(`/api/v1/service-section/provide-service/status/${row._id}`, { status: targetStatus })
            );
            await Promise.all(promises);

            // Update local state instantly (No reload needed)
            const updatedIds = selectedRows.map(r => r._id);
            setData(prev => prev.map(ad => 
                updatedIds.includes(ad._id) ? { ...ad, status: targetStatus } : ad
            ));

            toast.success(`Service ads marked as ${newStatus} successfully!`, { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status for some ads.", { id: toastId });
        }
    };

    return (
        <div>
            {/* Pass the dynamic columns and data to DataTable */}
            <DataTable 
                columns={service_data_columns(setData)} // ✅ Pass setData to columns for instant UI update
                data={data} 
                setData={setData} 
                onBulkDelete={handleBulkDelete}          // ✅ Connect Bulk Delete
                onBulkStatusChange={handleBulkStatusChange} // ✅ Connect Bulk Status Change
            />
        </div>
    )
}