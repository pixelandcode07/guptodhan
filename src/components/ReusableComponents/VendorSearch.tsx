'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

export default function VendorSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    // Debounce লজিক: ইউজার টাইপ করা শেষ করার ৫০০ মিলি-সেকেন্ড পর সার্চ হবে
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            
            if (searchTerm.trim() !== '') {
                params.set('search', searchTerm);
            } else {
                params.delete('search');
            }
            
            params.set('page', '1'); // নতুন সার্চ করলে পেজ ১-এ চলে যাবে
            router.push(`?${params.toString()}`);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, router, searchParams]);

    return (
        <div className="relative max-w-md w-full mx-auto md:mx-0 mb-8 mt-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
                type="text"
                placeholder="Search vendor stores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-6 border-[#0097E9]/20 focus-visible:ring-[#0097E9] rounded-xl shadow-sm text-base bg-white"
            />
        </div>
    );
}