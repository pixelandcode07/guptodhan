import React from 'react'
import NavHead from './components/NavHead'
import NavMain from './components/NavMain'
import { usePathname } from "next/navigation";
import BuySellNavMain from './components/BuySellNavMain';

export default function HomeNavbar() {
    const pathname = usePathname();

    const isBuyAndSell = pathname?.startsWith("/home/buyandsell");
    return (
        <div>
            <NavHead />
            {isBuyAndSell ? <BuySellNavMain /> : <NavMain />}
        </div>
    )
}
