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
        <div className="mx-3 my-4 md:mx-6 md:my-8 space-y-4 md:space-y-6">
            {isBaseOrdersRoute && (
                <section className="rounded-lg border border-[#e4e7eb] bg-white/60 backdrop-blur-sm shadow-sm">
                    <header className="flex items-center justify-between px-3 py-2 md:px-4 md:py-3 border-b border-[#e4e7eb]">
                        <p className="text-sm font-medium text-gray-800">Total Order Statistics</p>
                        <button onClick={() => setShowStats(s => !s)} className="p-1.5 rounded hover:bg-gray-100 active:bg-gray-200 transition" aria-label={showStats ? 'Hide statistics' : 'Show statistics'}>
                            {showStats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </header>
                    {showStats && (
                        <div className="px-3 py-3 md:px-4 md:py-4">
                            <OrdersStats />
                        </div>
                    )}
                </section>
            )}
            <section className="rounded-lg border border-[#e4e7eb] bg-white/60 backdrop-blur-sm shadow-sm">
                <header className="flex items-center justify-between px-3 py-2 md:px-4 md:py-3 border-b border-[#e4e7eb]">
                    <p className="text-sm font-medium text-gray-800">Advanced Filters{normalizedStatus ? ` • ${normalizedStatus}` : ''}</p>
                    <button onClick={() => setShowFilters(s => !s)} className="p-1.5 rounded hover:bg-gray-100 active:bg-gray-200 transition" aria-label={showFilters ? 'Hide filters' : 'Show filters'}>
                        {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </header>
                {showFilters && (
                    <div className="px-3 py-3 md:px-4 md:py-4">
                        <OrdersFilters />
                    </div>
                )}
            </section>
            <div className="sticky top-0 z-10 -mx-3 md:mx-0 bg-gradient-to-b from-white/90 to-white/40 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="px-3 md:px-0 pt-2 md:pt-0">
                    <OrdersToolbar initialStatus={normalizedStatus} showBulkCourierEntry={showBulkCourierEntry} />
                </div>
            </div>
            <div className="rounded-lg border border-[#e4e7eb] bg-white shadow-sm">
                <OrdersTable initialStatus={normalizedStatus} />
            </div>
        </div>
    );
}


