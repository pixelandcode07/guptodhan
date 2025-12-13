import React from 'react'
import NavHead from './components/NavHead'
import NavMain from './components/NavMain'
import { usePathname } from "next/navigation";
import BuySellNavMain from './components/BuySellNavMain';
import DonationNavMain from './components/DonationNavMain';

export default function HomeNavbar() {
    const pathname = usePathname();

    const isBuyAndSell = pathname?.startsWith("/home/buyandsell");
    const isDonation = pathname?.startsWith("/home/donation");
    return (
        <div>
            <NavHead />
            {isBuyAndSell ? <BuySellNavMain /> : isDonation ? <DonationNavMain /> : <NavMain />}
        </div>
    )
}
