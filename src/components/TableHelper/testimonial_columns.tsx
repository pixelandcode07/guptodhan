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
  },
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = row.getValue('image') as string;

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
    accessorKey: 'customer',
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
    accessorKey: 'designation',
    header: 'Testimonial',
  },

  {
    id: 'action',
    header: 'Action',
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            <Edit className="w-4 h-4" />
          </Button>
          <Button
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
