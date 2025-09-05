'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Edit, Star, Trash2 } from 'lucide-react';

export type Size = {
  id: number;
  image: string;
  title: string;
  url: string;
  status: string;
};

export const all_page_columns: ColumnDef<Size>[] = [
  {
    accessorKey: 'id',
    header: 'SL',
  },
  {
    accessorKey: 'image',
    header: 'Feature Image',
    cell: ({ row }) => {
      const imageUrl = row.getValue('image') as string;

      return (
        <div className="flex justify-center items-center">
          <img
            src={imageUrl}
            alt="thumbnail"
            className="h-12 w-12 object-cover rounded-md border"
          />
        </div>
      );
    },
  },

  {
    accessorKey: 'title',
    header: 'Page Title',
  },

  {
    accessorKey: 'url',
    header: 'Page URL',
  },

  {
    id: 'action',
    header: 'Action',
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
