// "use client";

// import { cn } from "@/lib/utils";
// import { ColumnDef } from "@tanstack/react-table";
// import { Edit, Trash, CheckCircle, XCircle, MapPin, Tag } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Image from "next/image";
// import Link from "next/link";
// import { toast } from "sonner";
// import axios from "axios";
// import { confirmDelete } from "@/components/ReusableComponents/ConfirmToast";
// import { ServiceData } from "@/types/ServiceDataType";

// export const service_data_columns_user: ColumnDef<ServiceData>[] = [

//     {
//         accessorKey: "serial",
//         header: "Serial",
//         cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
//     },
//     {
//         accessorKey: "service_images",
//         header: "Image",
//         cell: ({ row }) => {
//             const images = row.getValue("service_images") as string[];
//             return (
//                 <div className="relative w-16 h-12 rounded-md overflow-hidden border bg-gray-50">
//                     <Image
//                         src={images?.[0] || "/placeholder-service.png"}
//                         alt="Service"
//                         fill
//                         className="object-cover"
//                     />
//                 </div>
//             );
//         },
//     },
//     {
//         accessorKey: "service_title",
//         header: "Service Info",
//         cell: ({ row }) => {
//             const service = row.original;
//             return (
//                 <div className="flex flex-col gap-0.5">
//                     <span className="font-semibold text-gray-900 line-clamp-1">{service.service_title}</span>
//                     <div className="flex items-center text-[10px] text-gray-500 gap-1">
//                         <Tag className="h-3 w-3" /> {service.service_category}
//                     </div>
//                 </div>
//             );
//         },
//     },
//     {
//         accessorKey: "service_area",
//         header: "Location",
//         cell: ({ row }) => {
//             const area = row.original.service_area;
//             return (
//                 <div className="flex flex-col text-xs text-gray-600">
//                     <div className="flex items-center gap-1">
//                         <MapPin className="h-3 w-3 text-red-400" />
//                         <span>{area.thana}</span>
//                     </div>
//                     <span className="pl-4 text-[10px] text-gray-400">{area.city}</span>
//                 </div>
//             );
//         },
//     },
//     {
//         accessorKey: "base_price",
//         header: "Pricing",
//         cell: ({ row }) => {
//             const service = row.original;
//             return (
//                 <div className="flex flex-col">
//                     <span className="font-bold text-primary">৳{service.base_price}</span>
//                     <span className="text-[10px] capitalize text-gray-400">{service.pricing_type}</span>
//                 </div>
//             );
//         },
//     },
//     {
//         accessorKey: "service_status",
//         header: "Status",
//         cell: ({ row }) => {
//             const status = row.getValue("service_status") as string;
//             return (
//                 <span className={cn(
//                     "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
//                     status === "Active"
//                         ? "bg-green-100 text-green-700"
//                         : status === "Under Review"
//                             ? "bg-amber-100 text-amber-700"
//                             : "bg-red-100 text-red-700"
//                 )}>
//                     {status}
//                 </span>
//             );
//         },
//     },
//     // {
//     //     id: "actions",
//     //     header: "Actions",
//     //     cell: ({ row, table }) => {
//     //         const service = row.original;
//     //         const setData = (table.options.meta as any)?.setData;

//     //         // Updated Status Logic
//     //         const handleStatusUpdate = async (action: "approve" | "reject") => {
//     //             try {
//     //                 await toast.promise(
//     //                     axios.patch(
//     //                         `/api/v1/service-section/provide-service/status/${service._id}`,
//     //                         { action }
//     //                     ),
//     //                     {
//     //                         loading: `${action === "approve" ? "Approving" : "Rejecting"} service...`,
//     //                         success: `Service ${action === "approve" ? "approved" : "rejected"} successfully`,
//     //                         error: (err) => err.response?.data?.message || "Operation failed",
//     //                     }
//     //                 );

//     //                 if (setData) {
//     //                     setData((prev: ServiceData[]) =>
//     //                         prev.map(item =>
//     //                             item._id === service._id
//     //                                 ? {
//     //                                     ...item,
//     //                                     service_status: action === "approve" ? "Active" : "Disabled",
//     //                                     is_visible_to_customers: action === "approve",
//     //                                 }
//     //                                 : item
//     //                         )
//     //                     );
//     //                 }
//     //             } catch (error) {
//     //                 console.error(error);
//     //             }
//     //         };


