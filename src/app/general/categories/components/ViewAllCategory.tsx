"use client"

import { DataTable } from "@/components/TableHelper/data-table"
import { SubCategoryType, view_buy_sell_columns, ViewBuySellDataType } from "@/components/TableHelper/view_buy_sell_columns"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function ViewAllCategory() {
    const { data: session } = useSession()
    const token = (session?.user as { accessToken?: string; role?: string })?.accessToken
    const adminRole = (session?.user as { role?: string })?.role === "admin"
    const [categories, setCategories] = useState<ViewBuySellDataType[]>([])

    const fetchCategories = async () => {
        try {
            // Fetch from the endpoint that populates subCategories (includes category ID in subCategories)
            const res = await axios.get("/api/v1/public/categories-with-subcategories")
            // Ensure subCategories have 'category' field (from lookup, it should be available if projected)
            const enrichedData = (res.data.data || []).map((cat: ViewBuySellDataType) => ({
                ...cat,
                subCategories: cat.subCategories?.map((sub: SubCategoryType) => ({
                    ...sub,
                    category: cat._id // Explicitly set parent category ID in each subCategory
                })) || []
            }));
            setCategories(enrichedData)
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
                        await axios.delete(`/api/v1/classifieds-categories/${_id}`, {
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
                columns={view_buy_sell_columns(handleDelete)}
                data={categories}
                rearrangePath="/general/rearrange/buy/sell/categories"
            />
        </div>
    )
}
