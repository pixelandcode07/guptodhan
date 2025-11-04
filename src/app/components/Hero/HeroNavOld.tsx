// 'use client';

// import React, { useState } from 'react';
// import Link from 'next/link';
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from '@/components/ui/navigation-menu';
// import {
//   Accordion,
//   AccordionItem,
//   AccordionTrigger,
//   AccordionContent,
// } from '@/components/ui/accordion';
// import { Menu, X, ChevronDown } from 'lucide-react';
// import { MainCategory } from '@/types/navigation-menu';
// import { Button } from '@/components/ui/button';

// interface HeroNavProps {
//   categories: MainCategory[];
// }

// export default function HeroNav({ categories }: HeroNavProps) {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const visibleCategories = categories.slice(0, 7);
//   const moreCategories = categories.slice(7);

//   return (
//     <nav className="bg-[#000066] text-white relative z-50">
//       <div className="container mx-auto px-4 py-2 flex justify-between items-center">
//         {/* Logo or Title */}
//         {/* <div className="text-lg font-semibold">ShopPortal</div> */}

//         {/* 🔹 Mobile Menu Button */}
//         <button
//           className="md:hidden text-white"
//           onClick={() => setMobileOpen(!mobileOpen)}
//           aria-label="Toggle menu"
//         >
//           {mobileOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>

//         {/* 🔹 Desktop Navigation Menu */}
//         <div className="hidden md:block">
//           <NavigationMenu>
//             <NavigationMenuList>
//               {visibleCategories.map((main) => (
//                 <NavigationMenuItem key={main.mainCategoryId}>
//                   <NavigationMenuTrigger className="text-white hover:bg-[#000080] transition-all">
//                     {main.name}
//                   </NavigationMenuTrigger>

//                   {main.subCategories.length > 0 && (
//                     <NavigationMenuContent className="p-4 w-[300px] bg-white text-black rounded-md shadow-lg">
//                       <ul>
//                         {main.subCategories.map((sub) => (
//                           <li key={sub.subCategoryId} className="group relative">
//                             <Link
//                               href={`/category/${main.mainCategoryId}/${sub.subCategoryId}`}
//                               className="block px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
//                             >
//                               {sub.name}
//                             </Link>

//                             {/* 🧩 Child categories */}
//                             {sub.children.length > 0 && (
//                               <ul className="absolute top-0 left-full mt-0 ml-2 bg-white border rounded-md shadow-lg invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all z-50 w-[220px]">
//                                 {sub.children.map((child) => (
//                                   <li key={child.childCategoryId}>
//                                     <Link
//                                       href={`/category/${main.mainCategoryId}/${sub.subCategoryId}/${child.childCategoryId}`}
//                                       className="block px-3 py-2 hover:bg-gray-100 text-sm"
//                                     >
//                                       {child.name}
//                                     </Link>
//                                   </li>
//                                 ))}
//                               </ul>
//                             )}
//                           </li>
//                         ))}
//                       </ul>
//                     </NavigationMenuContent>
//                   )}
//                 </NavigationMenuItem>
//               ))}

//               {/* 🔹 More Dropdown */}
//               {moreCategories.length > 0 && (
//                 <NavigationMenuItem>
//                   <NavigationMenuTrigger className="text-white hover:bg-[#000080] flex items-center">
//                     More
//                   </NavigationMenuTrigger>
//                   <NavigationMenuContent className="p-4 w-[250px] bg-white text-black rounded-md shadow-lg">
//                     <ul>
//                       {moreCategories.map((cat) => (
//                         <li key={cat.mainCategoryId}>
//                           <Link
//                             href={`/category/${cat.mainCategoryId}`}
//                             className="block px-3 py-2 rounded-md hover:bg-gray-100"
//                           >
//                             {cat.name}
//                           </Link>
//                         </li>
//                       ))}
//                     </ul>
//                   </NavigationMenuContent>
//                 </NavigationMenuItem>
//               )}
//             </NavigationMenuList>
//           </NavigationMenu>
//         </div>

