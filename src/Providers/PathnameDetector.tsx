
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

    // Check if it's a vendor route, but exclude public store detail pages (/store/[id])
    const isVendorRoute = vendorRoutes.some(route => {
        if (route === '/store') {
            // Only treat /store (exact) or /store/ (with sub-routes that aren't IDs) as vendor routes
            // Public store pages are /store/[id] where id is a MongoDB ObjectId (24 hex chars)
            if (pathname === '/store') return true;
            if (pathname.startsWith('/store/')) {
                const afterStore = pathname.substring('/store/'.length);
                // If it looks like an ObjectId (24 hex characters), it's a public store page
                const isObjectId = /^[0-9a-fA-F]{24}$/.test(afterStore.split('/')[0]);
                return !isObjectId; // If it's an ObjectId, it's NOT a vendor route
            }
            return false;
        }
        return pathname === route || pathname.startsWith(route + '/');
    });

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