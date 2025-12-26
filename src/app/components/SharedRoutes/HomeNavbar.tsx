'use client';

import React, { useState, useEffect } from 'react'
import NavHead from './components/NavHead'
import NavMain from './components/NavMain'
import { usePathname } from "next/navigation";
import BuySellNavMain from './components/BuySellNavMain';
import DonationNavMain from './components/DonationNavMain';

export default function HomeNavbar() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isBuyAndSell = pathname?.startsWith("/home/buyandsell");
    const isDonation = pathname?.startsWith("/home/donation");

    // যদি মাউন্ট না হয় তবে কিছুই রেন্ডার করবে না (হাইড্রেসন এরর থেকে বাঁচতে)
    if (!mounted) return null;

    return (
        <div className='container mx-auto'>
            <NavHead />
            {isBuyAndSell ? <BuySellNavMain /> : isDonation ? <DonationNavMain /> : <NavMain />}
        </div>
    )
}