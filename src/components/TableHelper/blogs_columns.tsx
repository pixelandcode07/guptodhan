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

export const blogs_columns: ColumnDef<StoresDataType>[] = [
  {
    accessorKey: 'id',
    header: 'SL',
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = row.getValue('image') as string;
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
    accessorKey: 'published',
    header: 'Published',
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black cursor-pointer">
            <Edit />
          </Button>
          <Button className="bg-red-700 hover:bg-red-800 text-white cursor-pointer">
            <X />
          </Button>
        </div>
      );
    },
  },
];
