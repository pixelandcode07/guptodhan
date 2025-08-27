"use client"


import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    // DropdownMenuLabel,
    // DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, KeySquare, LogOut } from "lucide-react"

type Checked = DropdownMenuCheckboxItemProps["checked"]

export function NavProfile() {
    // const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
    // const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
    // const [showPanel, setShowPanel] = React.useState<Checked>(false)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    {/* Avatar */}
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {/* Avatar */}
                    {/* User Name */}
                    <span className="ml-2 text-sm font-medium">Yeamin Matbor</span> <ChevronDown />
                    {/* User Name */}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                {/* <DropdownMenuLabel></DropdownMenuLabel> */}
                {/* <DropdownMenuSeparator /> */}
                <DropdownMenuCheckboxItem
                // checked={showStatusBar}
                // onCheckedChange={setShowStatusBar}
                >
                    <KeySquare /> Change Password
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                // checked={showStatusBar}
                // onCheckedChange={setShowStatusBar}
                >
                    <LogOut /> Logout
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
