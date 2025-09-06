'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Star } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import { Pagination } from '@/components/ui/pagination';
import { DataTable } from '@/components/TableHelper/data-table';
import { testimonial_columns } from '@/components/TableHelper/testimonial_columns';

// Example data (you can fetch from API later)
const testimonials = [
  {
    id: 1,
    image: 'https://github.com/shadcn.png',
    customer: 'Sacha Lowe',
    designation: 'CEO, Getup Ltd.',
    rating: 3,
    testimonial:
      'I usually try to keep my sadness pent up inside where it can fester quietly as a mental illness.',
  },
  {
    id: 2,
    image: 'https://github.com/shadcn.png',
    customer: 'Carissa Woodward',
    designation: 'Manager, Getup Ltd.',
    rating: 4,
    testimonial:
      'Trapped in a book I wrote: a crummy world of plot holes and spelling errors!',
  },
  {
    id: 3,
    image: 'https://github.com/shadcn.png',
    customer: 'Patience Blankenship',
    designation: 'Sales Executive, Getup Ltd.',
    rating: 5,
    testimonial:
      'As an interesting side note, I love how testimonials work in this system.',
  },
];

export default function TestimonialsPage() {
  const [search, setSearch] = useState('');

  const filteredData = testimonials.filter(item =>
    item.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-6 pt-5 space-y-6 bg-white">
      <SectionTitle text="Testimonials" />
      <div className="px-5 p">
        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row pb-4 md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="entries" className="text-sm font-medium">
              Show:
            </label>
            <select
              id="entries"
              className="border rounded-md px-2 py-1 text-sm">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
          <div>
            <input
              type="search"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border px-3 py-2 rounded-md w-full md:w-64 text-sm"
            />
          </div>
        </div>

        <DataTable columns={testimonial_columns} data={testimonials} />

        <Pagination />
      </div>
    </div>
  );
}
