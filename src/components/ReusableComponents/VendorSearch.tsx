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
        const delayDebounceFn = setTimeout(() => {
            updateSearch(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleClear = () => {
        setSearchTerm('');
        updateSearch('');
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                className={`
                    relative flex items-center
                    bg-white/95 backdrop-blur-md
                    rounded-2xl
                    transition-all duration-300 ease-out
                    ${isFocused
                        ? 'shadow-[0_0_0_2px_#0097E9,0_8px_32px_rgba(0,151,233,0.18)]'
                        : 'shadow-[0_4px_24px_rgba(0,0,93,0.10)] hover:shadow-[0_6px_32px_rgba(0,151,233,0.13)]'
                    }
                    border border-transparent
                `}
            >
                {/* Left Icon */}
                <div className="pl-5 pr-3 flex items-center pointer-events-none">
                    <Search
                        className={`w-5 h-5 transition-colors duration-200 ${isFocused ? 'text-[#0097E9]' : 'text-gray-400'}`}
                    />
                </div>

                {/* Input */}
                <input
                    type="text"
                    placeholder="Search vendor stores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="
                        flex-1 py-4 pr-2
                        bg-transparent
                        text-[#00005E] placeholder-gray-400
                        text-base font-medium
                        outline-none border-none
                        min-w-0
                    "
                />

                {/* Clear Button */}
                {searchTerm && (
                    <button
                        onClick={handleClear}
                        className="
                            mr-2 p-1.5 rounded-full
                            text-gray-400 hover:text-[#0097E9]
                            hover:bg-[#0097E9]/8
                            transition-all duration-150
                        "
                        aria-label="Clear search"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                {/* Search Button */}
                <button
                    className="
                        mr-2 px-5 py-2.5 rounded-xl
                        bg-[#0097E9] hover:bg-[#007ec5]
                        text-white text-sm font-semibold
                        transition-all duration-200
                        active:scale-95
                        whitespace-nowrap
                        hidden sm:block
                    "
                    onClick={() => updateSearch(searchTerm)}
                >
                    Search
                </button>
            </div>

            {/* Active search indicator */}
            {searchTerm && (
                <p className="mt-2 text-xs text-[#0097E9]/80 pl-1">
                    Searching for:{' '}
                    <span className="font-semibold text-[#0097E9]">"{searchTerm}"</span>
                </p>
            )}
        </div>
    );
}