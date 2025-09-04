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

// Example data (you can fetch from API later)
const testimonials = [
  {
    id: '1',
    image: '/testimonial/TgzFu1710389859.jpg',
    customer: 'Sacha Lowe',
    designation: 'CEO, Getup Ltd.',
    rating: 3,
    testimonial:
      'I usually try to keep my sadness pent up inside where it can fester quietly as a mental illness.',
  },
  {
    id: '2',
    image: '/testimonial/N6cXl1710389840.jpg',
    customer: 'Carissa Woodward',
    designation: 'Manager, Getup Ltd.',
    rating: 4,
    testimonial:
      'Trapped in a book I wrote: a crummy world of plot holes and spelling errors!',
  },
  {
    id: '3',
    image: '/testimonial/cgUSR1710389825.jpg',
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

        {/* Table */}
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">SL</TableHead>
                <TableHead className="text-center">Image</TableHead>
                <TableHead className="text-center">Customer</TableHead>
                <TableHead className="text-center">Designation</TableHead>
                <TableHead className="text-center">Rating</TableHead>
                <TableHead className="text-center">Testimonial</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">
                    <Image
                      src={item.image}
                      alt={item.customer}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </TableCell>
                  <TableCell className="text-center">{item.customer}</TableCell>
                  <TableCell className="text-center">
                    {item.designation}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className="text-yellow-500"
                          fill="gold"
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center max-w-xs truncate">
                    {item.testimonial}
                  </TableCell>
                  <TableCell className="text-center flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="bg-yellow-500 hover:bg-yellow-600">
                      <Edit size={16} />
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination (static example) */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <p>
            Showing {filteredData.length} of {testimonials.length} entries
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Previous
            </Button>
            <Button size="sm" variant="outline">
              1
            </Button>
            <Button size="sm" variant="outline">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
