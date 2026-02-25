'use client';

import React, { useState, useEffect } from 'react'
import NavHead from './components/NavHead'
import NavMain from './components/NavMain'
import { usePathname } from "next/navigation";
import BuySellNavMain from './components/BuySellNavMain';
import DonationNavMain from './components/DonationNavMain';
import ServiceNavMain from '@/app/home/(service)/components/ServiceNavMain';

export default function HomeNavbar() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isBuyAndSell = pathname?.startsWith("/buy-sell");
    const isDonation = pathname?.startsWith("/donation");
    const isService = pathname?.startsWith("/home/service");

    if (!mounted) return null;

    return (
        // <div className='container mx-auto'>
        <div className=''>
            {/* <NavHead /> */}
            {isBuyAndSell ? <BuySellNavMain /> : isDonation ? <DonationNavMain /> : isService ? <ServiceNavMain /> : <NavMain />}
        </div>
    )
}