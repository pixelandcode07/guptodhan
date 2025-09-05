'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Edit, X } from 'lucide-react';
import { Button } from '../ui/button';

export type StoresDataType = {
  id: number;
  img: string;
  name: string;
  desc: string;
};

export const terms_columns: ColumnDef<StoresDataType>[] = [
  {
    accessorKey: 'id',
    header: 'SL',
  },
  {
    accessorKey: 'img',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = row.original.img;
      return (
        <img
          src={imageUrl}
          alt="Employee"
          className="w-12 h-12 object-cover rounded-full"
        />
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'Employee Name',
  },
  {
    accessorKey: 'desc',
    header: 'Designation',
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
