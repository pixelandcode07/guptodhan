'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star, Edit2, Trash2 } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';

type Testimonial = {
  id: string;
  customer: string;
  designation: string;
  rating: number;
  testimonial: string;
  image: string;
};

const initialTestimonials: Testimonial[] = [
  {
    id: '1',
    customer: 'Sacha Lowe',
    designation: 'CEO, Getup Ltd.',
    rating: 3,
    testimonial: 'I usually try to keep my sadness pent up inside...',
    image: '/testimonial/TgzFu1710389859.jpg',
  },
  {
    id: '2',
    customer: 'Carissa Woodward',
    designation: 'Manager, Getup Ltd.',
    rating: 4,
    testimonial: 'I usually try to keep my sadness pent up inside...',
    image: '/testimonial/N6cXl1710389840.jpg',
  },
];

export default function TestimonialTable() {
  const [search, setSearch] = useState('');

  const filteredTestimonials = initialTestimonials.filter(t =>
    t.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className=" bg-white pt-4 rounded-lg shadow space-y-4">
      <SectionTitle text="Testimonials" />

      {/* Controls */}
      <div className="flex px-4 pt-0 md:px-6 flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span>Show</span>
          <Select>
            <SelectTrigger className="w-20">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span>entries</span>
        </div>
        <Input
          type="search"
          placeholder="Search"
          className="md:w-64 w-full"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-4 md:px-6 md:overflow-x-auto">
        <Table className="min-w-[700px] md:min-w-full table-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-10">SL</TableHead>
              <TableHead className="text-center w-12">Image</TableHead>
              <TableHead className="w-24">Customer</TableHead>
              <TableHead className="w-28 md:w-36 hidden md:table-cell">
                Designation
              </TableHead>
              <TableHead className="text-center w-20">Rating</TableHead>
              <TableHead className="w-48 md:w-64 hidden md:table-cell">
                Testimonial
              </TableHead>
              <TableHead className="text-center w-24">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTestimonials.map((t, i) => (
              <TableRow key={t.id}>
                <TableCell className="text-center">{i + 1}</TableCell>
                <TableCell className="text-center">
                  <Image
                    src={t.image}
                    alt={t.customer}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </TableCell>
                <TableCell>{t.customer}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {t.designation}
                </TableCell>
                <TableCell className="flex justify-center gap-1">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 text-yellow-500" />
                  ))}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {t.testimonial}
                </TableCell>
                <TableCell className="flex justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1">
                    <Edit2 className="w-4 h-4" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex px-4 md:px-6  flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-2">
        <span>
          Showing 1 to {filteredTestimonials.length} of{' '}
          {initialTestimonials.length} entries
        </span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            Previous
          </Button>
          <Button size="sm" variant="outline">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
