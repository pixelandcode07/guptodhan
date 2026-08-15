'use client'

import { DataTable } from '@/components/TableHelper/data-table'
import { getProviderColumns } from '@/components/TableHelper/provider_management_columns';
import { IProvider } from '@/types/ProviderType';
import { useState, useEffect, useMemo } from 'react'
import { toast } from 'sonner';
import { confirmDelete } from '@/components/ReusableComponents/ConfirmToast';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation'; 

type ClientDataTableProps = {
    serviceUsers: IProvider[];
}

export default function ClientDataTable({ serviceUsers }: ClientDataTableProps) {
    const [data, setData] = useState<IProvider[]>(serviceUsers || []);
    const router = useRouter(); 
    
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    useEffect(() => {
        if (serviceUsers) {
            setData(serviceUsers);
        }
    }, [serviceUsers]);

    const filteredData = useMemo(() => {
        let result = data;

        if (statusFilter !== 'all') {
            const isActiveRequired = statusFilter === 'active';
            result = result.filter(provider => provider.isActive === isActiveRequired);
        }

        const q = searchQuery.trim().toLowerCase();
        if (q) {
            result = result.filter(provider => {
                const searchableFields = [
                    provider.name,
                    provider.email,
                    provider.phoneNumber,
                    provider.role
                ];
                return searchableFields.some(field => field && String(field).toLowerCase().includes(q));
            });
        }

        return result;
    }, [data, searchQuery, statusFilter]);

    const handleBulkStatusChange = async (selectedRows: IProvider[], newStatus: 'active' | 'inactive') => {
        if (selectedRows.length === 0) return;

        const action = newStatus === 'active' ? 'approve' : 'reject';
        const toastId = toast.loading(`${action === 'approve' ? 'Approving' : 'Rejecting'} ${selectedRows.length} providers...`);

        try {
            const promises = selectedRows.map(row => 
                axios.patch(`/api/v1/service-section/service-provider/${action}/${row._id}`, { id: row._id })
            );
            
            await Promise.all(promises);

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
            
            router.refresh();

        } catch (error) {
            console.error(error);
            toast.error("Failed to update status for some providers.", { id: toastId });
        }
    };

    const handleBulkDelete = async (selectedRows: IProvider[]) => {
        if (selectedRows.length === 0) return;

        const isConfirmed = await confirmDelete(`Are you sure you want to delete ${selectedRows.length} providers permanently?`);
        if (!isConfirmed) return;

        const toastId = toast.loading(`Deleting ${selectedRows.length} providers...`);

        try {
            const promises = selectedRows.map(row => 
                // ✅ Users ডিলিট করার API কল করা হচ্ছে
                axios.delete(`/api/v1/users/${row._id}`) 
            );
            await Promise.all(promises);

            const deletedIds = selectedRows.map(r => r._id);
            setData(prev => prev.filter(provider => !deletedIds.includes(provider._id)));

            toast.success("Providers deleted successfully!", { id: toastId });
            
            // ✅ MAGIC FIX: সার্ভার ক্যাশ ক্লিয়ার করে নতুন ডাটা আনার নির্দেশ
            router.refresh();

        } catch (error) {
            console.error(error);
            toast.error("Failed to delete some providers. Check if delete API exists.", { id: toastId });
        }
    };

    return (
        <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search by name, email, phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-gray-50 focus-visible:ring-blue-500 w-full"
                    />
                </div>

                <div className="w-full sm:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                        className="w-full sm:w-48 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                    >
                        <option value="all">All Providers</option>
                        <option value="active">Active Providers</option>
                        <option value="inactive">Inactive Providers</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <DataTable 
                    columns={getProviderColumns(setData)} 
                    data={filteredData} 
                    setData={setData} 
                    onBulkStatusChange={handleBulkStatusChange} 
                    onBulkDelete={handleBulkDelete}             
                />
                
                {filteredData.length === 0 && (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        No provider requests found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    )
}