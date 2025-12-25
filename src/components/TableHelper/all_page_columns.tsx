'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

// Define the correct type based on your API response
export type SeoPage = {
  _id: string;
  pageIdentifier: string;
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  createdAt: string;
  updatedAt: string;
  metaKeywords?: string[];
};

export const all_page_columns: ColumnDef<SeoPage>[] = [
  {
    accessorKey: '_id',
    header: 'SL',
    cell: ({ row, table }) => {
      const index = table
        .getSortedRowModel()
        .flatRows.findIndex((flatRow) => flatRow.id === row.id);
      return <div className="text-center font-medium">{index + 1}</div>;
    },
  },

  {
    accessorKey: 'ogImage',
    header: 'Feature Image',
    cell: ({ row }) => {
      const imageUrl = row.getValue('ogImage') as string | undefined;

      return (
        <div className="flex justify-center items-center py-2">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="OG Image"
              className="h-16 w-24 object-cover rounded-md border shadow-sm"
            />
          ) : (
            <div className="h-16 w-24 bg-gray-200 border-2 border-dashed rounded-md flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: 'metaTitle',
    header: 'Page Title',
    cell: ({ row }) => {
      const title = row.getValue('metaTitle') as string;
      return <div className="font-medium max-w-xs truncate">{title}</div>;
    },
  },

  {
    accessorKey: 'pageIdentifier',
    header: 'Page URL',
    cell: ({ row }) => {
      const identifier = row.getValue('pageIdentifier') as string;
      const fullUrl = `/${identifier}`; // Adjust base path if needed, e.g., `/pages/${identifier}`
      return (
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline font-mono text-sm"
        >
          {fullUrl}
        </a>
      );
    },
  },

  {
    accessorKey: 'metaDescription',
    header: 'Meta Description',
    cell: ({ row }) => {
      const desc = row.getValue('metaDescription') as string;
      return (
        <p className="text-sm text-gray-600 line-clamp-2 max-w-md">
          {desc || '—'}
        </p>
      );
    },
  },

  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string;
      return <div className="text-sm text-gray-500">{format(new Date(date), 'PP')}</div>;
    },
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const page = row.original;

      return (
        <div className="flex items-center gap-2">
          <Link href={`/general/edit/seo/${page._id}`}>
            {/* E:\Guptodhan\Main-Project\src\app\general\edit\seo\[id]\page.tsx */}
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            // You can add onClick={() => handleEdit(page._id)} later
            >
              <Edit className="w-4 h-4" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          // onClick={() => handleDelete(page._id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];