'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import OrdersStats from './sections/OrdersStats';
import OrdersFilters from './sections/OrdersFilters';
import OrdersTable from './sections/OrdersTable';
import OrdersToolbar from './sections/OrdersToolbar';


export default function OrdersPage({ initialStatus }: { initialStatus?: string }) {
    const normalizedStatus = useMemo(() => initialStatus?.toLowerCase(), [initialStatus]);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [showStats, setShowStats] = useState<boolean>(true);
    const showBulkCourierEntry = normalizedStatus === 'ready-to-ship';
    const isBaseOrdersRoute = !normalizedStatus;

    return (
        <div className="m-5 md:m-10 space-y-5">
            {isBaseOrdersRoute && (
                <section className="border border-[#e4e7eb] rounded-xs">
                    <header className="flex items-center justify-between p-3 border-b border-[#e4e7eb]">
                        <p className="text-sm">Total Order Statistics</p>
                        <button onClick={() => setShowStats(s => !s)} className="p-1" aria-label={showStats ? 'Hide statistics' : 'Show statistics'}>
                            {showStats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </header>
                    {showStats && (
                        <div className="p-4">
                            <OrdersStats />
                        </div>
                    )}
                </section>
            )}
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
            <OrdersToolbar initialStatus={normalizedStatus} showBulkCourierEntry={showBulkCourierEntry} />
            <OrdersTable initialStatus={normalizedStatus} />
        </div>
    );
}


