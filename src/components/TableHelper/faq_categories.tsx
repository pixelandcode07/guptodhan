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
    accessorKey: '_id',
    header: 'SL',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'question',
    header: 'Qustion',
  },
  {
    accessorKey: 'answer',
    header: 'Answer',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: any) => {
      const isActive = row.original.isActive; // true বা false
      return (
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${
            isActive
              ? 'bg-green-100 text-green-700 border-green-300'
              : 'bg-red-100 text-red-700 border-red-300'
          }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      );
    },
  },
];
