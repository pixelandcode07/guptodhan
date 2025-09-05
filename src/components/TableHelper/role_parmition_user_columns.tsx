'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '../ui/button';
import { Edit } from 'lucide-react';

export type StoresDataType = {
  sl: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createAt: string;
};

export const role_parmition_columns: ColumnDef<StoresDataType>[] = [
  { accessorKey: 'sl', header: 'SL' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'phone', header: 'Phone' },
  { accessorKey: 'address', header: 'Address' },
  { accessorKey: 'createAt', header: 'Acount Created' },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black cursor-pointer">
            <Edit /> Assin
          </Button>
        </div>
      );
    },
  },
];
