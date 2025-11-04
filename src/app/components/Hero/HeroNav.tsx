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
import { useState } from "react"

interface HeroNavProps {
    categories: MainCategory[];
}

export function HeroNav({ categories }: HeroNavProps) {
    const isMobile = useIsMobile()

    const [showAll, setShowAll] = useState(false)
    const visibleCategories = showAll ? categories : categories.slice(0, 7)

    return (
        <NavigationMenu viewport={isMobile}>
            <div className="flex justify-between items-center lg:gap-24 xl:gap-52">
                <div>
                    <NavigationMenuList className="">
                        {
                            visibleCategories.map((main) => (
                                <NavigationMenuItem className="hidden md:block" key={main?.mainCategoryId}>
                                    <NavigationMenuTrigger>{main?.name}</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[200px] gap-4">
                                            <li>
                                                {
                                                    main?.subCategories?.map((sub) => (
                                                        <NavigationMenuLink asChild key={sub?.subCategoryId}>
                                                            <Link
                                                                href={`/category/${main?.mainCategoryId}/${sub?.subCategoryId}`}
                                                                className="text-sm font-medium">
                                                                {sub?.name}
                                                            </Link>
                                                            
                                                        </NavigationMenuLink>
                                                    ))
                                                }

                                            </li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            ))
                        }
                        {/* More Button */}
                        {categories.length > 7 && !showAll && (
                            <NavigationMenuItem className="hidden md:block">
                                <NavigationMenuTrigger onClick={() => setShowAll(true)}>
                                    More
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[200px] gap-4">
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
                </div>
                <div className="flex h-full space-x-2">
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


