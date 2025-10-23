'use client';

import { useState } from 'react';
import { DataTable } from '@/components/TableHelper/data-table';
import { testimonial_columns } from '@/components/TableHelper/testimonial_columns';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react'; // ✅ Import useSession for authentication
import { ColumnDef } from '@tanstack/react-table';

// Define a type for your data
type Testimonial = {
  _id: string;
  // Add other properties here
};

interface TestimonialsTableProps {
  initialTestimonials: Testimonial[];
}

export default function TestimonialsTable({
  initialTestimonials,
}: TestimonialsTableProps) {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken; // Get token for API calls

  const [data, setData] = useState(initialTestimonials);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (!token) return toast.error('Authentication required.');

    toast('Are you sure you want to delete this testimonial?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          setLoadingId(id);
          try {
            await axios.delete(`/api/v1/testimonial/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Testimonial deleted successfully!');
            setData(prev =>
              prev.filter((item: Testimonial) => item._id !== id)
            );
          } catch (error: any) {
            toast.error(
              error.response?.data?.message || 'Failed to delete testimonial.'
            );
          } finally {
            setLoadingId(null);
          }
        },
      },
      cancel: { label: 'Cancel', onClick: () => {} },
    });
  };

  const columns: ColumnDef<Testimonial>[] = [
    ...(testimonial_columns as ColumnDef<Testimonial>[]),
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => {
        const id = row.original._id;
        const isDeleting = loadingId === id;
        return (
          <div className="flex gap-3">
            <Button
              asChild
              size="icon"
              variant="outline"
              className="text-blue-500 hover:text-blue-600">
              <Link href={`/general/view/testimonials/edit?id=${id}`}>
                <Pencil size={18} />
              </Link>
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="text-red-500 hover:text-red-600"
              onClick={() => handleDelete(id)}
              disabled={isDeleting}>
              {isDeleting ? (
                <Loader2 size={18} className="animate-spin" />
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
