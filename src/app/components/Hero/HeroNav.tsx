// "use client"

// import Link from "next/link"

// import { useIsMobile } from "@/hooks/use-mobile"
// import {
//     NavigationMenu,
//     NavigationMenuContent,
//     NavigationMenuItem,
//     NavigationMenuLink,
//     NavigationMenuList,
//     NavigationMenuTrigger,
// } from "@/components/ui/navigation-menu"
// import { Button } from "@/components/ui/button"
// import { HandCoins, House } from "lucide-react"
// import { MainCategory } from "@/types/navigation-menu"
// import { useState } from "react"

// interface HeroNavProps {
//     categories: MainCategory[];
// }

// export function HeroNav({ categories }: HeroNavProps) {
//     const isMobile = useIsMobile()

//     const [showAll, setShowAll] = useState(false)
//     const visibleCategories = showAll ? categories : categories.slice(0, 7)

//     return (
//         <NavigationMenu viewport={isMobile}>
//             <div className="flex justify-between items-center lg:gap-7 xl:gap-36">
//                 <div>
//                     <NavigationMenuList className="">
//                         {
//                             visibleCategories.map((main) => (
//                                 <NavigationMenuItem className="hidden md:block" key={main?.mainCategoryId}>
//                                     <NavigationMenuTrigger>{main?.name}</NavigationMenuTrigger>
//                                     <NavigationMenuContent>
//                                         <ul className="grid w-[200px] gap-4">
//                                             <li>
//                                                 {
//                                                     main?.subCategories?.map((sub) => (
//                                                         <NavigationMenuLink asChild key={sub?.subCategoryId}>
//                                                             <Link
//                                                                 href={`/category/${main?.mainCategoryId}/${sub?.subCategoryId}`}
//                                                                 className="text-sm font-medium">
//                                                                 {sub?.name}
//                                                             </Link>
                                                            
//                                                         </NavigationMenuLink>
//                                                     ))
//                                                 }

//                                             </li>
//                                         </ul>
//                                     </NavigationMenuContent>
//                                 </NavigationMenuItem>
//                             ))
//                         }
//                         {/* More Button */}
//                         {categories.length > 7 && !showAll && (
//                             <NavigationMenuItem className="hidden md:block">
//                                 <NavigationMenuTrigger >
//                                     More
//                                 </NavigationMenuTrigger>
//                                 <NavigationMenuContent>
//                                     <ul className="grid w-[200px] gap-4">
//                                         {categories.slice(7).map((main) => (
//                                             <li key={main.mainCategoryId}>
//                                                 <NavigationMenuLink asChild>
//                                                     <Link
//                                                         href={`/category/${main.mainCategoryId}`}
//                                                         className="text-sm font-medium"
//                                                     >
//                                                         {main.name}
//                                                     </Link>
//                                                 </NavigationMenuLink>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </NavigationMenuContent>
//                             </NavigationMenuItem>
//                         )}

//                     </NavigationMenuList>
//                 </div>
//                 <div className="flex h-full space-x-2">
//                     <Button className="rounded-none h-full" variant="HomeBuy" size="xxl">
//                         <House size={20} className="mr-2" />
//                         <Link href="/home/buyandsell">Buy & Sale</Link>
//                     </Button>
//                     <Button className="rounded-none h-full" variant="HomeDoante" size="xxl">
//                         <HandCoins size={20} className="mr-2" />
//                         <Link href="/home/donate">Donation</Link>
//                     </Button>
//                 </div>
//             </div>
//         </NavigationMenu>
//     )
// }


"use client"

import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { HandCoins, House } from "lucide-react"
import { MainCategory } from "@/types/navigation-menu"
import { useState, useEffect } from "react"

interface HeroNavProps {
    categories: MainCategory[];
}

export function HeroNav({ categories }: HeroNavProps) {
    const isMobile = useIsMobile()
    const [screenWidth, setScreenWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 0)
    const [showAll, setShowAll] = useState(false)

    // Update screen width on resize
    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth)
        }

        // Set initial width
        handleResize()

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    // Determine how many categories to show
    const getVisibleCount = () => {
        if (screenWidth < 768) return 7
        if (screenWidth < 1024) return 0 // Mobile: hide all (or handle separately)
        if (screenWidth >= 1024 && screenWidth < 1440) return 4
        return 7 // 1440px and above
    }

    const visibleCount = getVisibleCount()
    const visibleCategories = showAll ? categories : categories.slice(0, visibleCount)
    const hasMore = categories.length > visibleCount

    return (
        <NavigationMenu viewport={isMobile}>
            <div className="flex justify-between items-center lg:gap-24 xl:gap-36">
                <div>
                    <NavigationMenuList className="">
                        {/* Visible Categories */}
                        {visibleCategories.map((main) => (
                            <NavigationMenuItem className="hidden md:block" key={main?.mainCategoryId}>
                                <NavigationMenuTrigger>{main?.name}</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[200px] gap-4 p-4">
                                        {main?.subCategories?.map((sub) => (
                                            <li key={sub?.subCategoryId}>
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href={`/category/${main?.mainCategoryId}/${sub?.subCategoryId}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-sm font-medium"
                                                    >
                                                        {sub?.name}
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        ))}

                        {/* More Button - Only show if needed and not in showAll mode */}
                        {hasMore && !showAll && (
                            <NavigationMenuItem className="hidden md:block">
                                <NavigationMenuTrigger>More</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[200px] gap-4 p-4">
                                        {categories.slice(visibleCount).map((main) => (
                                            <li key={main.mainCategoryId}>
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href={`/category/${main.mainCategoryId}`}
                                                        className="block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-sm font-medium"
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
                </div>

                {/* Action Buttons */}
                <div className="hidden lg:flex h-full space-x-2">
                    <Button className="rounded-none h-full" variant="HomeBuy" size="xxl">
                        <House size={20} className="mr-2" />
                        <Link href="/home/buyandsell">Buy & Sale</Link>
                    </Button>
                    <Button className="rounded-none h-full" variant="HomeDoante" size="xxl">
                        <HandCoins size={20} className="mr-2" />
                        <Link href="/home/donate">Donation</Link>
                    </Button>
                </div>
            </div>
        </NavigationMenu>
    )
}