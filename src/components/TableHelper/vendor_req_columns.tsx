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
    accessorKey: 'user.name',
    header: 'Name',
  },
  {
    accessorKey: 'user.email',
    header: 'Email',
  },
  {
    accessorKey: 'user.phoneNumber',
    header: 'Phone',
  },
  {
    accessorKey: 'businessName',
    header: 'Business Name',
  },
  {
    accessorKey: 'tradeLicenseNumber',
    header: 'Trade License Number',
  },
  {
    id: 'verified',
    header: 'Verified',
    cell: ({ row }) => {
      const isActive = row.original.user.isActive;
      return (
        <div
          className={cn(
            `p-1 rounded-md w-max text-xs`,
            isActive ? 'text-green-500' : 'text-red-500'
          )}
        >
          {isActive ? 'Yes' : 'No'}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <div
          className={cn(
            `p-1 rounded-md w-max text-xs font-medium`,
            status === 'pending' && 'bg-yellow-100 text-yellow-700',
            status === 'approved' && 'bg-green-100 text-green-700',
            status === 'rejected' && 'bg-red-100 text-red-700'
          )}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
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
    cell: ({ row }) => {
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
            asChild // এটা দরকার যাতে Button এর ভিতর Link কাজ করে
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
