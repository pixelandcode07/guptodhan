// "use client";

// import { cn } from "@/lib/utils";
// import { ColumnDef } from "@tanstack/react-table";
// import { CheckCircle, XCircle, Mail, Phone, ShieldCheck } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import axios from "axios";
// import { IProvider } from "@/types/ProviderType";

// export const provider_management_columns: ColumnDef<IProvider>[] = [
//   {
//     accessorKey: "serial",
//     header: "Serial",
//     cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
//   },
//   {
//     accessorKey: "name",
//     header: "Provider Info",
//     cell: ({ row }) => {
//       const user = row.original;
//       return (
//         <div className="flex flex-col gap-0.5">
//           <span className="font-semibold text-gray-900">{user.name}</span>
//           <div className="flex items-center text-[11px] text-gray-500 gap-1 italic">
//             {user.role}
//           </div>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "contact",
//     header: "Contact Details",
//     cell: ({ row }) => {
//       const user = row.original;
//       return (
//         <div className="flex flex-col gap-1 text-[11px]">
//           <div className="flex items-center gap-1.5 text-gray-600">
//             <Mail className="h-3 w-3 text-blue-500" />
//             <span>{user.email}</span>
//           </div>
//           <div className="flex items-center gap-1.5 text-gray-600">
//             <Phone className="h-3 w-3 text-green-500" />
//             <span>{user.phoneNumber}</span>
//           </div>
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "isVerified",
//     header: "Verified",
//     cell: ({ row }) => {
//       const isVerified = row.getValue("isVerified") as boolean;
//       return (
//         <div className="flex justify-center">
//           {isVerified ? (
//             <ShieldCheck className="h-5 w-5 text-emerald-500" />
//           ) : (
//             <XCircle className="h-5 w-5 text-gray-300" />
//           )}
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "isActive",
//     header: "Status",
//     cell: ({ row }) => {
//       const isActive = row.getValue("isActive") as boolean;
//       return (
//         <span
//           className={cn(
//             "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
//             isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
//           )}
//         >
//           {isActive ? "Active" : "Inactive"}
//         </span>
//       );
//     },
//   },
//   {
//     id: "actions",
//     header: "Actions",
//     cell: ({ row, table }) => {
//       const user = row.original;
//       const setData = (table.options.meta as any)?.setData;

//       const handleStatusUpdate = async (action: "approve" | "reject") => {
//         const apiUrl = `/api/v1/service-section/service-provider/${action}/${user._id}`;
//         const newActiveStatus = action === "approve";

//         try {
//           await toast.promise(axios.patch(apiUrl), {
//             loading: `${action === "approve" ? "Approving" : "Rejecting"} provider...`,
//             success: `Provider ${action === "approve" ? "Approved" : "Rejected"} successfully!`,
//             error: (err) => err.response?.data?.message || `Failed to ${action} provider`,
//             style: { background: "#fff", color: "#000" },
//           });

//           if (setData) {
//             setData((prev: IProvider[]) =>
//               prev.map((item) =>
//                 item._id === user._id ? { ...item, isActive: newActiveStatus } : item
//               )
//             );
//           }
//         } catch (error) {
//           console.error(`${action} error:`, error);
//         }
//       };

//       return (
//         <div className="flex items-center gap-2">
//           {/* Approve Button */}
//           <Button
//             variant="outline"
//             size="sm"
//             className="h-8 w-8 p-0 border-green-100 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
//             onClick={() => handleStatusUpdate("approve")}
//             disabled={user.isActive} // Active thakle approve dorkar nei
//             title="Approve Provider"
//           >
//             <CheckCircle className="h-4 w-4" />
//           </Button>

//           {/* Reject Button */}
//           <Button
//             variant="outline"
//             size="sm"
//             className="h-8 w-8 p-0 border-red-100 text-red-600 hover:bg-red-50 disabled:opacity-50"
//             onClick={() => handleStatusUpdate("reject")}
//             disabled={!user.isActive} // Inactive thakle reject dorkar nei
//             title="Reject Provider"
//           >
//             <XCircle className="h-4 w-4" />
//           </Button>
//         </div>
//       );
//     },
//   },
// ];


"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, XCircle, Mail, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { IProvider } from "@/types/ProviderType";

export const provider_management_columns: ColumnDef<IProvider>[] = [
  {
    accessorKey: "serial",
    header: "Serial",
    cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
  },
  {
    accessorKey: "name",
    header: "Provider Info",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-gray-900">{user.name}</span>
          <div className="flex items-center text-[11px] text-gray-500 gap-1 italic">
            {user.role}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "contact",
    header: "Contact Details",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col gap-1 text-[11px]">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Mail className="h-3 w-3 text-blue-500" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Phone className="h-3 w-3 text-green-500" />
            <span>{user.phoneNumber}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "isVerified",
    header: "Verified",
    cell: ({ row }) => {
      const isVerified = row.getValue("isVerified") as boolean;
      return (
        <div className="flex justify-center">
          {isVerified ? (
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
          ) : (
            <XCircle className="h-5 w-5 text-gray-300" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <span
          className={cn(
            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
            isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const user = row.original;
      const setData = (table.options.meta as any)?.setData;

      const handleStatusUpdate = async (action: "approve" | "reject") => {
        const apiUrl = `/api/v1/service-section/service-provider/${action}/${user._id}`;

        try {
          await toast.promise(
            axios.patch(apiUrl, { id: user._id }),
            {
              loading: `${action === "approve" ? "Approving" : "Rejecting"} provider...`,
              success: () => {
                return action === "approve"
                  ? "User status changed to active"
                  : "User status changed to Inactive";
              },
              error: (err) => err.response?.data?.message || `Failed to ${action} provider`,
              style: { background: "#fff", color: "#000" },
            }
          );
          if (setData) {
            setData((prev: IProvider[]) =>
              prev.map((item) =>
                item._id === user._id
                  ? {
                    ...item,
                    isActive: action === "approve",
                    role: action === "approve" ? "service-provider" : item.role
                  }
                  : item
              )
            );
          }
        } catch (error) {
          console.error(`${action} error:`, error);
        }
      };

      return (
        <div className="flex items-center gap-2">
          {/* Approve Button */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 border-green-200 text-emerald-600 hover:bg-emerald-50 disabled:opacity-30"
            onClick={() => handleStatusUpdate("approve")}
            disabled={user.isActive}
            title="Approve & Activate"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>

          {/* Reject/Deactivate Button */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-30"
            onClick={() => handleStatusUpdate("reject")}
            disabled={!user.isActive}
            title="Reject & Deactivate"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];