//         {/* 🔹 Right Buttons (Desktop Only) */}
//         <div className="hidden md:flex h-full space-x-2">
//           <Button className="rounded-none h-full" variant="HomeBuy" size="xxl">
//             Buy & Sell
//           </Button>
//           <Button className="rounded-none h-full" variant="HomeDoante" size="xxl">
//             Donate
//           </Button>
//         </div>
//       </div>

//       {/* 🔹 Mobile Menu (Accordion) */}
//       {mobileOpen && (
//         <div className="md:hidden bg-white text-black p-4 shadow-lg absolute w-full left-0 top-full z-50">
//           <Accordion type="single" collapsible>
//             {categories.map((main) => (
//               <AccordionItem key={main.mainCategoryId} value={main.mainCategoryId}>
//                 <AccordionTrigger className="font-semibold text-[#000066]">
//                   {main.name}
//                 </AccordionTrigger>
//                 <AccordionContent>
//                   {main.subCategories.length > 0 ? (
//                     <ul className="pl-4 space-y-1">
//                       {main.subCategories.map((sub) => (
//                         <li key={sub.subCategoryId}>
//                           <Accordion type="single" collapsible>
//                             <AccordionItem value={sub.subCategoryId}>
//                               <AccordionTrigger className="text-sm font-medium text-gray-700">
//                                 {sub.name}
//                               </AccordionTrigger>
//                               <AccordionContent>
//                                 <ul className="pl-4 space-y-1">
//                                   {sub.children.length > 0 ? (
//                                     sub.children.map((child) => (
//                                       <li key={child.childCategoryId}>
//                                         <Link
//                                           href={`/category/${main.mainCategoryId}/${sub.subCategoryId}/${child.childCategoryId}`}
//                                           className="text-sm text-gray-600 hover:text-[#000066]"
//                                         >
//                                           {child.name}
//                                         </Link>
//                                       </li>
//                                     ))
//                                   ) : (
//                                     <li>
//                                       <Link
//                                         href={`/category/${main.mainCategoryId}/${sub.subCategoryId}`}
//                                         className="text-sm text-gray-600 hover:text-[#000066]"
//                                       >
//                                         {sub.name}
//                                       </Link>
//                                     </li>
//                                   )}
//                                 </ul>
//                               </AccordionContent>
//                             </AccordionItem>
//                           </Accordion>
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <Link
//                       href={`/category/${main.mainCategoryId}`}
//                       className="block text-sm text-gray-700 hover:text-[#000066]"
//                     >
//                       {main.name}
//                     </Link>
//                   )}
//                 </AccordionContent>
//               </AccordionItem>
//             ))}
//           </Accordion>
//         </div>
//       )}
//     </nav>
//   );
// }


'use client'

import * as React from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { MainCategory } from "@/types/navigation-menu"

interface HeroNavProps {
  categories: MainCategory[]
}

export default function HeroNav({ categories }: HeroNavProps) {
  const [showAll, setShowAll] = React.useState(false)
  const visibleCategories = showAll ? categories : categories.slice(0, 7)

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex flex-wrap">
        {visibleCategories.map((main) => (
          <NavigationMenuItem key={main.mainCategoryId}>
            <NavigationMenuTrigger>{main.name}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-2 sm:w-[300px] md:w-[400px] lg:w-[500px]">
                {main.subCategories.map((sub) => (
                  <li key={sub.subCategoryId}>
                    <NavigationMenuTrigger className="text-sm font-medium">
                      {sub.name}
                    </NavigationMenuTrigger>
                    {sub.children.length > 0 && (
                      <NavigationMenuContent>
                        <ul className="grid gap-1 w-[250px]">
                          {sub.children.map((child) => (
                            <li key={child.childCategoryId}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={`/category/${main.mainCategoryId}/${sub.subCategoryId}/${child.childCategoryId}`}
                                  className="text-sm"
                                >
                                  {child.name}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    )}
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}

        {/* More Button */}
        {categories.length > 7 && !showAll && (
          <NavigationMenuItem>
            <NavigationMenuTrigger onClick={() => setShowAll(true)}>
              More
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-2 sm:w-[300px] md:w-[400px] lg:w-[500px]">
                {categories.slice(7).map((main) => (
                  <li key={main.mainCategoryId}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/category/${main.mainCategoryId}`}
                        className="text-sm font-medium"
                      >
                        {main.name}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
