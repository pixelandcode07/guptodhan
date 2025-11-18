
'use client';
import { VendorProvider } from '@/contexts/VendorContext';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import VendorLayoutWrapper from './VendorLayoutWrapper';
import LayoutWrapper from './LayoutWrapper';

export default function PathnameDetector({ children }: { children: ReactNode }) {
    const pathname = usePathname() ?? '';

    // List of vendor routes (without /vendor prefix due to route group)
    const vendorRoutes = [
        '/dashboard',
        '/products/all',
        '/products/add',
        '/orders',
        '/reviews',
        '/withdrawal/request',
        '/withdrawal/history',
        '/store',
    ];

    const isVendorRoute = vendorRoutes.some(route =>
        pathname === route || pathname.startsWith(route + '/')
    );

    return (
        <VendorProvider isVendorRoute={isVendorRoute}>
            {isVendorRoute ? (
                // Vendor routes: No HomeNavbar/Footer
                <VendorLayoutWrapper>{children}</VendorLayoutWrapper>
            ) : (
                // Public routes: With HomeNavbar/Footer
                <LayoutWrapper>{children}</LayoutWrapper>
            )}
        </VendorProvider>
    );
}