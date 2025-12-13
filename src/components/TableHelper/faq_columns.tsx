'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge'; // ✅ use shadcn badge

export type FaqCategoryType = {
  faqCategoryID: number;
  categoryName: string;
  isActive: boolean;
};

export const faq_categories_columns: ColumnDef<FaqCategoryType>[] = [
  {
    accessorKey: '_id',
    header: 'SL',
  },
  {
    accessorKey: 'name',
    header: 'Category Name',
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean;

      return (
        <span
          className={`px-3 py-1 text-sm font-medium rounded-full border
          ${
            isActive
              ? 'bg-green-100 text-green-700 border-green-400'
              : 'bg-red-100 text-red-700 border-red-400'
          }
        `}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      );
    },
  },
];
