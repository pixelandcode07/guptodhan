'use client';

import HomeFooter from '@/app/components/SharedRoutes/HomeFooter';
import HomeNavbar from '@/app/components/SharedRoutes/HomeNavbar';
// import Navbar from "@/app/components/(SharedNav)/Navbar/Navbar"
import { usePathname } from 'next/navigation';

import { ReactNode } from 'react';

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideNavAndFoot = pathname ? pathname.startsWith('/general') : false;
  return (
    <>
      {!hideNavAndFoot && <HomeNavbar />}
      {children}
      {!hideNavAndFoot && <HomeFooter />}
    </>
  );
}
