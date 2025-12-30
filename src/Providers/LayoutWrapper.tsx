'use client';

import HomeFooter from "@/app/components/SharedRoutes/HomeFooter";
import HomeNavbar from "@/app/components/SharedRoutes/HomeNavbar";
import { usePathname } from "next/navigation";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import CartModalProvider from "@/components/CartModalProvider";
import { NotFoundProvider, useNotFound } from "@/contexts/NotFoundContext";
import { useVendor } from "@/contexts/VendorContext";
import { ReactNode } from 'react';

function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? '';
  const { isNotFound } = useNotFound();
  const { isVendorRoute } = useVendor();

  const hideNavAndFoot =
    isNotFound ||
    isVendorRoute ||
    pathname.startsWith('/general') ||
    pathname.startsWith('/join-as-vendor') ||
    pathname.startsWith('/vendor-singin') ||
    pathname.startsWith('/vendor/forgot-password') ||
    pathname.startsWith('/vendor-singup') ||
    pathname.startsWith('/home/chat') ||
    pathname.startsWith('/service/register') ||
    pathname.startsWith('/service/login');


  return (
    <>
      {!hideNavAndFoot && <HomeNavbar />}
      {children}
      {!hideNavAndFoot && <HomeFooter />}
      <CartModalProvider />
    </>
  );
}

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <NotFoundProvider>
          <LayoutContent>{children}</LayoutContent>
        </NotFoundProvider>
      </WishlistProvider>
    </CartProvider>
  );
}