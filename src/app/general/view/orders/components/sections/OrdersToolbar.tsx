import TableListToolbar from '@/components/TableHelper/TableListToolbar'

export default function OrdersToolbar({ initialStatus, showBulkCourierEntry = false }: { initialStatus?: string, showBulkCourierEntry?: boolean }) {
    const normalized = (initialStatus || '').toLowerCase().replace(/\s+/g, '-');
    const statusOptions = ["Select Status", "Pending", "Approved", "Ready to Ship", "In Transit", "Delivered", "Cancelled"];
    const labelFromSlug = (slug: string) => {
        switch (slug) {
            case 'ready-to-ship': return 'Ready to Ship';
            case 'in-transit': return 'In Transit';
            default: return slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Select Status';
        }
    }
    const selectedLabel = normalized ? labelFromSlug(normalized) : 'Select Status';

    return (
        <div className="rounded-lg border border-[#e4e7eb] bg-white shadow-sm">
            <div className="px-3 py-2 md:px-4 md:py-3">
                <TableListToolbar
                    title={`All Orders`}
                    statusOptions={statusOptions}
                    selectedStatus={selectedLabel}
                    pageSizeOptions={[20, 50, 100]}
                    onBulkCourierEntryClick={showBulkCourierEntry ? () => {} : undefined}
                />
            </div>
        </div>
    )
}


