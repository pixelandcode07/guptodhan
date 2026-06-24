'use client'

import { DataTable } from '@/components/TableHelper/data-table'
import { getProviderColumns } from '@/components/TableHelper/provider_management_columns';
import { IProvider } from '@/types/ProviderType';
import { useState, useEffect } from 'react'
import { toast } from 'sonner';
import { confirmDelete } from '@/components/ReusableComponents/ConfirmToast';
import axios from 'axios';

type ClientDataTableProps = {
    serviceUsers: IProvider[];
}

export default function ClientDataTable({ serviceUsers }: ClientDataTableProps) {
    const [data, setData] = useState<IProvider[]>(serviceUsers || []);

    useEffect(() => {
        if (serviceUsers) {
            setData(serviceUsers);
        }
    }, [serviceUsers]);

    // ==========================================
    //  Bulk Status Change Handler (Approve/Reject)
    // ==========================================
    const handleBulkStatusChange = async (selectedRows: IProvider[], newStatus: 'active' | 'inactive') => {
        if (selectedRows.length === 0) return;

        const action = newStatus === 'active' ? 'approve' : 'reject';
        const toastId = toast.loading(`${action === 'approve' ? 'Approving' : 'Rejecting'} ${selectedRows.length} providers...`);

        try {
            const promises = selectedRows.map(row => 
                axios.patch(`/api/v1/service-section/service-provider/${action}/${row._id}`, { id: row._id })
            );
            
            await Promise.all(promises);

            // Instant UI Update
            const updatedIds = selectedRows.map(r => r._id);
            setData(prev => prev.map(provider => 
                updatedIds.includes(provider._id) 
                ? { 
                    ...provider, 
                    isActive: newStatus === 'active',
                    role: newStatus === 'active' ? 'service-provider' : provider.role
                  } 
                : provider
            ));

            toast.success(`Providers ${action === 'approve' ? 'Activated' : 'Deactivated'} successfully!`, { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status for some providers.", { id: toastId });
        }
    };

    // ==========================================
    //  Bulk Delete Handler (Optional: If backend supports deleting users/providers)
    // ==========================================
    const handleBulkDelete = async (selectedRows: IProvider[]) => {
        if (selectedRows.length === 0) return;

        const isConfirmed = await confirmDelete(`Are you sure you want to delete ${selectedRows.length} providers permanently?`);
        if (!isConfirmed) return;

        const toastId = toast.loading(`Deleting ${selectedRows.length} providers...`);

        try {
            // Note: Replace the URL below with your actual backend user delete endpoint if available
            const promises = selectedRows.map(row => 
                axios.delete(`/api/v1/users/${row._id}`) 
            );
            await Promise.all(promises);

            // Filter out deleted items from local state
            const deletedIds = selectedRows.map(r => r._id);
            setData(prev => prev.filter(provider => !deletedIds.includes(provider._id)));

            toast.success("Providers deleted successfully!", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete some providers. Check if delete API exists.", { id: toastId });
        }
    };

    return (
        <div>
            <DataTable 
                columns={getProviderColumns(setData)} 
                data={data} 
                setData={setData} 
                onBulkStatusChange={handleBulkStatusChange} // ✅ Enabled Bulk Status Change
                onBulkDelete={handleBulkDelete}             // ✅ Enabled Bulk Delete
            />
        </div>
    )
}