//     //         const handleDelete = async () => {
//     //             const confirmed = await confirmDelete(`Delete "${service.service_title}"?`);
//     //             if (!confirmed) return;
//     //             try {
//     //                 await toast.promise(
//     //                     axios.delete(`/api/v1/service-section/provide-service/${service._id}`),
//     //                     {
//     //                         loading: "Deleting...",
//     //                         success: "Deleted!",
//     //                         error: "Failed to delete",
//     //                     }
//     //                 );
//     //                 if (setData) setData((prev: ServiceData[]) => prev.filter(item => item._id !== service._id));
//     //             } catch (error) { console.error(error); }
//     //         };

//     //         return (
//     //             <div className="flex items-center gap-1.5">

//     //                 {/* Edit Link */}
//     //                 <Link href={`/dashboard/services/edit/${service._id}`}>
//     //                     <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-blue-100 text-blue-600 hover:bg-blue-50">
//     //                         <Edit className="h-4 w-4" />
//     //                     </Button>
//     //                 </Link>

//     //                 {/* Delete Button */}
//     //                 <Button
//     //                     variant="outline" size="sm"
//     //                     className="h-8 w-8 p-0 border-red-100 text-red-600 hover:bg-red-50"
//     //                     onClick={handleDelete}
//     //                 >
//     //                     <Trash className="h-4 w-4" />
//     //                 </Button>
//     //             </div>
//     //         );
//     //     },
//     // },
//     {
//         id: "actions",
//         header: "Actions",
//         cell: ({ row, table }) => {
//             const service = row.original;
//             const meta = table.options.meta as any;
//             const setData = meta?.setData;

//             // const handleDelete = async () => {
//             //     const title = service.service_title?.trim() || "this service";
//             //     const shortTitle = title.length > 35 ? title.slice(0, 32) + "..." : title;

//             //     const confirmed = await confirmDelete(`Delete "${shortTitle}"?`);

//             //     if (!confirmed) return;

//             //     try {
//             //         await toast.promise(
//             //             axios.delete(`/api/v1/service-section/provide-service/${service._id}`),
//             //             {
//             //                 loading: "Deleting service...",
//             //                 success: "Service has been deleted",
//             //                 error: (err) =>
//             //                     err.response?.data?.message ||
//             //                     "Failed to delete service. Please try again.",
//             //             }
//             //         );

//             //         // Because backend performs soft-delete → we update status in UI
//             //         if (setData) {
//             //             setData((prev: ServiceData[]) =>
//             //                 prev.map((item) =>
//             //                     item._id === service._id
//             //                         ? {
//             //                             ...item,
//             //                             service_status: "Disabled",
//             //                             is_visible_to_customers: false,
//             //                         }
//             //                         : item
//             //                 )
//             //             );
//             //         }
//             //     } catch (err) {
//             //         console.error("Delete failed:", err);
//             //     }
//             // };


//             const handleDelete = async () => {
//                 // ... confirmation logic ...

//                 // const token = localStorage.getItem("token"); // or "accessToken", "jwt", etc.

//                 if (!token) {
//                     toast.error("You are not logged in. Please login again.");
//                     return;
//                 }

//                 try {
//                     await toast.promise(
//                         axios.delete(`/api/v1/service-section/provide-service/${service._id}`, {
//                             headers: {
//                                 Authorization: `Bearer ${token}`,
//                             },
//                         }),
//                         {
//                             loading: "Deleting service...",
//                             success: "Service deleted successfully",
//                             error: (err) =>
//                                 err.response?.data?.message || "Failed to delete service",
//                         }
//                     );

//                     // Update UI (soft-delete status)
//                     if (setData) {
//                         setData((prev: ServiceData[]) =>
//                             prev.map((item) =>
//                                 item._id === service._id
//                                     ? { ...item, service_status: "Disabled", is_visible_to_customers: false }
//                                     : item
//                             )
//                         );
//                     }
//                 } catch (err) {
//                     console.error(err);
//                 }
//             };


//             return (
//                 <div className="flex items-center justify-end gap-1.5">
//                     {/* Optional: keep Edit button if you want */}
//                     <Link href={`/dashboard/services/edit/${service._id}`}>
//                         <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
//                             title="Edit service"
//                         >
//                             <Edit className="h-4 w-4" />
//                         </Button>
//                     </Link>

//                     {/* Delete button */}
//                     <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
//                         onClick={handleDelete}
//                         title="Delete service"
//                     >
//                         <Trash className="h-4 w-4" />
//                     </Button>
//                 </div>
//             );
//         },
//         size: 100,
//         enableSorting: false,
//         enableHiding: false,
//     },
// ];



