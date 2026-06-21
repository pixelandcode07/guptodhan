"use client";

import { useState } from "react";
import { DataTable } from "@/components/TableHelper/data-table";
import { buySellListing_columns } from "@/components/TableHelper/buySellListing_columns";
import { ClassifiedAdListing } from "@/types/ClassifiedAdsType";
import { toast } from "sonner";
import { confirmDelete } from "@/components/ReusableComponents/ConfirmToast";
import { deleteAd, markAdAsActive, markAdAsInactive } from "@/lib/BuyandSellApis/fetchBuyAndSellAction";

export default function ListingClient({ initialListing }: { initialListing: ClassifiedAdListing[] }) {
    const [listing, setListing] = useState<ClassifiedAdListing[]>(initialListing);

    // ==========================================
    //  Bulk Delete Handler
    // ==========================================
    const handleBulkDelete = async (selectedRows: ClassifiedAdListing[]) => {
        if (selectedRows.length === 0) return;

        const isConfirmed = await confirmDelete(`Are you sure you want to delete ${selectedRows.length} ads permanently?`);
        if (!isConfirmed) return;

        const toastId = toast.loading(`Deleting ${selectedRows.length} ads...`);

        try {
            // Delete sequentially or via Promise.all
            const promises = selectedRows.map(row => deleteAd(row._id));
            await Promise.all(promises);

            // Filter out deleted items from local state
            const deletedIds = selectedRows.map(r => r._id);
            setListing(prev => prev.filter(ad => !deletedIds.includes(ad._id)));

            toast.success("Ads deleted successfully!", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete some ads.", { id: toastId });
        }
    };

    // ==========================================
    //  Bulk Status Change Handler
    // ==========================================
    const handleBulkStatusChange = async (selectedRows: ClassifiedAdListing[], status: 'active' | 'inactive') => {
        if (selectedRows.length === 0) return;

        const toastId = toast.loading(`Marking ${selectedRows.length} ads as ${status}...`);

        try {
            const promises = selectedRows.map(row => 
                status === 'active' ? markAdAsActive(row._id) : markAdAsInactive(row._id)
            );
            await Promise.all(promises);

            // Update local state instantly
            const updatedIds = selectedRows.map(r => r._id);
            setListing(prev => prev.map(ad => 
                updatedIds.includes(ad._id) ? { ...ad, status: status } : ad
            ));

            toast.success(`Ads marked as ${status} successfully!`, { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status for some ads.", { id: toastId });
        }
    };

    return (
        <div>
            <DataTable 
                columns={buySellListing_columns} 
                data={listing} 
                onBulkDelete={handleBulkDelete}
                onBulkStatusChange={handleBulkStatusChange}
            />
        </div>
    );
}