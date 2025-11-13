'use client';

import HomeFooter from "@/app/components/SharedRoutes/HomeFooter";
import HomeNavbar from "@/app/components/SharedRoutes/HomeNavbar"
import { usePathname } from "next/navigation"
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import CartModalProvider from "@/components/CartModalProvider";

import { ReactNode } from 'react';

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNavAndFoot =
    pathname ?
      pathname.startsWith('/general') ||
      pathname.startsWith('/vendorSingIn') ||
      pathname.startsWith('/vendorSingUp') : false;
  return (
    <CartProvider>
      <WishlistProvider>
        {!hideNavAndFoot && <HomeNavbar />}
        {children}
        {!hideNavAndFoot && <HomeFooter />}
        <CartModalProvider />
      </WishlistProvider>
    </CartProvider>
  );
}
