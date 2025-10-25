'use client';

import HomeFooter from "@/app/components/SharedRoutes/HomeFooter";
import HomeNavbar from "@/app/components/SharedRoutes/HomeNavbar"
import { usePathname } from "next/navigation"
import { CartProvider } from "@/contexts/CartContext";

import { ReactNode } from 'react';

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNavAndFoot = pathname ? pathname.startsWith('/general') : false;
  return (
    <CartProvider>
      {!hideNavAndFoot && <HomeNavbar />}
      {children}
      {!hideNavAndFoot && <HomeFooter />}
    </CartProvider>
  );
}
