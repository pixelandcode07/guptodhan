'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Check, Edit, Trash, X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Vendor } from '@/types/VendorType';
import { toast } from 'sonner';
import { approveVendor, deleteVendor, rejectVendor } from '@/lib/MultiVendorApis/vendorActions';
import { confirmDelete } from '../ReusableComponents/ConfirmToast';
import Link from 'next/link';

export const vendor_req_columns: ColumnDef<Vendor>[] = [
  {
    id: 'serial',
    header: 'Serial',
    cell: ({ row }) => {
      const index = row.index + 1;
      return <div className="font-medium">{index}</div>;
    },
  },
  {
    // ✅ সমাধান ১: 'user.name'-এর জন্য cell ফাংশন ব্যবহার
    accessorKey: 'user.name',
    header: 'Name',
    cell: ({ row }) => {
      // user অবজেক্ট আছে কিনা এবং name আছে কিনা চেক করুন
      const name = row.original.user?.name;
      return <div>{name || <span className="text-gray-400">N/A</span>}</div>;
    },
  },
  {
    // ✅ সমাধান ২: 'user.email'-এর জন্য cell ফাংশন ব্যবহার
    accessorKey: 'user.email',
    header: 'Email',
    cell: ({ row }) => {
      const email = row.original.user?.email;
      return <div>{email || <span className="text-gray-400">N/A</span>}</div>;
    },
  },
  {
    // ✅ সমাধান ৩: 'user.phoneNumber'-এর জন্য cell ফাংশন ব্যবহার
    accessorKey: 'user.phoneNumber',
    header: 'Phone',
    cell: ({ row }) => {
      const phone = row.original.user?.phoneNumber;
      return <div>{phone || <span className="text-gray-400">N/A</span>}</div>;
    },
  },
  {
    accessorKey: 'businessName',
    header: 'Business Name',
  },
  {
    accessorKey: 'tradeLicenseNumber',
    header: 'Trade License Number',
  },
  // {
  //   id: 'verified',
  //   header: 'Verified',
  //   cell: ({ row }) => {
  //     const isActive = row.original.user.isActive;
  //     return (
  //       <div
  //         className={cn(
  //           `p-1 rounded-md w-max text-xs`,
  //           isActive ? 'text-green-500' : 'text-red-500'
  //         )}
  //       >
  //         {isActive ? 'Yes' : 'No'}
  //       </div>
  //     );
  //   },
  // },
  {
    id: 'verified',
    header: 'Verified',
    cell: ({ row }) => {
      // ✅ সমাধান ৪: মূল ক্র্যাশের সমাধান - Optional Chaining (?.) যোগ করা
      const isActive = row.original.user?.isActive; // user.isActive এর বদলে user?.isActive
      return (
        <span
          className={cn(
            `p-1 rounded-md w-max text-xs`,
            // isActive null হলে ডিফল্টভাবে 'text-red-500' দেখাবে
            isActive ? 'text-green-500' : 'text-red-500'
          )}
        >
          {isActive === undefined ? "N/A" : isActive ? "Yes" : "No"}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      // ... (এই কোডে কোনো সমস্যা নেই)
      const rawStatus = row.getValue('status');
      const status = typeof rawStatus === 'string' ? rawStatus.toLowerCase() : null;
      const displayStatus = status
        ? status.charAt(0).toUpperCase() + status.slice(1)
        : 'Unknown';
      return (
        <div
          className={cn(
            'p-1 rounded-md w-max text-xs font-medium',
            status === 'pending' && 'bg-yellow-100 text-yellow-700',
            status === 'approved' && 'bg-green-100 text-green-700',
            status === 'rejected' && 'bg-red-100 text-red-700',
            !status && 'bg-gray-100 text-gray-600'
          )}
        >
          {displayStatus}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return date.toLocaleDateString('en-GB');
    },
  },
  {
    id: 'action',
    header: 'Action',
    cell: ({ row }) => {
      // ... (এই কোডে কোনো সমস্যা নেই)
      const vendor = row.original;

      const handleApprove = async () => {
        toast.promise(approveVendor(vendor._id), {
          loading: 'Approving vendor...',
          success: (data) => data.message,
          error: (data) => data.message,
        });
      };

      const handleReject = async () => {
        toast.promise(rejectVendor(vendor._id), {
          loading: 'Rejecting vendor...',
          success: (data) => data.message,
          error: (data) => data.message,
        });
      };

      const handleDelete = async () => {
        const confirmed = await confirmDelete(
          'Are you sure you want to delete this vendor and their account permanently?'
        );

        if (!confirmed) {
          toast.success('Deletion cancelled');
          return;
        }

        toast.promise(deleteVendor(vendor._id), {
          loading: 'Deleting vendor...',
          success: (data) => data.message,
          error: (data) => data.message,
        });
      };

      return (
        <div className="flex items-center gap-1">
          {vendor.status === 'pending' && (
            <>
              <Button size="icon" className="h-8 w-8 bg-green-600" onClick={handleApprove}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" className="h-8 w-8 bg-red-600" onClick={handleReject}>
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            size="icon"
            className="h-8 w-8 bg-blue-600 hover:bg-blue-700"
            asChild
            title="Edit Vendor"
          >
            <Link href={`/general/edit/vendor/${vendor._id}`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="icon" className="h-8 w-8 bg-red-700" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  }
]