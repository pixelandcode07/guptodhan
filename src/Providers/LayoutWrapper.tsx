// 'use client';

// import HomeFooter from "@/app/components/SharedRoutes/HomeFooter";
// import HomeNavbar from "@/app/components/SharedRoutes/HomeNavbar";
// import { usePathname } from "next/navigation";
// import { CartProvider } from "@/contexts/CartContext";
// import { WishlistProvider } from "@/contexts/WishlistContext";
// import CartModalProvider from "@/components/CartModalProvider";
// import { NotFoundProvider, useNotFound } from "@/contexts/NotFoundContext";
// import { ReactNode } from 'react';
// import { useVendor } from "@/contexts/VendorContext";

// function LayoutContent({ children }: { children: ReactNode }) {
//   const pathname = usePathname() ?? '';
//   const { isNotFound } = useNotFound();
//   const { isVendorRoute } = useVendor();

//   // Hide Navbar & Footer when notFound or specific paths
//   const hideNavAndFoot =
//     isNotFound ||
//     // isVendorRoute ||
//     pathname.startsWith('/general') ||
//     pathname.startsWith('/vendorSingIn') ||
//     pathname.startsWith('/vendorSingUp');

//   return (
//     <>
//       {!hideNavAndFoot && <HomeNavbar />}
//       {children}
//       {!hideNavAndFoot && <HomeFooter />}
//       <CartModalProvider />
//     </>
//   );
// }

// export default function LayoutWrapper({ children }: { children: ReactNode }) {
//   return (
//     <CartProvider>
//       <WishlistProvider>
//         <NotFoundProvider>
//           <LayoutContent>{children}</LayoutContent>
//         </NotFoundProvider>
//       </WishlistProvider>
//     </CartProvider>
//   );
// }


// 'use client';

// import HomeFooter from "@/app/components/SharedRoutes/HomeFooter";
// import HomeNavbar from "@/app/components/SharedRoutes/HomeNavbar";
// import { usePathname } from "next/navigation";
// import { CartProvider } from "@/contexts/CartContext";
// import { WishlistProvider } from "@/contexts/WishlistContext";
// import CartModalProvider from "@/components/CartModalProvider";
// import { NotFoundProvider, useNotFound } from "@/contexts/NotFoundContext";
// import { useVendor } from "@/contexts/VendorContext";
// import { ReactNode } from 'react';

// function LayoutContent({ children }: { children: ReactNode }) {
//   const pathname = usePathname() ?? '';
//   const { isNotFound } = useNotFound();
//   const { isVendorRoute } = useVendor();

//   const hideNavAndFoot =
//     isNotFound ||
//     isVendorRoute || // Vendor route এ গেলে লুকাবে
//     pathname.startsWith('/general') ||
//     pathname.startsWith('/vendorSingIn') ||
//     pathname.startsWith('/vendorSingUp');

//   return (
//     <>
//       {!hideNavAndFoot && <HomeNavbar />}
//       {children}
//       {!hideNavAndFoot && <HomeFooter />}
//       <CartModalProvider />
//     </>
//   );
// }

// export default function LayoutWrapper({ children }: { children: ReactNode }) {
//   return (
//     <CartProvider>
//       <WishlistProvider>
//         <NotFoundProvider>
//           <LayoutContent>{children}</LayoutContent>
//         </NotFoundProvider>
//       </WishlistProvider>
//     </CartProvider>
//   );
// }

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
    pathname.startsWith('/vendorSingIn') ||
    pathname.startsWith('/vendorSingUp');

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