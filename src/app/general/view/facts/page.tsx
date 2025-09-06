'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ListOrdered } from 'lucide-react';
import { DataTable } from '@/components/TableHelper/data-table';
import { blogs_columns } from '@/components/TableHelper/blogs_columns';
import SectionTitle from '@/components/ui/SectionTitle';
import { fact_columns } from '@/components/TableHelper/fact_columns';

type Facts = {
  id: number;
  title: string;
  desc: string;
  count: string | number;
  status: string;
};

const facts: Facts[] = [
  {
    id: 1,
    title: 'Products For Sale tes',
    desc: 'Diam maecenas ultricies mi eget mauris test',
    count: '12',
    status: 'Active',
  },
  {
    id: 2,
    title: 'Products For Sale tes',
    desc: 'Diam maecenas ultricies mi eget mauris test',
    count: '12',
    status: 'Active',
  },
  {
    id: 3,
    title: 'Products For Sale tes',
    desc: 'Diam maecenas ultricies mi eget mauris test',
    count: '12',
    status: 'Active',
  },
  {
    id: 4,
    title: 'Products For Sale tes',
    desc: 'Diam maecenas ultricies mi eget mauris test',
    count: '12',
    status: 'Active',
  },
];

export default function FactsPage() {
  const [search, setSearch] = useState('');

  const filteredBlogs = facts.filter(blog =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className=" bg-white">
      <div className="flex w-full justify-between items-center pt-5 flex-wrap">
        <div className="">
          <SectionTitle text="View All Blogs" />
        </div>

        <div className=" pr-5 flex gap-2 jstify-center">
          <Button variant="secondary" size="sm" asChild>
            <a href="#">
              {/* <ListOrdered className="h-4 w-4 mr-2" /> */}
              Add New
            </a>
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <a href="#">
              {/* <ListOrdered className="h-4 w-4 mr-2" /> */}
              Rearrange
            </a>
          </Button>
        </div>
      </div>
      <div className="p-5 pt-">
        {' '}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
          {/* Show Entries Dropdown */}
          <div className="flex items-center gap-2">
            <span>Show</span>
            <Select defaultValue="10">
              <SelectTrigger className="w-20">
                <SelectValue />
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

          {/* Search Input */}
          <div className="flex items-center gap-2">
            <span>Search:</span>
            <Input
              placeholder="Search blogs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-64"
            />
          </div>
        </div>
        <DataTable columns={fact_columns} data={facts} />
      </div>
    </div>
  );
}
