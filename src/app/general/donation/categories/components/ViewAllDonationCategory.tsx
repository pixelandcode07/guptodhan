"use client"

import { DataTable } from "@/components/TableHelper/data-table"
import { DonationDataType, view_donation_columns } from "@/components/TableHelper/view_donation_columns"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function ViewAllDonationCategory() {
    const { data: session } = useSession()
    const token = (session?.user as { accessToken?: string; role?: string })?.accessToken
    const adminRole = (session?.user as { role?: string })?.role === "admin"
    const [categories, setCategories] = useState<DonationDataType[]>([])

    const fetchCategories = async () => {
        try {
            const res = await axios.get("/api/v1/public/donation-categories")
            setCategories(res.data.data || [])
        } catch (error) {
            console.log(error)
            toast.error("Failed to fetch categories")
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const handleDelete = async (_id: string) => {
        toast("Are you sure you want to delete this item?", {
            description: "This action cannot be undone.",
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        await axios.delete(`/api/v1/donation-categories/${_id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "x-user-role": adminRole,
                            },
                        })
                        toast.success("Deleted successfully!")
                        fetchCategories() // refresh
                    } catch {
                        toast.error("Delete failed!")
                    }
                },
            },
            cancel: {
                label: "Cancel",
                onClick: () => {
                    toast.info("Delete cancelled")
                },
            },
        })
    }

    return (
        <div className="m-5 p-5 shadow-sm border rounded-md bg-white">
            <h1 className="text-lg font-semibold border-l-2 border-blue-500 mb-5">
                <span className="pl-5">Category List</span>
            </h1>
            <DataTable
                columns={view_donation_columns(handleDelete)}
                data={categories}
                rearrangePath="/general/rearrange/buy/sell/categories"
            />
        </div>
    )
}
