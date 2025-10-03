"use client"
import * as React from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { navigationData } from "@/data/navigation_data"
import { Button } from "@/components/ui/button"
import { HandCoins, House } from "lucide-react"



export default function HeroNav() {
  return (
    <NavigationMenu viewport={false} className="">
      <NavigationMenuList className="flex ">
        {/* lg:gap-[200px] xl:gap-0 */}
        <div className="flex">
          {navigationData.map((heading) => (
            <NavigationMenuItem key={heading.title}>
              <NavigationMenuTrigger>{heading.title}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[200px]">
                  {heading.subtitles.map((sub) => (
                    <li key={sub.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={sub.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            {sub.title}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </div>
        <div>
          <NavigationMenuItem className="space-x-4">
            <Button variant={'HomeBuy'} size={'xxl'}><House size={32} />
              <Link href={'/home/buyandsell'}>
                Buy & Sale
              </Link>
            </Button>
            <Button variant={'HomeDoante'} size={'xxl'}><HandCoins size={32} />
              <Link href={'/home/donate'}>
                Donation
              </Link>
            </Button>
            {/* </NavigationMenuTrigger> */}
          </NavigationMenuItem>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
