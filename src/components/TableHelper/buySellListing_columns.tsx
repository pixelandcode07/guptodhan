"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Check, X, EyeOff, RotateCcw, PackageCheck, Trash2, MoreHorizontal, Eye, MapPin, Phone, CalendarDays, Tags } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { confirmDelete } from "../ReusableComponents/ConfirmToast";
import { cn } from "@/lib/utils";
import { ClassifiedAdListing } from "@/types/ClassifiedAdsType";

import {
  approveAd,
  rejectAd,
  deleteAd,
  markAdAsSold,
  markAdAsPending,
  markAdAsActive,
  markAdAsInactive,
} from "@/lib/BuyandSellApis/fetchBuyAndSellAction";

// ────────────────────────────────────────────────
//  Server Action Handlers
// ────────────────────────────────────────────────

const handleApprove = async (id: string) => {
  const res = await approveAd(id);
  toast[res.success ? "success" : "error"]("Status Updated", {
    description: res.success ? "Ad approved (active) successfully!" : res.message,
  });
};

const handleReject = async (id: string) => {
  const res = await rejectAd(id);
  toast[res.success ? "success" : "error"]("Status Updated", {
    description: res.success ? "Ad rejected successfully!" : res.message,
  });
};

const handleMarkAsSold = async (id: string) => {
  const res = await markAdAsSold(id);
  toast[res.success ? "success" : "error"]("Status Updated", {
    description: res.success ? "Ad marked as sold!" : res.message,
  });
};

const handleMakePending = async (id: string) => {
  const res = await markAdAsPending(id);
  toast[res.success ? "success" : "error"]("Status Updated", {
    description: res.success ? "Ad moved back to pending!" : res.message,
  });
};

const handleMakeActive = async (id: string) => {
  const res = await markAdAsActive(id);
  toast[res.success ? "success" : "error"]("Status Updated", {
    description: res.success ? "Ad activated successfully!" : res.message,
  });
};

const handleMakeInactive = async (id: string) => {
  const res = await markAdAsInactive(id);
  toast[res.success ? "success" : "error"]("Status Updated", {
    description: res.success ? "Ad marked as inactive!" : res.message,
  });
};

const handleDelete = async (id: string) => {
  const confirmed = await confirmDelete("Are you sure you want to permanently delete this ad?");
  if (!confirmed) return;

  const res = await deleteAd(id);
  toast[res.success ? "success" : "error"]("Ad Deleted", {
    description: res.success ? "Ad removed permanently!" : res.message,
  });
};