"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";
import { confirmDelete } from "@/components/ReusableComponents/ConfirmToast";
import { ServiceData } from "@/types/ServiceDataType";
import { useSession } from "next-auth/react"; // ← important import

export const service_data_columns_user: ColumnDef<ServiceData>[] = [
  {
    accessorKey: "serial",
    header: "Serial",
    cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
  },
  {
    accessorKey: "service_images",
    header: "Image",
    cell: ({ row }) => {
      const images = row.getValue("service_images") as string[];
      return (
        <div className="relative w-16 h-12 rounded-md overflow-hidden border bg-gray-50">
          <Image
            src={images?.[0] || "/placeholder-service.png"}
            alt="Service"
            fill
            className="object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "service_title",
    header: "Service Info",
    cell: ({ row }) => {
      const service = row.original;
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-gray-900 line-clamp-1">
            {service.service_title}
          </span>
          <div className="flex items-center text-[10px] text-gray-500 gap-1">
            <Tag className="h-3 w-3" /> {service.service_category}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "service_area",
    header: "Location",
    cell: ({ row }) => {
      const area = row.original.service_area;
      return (
        <div className="flex flex-col text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-red-400" />
            <span>{area.thana}</span>
          </div>
          <span className="pl-4 text-[10px] text-gray-400">{area.city}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "base_price",
    header: "Pricing",
    cell: ({ row }) => {
      const service = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-bold text-primary">৳{service.base_price}</span>
          <span className="text-[10px] capitalize text-gray-400">
            {service.pricing_type}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "service_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("service_status") as string;
      return (
        <span
          className={cn(
            "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
            status === "Active"
              ? "bg-green-100 text-green-700"
              : status === "Under Review"
              ? "bg-amber-100 text-amber-700"
              : "bg-red-100 text-red-700"
          )}
        >
          {status}
        </span>
      );
    },
  },
//   {
//     id: "actions",
//     header: "Actions",
//     cell: ({ row, table }) => {
//       const service = row.original;
//       const meta = table.options.meta as any;
//       const setData = meta?.setData;

//       const { data: session, status: sessionStatus } = useSession();

//       const handleDelete = async () => {
//         const confirmed = await confirmDelete(
//           `Delete "${service.service_title || "this service"}"?`
//         );
//         if (!confirmed) return;

//         if (sessionStatus === "loading") {
//           toast.info("Session is loading, please wait...");
//           return;
//         }

//         if (!session) {
//           toast.error("You must be logged in to delete a service.");
//           return;
//         }

//         // Adjust this key based on your actual next-auth config
//         // Common names: accessToken, token, jwt, idToken, backendToken...
//         const token = (session as any)?.accessToken || (session as any)?.token;

//         if (!token) {
//           toast.error(
//             "Authentication token not found. Please log out and log in again."
//           );
//           return;
//         }

//         try {
//           await toast.promise(
//             axios.delete(`/api/v1/service-section/provide-service/${service._id}`, {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }),
//             {
//               loading: "Deleting service...",
//               success: "Service deleted successfully",
//               error: (err) =>
//                 err.response?.data?.message ||
//                 "Failed to delete service. Please try again.",
//             }
//           );

//           // Soft-delete UI update
//           if (setData) {
//             setData((prev: ServiceData[]) =>
//               prev.map((item) =>
//                 item._id === service._id
//                   ? {
//                       ...item,
//                       service_status: "Disabled",
//                       is_visible_to_customers: false,
//                     }
//                   : item
//               )
//             );
//           }

//           // Optional: remove row instead
//           // setData((prev) => prev.filter((item) => item._id !== service._id));
//         } catch (err) {
//           console.error("Delete error:", err);
//         }
//       };

//       return (
//         <div className="flex items-center justify-end gap-1.5">
//           <Link href={`/dashboard/services/edit/${service._id}`}>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-8 w-8 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
//               title="Edit service"
//             >
//               <Edit className="h-4 w-4" />
//             </Button>
//           </Link>

//           <Button
//             variant="ghost"
//             size="icon"
//             className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
//             onClick={handleDelete}
//             title="Delete service"
//             disabled={sessionStatus === "loading"}
//           >
//             <Trash className="h-4 w-4" />
//           </Button>
//         </div>
//       );
//     },
//     size: 100,
//     enableSorting: false,
//     enableHiding: false,
//   },
];