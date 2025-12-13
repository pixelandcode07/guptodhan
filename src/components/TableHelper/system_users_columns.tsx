"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
import Link from "next/link"

// ✅ FIX: Define the 'User' type to match your actual user data
export type User = {
  _id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  profilePicture?: string;
  role: 'user' | 'vendor' | 'service-provider' | 'admin';
  isActive: boolean;
}

// ✅ FIX: Turn the columns into a function that accepts handlers for actions
export const getSystemUsersColumns = (
    handleStatusToggle: (id: string, currentStatus: boolean) => void,
    handleDelete: (id: string) => void
): ColumnDef<User>[] => [
  {
    accessorKey: "profilePicture",
    header: "Avatar",
    cell: ({ row }) => {
      const imageUrl = row.original.profilePicture;
      const name = row.original.name;
      return (
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center relative overflow-hidden">
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={name} 
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <span className="text-xs font-bold">{name.charAt(0).toUpperCase()}</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <span className="capitalize font-medium">{row.original.role.replace('-', ' ')}</span>,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
        const user = row.original;
        return (
            <Switch
                checked={user.isActive}
                onCheckedChange={(newStatus) => handleStatusToggle(user._id, newStatus)}
            />
        )
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
        const user = row.original;
        return (
            <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    <Link href={`/general/edit/user/${user._id}`}>
                        <Edit className="w-4 h-4" />
                    </Link>
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(user._id)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        )
    }
  }
]