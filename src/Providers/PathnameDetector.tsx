'use client';
import { VendorProvider } from '@/contexts/VendorContext';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import VendorLayoutWrapper from './VendorLayoutWrapper';
import LayoutWrapper from './LayoutWrapper';

export default function PathnameDetector({ children }: { children: ReactNode }) {
    const pathname = usePathname() ?? '';
    const vendorRoutes = [
        '/dashboard',
        '/products/all',
        '/products/add',
        '/orders',
        '/reviews',
        '/withdrawal/request',
        '/withdrawal/history',
        '/store',
        '/edit/product',
    ];

    const isVendorRoute = vendorRoutes.some(route => {
        return pathname === route || pathname.startsWith(route + '/');
    });

    return (
        <VendorProvider isVendorRoute={isVendorRoute}>
            {isVendorRoute ? (
                // Vendor pages → No public Navbar/Footer
                <VendorLayoutWrapper>{children}</VendorLayoutWrapper>
            ) : (
                // Public pages (including /store/[id] public store detail) → With Navbar/Footer
                <LayoutWrapper>{children}</LayoutWrapper>
            )}
        </VendorProvider>
    );
}