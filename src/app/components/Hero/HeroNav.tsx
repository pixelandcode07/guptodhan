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



export default function HeroNav() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        {navigationData.map((heading) => (
          <NavigationMenuItem key={heading.title}>
            <NavigationMenuTrigger>{heading.title}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-[300px]">
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
      </NavigationMenuList>
    </NavigationMenu>
  )
}
