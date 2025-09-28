'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

export const teams_columns: ColumnDef<any>[] = [
  {
    accessorKey: '_id',
    header: 'SL',
    cell: ({ row }) => row.index + 1, // auto serial number
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const image = row.getValue('image') as string;
      return (
        <div className="flex justify-center items-center">
          <img
            src={image}
            alt="thumbnail"
            className="h-12 w-12 object-cover rounded-md border"
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'name', // ✅ Fix here
    header: 'Employee Name',
  },
  {
    accessorKey: 'designation',
    header: 'Designation',
  },
  // {
  //   id: 'action',
  //   header: 'Action',
  //   cell: () => (
  //     <div className="flex items-center gap-2">
  //       <Button
  //         variant="ghost"
  //         size="sm"
  //         className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
  //         <Edit className="w-4 h-4" />
  //       </Button>
  //       <Button
  //         variant="ghost"
  //         size="sm"
  //         className="text-red-600 hover:text-red-700 hover:bg-red-50">
  //         <Trash2 className="w-4 h-4" />
  //       </Button>
  //     </div>
  //   ),
  // },
];
