'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

export type Size = {
  _id?: string; // mongo id for operations
  sizeId?: string; // slug/id
  id: number;
  name: string;
  status: 'Active' | 'Inactive';
  created_at: string;
};

export type SizeColumnHandlers = {
  onDelete: (size: Size) => void;
  onEdit: (size: Size) => void;
};

export const getSizeColumns = ({ onDelete, onEdit }: SizeColumnHandlers): ColumnDef<Size>[] => [
  {
    accessorKey: 'id',
    header: 'SL',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return <span>{status}</span>;
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
  },
  {
    id: 'action',
    header: 'Action',
    cell: ({ row }) => {
      const size = row.original as Size;
      return (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onEdit(size)}
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onDelete(size)}
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
