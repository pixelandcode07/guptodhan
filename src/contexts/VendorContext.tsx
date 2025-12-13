'use client';

import { createContext, useContext, ReactNode } from 'react';

interface VendorContextType {
    isVendorRoute: boolean;
}

const VendorContext = createContext<VendorContextType>({ isVendorRoute: false });

export function VendorProvider({ children, isVendorRoute }: { children: ReactNode; isVendorRoute: boolean }) {
    return (
        <VendorContext.Provider value={{ isVendorRoute }}>
            {children}
        </VendorContext.Provider>
    );
}

export function useVendor() {
    return useContext(VendorContext);
}