// ────────────────────────────────────────────────
//  Action Cell Component (Handles View Modal & Dropdown)
// ────────────────────────────────────────────────
const ActionCell = ({ ad }: { ad: ClassifiedAdListing }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { status, _id: id } = ad;

  // Format Date safely
  const createdDate = ad.createdAt ? new Date(ad.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown';

  // ✅ MAGIC FIX: Extracting Location and other attributes exactly as per your JSON structure
  const adAny = ad as any;
  const division = adAny.division;
  const district = adAny.district;
  const upazila = adAny.upazila;
  const locationText = [upazila, district, division].filter(Boolean).join(', ') || 'N/A';

  const brand = adAny.brand;
  const productModel = adAny.productModel;
  const authenticity = adAny.authenticity;
  const isPhoneHidden = ad.contactDetails?.isPhoneHidden || (ad.contactDetails as any)?.hidePhone;

  return (
    <>
      <div className="flex items-center gap-1 justify-end">
        {/* View Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          onClick={() => setIsViewModalOpen(true)}
          title="View Ad Details"
        >
          <Eye className="h-4 w-4" />
        </Button>

        {/* Dropdown Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {(status === "rejected" || status === "inactive" || status === "active") && (
              <DropdownMenuItem
                className="flex items-center gap-2 text-amber-600 cursor-pointer"
                onClick={() => handleMakePending(id)}
              >
                <RotateCcw className="h-4 w-4" /> Make Pending
              </DropdownMenuItem>
            )}

            {(status === "pending" || status === "inactive" || status === "rejected") && (
              <DropdownMenuItem
                className="flex items-center gap-2 text-green-600 cursor-pointer"
                onClick={() => handleMakeActive(id)}
              >
                <Check className="h-4 w-4" /> Mark as Active
              </DropdownMenuItem>
            )}

            {status === "active" && (
              <DropdownMenuItem
                className="flex items-center gap-2 text-orange-600 cursor-pointer"
                onClick={() => handleMakeInactive(id)}
              >
                <EyeOff className="h-4 w-4" /> Mark as Inactive
              </DropdownMenuItem>
            )}

            {status === "active" && (
              <DropdownMenuItem
                className="flex items-center gap-2 text-purple-600 cursor-pointer"
                onClick={() => handleMarkAsSold(id)}
              >
                <PackageCheck className="h-4 w-4" /> Mark as Sold
              </DropdownMenuItem>
            )}

            {(status === "pending" || status === "active") && (
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-600 cursor-pointer"
                onClick={() => handleReject(id)}
              >
                <X className="h-4 w-4" /> Reject
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              className="flex items-center gap-2 text-red-700 font-medium cursor-pointer mt-1 border-t pt-1"
              onClick={() => handleDelete(id)}
            >
              <Trash2 className="h-4 w-4" /> Delete Permanently
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ✅ View Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-3 mb-3">
            <DialogTitle className="text-xl font-bold text-gray-800">Ad Details Review</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{ad.title}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><Tags className="w-4 h-4 text-blue-500" /> {ad.category?.name} {ad.subCategory ? `> ${ad.subCategory.name}` : ''}</span>
                <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-orange-500" /> Posted on: {createdDate}</span>
              </div>
            </div>

            {/* Images Grid */}
            {ad.images && ad.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ad.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                    <Image src={img} alt={`Ad Image ${idx + 1}`} fill className="object-cover hover:scale-105 transition-transform" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                No Images Provided
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pricing</p>
                  <p className="text-2xl font-black text-blue-600">৳{ad.price?.toLocaleString()} <span className="text-sm font-medium text-gray-500">{ad.isNegotiable ? '(Negotiable)' : '(Fixed)'}</span></p>
                </div>
                
                {/* Condition & Authenticity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Condition</p>
                    <p className="text-sm font-medium text-gray-800 capitalize">{ad.condition || 'N/A'}</p>
                  </div>
                  {authenticity && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Authenticity</p>
                      <p className="text-sm font-medium text-gray-800 capitalize">{authenticity}</p>
                    </div>
                  )}
                </div>

                {/* Brand & Model */}
                {brand && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Brand & Model</p>
                    <p className="text-sm font-medium text-gray-800 capitalize">{brand} {productModel ? `- ${productModel}` : ''}</p>
                  </div>
                )}

                {/* Location */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</p>
                  <div className="flex items-start gap-1.5 text-sm font-medium text-gray-800 mt-1">
                    <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="leading-snug">{locationText}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Seller Information</p>
                  <div className="flex items-center gap-3 mt-2 bg-white p-2 rounded-lg border border-gray-200">
                    {ad.user?.profilePicture ? (
                      <Image src={ad.user.profilePicture} alt={ad.user.name || 'Seller'} width={40} height={40} className="rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {ad.user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{ad.user?.name || 'Unknown User'}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3 text-green-500" /> {ad.contactDetails?.phone || 'N/A'}</p>
                    </div>
                  </div>
                  {isPhoneHidden && (
                    <p className="text-xs text-red-500 italic mt-1">* Seller requested to hide phone number</p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Current Status</p>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-1 inline-block",
                      status === "pending" && "bg-yellow-100 text-yellow-800",
                      status === "active" && "bg-green-100 text-green-800",
                      status === "inactive" && "bg-red-100 text-red-800",
                      status === "sold" && "bg-gray-200 text-gray-800",
                      status === "rejected" && "bg-orange-100 text-orange-800"
                    )}
                  >
                    {status}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 border-b pb-2">Description</p>
              <div className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-4 rounded-xl border border-gray-100 leading-relaxed shadow-sm">
                {ad.description || 'No description provided for this ad.'}
              </div>
            </div>

            {/* Action Buttons inside Modal */}
            {status === 'pending' && (
               <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                  <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => { handleReject(id); setIsViewModalOpen(false); }}>
                     <X className="w-4 h-4 mr-2" /> Reject Ad
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => { handleApprove(id); setIsViewModalOpen(false); }}>
                     <Check className="w-4 h-4 mr-2" /> Approve Ad
                  </Button>
               </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const buySellListing_columns: ColumnDef<ClassifiedAdListing>[] = [
  // Checkbox Column
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        className="w-4 h-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="w-4 h-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // Serial
  {
    id: "serial",
    header: "Serial",
    cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
  },

  // Product Name
  {
    accessorKey: "title",
    header: "Product Name",
    cell: ({ row }) => <span className="font-medium line-clamp-2 max-w-[200px]">{row.getValue("title")}</span>,
  },

  // Image
  {
    id: "image",
    header: "Image",
    cell: ({ row }) => {
      const firstImage = row.original.images[0] || null;
      return firstImage ? (
        <div className="relative h-12 w-12 rounded-md overflow-hidden border">
          <Image src={firstImage} alt="Ad" fill className="object-cover" />
        </div>
      ) : (
        <div className="h-12 w-12 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center text-xs text-gray-400">
          N/A
        </div>
      );
    },
  },

  // Category + Subcategory
  {
    id: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category?.name || "N/A";
      const subCategory = row.original.subCategory?.name;
      return (
        <div className="text-sm">
          <div className="font-medium">{category}</div>
          {subCategory && <div className="text-xs text-gray-500">{subCategory}</div>}
        </div>
      );
    },
  },

  // Price
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      const isNegotiable = row.original.isNegotiable;
      return (
        <div className="font-bold text-gray-800">
          ৳{price?.toLocaleString()}
          {isNegotiable && <span className="block text-[10px] text-green-600 font-medium leading-tight">Negotiable</span>}
        </div>
      );
    },
  },

  // Status Badge
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as ClassifiedAdListing["status"];
      return (
        <span
          className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
            status === "pending" && "bg-yellow-100 text-yellow-800",
            status === "active" && "bg-green-100 text-green-800",
            status === "inactive" && "bg-red-100 text-red-800",
            status === "sold" && "bg-gray-200 text-gray-800",
            status === "rejected" && "bg-orange-100 text-orange-800"
          )}
        >
          {status}
        </span>
      );
    },
  },

  // Posted By
  {
    id: "postedBy",
    header: "Posted By",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center gap-2">
          {user?.profilePicture ? (
            <Image src={user.profilePicture} alt={user.name || "User"} width={28} height={28} className="rounded-full object-cover border border-gray-200" />
          ) : (
            <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
              {user?.name?.charAt(0) || "U"}
            </div>
          )}
          <span className="text-sm font-medium text-gray-700">{user?.name || "Unknown"}</span>
        </div>
      );
    },
  },

  // Action Cell
  {
    id: "actions",
    header: () => <div className="text-right pr-2">Actions</div>,
    cell: ({ row }) => <ActionCell ad={row.original} />,
  },
];