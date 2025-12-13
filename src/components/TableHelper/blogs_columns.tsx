'use client';

import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, X } from 'lucide-react';
import { Button } from '../ui/button';

export type StoresDataType = {
  id: number;
  title: string;
  image: string;
  category: string;
  status: string;
  published: string;
  created_at?: string;
};

const categoryMap: Record<string, string> = {
  '1': 'Education',
  '2': 'Environment',
  '3': 'Human Rights',
  '4': 'E-commerce',
  '5': 'Donation',
  '6': 'Buy & Sale',
};

export const blogs_columns: ColumnDef<StoresDataType>[] = [
  {
    id: 'serial',
    header: 'SL',
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'coverImage',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = row.getValue('coverImage') as string;
      return (
        <img
          src={imageUrl}
          alt="blog"
          className="h-12 w-12 object-cover rounded-md border"
        />
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const categoryValue = row.getValue('category') as string;
      return categoryMap[categoryValue] || categoryValue;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;

      const statusColor =
        status === 'active'
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
    accessorKey: 'createdAt',
    header: 'Published',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      const formattedDate = date.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      return formattedDate.replace(',', ' -');
    },
  },

  // {
  //   accessorKey: 'action',
  //   header: 'Action',
  //   cell: () => {
  //     return (
  //       <div className="flex items-center gap-2">
  //         <Button className="bg-yellow-400 hover:bg-yellow-500 text-black cursor-pointer">
  //           <Edit />
  //         </Button>
  //         <Button className="bg-red-700 hover:bg-red-800 text-white cursor-pointer">
  //           <X />
  //         </Button>
  //       </div>
  //     );
  //   },
  // },
];
