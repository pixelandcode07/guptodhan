// "use client";

// import { DataTable } from "@/components/TableHelper/data-table";
// import { view_buy_sell_columns } from "@/components/TableHelper/view_buy_sell_columns";
// import axios from "axios";
// import { useSession } from "next-auth/react";
// import { toast } from "sonner";
// // import { CategoriesTableProps } from "../page";

// interface Category {
//     name: string;
//     icon: string;
//     slug: string;
//     status: "pending" | "active" | "inactive";
// }

// interface CategoriesTableProps {
//     data: Category[];
// }

// export default function CategoriesTable({ data }: CategoriesTableProps) {
//     const { data: session } = useSession();
//     const token = session?.accessToken;
//     const adminRole = session?.user?.role === 'admin'
//     // Delete method (client-side)
//     const handleDelete = async (_id: string) => {
//         toast("Are you sure you want to delete this item?", {
//             description: "This action cannot be undone.",
//             action: {
//                 label: "Delete",
//                 onClick: async () => {
//                     try {
//                         await axios.delete(`/api/v1/classifieds-categories/${_id}`, {
//                             headers: {
//                                 "Content-Type": "multipart/form-data",
//                                 Authorization: `Bearer ${token}`,
//                                 "x-user-role": adminRole,
//                             },
//                         })

//                         toast.success("Deleted successfully!")
//                         window.location.reload()
//                     } catch (error) {
//                         console.error(error)
//                         toast.error("Delete failed!")
//                     }
//                 },
//             },
//             cancel: {
//                 label: "Cancel",
//                 onClick: () => {
//                     toast.info("Delete cancelled")
//                 },
//             },
//         })
//     }

//     return (
//         <>
//             {/* <DataTable columns={view_buy_sell_columns} data={data} /> */}
//             <DataTable
//                 columns={view_buy_sell_columns(handleDelete)}
//                 data={data}
//                 rearrangePath="/general/rearrange/buy/sell/categories"
//             />
//         </>
//     );
// }
