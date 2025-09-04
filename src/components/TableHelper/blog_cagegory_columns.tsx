'use client';

import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, X, ArrowUpDown, Delete, Trash } from 'lucide-react'; // ⬅️ lucide-react থেকে icon নেওয়া হয়েছে
import { Button } from '../ui/button';

export type StoresDataType = {
  id: number;
  name: string;
  slug: string;
  featured: boolean;
  status: string;
  image?: string;
  category?: string;
  published?: string;
};

export const blog_bagegory_columns: ColumnDef<StoresDataType>[] = [
  {
    accessorKey: 'id',
    header: 'SL',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'slug',
    header: 'Slug',
  },
  {
    accessorKey: 'featured',
    header: 'Featured',
    cell: ({ row }) => {
      const featured = row.getValue('featured') as boolean;
      return (
        <span
          className={cn(
            'px-2 py-1 rounded-full text-xs font-medium border',
            featured
              ? 'bg-blue-100 text-blue-700 border-blue-300'
              : 'bg-gray-100 text-gray-700 border-gray-300'
          )}>
          {featured ? 'Yes' : 'No'}
        </span>
      );
    },
  },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;

      const statusColor =
        status === 'Active'
          ? 'bg-green-100 text-green-700 border-green-300'
          : status === 'Pending'
          ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
          : 'bg-red-100 text-red-700 border-red-300';

      return (
        <span
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium border',
            statusColor
          )}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          {/* Edit */}
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black cursor-pointer">
            <Edit className="w-4 h-4" />
          </Button>

          {/* Delete */}
          <Button className="bg-red-700 hover:bg-red-800 text-white cursor-pointer">
            <Trash className="w-4 h-4" />
          </Button>

          {/* Arrow Up/Down */}
          <Button className="bg-green-600 hover:bg-green-700 text-white cursor-pointer">
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
