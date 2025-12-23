
// 'use client';
// import { VendorProvider } from '@/contexts/VendorContext';
// import { usePathname } from 'next/navigation';
// import { ReactNode } from 'react';
// import VendorLayoutWrapper from './VendorLayoutWrapper';
// import LayoutWrapper from './LayoutWrapper';

// export default function PathnameDetector({ children }: { children: ReactNode }) {
//     const pathname = usePathname() ?? '';

//     // List of vendor routes (without /vendor prefix due to route group)
//     const vendorRoutes = [
//         '/dashboard',
//         '/products/all',
//         '/products/add',
//         '/orders',
//         '/reviews',
//         '/withdrawal/request',
//         '/withdrawal/history',
//         '/store',
//         '/edit/product/',
//     ];

//     // Check if it's a vendor route, but exclude public store detail pages (/store/[id])
//     const isVendorRoute = vendorRoutes.some(route => {
//         if (route === '/store') {
//             if (pathname === '/store') return true;
//             if (pathname.startsWith('/store/')) {
//                 const afterStore = pathname.substring('/store/'.length);
//                 const firstSegment = afterStore.split('/')[0];
//                 const isObjectId = /^[0-9a-fA-F]{24}$/.test(firstSegment);
//                 return !isObjectId; // If it's a MongoDB ObjectId → public store detail page (not vendor)
//             }
//             return false;
//         }

//         // For other routes, including '/edit/product'
//         return pathname === route || pathname.startsWith(route + '/');
//     });

//     return (
//         <VendorProvider isVendorRoute={isVendorRoute}>
//             {isVendorRoute ? (
//                 // Vendor routes: No HomeNavbar/Footer
//                 <VendorLayoutWrapper>{children}</VendorLayoutWrapper>
//             ) : (
//                 // Public routes: With HomeNavbar/Footer
//                 <LayoutWrapper>{children}</LayoutWrapper>
//             )}
//         </VendorProvider>
//     );
// }


'use client';
import { VendorProvider } from '@/contexts/VendorContext';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import VendorLayoutWrapper from './VendorLayoutWrapper';
import LayoutWrapper from './LayoutWrapper';

export default function PathnameDetector({ children }: { children: ReactNode }) {
    const pathname = usePathname() ?? '';

    // All vendor dashboard/admin routes (including dynamic ones like /edit/product/[id])
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