'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import OrdersStats from './sections/OrdersStats';
import OrdersFilters from './sections/OrdersFilters';
import OrdersToolbar from './sections/OrdersToolbar';
import OrdersTable from './sections/OrdersTable';


export default function OrdersPage() {
    const [showStats, setShowStats] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="m-5 md:m-10 space-y-5">
            <section className="border border-[#e4e7eb] rounded-xs">
                <header className="flex items-center justify-between p-3 border-b border-[#e4e7eb]">
                    <p className="text-sm">Total Order Statistics</p>
                    <button onClick={() => setShowStats(s => !s)} className="p-1">
                        {showStats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </header>
                {showStats && (
                    <div className="p-4">
                        <OrdersStats />
                    </div>
                )}
            </section>

            <section className="border border-[#e4e7eb] rounded-xs">
                <header className="flex items-center justify-between p-3 border-b border-[#e4e7eb]">
                    <p className="text-sm">Advanced Filters for Orders</p>
                    <button onClick={() => setShowFilters(s => !s)} className="p-1">
                        {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </header>
                {showFilters && (
                    <div className="p-4">
                        <OrdersFilters />
                    </div>
                )}
            </section>

            <OrdersToolbar />
            <OrdersTable />
        </div>
    );
}


