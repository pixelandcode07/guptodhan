'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import OrdersFilters from './sections/OrdersFilters';
import OrdersTable from './sections/OrdersTable';


export default function OrdersPage({ initialStatus }: { initialStatus?: string }) {
    const normalizedStatus = useMemo(() => initialStatus?.toLowerCase(), [initialStatus]);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    return (
        <div className="m-5 md:m-10 space-y-5">
            <section className="border border-[#e4e7eb] rounded-xs">
                <header className="flex items-center justify-between p-3 border-b border-[#e4e7eb]">
                    <p className="text-sm">Advanced Filters for Orders{normalizedStatus ? ` • ${normalizedStatus}` : ''}</p>
                    <button onClick={() => setShowFilters(s => !s)} className="p-1" aria-label={showFilters ? 'Hide filters' : 'Show filters'}>
                        {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </header>
                {showFilters && (
                    <div className="p-4">
                        <OrdersFilters />
                    </div>
                )}
            </section>
            <OrdersTable initialStatus={normalizedStatus} />
        </div>
    );
}


