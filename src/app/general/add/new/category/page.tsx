'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ArrowUpDown, Plus } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';

export default function BlogCategoryTable() {
  const data = [
    {
      id: 1,
      name: 'Education',
      slug: 'education1730614987',
      featured: false,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Environment',
      slug: 'environment1730614992',
      featured: false,
      status: 'Active',
    },
    {
      id: 3,
      name: 'Human Rights',
      slug: 'human-rights1730614998',
      featured: false,
      status: 'Active',
    },
    {
      id: 4,
      name: 'E-commerce',
      slug: 'ecommerce1731211092',
      featured: false,
      status: 'Active',
    },
    {
      id: 5,
      name: 'Donation',
      slug: 'donation1741673125',
      featured: false,
      status: 'Active',
    },
    {
      id: 6,
      name: 'Buy&Sale',
      slug: 'buysale1741673165',
      featured: false,
      status: 'Active',
    },
  ];

  return (
    <div className=" bg-white space-y-4">
      {/* Header */}
      <div className="flex flex-col pt-5 pr-5   md:flex-row justify-between items-center gap-3">
        <SectionTitle text="View All Blog Categories" />
        <div className="flex gap-2">
          <Button variant="secondary" className="flex items-center gap-1">
            <ArrowUpDown className="w-4 h-4" /> Rearrange Category
          </Button>
          <Button className="flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add New Category
          </Button>
        </div>
      </div>

      <div className="px-5 pb-5">
        {/* Search */}
        <div className="flex justify-end">
          <input
            type="text"
            placeholder="Search..."
            className="w-full md:w-64 rounded-md border px-3 py-2 text-sm"
          />
        </div>

        {/* Table */}
        <div className="border mt-4  rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-16">SL</TableHead>
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Slug</TableHead>
                <TableHead className="text-center">Featured</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center w-40">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">{item.name}</TableCell>
                  <TableCell className="text-center">{item.slug}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant={item.featured ? 'default' : 'destructive'}>
                      {item.featured ? 'Featured' : 'Not Featured'}
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">{item.status}</TableCell>
                  <TableCell className="flex justify-center gap-2">
                    <Button size="sm" variant="secondary">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700">
                      <ArrowUpDown className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-sm text-gray-600">
          <p>
            Showing 1 to {data.length} of {data.length} entries
          </p>
          <div className="flex gap-1 mt-2 md:mt-0">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="default" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
