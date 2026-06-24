'use client';

import { useState } from 'react';
import { DataTable } from '@/components/TableHelper/data-table';
import { vendorOrdersColumns, VendorOrderRow } from '@/components/TableHelper/vendor_orders_columns';
import { toast } from 'sonner';
import axios from 'axios';
import { confirmDelete } from '@/components/ReusableComponents/ConfirmToast';

export default function VendorOrdersClient({ initialOrders }: { initialOrders: VendorOrderRow[] }) {
  const [orders, setOrders] = useState<VendorOrderRow[]>(initialOrders);

  // Bulk Status Update (Vendor can process, ship, deliver, cancel)
  const handleBulkStatusChange = async (selectedRows: VendorOrderRow[], newStatus: string) => {
    if (selectedRows.length === 0) return;

    const toastId = toast.loading(`Marking ${selectedRows.length} orders as ${newStatus}...`);

    try {
        const promises = selectedRows.map(row => 
            axios.patch(`/api/v1/product-order/${row.id}`, { orderStatus: newStatus })
        );
        
        await Promise.all(promises);

        const updatedIds = selectedRows.map(r => r.id);
        setOrders(prev => prev.map(o => 
            updatedIds.includes(o.id) ? { ...o, status: newStatus } : o
        ));

        toast.success(`Orders marked as ${newStatus} successfully!`, { id: toastId });
    } catch (error) {
        toast.error("Failed to update status for some orders.", { id: toastId });
    }
  };

  // Bulk Delete (Admin/Vendor function)
  const handleBulkDelete = async (selectedRows: VendorOrderRow[]) => {
    if (selectedRows.length === 0) return;

    const isConfirmed = await confirmDelete(`Are you sure you want to delete ${selectedRows.length} orders permanently?`);
    if (!isConfirmed) return;

    const toastId = toast.loading(`Deleting ${selectedRows.length} orders...`);

    try {
        const promises = selectedRows.map(row => axios.delete(`/api/v1/product-order/${row.id}`));
        await Promise.all(promises);

        const deletedIds = selectedRows.map(r => r.id);
        setOrders(prev => prev.filter(o => !deletedIds.includes(o.id)));

        toast.success("Orders deleted successfully!", { id: toastId });
    } catch (error) {
        toast.error("Failed to delete some orders.", { id: toastId });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <DataTable 
        columns={vendorOrdersColumns} 
        data={orders} 
        setData={setOrders}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChangeCustom={{
            options: [
                { label: "Mark as Processing", value: "Processing" },
                { label: "Mark as Shipped", value: "Shipped" },
                { label: "Mark as Delivered", value: "Delivered" },
                { label: "Cancel Orders", value: "Cancelled" }
            ],
            handler: handleBulkStatusChange
        }}
      />
    </div>
  );
}