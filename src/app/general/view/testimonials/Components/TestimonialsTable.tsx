'use client';

import { useState } from 'react';
import { DataTable } from '@/components/TableHelper/data-table';
import { testimonial_columns } from '@/components/TableHelper/testimonial_columns';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination';

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

export default function TestimonialsTable() {
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState('10'); // added state for dropdown

  // filter by search term
  const filteredData = testimonials.filter(item =>
    item.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row pb-4 md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="entries" className="text-sm font-medium">
            Show:
          </label>
          <Select value={entries} onValueChange={setEntries}>
            <SelectTrigger id="entries" className="w-[100px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Input
          type="search"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-64 text-sm"
        />
      </div>

      <DataTable
        columns={testimonial_columns}
        data={filteredData.slice(0, Number(entries))}
      />
      <Pagination />
    </div>
  );
}
