'use client';

import { DataTable } from '@/components/TableHelper/data-table';
import { testimonial_columns } from '@/components/TableHelper/testimonial_columns';
import { Pagination } from '@/components/ui/pagination';

export default function TestimonialsTable({
  testimonials,
}: {
  testimonials: any[];
}) {
  return (
    <div>
      <DataTable columns={testimonial_columns} data={testimonials} />
      <Pagination />
    </div>
  );
}
