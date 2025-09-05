'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '../ui/button';
import { Edit, X } from 'lucide-react';

export type StoresDataType = {
  sl: number;
  roleName: string;
  desc: string;
  createdAt: string;
  updatedAt: string;
};

export const user_roles_columns: ColumnDef<StoresDataType>[] = [
  { accessorKey: 'sl', header: 'SL' },
  { accessorKey: 'roleName', header: 'Role Name' },
  { accessorKey: 'desc', header: 'Description' },
  { accessorKey: 'createdAt', header: 'Created At' },
  { accessorKey: 'updatedAt', header: 'Updated At' },
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
