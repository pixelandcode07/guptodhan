'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Edit, Star, Trash2 } from 'lucide-react';

export type Size = {
  id: number;
  image: string;
  customer: string;
  designation: string;
  rating: number;
  testimonial: string;
};

export const testimonial_columns: ColumnDef<Size>[] = [
  {
    accessorKey: 'id',
    header: 'SL',
    cell: ({ row }) => {
      return row.index + 1;
    },
  },
  {
    accessorKey: 'customerImage',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = row.getValue('customerImage') as string;

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
    accessorKey: 'customerName',
    header: 'Customer',
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => {
      const rating = row.original.rating;
      return (
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating ? 'text-yellow-400 ' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Testimonial',
  },
];
