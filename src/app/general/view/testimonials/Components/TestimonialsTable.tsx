'use client';

import { DataTable } from '@/components/TableHelper/data-table';
import { testimonial_columns } from '@/components/TableHelper/testimonial_columns';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';
import { useState } from 'react';

export default function TestimonialsTable({
  testimonials,
}: {
  testimonials: any[];
}) {
  const [data, setData] = useState(testimonials);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // 🗑️ Handle Delete Function
  const handleDelete = async (id: string) => {
    const confirmed = confirm(
      'Are you sure you want to delete this testimonial?'
    );
    if (!confirmed) return;

    try {
      setLoadingId(id);
      const response = await axios.delete(`/api/v1/testimonial/${id}`);

      if (response.data?.success) {
        // Remove from local state
        setData(prev => prev.filter((item: any) => item._id !== id));
        toast.success('Testimonial deleted successfully!');
      } else {
        toast.error('Failed to delete testimonial.');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoadingId(null);
    }
  };

  const columns = [
    ...testimonial_columns,
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }: any) => {
        const id = row.original._id;
        const isDeleting = loadingId === id;

        return (
          <div className="flex gap-3">
            <Link href={`/general/view/testimonials/edit?id=${id}`}>
              <Button
                size="icon"
                variant="outline"
                className="text-blue-500 hover:text-blue-600">
                <Pencil size={18} />
              </Button>
            </Link>

            <Button
              size="icon"
              variant="outline"
              className="text-red-500 hover:text-red-600"
              onClick={() => handleDelete(id)}
              disabled={isDeleting}>
              {isDeleting ? (
                <Loader2 size={18} className="animate-spin text-gray-500" />
              ) : (
                <Trash2 size={18} />
              )}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
