'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DeleteIcon, Edit, X } from 'lucide-react';
import { Button } from '../ui/button';

export type StoresDataType = {
  id: number;
  category: string;
  qustion: string;
  answer: string;
  status: string;
};

export const faq_columns: ColumnDef<StoresDataType>[] = [
  {
    accessorKey: 'id',
    header: 'SL',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'qustion',
    header: 'Qustion',
  },
  {
    accessorKey: 'answer',
    header: 'Answer',
  },
  {
    accessorKey: 'status',
    header: 'Status',
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
            <DeleteIcon />
          </Button>
        </div>
      );
    },
  },
];
