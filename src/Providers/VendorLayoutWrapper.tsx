'use client';

import { NotFoundProvider } from "@/contexts/NotFoundContext";
import { ReactNode } from 'react';

export default function VendorLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <NotFoundProvider>
      {children}
    </NotFoundProvider>
  );
}