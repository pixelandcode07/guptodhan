'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

export default function VendorSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [isFocused, setIsFocused] = useState(false);

    const updateSearch = useCallback(
        (value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value.trim() !== '') {
                params.set('search', value.trim());
            } else {
                params.delete('search');
            }
            params.set('page', '1');
            router.push(`?${params.toString()}`);
        },
        [router, searchParams]
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            updateSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleClear = () => {
        setSearchTerm('');
        updateSearch('');
    };

    return (
        <div className="w-full">
            <div
                className={`
                    relative flex items-center h-11
                    bg-white rounded-xl
                    border transition-all duration-200
                    ${isFocused
                        ? 'border-[#0097E9] shadow-[0_0_0_3px_rgba(0,151,233,0.12)]'
                        : 'border-gray-200 shadow-sm hover:border-[#0097E9]/50'
                    }
                `}
            >
                {/* Search Icon */}
                <Search
                    className={`absolute left-3 w-4 h-4 pointer-events-none transition-colors duration-200 ${
                        isFocused ? 'text-[#0097E9]' : 'text-gray-400'
                    }`}
                />

                {/* Input */}
                <input
                    type="text"
                    placeholder="Search vendor stores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="
                        w-full h-full
                        pl-9 pr-2
                        bg-transparent
                        text-sm text-[#00005E] placeholder-gray-400
                        outline-none border-none rounded-xl
                    "
                />

                {/* Clear button */}
                {searchTerm && (
                    <button
                        onClick={handleClear}
                        className="p-1 mr-1 rounded-full text-gray-400 hover:text-[#0097E9] hover:bg-[#0097E9]/10 transition-all duration-150"
                        aria-label="Clear search"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}

                {/* Search Button */}
                <button
                    onClick={() => updateSearch(searchTerm)}
                    className="
                        mr-1.5 px-4 h-8 rounded-lg shrink-0
                        bg-[#0097E9] hover:bg-[#007ec5]
                        text-white text-sm font-medium
                        transition-all duration-150 active:scale-95
                    "
                >
                    Search
                </button>
            </div>

            {/* Active search hint */}
            {searchTerm && (
                <p className="mt-1.5 text-xs text-[#0097E9] pl-0.5">
                    Showing results for{' '}
                    <span className="font-semibold">"{searchTerm}"</span>
                </p>
            )}
        </div>
    );
}